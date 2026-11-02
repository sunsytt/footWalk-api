import { z } from "zod";

const dayString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida");

const baseGoal = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto").max(60, "Máximo 60 caracteres"),
  targetSteps: z.number().int("Debe ser entero").min(1000, "Mínimo 1,000 pasos").max(100000, "Máximo 100,000 pasos"),
  startDate: dayString.optional(),
  endDate: dayString.nullable().optional(),
});

const datesOk = (g: { startDate?: string; endDate?: string | null }) =>
  !g.startDate || !g.endDate || g.endDate >= g.startDate;

export const createGoalSchema = baseGoal.refine(datesOk, {
  message: "endDate no puede ser anterior a startDate",
  path: ["endDate"],
});

export const updateGoalSchema = baseGoal.partial().refine(datesOk, {
  message: "endDate no puede ser anterior a startDate",
  path: ["endDate"],
});