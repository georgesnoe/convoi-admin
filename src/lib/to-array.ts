export function toArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of [
      "data",
      "items",
      "results",
      "rows",
      "users",
      "trips",
      "vehicles",
      "reservations",
      "messages",
    ]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
    const values = Object.values(obj);
    if (values.length > 0 && values.every((v) => typeof v === "object")) {
      const nested = values.find((v) => Array.isArray((v as Record<string, unknown>)?.data));
      if (nested) return (nested as Record<string, unknown>).data as T[];
    }
  }
  return [];
}
