import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../middlewares/error.js";

function buildSession(user: { id: number; name: string; email: string }) {
  const token = jwt.sign({ sub: String(user.id) }, env.jwtSecret, { expiresIn: "7d" });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

export async function register(data: { name: string; email: string; password: string }) {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new AppError(409, "Ese correo ya está registrado");

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email, passwordHash },
  });
  return buildSession(user);
}

export async function login(data: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  const ok = user && (await bcrypt.compare(data.password, user.passwordHash));
  if (!user || !ok) throw new AppError(401, "Correo o contraseña incorrectos");
  return buildSession(user);
}