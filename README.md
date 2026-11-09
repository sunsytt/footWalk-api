# FootWalk API

API REST de **FootWalk**, una aplicación móvil nativa para Android de seguimiento de actividad física. Permite registrar usuarios, iniciar sesión y gestionar caminatas (nombre, fecha, pasos, distancia, duración y notas), además de calcular el progreso diario de pasos.

## Stack
Node.js · TypeScript · Express · Prisma ORM · MySQL · JWT · bcrypt · Zod

## Cómo ejecutarlo
1. `npm install`
2. Copiar `.env.example` a `.env` y completar los valores
3. `npx prisma migrate dev`
4. `npm run dev`
