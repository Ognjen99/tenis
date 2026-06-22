import { PlayerAvatar } from "@/components/player-avatar";
import type { StandingRow } from "@/lib/standings";
import { sr } from "@/lib/i18n";

type StandingsTableProps = {
  standings: StandingRow[];
};

export function StandingsTable({ standings }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-300">
        {sr.standings.empty}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-slate-950/30">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-4">{sr.standings.pos}</th>
              <th className="px-4 py-4">{sr.standings.player}</th>
              <th className="px-4 py-4 text-right">{sr.standings.mp}</th>
              <th className="px-4 py-4 text-right">{sr.standings.wins}</th>
              <th className="px-4 py-4 text-right">{sr.standings.losses}</th>
              <th className="px-4 py-4 text-right">{sr.standings.setsWon}</th>
              <th className="px-4 py-4 text-right">{sr.standings.setsLost}</th>
              <th className="px-4 py-4 text-right">{sr.standings.diff}</th>
              <th className="px-4 py-4 text-right">{sr.standings.gamesWon}</th>
              <th className="px-4 py-4 text-right">{sr.standings.gamesLost}</th>
              <th className="px-4 py-4 text-right">{sr.standings.gamesDiff}</th>
              <th className="px-4 py-4 text-right">{sr.standings.points}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {standings.map((row) => (
              <tr key={row.playerId} className="hover:bg-white/[0.03]">
                <td className="px-4 py-4 font-semibold text-emerald-300">
                  {row.position}
                </td>
                <td className="px-4 py-4 font-medium text-white">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar
                      name={row.playerName}
                      imageUrl={row.imageUrl}
                      size="sm"
                    />
                    <span>{row.playerName}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {row.matchesPlayed}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {row.wins}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {row.losses}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {row.setsWon}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {row.setsLost}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {row.setDifference > 0 ? "+" : ""}
                  {row.setDifference}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {row.gamesWon}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {row.gamesLost}
                </td>
                <td className="px-4 py-4 text-right text-slate-300">
                  {row.gameDifference > 0 ? "+" : ""}
                  {row.gameDifference}
                </td>
                <td className="px-4 py-4 text-right text-lg font-bold text-white">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
