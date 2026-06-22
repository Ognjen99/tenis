import Link from "next/link";
import { LeagueStatsCards } from "@/components/league-stats-cards";
import { PageShell } from "@/components/page-shell";
import { RecentMatchCard } from "@/components/recent-match-card";
import { StandingsTable } from "@/components/standings-table";
import { getLeagueStats, getRecentMatches, getStandings } from "@/lib/data";
import { sr } from "@/lib/i18n";

export default async function Home() {
  const [standings, recentMatches, stats] = await Promise.all([
    getStandings(),
    getRecentMatches(5),
    getLeagueStats(),
  ]);

  return (
    <PageShell>
      <section className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300 sm:text-sm sm:tracking-[0.3em]">
              {sr.home.eyebrow}
            </p>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              {sr.home.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
              {sr.home.description}
            </p>
          </div>
          <StandingsTable standings={standings} />
        </div>

        <aside className="space-y-6">
          <LeagueStatsCards stats={stats} />
          <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-white">
                {sr.home.recentMatches}
              </h2>
              <Link
                href="/matches"
                className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
              >
                {sr.home.viewAll}
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentMatches.length === 0 ? (
                <p className="text-sm text-slate-400">{sr.home.noResults}</p>
              ) : (
                recentMatches.map((match) => (
                  <RecentMatchCard
                    key={match.id}
                    player1={match.player1}
                    player2={match.player2}
                    result={match.result}
                    winner={match.winner}
                  />
                ))
              )}
            </div>
          </section>
        </aside>
      </section>
    </PageShell>
  );
}
