import { sr } from "@/lib/i18n";

export type MatchScore = {
  player1Sets: number;
  player2Sets: number;
};

export type MatchGames = {
  player1Games: number;
  player2Games: number;
};

export type ParsedMatchResult = MatchScore &
  MatchGames & {
    scoreDetail: string;
  };

export type MatchPoints = {
  player1Points: number;
  player2Points: number;
};

export const VALID_SCORES = ["2:0", "2:1", "0:2", "1:2"] as const;

export function formatScore(score: MatchScore) {
  return `${score.player1Sets}:${score.player2Sets}`;
}

export function formatMatchResult(
  match: MatchScore &
    Partial<MatchGames> & {
      scoreDetail?: string | null;
    },
) {
  if (match.scoreDetail) {
    return match.scoreDetail;
  }

  const sets = formatScore(match);

  if (match.player1Games || match.player2Games) {
    return `${sets} (${match.player1Games}:${match.player2Games})`;
  }

  return sets;
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

function parseSetPart(part: string) {
  const match = part.trim().match(/^(\d+)[:.-](\d+)$/);

  if (!match) {
    throw new Error(sr.messages.invalidScoreFormat);
  }

  const player1Games = Number(match[1]);
  const player2Games = Number(match[2]);

  if (
    !Number.isInteger(player1Games) ||
    !Number.isInteger(player2Games) ||
    player1Games < 0 ||
    player2Games < 0
  ) {
    throw new Error(sr.messages.invalidScoreFormat);
  }

  if (player1Games === player2Games) {
    throw new Error(sr.messages.invalidSetScore);
  }

  return { player1Games, player2Games };
}

export function parseDetailedScore(input: string): ParsedMatchResult {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error(sr.messages.invalidScoreFormat);
  }

  const setParts = trimmed
    .split(/[,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (setParts.length < 2 || setParts.length > 3) {
    throw new Error(sr.messages.invalidDetailedScore);
  }

  let player1Sets = 0;
  let player2Sets = 0;
  let player1Games = 0;
  let player2Games = 0;
  const formattedSets: string[] = [];

  for (const part of setParts) {
    const setScore = parseSetPart(part);
    player1Games += setScore.player1Games;
    player2Games += setScore.player2Games;
    formattedSets.push(`${setScore.player1Games}:${setScore.player2Games}`);

    if (setScore.player1Games > setScore.player2Games) {
      player1Sets += 1;
    } else {
      player2Sets += 1;
    }
  }

  if (!isValidScore(player1Sets, player2Sets)) {
    throw new Error(sr.messages.invalidScoreValues);
  }

  return {
    player1Sets,
    player2Sets,
    player1Games,
    player2Games,
    scoreDetail: formattedSets.join(", "),
  };
}

export function parseMatchResult(
  exactScore: string,
  player1GamesInput?: number,
  player2GamesInput?: number,
): ParsedMatchResult {
  const trimmed = exactScore.trim();
  const setParts = trimmed
    .split(/[,;]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (setParts.length >= 2) {
    return parseDetailedScore(trimmed);
  }

  const score = parseScore(trimmed);

  if (
    player1GamesInput === undefined ||
    player2GamesInput === undefined ||
    !Number.isInteger(player1GamesInput) ||
    !Number.isInteger(player2GamesInput) ||
    player1GamesInput < 0 ||
    player2GamesInput < 0
  ) {
    throw new Error(sr.messages.invalidGamesCount);
  }

  if (player1GamesInput === player2GamesInput) {
    throw new Error(sr.messages.gamesMustDiffer);
  }

  const winnerHasMoreGames =
    score.player1Sets > score.player2Sets
      ? player1GamesInput > player2GamesInput
      : player2GamesInput > player1GamesInput;

  if (!winnerHasMoreGames) {
    throw new Error(sr.messages.winnerMustHaveMoreGames);
  }

  return {
    ...score,
    player1Games: player1GamesInput,
    player2Games: player2GamesInput,
    scoreDetail: `${formatScore(score)} (${player1GamesInput}:${player2GamesInput})`,
  };
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
