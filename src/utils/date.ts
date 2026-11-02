export function todayString(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Fecha sin hora, en UTC, para columnas @db.Date
export function parseDay(day: string): Date {
  return new Date(`${day}T00:00:00.000Z`);
}

export const formatDay = (d: Date) => d.toISOString().slice(0, 10);

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}