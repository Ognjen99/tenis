import { prisma } from "@/lib/db";
import { calculateStandings } from "@/lib/standings";
import { formatMatchResult, getWinnerId } from "@/lib/scoring";

export async function getStandings() {
  const [players, matches] = await Promise.all([
    prisma.player.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    }),
    prisma.match.findMany(),
  ]);

  return calculateStandings(players, matches);
}

export async function getPlayers() {
  return prisma.player.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });
}

export async function getActivePlayers() {
  return prisma.player.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
}

export async function getUnplayedFixtures() {
  const fixtures = await prisma.fixture.findMany({
    where: {
      match: null,
      player1: { isActive: true },
      player2: { isActive: true },
    },
    include: {
      player1: true,
      player2: true,
    },
    orderBy: [{ createdAt: "asc" }],
  });

  return fixtures;
}

export async function getMatchHistory() {
  const matches = await prisma.match.findMany({
    include: {
      player1: true,
      player2: true,
    },
    orderBy: { enteredAt: "desc" },
  });

  return matches.map((match) => ({
    ...match,
    result: formatMatchResult(match),
    winner:
      getWinnerId(match) === match.player1Id ? match.player1 : match.player2,
  }));
}

export async function getRecentMatches(limit = 5) {
  const matches = await getMatchHistory();
  return matches.slice(0, limit);
}

export async function getLeagueStats() {
  const [players, fixtures, matches, standings] = await Promise.all([
    getActivePlayers(),
    prisma.fixture.findMany({
      include: { match: true, player1: true, player2: true },
    }),
    prisma.match.findMany(),
    getStandings(),
  ]);

  const activeFixtureCount = fixtures.filter(
    (fixture) => fixture.player1.isActive && fixture.player2.isActive,
  ).length;
  const playedCount = matches.length;
  const remainingCount = Math.max(activeFixtureCount - playedCount, 0);
  const totalSets = matches.reduce(
    (sum, match) => sum + match.player1Sets + match.player2Sets,
    0,
  );

  return {
    playerCount: players.length,
    totalFixtures: activeFixtureCount,
    playedCount,
    remainingCount,
    completion:
      activeFixtureCount === 0 ? 0 : Math.round((playedCount / activeFixtureCount) * 100),
    averageSets:
      playedCount === 0 ? 0 : Number((totalSets / playedCount).toFixed(1)),
    leader: standings[0] ?? null,
  };
}
