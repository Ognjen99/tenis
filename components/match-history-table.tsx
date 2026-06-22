import Link from "next/link";
import { PlayerAvatar } from "@/components/player-avatar";
import { locale, sr } from "@/lib/i18n";

type MatchPlayer = {
  name: string;
  imageUrl?: string | null;
};

type MatchHistoryItem = {
  id: string;
  enteredAt: Date;
  player1: MatchPlayer;
  player2: MatchPlayer;
  result: string;
  winner: MatchPlayer;
};

type MatchHistoryTableProps = {
  matches: MatchHistoryItem[];
  isAdmin?: boolean;
};

export function MatchHistoryTable({
  matches,
  isAdmin = false,
}: MatchHistoryTableProps) {
  if (matches.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-300">
        {sr.matches.empty}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-4">{sr.matches.dateEntered}</th>
              <th className="px-4 py-4">{sr.matches.player1}</th>
              <th className="px-4 py-4">{sr.matches.player2}</th>
              <th className="px-4 py-4">{sr.matches.result}</th>
              <th className="px-4 py-4">{sr.matches.winner}</th>
              {isAdmin ? (
                <th className="px-4 py-4 text-right">{sr.nav.admin}</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {matches.map((match) => (
              <tr key={match.id} className="hover:bg-white/[0.03]">
                <td className="px-4 py-4 text-slate-300">
                  {formatDate(match.enteredAt)}
                </td>
                <td className="px-4 py-4 font-medium text-white">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar
                      name={match.player1.name}
                      imageUrl={match.player1.imageUrl}
                      size="sm"
                    />
                    <span>{match.player1.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-white">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar
                      name={match.player2.name}
                      imageUrl={match.player2.imageUrl}
                      size="sm"
                    />
                    <span>{match.player2.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-bold text-emerald-300">
                  {match.result}
                </td>
                <td className="px-4 py-4 text-slate-200">
                  <div className="flex items-center gap-3">
                    <PlayerAvatar
                      name={match.winner.name}
                      imageUrl={match.winner.imageUrl}
                      size="sm"
                    />
                    <span>{match.winner.name}</span>
                  </div>
                </td>
                {isAdmin ? (
                  <td className="px-4 py-4 text-right">
                    <Link
                      className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-slate-200"
                      href={`/admin/matches/${match.id}/edit`}
                    >
                      {sr.matches.edit}
                    </Link>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
