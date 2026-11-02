import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.js";
import { AppError } from "../../middlewares/error.js";
import { validate } from "../../middlewares/validate.js";
import { walkSchema } from "./walks.schema.js";
import * as walksService from "./walks.service.js";

export const walksRouter = Router();

walksRouter.use(requireAuth);

function parseId(raw: string | string[] | undefined) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(400, "Id inválido");
  return id;
}

walksRouter.get("/", async (_req, res) => {
  res.json(await walksService.listWalks(res.locals.userId));
});

walksRouter.get("/:id", async (req, res) => {
  res.json(await walksService.getWalk(res.locals.userId, parseId(req.params.id)));
});

walksRouter.post("/", validate(walkSchema), async (req, res) => {
  res.status(201).json(await walksService.createWalk(res.locals.userId, req.body));
});

walksRouter.put("/:id", validate(walkSchema), async (req, res) => {
  res.json(await walksService.updateWalk(res.locals.userId, parseId(req.params.id), req.body));
});

walksRouter.delete("/:id", async (req, res) => {
  await walksService.deleteWalk(res.locals.userId, parseId(req.params.id));
  res.status(204).send();
});