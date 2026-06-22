import { z } from "zod";
import { sr } from "@/lib/i18n";

export const playerNameSchema = z
  .string()
  .trim()
  .min(2, sr.messages.nameMinLength)
  .max(80, sr.messages.nameMaxLength);

export const exactScoreSchema = z
  .string()
  .trim()
  .min(1, sr.messages.invalidScoreFormat);

export const gamesCountSchema = z.coerce
  .number()
  .int()
  .min(0, sr.messages.invalidGamesCount);

export function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function getOptionalNumber(formData: FormData, key: string) {
  const value = getString(formData, key).trim();
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
