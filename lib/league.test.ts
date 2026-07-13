import { describe, expect, it } from "vitest";
import { buildDoubleRoundRobinPairs } from "@/lib/fixtures";
import {
  getMatchPoints,
  parseDetailedScore,
  parseMatchResult,
  parseScore,
} from "@/lib/scoring";
import { calculateStandings } from "@/lib/standings";

const players = [
  { id: "a", name: "Ana", isActive: true },
  { id: "b", name: "Bojan", isActive: true },
  { id: "c", name: "Ceca", isActive: true },
];

const withGames = (match: {
  id: string;
  player1Id: string;
  player2Id: string;
  player1Sets: number;
  player2Sets: number;
  player1Games?: number;
  player2Games?: number;
}) => ({
  player1Games: 0,
  player2Games: 0,
  ...match,
});

describe("league rules", () => {
  it("scores 2:0 and 2:1 results correctly", () => {
    expect(getMatchPoints(parseScore("2:0"))).toEqual({
      player1Points: 3,
      player2Points: 0.5,
    });
    expect(getMatchPoints(parseScore("0:2"))).toEqual({
      player1Points: 0.5,
      player2Points: 3,
    });
    expect(getMatchPoints(parseScore("2:1"))).toEqual({
      player1Points: 3,
      player2Points: 1,
    });
  });

  it("parses detailed set scores and counts gems", () => {
    expect(parseDetailedScore("6:4, 3:6, 6:2")).toEqual({
      player1Sets: 2,
      player2Sets: 1,
      player1Games: 15,
      player2Games: 12,
      scoreDetail: "6:4, 3:6, 6:2",
    });
  });

  it("accepts simple set scores with manually entered gems", () => {
    expect(parseMatchResult("2:1", 15, 12)).toEqual({
      player1Sets: 2,
      player2Sets: 1,
      player1Games: 15,
      player2Games: 12,
      scoreDetail: "2:1 (15:12)",
    });
  });

  it("generates n * (n - 1) double round-robin fixtures", () => {
    const tenPlayers = Array.from({ length: 10 }, (_, index) => ({
      id: `player-${index + 1}`,
    }));

    expect(buildDoubleRoundRobinPairs(tenPlayers)).toHaveLength(90);
  });

  it("ranks by points before sets", () => {
    const standings = calculateStandings(players, [
      withGames({
        id: "m1",
        player1Id: "a",
        player2Id: "b",
        player1Sets: 2,
        player2Sets: 0,
        player1Games: 12,
        player2Games: 6,
      }),
      withGames({
        id: "m2",
        player1Id: "b",
        player2Id: "c",
        player1Sets: 2,
        player2Sets: 1,
        player1Games: 14,
        player2Games: 12,
      }),
    ]);

    expect(standings.map((row) => row.playerName)).toEqual([
      "Bojan",
      "Ana",
      "Ceca",
    ]);
  });

  it("uses head-to-head when points are tied", () => {
    const standings = calculateStandings(
      [...players, { id: "d", name: "Dejan", isActive: true }],
      [
        withGames({
          id: "m1",
          player1Id: "a",
          player2Id: "b",
          player1Sets: 2,
          player2Sets: 0,
          player1Games: 12,
          player2Games: 4,
        }),
        withGames({
          id: "m2",
          player1Id: "b",
          player2Id: "c",
          player1Sets: 2,
          player2Sets: 0,
          player1Games: 12,
          player2Games: 5,
        }),
        withGames({
          id: "m3",
          player1Id: "d",
          player2Id: "a",
          player1Sets: 2,
          player2Sets: 0,
          player1Games: 12,
          player2Games: 6,
        }),
      ],
    );

    expect(standings[0].playerName).toBe("Ana");
    expect(standings[1].playerName).toBe("Bojan");
  });

  it("uses head-to-head games before overall games when points are tied", () => {
    const standings = calculateStandings(
      [
        { id: "a", name: "Ana", isActive: true },
        { id: "b", name: "Bojan", isActive: true },
      ],
      [
        withGames({
          id: "m1",
          player1Id: "a",
          player2Id: "b",
          player1Sets: 2,
          player2Sets: 0,
          player1Games: 14,
          player2Games: 8,
        }),
        withGames({
          id: "m2",
          player1Id: "b",
          player2Id: "a",
          player1Sets: 2,
          player2Sets: 0,
          player1Games: 12,
          player2Games: 9,
        }),
      ],
    );

    expect(standings[0].playerName).toBe("Ana");
    expect(standings[0].gamesWon).toBe(23);
    expect(standings[1].playerName).toBe("Bojan");
    expect(standings[1].gamesWon).toBe(20);
  });

  it("ranks by head-to-head when tied on points even if overall games differ", () => {
    const standings = calculateStandings(
      [
        { id: "aleksandar", name: "Aleksandar Pavlović", isActive: true },
        { id: "radan", name: "Radan Savić", isActive: true },
        { id: "other", name: "Other", isActive: true },
      ],
      [
        withGames({
          id: "h2h-1",
          player1Id: "radan",
          player2Id: "aleksandar",
          player1Sets: 2,
          player2Sets: 1,
          player1Games: 14,
          player2Games: 10,
        }),
        withGames({
          id: "h2h-2",
          player1Id: "aleksandar",
          player2Id: "radan",
          player1Sets: 2,
          player2Sets: 1,
          player1Games: 12,
          player2Games: 13,
        }),
        withGames({
          id: "a-other",
          player1Id: "aleksandar",
          player2Id: "other",
          player1Sets: 2,
          player2Sets: 0,
          player1Games: 24,
          player2Games: 8,
        }),
        withGames({
          id: "r-other",
          player1Id: "radan",
          player2Id: "other",
          player1Sets: 2,
          player2Sets: 0,
          player1Games: 12,
          player2Games: 6,
        }),
      ],
    );

    const aleksandar = standings.find((row) => row.playerName === "Aleksandar Pavlović");
    const radan = standings.find((row) => row.playerName === "Radan Savić");

    expect(aleksandar?.points).toBe(7);
    expect(radan?.points).toBe(7);
    expect(aleksandar?.gamesWon).toBeGreaterThan(radan?.gamesWon ?? 0);
    expect(standings[0].playerName).toBe("Radan Savić");
    expect(standings[1].playerName).toBe("Aleksandar Pavlović");
  });
});
