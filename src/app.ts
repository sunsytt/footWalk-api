import cors from "cors";
import express from "express";
import { errorHandler } from "./middlewares/error.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { stepsRouter } from "./modules/steps/steps.routes.js";
import { goalsRouter } from "./modules/goals/goals.routes.js";
import { walksRouter } from "./modules/walks/walks.routes.js";


export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/steps", stepsRouter);
app.use("/goals", goalsRouter);
app.use("/walks", walksRouter);

app.use(errorHandler);