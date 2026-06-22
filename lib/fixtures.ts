import { prisma } from "@/lib/db";

type FixturePlayer = {
  id: string;
};

export function buildDoubleRoundRobinPairs(players: FixturePlayer[]) {
  const fixturePairs: Array<{
    player1Id: string;
    player2Id: string;
    leg: number;
  }> = [];

  for (let i = 0; i < players.length; i += 1) {
    for (let j = i + 1; j < players.length; j += 1) {
      fixturePairs.push({
        player1Id: players[i].id,
        player2Id: players[j].id,
        leg: 1,
      });
      fixturePairs.push({
        player1Id: players[j].id,
        player2Id: players[i].id,
        leg: 2,
      });
    }
  }

  return fixturePairs;
}

export async function regenerateFixtures() {
  const players = await prisma.player.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const fixturePairs = buildDoubleRoundRobinPairs(players);

  for (const fixture of fixturePairs) {
    await prisma.fixture.upsert({
      where: {
        player1Id_player2Id_leg: fixture,
      },
      update: {},
      create: fixture,
    });
  }

  await deleteUnplayedFixturesForInactivePlayers();
}

export async function deleteUnplayedFixturesForInactivePlayers() {
  const inactivePlayers = await prisma.player.findMany({
    where: { isActive: false },
    select: { id: true },
  });

  if (inactivePlayers.length === 0) {
    return;
  }

  const inactiveIds = inactivePlayers.map((player) => player.id);
  const fixtures = await prisma.fixture.findMany({
    where: {
      OR: [
        { player1Id: { in: inactiveIds } },
        { player2Id: { in: inactiveIds } },
      ],
    },
    include: { match: true },
  });

  const unplayedFixtureIds = fixtures
    .filter((fixture) => !fixture.match)
    .map((fixture) => fixture.id);

  if (unplayedFixtureIds.length > 0) {
    await prisma.fixture.deleteMany({
      where: { id: { in: unplayedFixtureIds } },
    });
  }
}
