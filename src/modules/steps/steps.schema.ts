import { z } from "zod";

const dayString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida");

export const syncSchema = z.object({
  date: dayString.optional(),
  totalSteps: z.number().int("Debe ser entero").min(0, "No puede ser negativo").max(200000, "Valor demasiado alto"),
});

export const todayQuerySchema = z.object({ date: dayString.optional() });