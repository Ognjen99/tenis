import { describe, expect, it } from "vitest";
import { buildDoubleRoundRobinPairs } from "@/lib/fixtures";
import { getMatchPoints, parseScore } from "@/lib/scoring";
import { calculateStandings } from "@/lib/standings";

const players = [
  { id: "a", name: "Ana", isActive: true },
  { id: "b", name: "Bojan", isActive: true },
  { id: "c", name: "Ceca", isActive: true },
];

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

  it("generates n * (n - 1) double round-robin fixtures", () => {
    const tenPlayers = Array.from({ length: 10 }, (_, index) => ({
      id: `player-${index + 1}`,
    }));

    expect(buildDoubleRoundRobinPairs(tenPlayers)).toHaveLength(90);
  });

  it("ranks by points before sets", () => {
    const standings = calculateStandings(players, [
      {
        id: "m1",
        player1Id: "a",
        player2Id: "b",
        player1Sets: 2,
        player2Sets: 0,
      },
      {
        id: "m2",
        player1Id: "b",
        player2Id: "c",
        player1Sets: 2,
        player2Sets: 1,
      },
    ]);

    expect(standings.map((row) => row.playerName)).toEqual([
      "Bojan",
      "Ana",
      "Ceca",
    ]);
  });

  it("uses head-to-head when points and sets won are tied", () => {
    const standings = calculateStandings(
      [...players, { id: "d", name: "Dejan", isActive: true }],
      [
      {
        id: "m1",
        player1Id: "a",
        player2Id: "b",
        player1Sets: 2,
        player2Sets: 0,
      },
      {
        id: "m2",
        player1Id: "b",
        player2Id: "c",
        player1Sets: 2,
        player2Sets: 0,
      },
      {
        id: "m3",
        player1Id: "d",
        player2Id: "a",
        player1Sets: 2,
        player2Sets: 0,
      },
    ],
    );

    expect(standings[0].playerName).toBe("Ana");
    expect(standings[1].playerName).toBe("Bojan");
  });
});
