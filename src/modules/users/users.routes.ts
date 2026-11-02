import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/error.js";
import { requireAuth } from "../../middlewares/auth.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, async (_req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: res.locals.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  if (!user) throw new AppError(404, "Usuario no encontrado");
  res.json(user);
});