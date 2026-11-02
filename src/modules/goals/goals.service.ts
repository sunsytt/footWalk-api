import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/error.js";
import { parseDay, todayString } from "../../utils/date.js";

type GoalRow = {
  id: number;
  name: string;
  targetSteps: number;
  startDate: Date;
  endDate: Date | null;
};

const fmt = (d: Date) => d.toISOString().slice(0, 10);

function toDto(goal: GoalRow, currentSteps: number) {
  return {
    id: goal.id,
    name: goal.name,
    targetSteps: goal.targetSteps,
    startDate: fmt(goal.startDate),
    endDate: goal.endDate ? fmt(goal.endDate) : null,
    currentSteps,
    progress: Math.min(100, Math.round((currentSteps / goal.targetSteps) * 100)),
    completed: currentSteps >= goal.targetSteps,
  };
}

async function stepsOf(userId: number, day: string) {
  const record = await prisma.dailyStep.findUnique({
    where: { userId_date: { userId, date: parseDay(day) } },
  });
  return record?.totalSteps ?? 0;
}

async function findOwned(userId: number, id: number) {
  const goal = await prisma.goal.findFirst({ where: { id, userId } });
  if (!goal) throw new AppError(404, "Meta no encontrada");
  return goal;
}

export async function listGoals(userId: number) {
  const today = todayString();
  const currentSteps = await stepsOf(userId, today);

  const goals = await prisma.goal.findMany({
    where: {
      userId,
      OR: [{ endDate: null }, { endDate: { gte: parseDay(today) } }],
    },
    orderBy: { createdAt: "asc" },
  });

  const items = goals.map((g) => toDto(g, currentSteps));
  return {
    summary: {
      total: items.length,
      completed: items.filter((g) => g.completed).length,
      progress: items.length
        ? Math.round((items.filter((g) => g.completed).length / items.length) * 100)
        : 0,
    },
    goals: items,
  };
}

export async function createGoal(
  userId: number,
  input: { name: string; targetSteps: number; startDate?: string; endDate?: string | null }
) {
  const today = todayString();
  const goal = await prisma.goal.create({
    data: {
      userId,
      name: input.name,
      targetSteps: input.targetSteps,
      startDate: parseDay(input.startDate ?? today),
      endDate: input.endDate ? parseDay(input.endDate) : null,
    },
  });
  return toDto(goal, await stepsOf(userId, today));
}

export async function updateGoal(
  userId: number,
  id: number,
  input: { name?: string; targetSteps?: number; startDate?: string; endDate?: string | null }
) {
  const current = await findOwned(userId, id);

  const start = input.startDate ? parseDay(input.startDate) : current.startDate;
  const end =
    input.endDate === undefined ? current.endDate : input.endDate ? parseDay(input.endDate) : null;
  if (end && end < start) throw new AppError(400, "endDate no puede ser anterior a startDate");

  const goal = await prisma.goal.update({
    where: { id },
    data: {
      name: input.name,
      targetSteps: input.targetSteps,
      startDate: start,
      endDate: end,
    },
  });
  return toDto(goal, await stepsOf(userId, todayString()));
}

export async function deleteGoal(userId: number, id: number) {
  await findOwned(userId, id);
  await prisma.goal.delete({ where: { id } });
}