import fs from "node:fs/promises";
import path from "node:path";
import { sr } from "@/lib/i18n";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "players");
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function savePlayerImage(playerId: string, file: File) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error(sr.messages.chooseImage);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(sr.messages.imageTooLarge);
  }

  const extension = ALLOWED_TYPES.get(file.type);

  if (!extension) {
    throw new Error(sr.messages.invalidImageType);
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const filename = `${playerId}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/players/${filename}`;
}

export async function deletePlayerImage(imageUrl: string | null | undefined) {
  if (!imageUrl?.startsWith("/uploads/players/")) {
    return;
  }

  try {
    await fs.unlink(path.join(process.cwd(), "public", imageUrl));
  } catch {
    // Ignore missing files.
  }
}

export function getFileFromFormData(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File ? value : null;
}
