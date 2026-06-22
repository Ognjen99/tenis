import { PlayerAvatar } from "@/components/player-avatar";
import type { StandingRow } from "@/lib/standings";
import { sr } from "@/lib/i18n";

type StandingsTableProps = {
  standings: StandingRow[];
};

export function StandingsTable({ standings }: StandingsTableProps) {
  if (standings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-slate-300 sm:p-8">
        {sr.standings.empty}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {standings.map((row) => (
          <article
            key={row.playerId}
            className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-sm font-bold text-emerald-300">
                  {row.position}
                </span>
                <PlayerAvatar
                  name={row.playerName}
                  imageUrl={row.imageUrl}
                  size="sm"
                />
                <span className="min-w-0 break-words font-medium text-white">
                  {row.playerName}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {sr.standings.points}
                </p>
                <p className="text-xl font-bold text-white">{row.points}</p>
              </div>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2 text-center text-xs sm:grid-cols-5">
              <Stat label={sr.standings.mp} value={row.matchesPlayed} />
              <Stat label={sr.standings.wins} value={row.wins} />
              <Stat label={sr.standings.losses} value={row.losses} />
              <Stat label={sr.standings.setsWon} value={row.setsWon} />
              <Stat label={sr.standings.setsLost} value={row.setsLost} />
              <Stat
                label={sr.standings.diff}
                value={`${row.setDifference > 0 ? "+" : ""}${row.setDifference}`}
              />
              <Stat label={sr.standings.gamesWon} value={row.gamesWon} />
              <Stat label={sr.standings.gamesLost} value={row.gamesLost} />
              <Stat
                label={sr.standings.gamesDiff}
                value={`${row.gameDifference > 0 ? "+" : ""}${row.gameDifference}`}
              />
            </dl>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl shadow-slate-950/30 md:block">
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
    </>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white/5 px-2 py-2">
      <dt className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-slate-200">{value}</dd>
    </div>
  );
}
