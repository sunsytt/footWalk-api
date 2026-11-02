import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/error.js";
import { parseDay, todayString } from "../../utils/date.js";
import { stepsToKm } from "../../utils/distance.js";

const DEFAULT_GOAL = 10000;

export async function getDaySummary(userId: number, day: string) {
  const date = parseDay(day);

  const record = await prisma.dailyStep.findUnique({
    where: { userId_date: { userId, date } },
  });

  // Meta vigente ese día; si no hay ninguna, se usa la meta por defecto
  const goal = await prisma.goal.findFirst({
    where: {
      userId,
      startDate: { lte: date },
      OR: [{ endDate: null }, { endDate: { gte: date } }],
    },
    orderBy: { createdAt: "desc" },
  });

  const totalSteps = record?.totalSteps ?? 0;
  const goalSteps = goal?.targetSteps ?? DEFAULT_GOAL;

  return {
    date: day,
    totalSteps,
    distanceKm: stepsToKm(totalSteps),
    goalSteps,
    progress: Math.min(100, Math.round((totalSteps / goalSteps) * 100)),
  };
}

export async function syncSteps(userId: number, input: { date?: string; totalSteps: number }) {
  const day = input.date ?? todayString();
  if (day > todayString()) throw new AppError(400, "No se pueden registrar pasos de una fecha futura");

  const date = parseDay(day);
  await prisma.dailyStep.upsert({
    where: { userId_date: { userId, date } },
    update: { totalSteps: input.totalSteps },
    create: { userId, date, totalSteps: input.totalSteps },
  });

  return getDaySummary(userId, day);
}