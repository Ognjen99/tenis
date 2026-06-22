"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { regenerateFixtures } from "@/lib/fixtures";
import { sr } from "@/lib/i18n";
import {
  deletePlayerImage,
  getFileFromFormData,
  savePlayerImage,
} from "@/lib/player-image";
import { requireAdmin } from "@/lib/session";
import { getString, playerNameSchema } from "@/lib/validation";

const PLAYERS_PATH = "/admin/players";

export async function addPlayerAction(formData: FormData) {
  await requireAdmin();

  const parsed = playerNameSchema.safeParse(getString(formData, "name"));

  if (!parsed.success) {
    redirectWithError(
      parsed.error.issues[0]?.message ?? sr.messages.invalidPlayerName,
    );
  }

  const name = parsed.data;
  const existing = await prisma.player.findUnique({ where: { name } });

  if (existing?.isActive) {
    redirectWithError(sr.messages.playerExists);
  }

  let playerId: string;

  if (existing) {
    await prisma.player.update({
      where: { id: existing.id },
      data: { isActive: true },
    });
    playerId = existing.id;
  } else {
    const player = await prisma.player.create({ data: { name } });
    playerId = player.id;
  }

  try {
    await applyPlayerImage(playerId, formData);
  } catch (error) {
    redirectWithError(
      error instanceof Error ? error.message : sr.messages.uploadImageFailed,
    );
  }

  await regenerateFixtures();
  revalidateLeaguePages();
  redirect(`${PLAYERS_PATH}?success=${encodeURIComponent(sr.messages.playerSaved)}`);
}

export async function updatePlayerAction(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");
  const parsed = playerNameSchema.safeParse(getString(formData, "name"));

  if (!id || !parsed.success) {
    redirectWithError(
      parsed.error?.issues[0]?.message ?? sr.messages.invalidPlayerUpdate,
    );
  }

  try {
    await prisma.player.update({
      where: { id },
      data: { name: parsed.data },
    });
  } catch {
    redirectWithError(sr.messages.updatePlayerFailed);
  }

  revalidateLeaguePages();
  redirect(
    `${PLAYERS_PATH}?success=${encodeURIComponent(sr.messages.playerUpdated)}`,
  );
}

export async function updatePlayerImageAction(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    redirectWithError(sr.messages.missingPlayerId);
  }

  try {
    await applyPlayerImage(id, formData);
  } catch (error) {
    redirectWithError(
      error instanceof Error ? error.message : sr.messages.uploadImageFailed,
    );
  }

  revalidateLeaguePages();
  redirect(
    `${PLAYERS_PATH}?success=${encodeURIComponent(sr.messages.playerImageUpdated)}`,
  );
}

export async function removePlayerAction(formData: FormData) {
  await requireAdmin();

  const id = getString(formData, "id");

  if (!id) {
    redirectWithError(sr.messages.missingPlayerId);
  }

  const playedMatches = await prisma.match.count({
    where: {
      OR: [{ player1Id: id }, { player2Id: id }],
    },
  });

  if (playedMatches > 0) {
    redirectWithError(sr.messages.playerHasHistory);
  }

  const player = await prisma.player.findUnique({ where: { id } });

  await prisma.player.update({
    where: { id },
    data: { isActive: false },
  });
  await deletePlayerImage(player?.imageUrl);
  await regenerateFixtures();
  revalidateLeaguePages();
  redirect(
    `${PLAYERS_PATH}?success=${encodeURIComponent(sr.messages.playerRemoved)}`,
  );
}

async function applyPlayerImage(playerId: string, formData: FormData) {
  const imageFile = getFileFromFormData(formData, "image");

  if (!imageFile || imageFile.size === 0) {
    return;
  }

  const player = await prisma.player.findUnique({ where: { id: playerId } });

  if (!player) {
    throw new Error(sr.messages.playerNotFound);
  }

  const imageUrl = await savePlayerImage(playerId, imageFile);
  await deletePlayerImage(player.imageUrl);
  await prisma.player.update({
    where: { id: playerId },
    data: { imageUrl },
  });
}

function revalidateLeaguePages() {
  revalidatePath("/");
  revalidatePath("/matches");
  revalidatePath("/admin");
  revalidatePath("/admin/players");
  revalidatePath("/admin/matches/new");
}

function redirectWithError(message: string): never {
  redirect(`${PLAYERS_PATH}?error=${encodeURIComponent(message)}`);
}
