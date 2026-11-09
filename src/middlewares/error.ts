import type { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }
  const parseError = err as { type?: string };
  if (parseError?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido" });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}