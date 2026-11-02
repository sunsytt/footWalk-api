import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { AppError } from "../../middlewares/error.js";
import { todayString } from "../../utils/date.js";
import { syncSchema, todayQuerySchema } from "./steps.schema.js";
import * as stepsService from "./steps.service.js";

export const stepsRouter = Router();

stepsRouter.use(requireAuth);

stepsRouter.get("/today", async (req, res) => {
  const parsed = todayQuerySchema.safeParse(req.query);
  if (!parsed.success) throw new AppError(400, "Parámetro date inválido (YYYY-MM-DD)");
  const day = parsed.data.date ?? todayString();
  res.json(await stepsService.getDaySummary(res.locals.userId, day));
});

stepsRouter.post("/sync", validate(syncSchema), async (req, res) => {
  res.json(await stepsService.syncSteps(res.locals.userId, req.body));
});