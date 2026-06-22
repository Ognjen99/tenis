"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { sr } from "@/lib/i18n";
import { parseMatchResult } from "@/lib/scoring";
import { requireAdmin } from "@/lib/session";
import {
  exactScoreSchema,
  getOptionalNumber,
  getString,
} from "@/lib/validation";

export async function addMatchResultAction(formData: FormData) {
  await requireAdmin();

  const player1Id = getString(formData, "player1Id");
  const player2Id = getString(formData, "player2Id");
  const score = parseSubmittedScore(formData, "/admin/matches/new");

  if (!player1Id || !player2Id) {
    redirectWithError("/admin/matches/new", sr.messages.chooseBothPlayers);
  }

  if (player1Id === player2Id) {
    redirectWithError("/admin/matches/new", sr.messages.chooseDifferentPlayers);
  }

  const [player1, player2] = await Promise.all([
    prisma.player.findUnique({ where: { id: player1Id } }),
    prisma.player.findUnique({ where: { id: player2Id } }),
  ]);

  if (!player1?.isActive || !player2?.isActive) {
    redirectWithError("/admin/matches/new", sr.messages.playersMustBeActive);
  }

  const fixture = await prisma.fixture.findFirst({
    where: {
      match: null,
      player1: { isActive: true },
      player2: { isActive: true },
      OR: [
        { player1Id, player2Id },
        { player1Id: player2Id, player2Id: player1Id },
      ],
    },
  });

  if (!fixture) {
    redirectWithError("/admin/matches/new", sr.messages.allMatchesPlayed);
  }

  await prisma.match.create({
    data: {
      fixtureId: fixture.id,
      player1Id,
      player2Id,
      player1Sets: score.player1Sets,
      player2Sets: score.player2Sets,
      player1Games: score.player1Games,
      player2Games: score.player2Games,
      scoreDetail: score.scoreDetail,
    },
  });

  revalidateLeaguePages();
  redirect(
    `/admin/matches/new?success=${encodeURIComponent(sr.messages.matchAdded)}`,
  );
}

export async function updateMatchResultAction(formData: FormData) {
  await requireAdmin();

  const matchId = getString(formData, "matchId");
  const score = parseSubmittedScore(formData, "/matches");

  if (!matchId) {
    redirectWithError("/matches", sr.messages.missingMatchId);
  }

  await prisma.match.update({
    where: { id: matchId },
    data: {
      player1Sets: score.player1Sets,
      player2Sets: score.player2Sets,
      player1Games: score.player1Games,
      player2Games: score.player2Games,
      scoreDetail: score.scoreDetail,
    },
  });

  revalidateLeaguePages();
  redirect(
    `/admin/matches/${matchId}/edit?success=${encodeURIComponent(sr.messages.matchUpdated)}`,
  );
}

export async function deleteMatchResultAction(formData: FormData) {
  await requireAdmin();

  const matchId = getString(formData, "matchId");

  if (!matchId) {
    redirectWithError("/matches", sr.messages.missingMatchId);
  }

  await prisma.match.delete({ where: { id: matchId } });
  revalidateLeaguePages();
  redirect(`/matches?success=${encodeURIComponent(sr.messages.matchDeleted)}`);
}

function parseSubmittedScore(formData: FormData, errorPath: string) {
  const parsed = exactScoreSchema.safeParse(getString(formData, "exactScore"));

  if (!parsed.success) {
    redirectWithError(errorPath, sr.messages.invalidResult);
  }

  try {
    return parseMatchResult(
      parsed.data,
      getOptionalNumber(formData, "player1Games"),
      getOptionalNumber(formData, "player2Games"),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : sr.messages.invalidResult;
    redirectWithError(errorPath, message);
  }
}

function revalidateLeaguePages() {
  revalidatePath("/");
  revalidatePath("/matches");
  revalidatePath("/admin");
  revalidatePath("/admin/matches/new");
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}
