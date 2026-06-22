import { sr } from "@/lib/i18n";

export type MatchScore = {
  player1Sets: number;
  player2Sets: number;
};

export type MatchPoints = {
  player1Points: number;
  player2Points: number;
};

export const VALID_SCORES = ["2:0", "2:1", "0:2", "1:2"] as const;

export function formatScore(score: MatchScore) {
  return `${score.player1Sets}:${score.player2Sets}`;
}

export function isValidScore(player1Sets: number, player2Sets: number) {
  const score = formatScore({ player1Sets, player2Sets });
  return VALID_SCORES.includes(score as (typeof VALID_SCORES)[number]);
}

export function parseScore(result: string): MatchScore {
  const [player1Raw, player2Raw] = result.split(":");
  const player1Sets = Number(player1Raw);
  const player2Sets = Number(player2Raw);

  if (!Number.isInteger(player1Sets) || !Number.isInteger(player2Sets)) {
    throw new Error(sr.messages.invalidScoreFormat);
  }

  if (!isValidScore(player1Sets, player2Sets)) {
    throw new Error(sr.messages.invalidScoreValues);
  }

  return { player1Sets, player2Sets };
}

export function getWinnerId<T extends { player1Id: string; player2Id: string }>(
  match: T & MatchScore,
) {
  if (!isValidScore(match.player1Sets, match.player2Sets)) {
    throw new Error("Cannot determine winner for an invalid match score.");
  }

  return match.player1Sets > match.player2Sets
    ? match.player1Id
    : match.player2Id;
}

export function getMatchPoints(score: MatchScore): MatchPoints {
  if (!isValidScore(score.player1Sets, score.player2Sets)) {
    throw new Error("Cannot score an invalid match result.");
  }

  const loserPoints =
    Math.abs(score.player1Sets - score.player2Sets) === 1 ? 1 : 0.5;

  if (score.player1Sets > score.player2Sets) {
    return { player1Points: 3, player2Points: loserPoints };
  }

  return { player1Points: loserPoints, player2Points: 3 };
}
