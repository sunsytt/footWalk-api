import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./error.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new AppError(401, "Token requerido");

  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as { sub: string };
    res.locals.userId = Number(payload.sub);
    next();
  } catch {
    throw new AppError(401, "Token inválido o expirado");
  }
}