import { PlayerAvatar } from "@/components/player-avatar";
import { sr } from "@/lib/i18n";

type RecentMatchCardProps = {
  player1: {
    name: string;
    imageUrl?: string | null;
  };
  player2: {
    name: string;
    imageUrl?: string | null;
  };
  result: string;
  winner: {
    name: string;
    imageUrl?: string | null;
  };
};

export function RecentMatchCard({
  player1,
  player2,
  result,
  winner,
}: RecentMatchCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <PlayerAvatar
            name={player1.name}
            imageUrl={player1.imageUrl}
            size="sm"
          />
          <span className="truncate text-sm font-medium text-white">
            {player1.name}
          </span>
        </div>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {sr.matches.vs}
        </span>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="truncate text-right text-sm font-medium text-white">
            {player2.name}
          </span>
          <PlayerAvatar
            name={player2.name}
            imageUrl={player2.imageUrl}
            size="sm"
          />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <p className="text-lg font-bold text-white">{result}</p>
        <PlayerAvatar name={winner.name} imageUrl={winner.imageUrl} size="sm" />
        <p className="text-sm font-medium text-emerald-300">
          {winner.name} {sr.matches.won}
        </p>
      </div>
    </div>
  );
}
