import { getMatchPoints, getWinnerId } from "@/lib/scoring";

export type StandingPlayer = {
  id: string;
  name: string;
  imageUrl?: string | null;
  isActive: boolean;
};

export type StandingMatch = {
  id: string;
  player1Id: string;
  player2Id: string;
  player1Sets: number;
  player2Sets: number;
  player1Games: number;
  player2Games: number;
};

export type StandingRow = {
  position: number;
  playerId: string;
  playerName: string;
  imageUrl?: string | null;
  matchesPlayed: number;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  setDifference: number;
  gamesWon: number;
  gamesLost: number;
  gameDifference: number;
  points: number;
};

type HeadToHeadRow = {
  playerId: string;
  points: number;
  wins: number;
  gamesWon: number;
};

export function calculateStandings(
  players: StandingPlayer[],
  matches: StandingMatch[],
): StandingRow[] {
  const rows = new Map<string, StandingRow>();

  for (const player of players.filter((player) => player.isActive)) {
    rows.set(player.id, {
      position: 0,
      playerId: player.id,
      playerName: player.name,
      imageUrl: player.imageUrl,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
      setDifference: 0,
      gamesWon: 0,
      gamesLost: 0,
      gameDifference: 0,
      points: 0,
    });
  }

  for (const match of matches) {
    const player1 = rows.get(match.player1Id);
    const player2 = rows.get(match.player2Id);

    if (!player1 || !player2) {
      continue;
    }

    const points = getMatchPoints(match);
    const winnerId = getWinnerId(match);

    player1.matchesPlayed += 1;
    player2.matchesPlayed += 1;
    player1.setsWon += match.player1Sets;
    player1.setsLost += match.player2Sets;
    player2.setsWon += match.player2Sets;
    player2.setsLost += match.player1Sets;
    player1.gamesWon += match.player1Games;
    player1.gamesLost += match.player2Games;
    player2.gamesWon += match.player2Games;
    player2.gamesLost += match.player1Games;
    player1.points += points.player1Points;
    player2.points += points.player2Points;

    if (winnerId === player1.playerId) {
      player1.wins += 1;
      player2.losses += 1;
    } else {
      player2.wins += 1;
      player1.losses += 1;
    }
  }

  for (const row of rows.values()) {
    row.setDifference = row.setsWon - row.setsLost;
    row.gameDifference = row.gamesWon - row.gamesLost;
  }

  const sorted = sortWithTieBreakers([...rows.values()], matches);

  return sorted.map((row, index) => ({
    ...row,
    position: index + 1,
    setDifference: row.setsWon - row.setsLost,
    gameDifference: row.gamesWon - row.gamesLost,
  }));
}

function sortWithTieBreakers(rows: StandingRow[], matches: StandingMatch[]) {
  const primarySorted = rows.toSorted(
    (a, b) =>
      b.points - a.points ||
      b.setsWon - a.setsWon ||
      b.gamesWon - a.gamesWon ||
      a.setsLost - b.setsLost ||
      a.playerName.localeCompare(b.playerName),
  );

  const rankedGroups: StandingRow[] = [];
  let cursor = 0;

  while (cursor < primarySorted.length) {
    const group = [primarySorted[cursor]];
    cursor += 1;

    while (
      cursor < primarySorted.length &&
      primarySorted[cursor].points === group[0].points &&
      primarySorted[cursor].setsWon === group[0].setsWon &&
      primarySorted[cursor].gamesWon === group[0].gamesWon
    ) {
      group.push(primarySorted[cursor]);
      cursor += 1;
    }

    rankedGroups.push(...rankTieGroup(group, matches));
  }

  return rankedGroups;
}

function rankTieGroup(rows: StandingRow[], matches: StandingMatch[]) {
  if (rows.length <= 1) {
    return rows;
  }

  const headToHead = calculateHeadToHead(rows, matches);

  return rows.toSorted((a, b) => {
    const h2hA = headToHead.get(a.playerId);
    const h2hB = headToHead.get(b.playerId);

    return (
      (h2hB?.points ?? 0) - (h2hA?.points ?? 0) ||
      (h2hB?.gamesWon ?? 0) - (h2hA?.gamesWon ?? 0) ||
      (h2hB?.wins ?? 0) - (h2hA?.wins ?? 0) ||
      a.setsLost - b.setsLost ||
      b.gameDifference - a.gameDifference ||
      a.playerName.localeCompare(b.playerName)
    );
  });
}

function calculateHeadToHead(rows: StandingRow[], matches: StandingMatch[]) {
  const tiedIds = new Set(rows.map((row) => row.playerId));
  const h2h = new Map<string, HeadToHeadRow>();

  for (const row of rows) {
    h2h.set(row.playerId, {
      playerId: row.playerId,
      points: 0,
      wins: 0,
      gamesWon: 0,
    });
  }

  for (const match of matches) {
    if (!tiedIds.has(match.player1Id) || !tiedIds.has(match.player2Id)) {
      continue;
    }

    const points = getMatchPoints(match);
    const winnerId = getWinnerId(match);
    const player1 = h2h.get(match.player1Id);
    const player2 = h2h.get(match.player2Id);

    if (!player1 || !player2) {
      continue;
    }

    player1.points += points.player1Points;
    player2.points += points.player2Points;
    player1.gamesWon += match.player1Games;
    player2.gamesWon += match.player2Games;

    if (winnerId === match.player1Id) {
      player1.wins += 1;
    } else {
      player2.wins += 1;
    }
  }

  return h2h;
}
