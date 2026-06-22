import Link from "next/link";
import { AdminNav } from "@/components/admin-nav";
import { LeagueStatsCards } from "@/components/league-stats-cards";
import { PageShell } from "@/components/page-shell";
import { getLeagueStats, getUnplayedFixtures } from "@/lib/data";
import { sr } from "@/lib/i18n";
import { requireAdmin } from "@/lib/session";

export default async function AdminPage() {
  await requireAdmin();

  const [stats, fixtures] = await Promise.all([
    getLeagueStats(),
    getUnplayedFixtures(),
  ]);

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300 sm:text-sm sm:tracking-[0.3em]">
            {sr.admin.eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {sr.admin.panelTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            {sr.admin.panelDescription}
          </p>
        </div>

        <AdminNav />
        <LeagueStatsCards stats={stats} />

        <section className="grid gap-4 md:grid-cols-2">
          <Link
            className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 hover:bg-white/10"
            href="/admin/players"
          >
            <h2 className="text-2xl font-bold text-white">
              {sr.admin.managePlayers}
            </h2>
            <p className="mt-2 text-slate-300">
              {sr.admin.managePlayersDescription}
            </p>
          </Link>
          <Link
            className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 hover:bg-white/10"
            href="/admin/matches/new"
          >
            <h2 className="text-2xl font-bold text-white">
              {sr.admin.addResult}
            </h2>
            <p className="mt-2 text-slate-300">
              {sr.admin.waitingFixtures(fixtures.length)}
            </p>
          </Link>
        </section>
      </div>
    </PageShell>
  );
}
