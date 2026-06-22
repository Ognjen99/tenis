import { LeaderName } from "@/components/leader-name";
import { sr } from "@/lib/i18n";

type LeagueStats = {
  playerCount: number;
  totalFixtures: number;
  playedCount: number;
  remainingCount: number;
  completion: number;
  averageSets: number;
  leader: { playerName: string; points: number } | null;
};

type LeagueStatsCardsProps = {
  stats: LeagueStats;
};

export function LeagueStatsCards({ stats }: LeagueStatsCardsProps) {
  const cards = [
    { label: sr.stats.players, value: String(stats.playerCount) },
    {
      label: sr.stats.matches,
      value: `${stats.playedCount}/${stats.totalFixtures}`,
    },
    { label: sr.stats.remaining, value: String(stats.remainingCount) },
    { label: sr.stats.complete, value: `${stats.completion}%` },
    { label: sr.stats.avgSets, value: String(stats.averageSets) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/20"
        >
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{card.value}</p>
        </div>
      ))}

      <div className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/20">
        <p className="text-sm text-slate-400">{sr.stats.leader}</p>
        {stats.leader ? (
          <div className="mt-2 min-w-0">
            <LeaderName name={stats.leader.playerName} />
            <p className="mt-2 text-2xl font-bold text-emerald-300">
              {stats.leader.points} {sr.stats.pointsShort}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-2xl font-bold text-white">{sr.stats.none}</p>
        )}
      </div>
    </div>
  );
}
