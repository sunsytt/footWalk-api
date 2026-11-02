import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { AppError } from "../../middlewares/error.js";
import { validate } from "../../middlewares/validate.js";
import { createGoalSchema, updateGoalSchema } from "./goals.schema.js";
import * as goalsService from "./goals.service.js";

export const goalsRouter = Router();

goalsRouter.use(requireAuth);

function parseId(raw: string | string[] | undefined) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(400, "Id inválido");
  return id;
}

goalsRouter.get("/", async (_req, res) => {
  res.json(await goalsService.listGoals(res.locals.userId));
});

goalsRouter.post("/", validate(createGoalSchema), async (req, res) => {
  res.status(201).json(await goalsService.createGoal(res.locals.userId, req.body));
});

goalsRouter.put("/:id", validate(updateGoalSchema), async (req, res) => {
  res.json(await goalsService.updateGoal(res.locals.userId, parseId(req.params.id), req.body));
});

goalsRouter.delete("/:id", async (req, res) => {
  await goalsService.deleteGoal(res.locals.userId, parseId(req.params.id));
  res.status(204).send();
});