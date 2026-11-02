import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/error.js";
import { formatDay, parseDay, todayString } from "../../utils/date.js";
import { stepsToKm } from "../../utils/distance.js";

const DAILY_GOAL_STEPS = 10000;
const round2 = (n: number) => Math.round(n * 100) / 100;

type WalkInput = {
  name: string;
  date: string;
  steps: number;
  distanceKm?: number;
  durationMinutes: number;
  notes?: string | null;
};

type WalkRow = {
  id: number;
  name: string;
  date: Date;
  steps: number;
  distanceKm: number;
  durationMinutes: number;
  notes: string | null;
};

function toDto(w: WalkRow) {
  return {
    id: w.id,
    name: w.name,
    date: formatDay(w.date),
    steps: w.steps,
    distanceKm: w.distanceKm,
    durationMinutes: w.durationMinutes,
    notes: w.notes,
  };
}

function toData(input: WalkInput) {
  return {
    name: input.name,
    date: parseDay(input.date),
    steps: input.steps,
    distanceKm: round2(input.distanceKm ?? stepsToKm(input.steps)),
    durationMinutes: input.durationMinutes,
    notes: input.notes ?? null,
  };
}

async function findOwned(userId: number, id: number) {
  const walk = await prisma.walk.findFirst({ where: { id, userId } });
  if (!walk) throw new AppError(404, "Caminata no encontrada");
  return walk;
}

export async function listWalks(userId: number) {
  const walks = await prisma.walk.findMany({
    where: { userId },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });

  const today = todayString();
  const todays = walks.filter((w) => formatDay(w.date) === today);
  const steps = todays.reduce((sum, w) => sum + w.steps, 0);

  return {
    today: {
      date: today,
      steps,
      distanceKm: round2(todays.reduce((sum, w) => sum + w.distanceKm, 0)),
      activeMinutes: todays.reduce((sum, w) => sum + w.durationMinutes, 0),
      goalSteps: DAILY_GOAL_STEPS,
      progress: Math.min(100, Math.round((steps / DAILY_GOAL_STEPS) * 100)),
    },
    walks: walks.map(toDto),
  };
}

export async function getWalk(userId: number, id: number) {
  return toDto(await findOwned(userId, id));
}

export async function createWalk(userId: number, input: WalkInput) {
  const walk = await prisma.walk.create({ data: { userId, ...toData(input) } });
  return toDto(walk);
}

export async function updateWalk(userId: number, id: number, input: WalkInput) {
  await findOwned(userId, id);
  const walk = await prisma.walk.update({ where: { id }, data: toData(input) });
  return toDto(walk);
}

export async function deleteWalk(userId: number, id: number) {
  await findOwned(userId, id);
  await prisma.walk.delete({ where: { id } });
}