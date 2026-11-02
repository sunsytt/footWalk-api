import "dotenv/config";

export const env = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET!,
};

if (!env.jwtSecret) throw new Error("Falta JWT_SECRET en el .env");