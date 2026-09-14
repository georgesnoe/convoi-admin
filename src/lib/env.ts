import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.url(
    "VITE_API_BASE_URL should be a valid url (ex: http://localhost:8080)",
  ),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environnement variables :",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environnement variables");
}

export const env = parsed.data;
