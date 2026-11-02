import { z } from "zod";
import { todayString } from "../../utils/date.js";

const dayString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD")
  .refine((v) => !Number.isNaN(Date.parse(v)), "Fecha inválida")
  .refine((v) => v <= todayString(), "La fecha no puede ser futura");

export const walkSchema = z.object({
  name: z.string().trim().min(2, "El nombre es muy corto").max(60, "Máximo 60 caracteres"),
  date: dayString,
  steps: z.number().int("Debe ser entero").min(1, "Mínimo 1 paso").max(100000, "Máximo 100,000 pasos"),
  distanceKm: z.number().min(0.1, "Mínimo 0.1 km").max(100, "Máximo 100 km").optional(),
  durationMinutes: z.number().int("Debe ser entero").min(1, "Mínimo 1 minuto").max(600, "Máximo 600 minutos"),
  notes: z.string().trim().max(120, "Máximo 120 caracteres").nullable().optional(),
});