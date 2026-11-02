import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import * as authService from "./auth.service.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), async (req, res) => {
  res.status(201).json(await authService.register(req.body));
});

authRouter.post("/login", validate(loginSchema), async (req, res) => {
  res.json(await authService.login(req.body));
});