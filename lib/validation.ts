import { z } from "zod";
import { sr } from "@/lib/i18n";
import { VALID_SCORES } from "@/lib/scoring";

export const playerNameSchema = z
  .string()
  .trim()
  .min(2, sr.messages.nameMinLength)
  .max(80, sr.messages.nameMaxLength);

export const scoreSchema = z.enum(VALID_SCORES);

export function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
