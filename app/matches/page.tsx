import { MatchHistoryTable } from "@/components/match-history-table";
import { Notice } from "@/components/notice";
import { PageShell } from "@/components/page-shell";
import { getMatchHistory } from "@/lib/data";
import { sr } from "@/lib/i18n";
import { isAdminLoggedIn } from "@/lib/session";

type MatchHistoryPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function MatchHistoryPage({
  searchParams,
}: MatchHistoryPageProps) {
  const [params, matches, isAdmin] = await Promise.all([
    searchParams,
    getMatchHistory(),
    isAdminLoggedIn(),
  ]);

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            {sr.matches.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
            {sr.matches.title}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">{sr.matches.description}</p>
        </div>
        <Notice error={params.error} success={params.success} />
        <MatchHistoryTable matches={matches} isAdmin={isAdmin} />
      </div>
    </PageShell>
  );
}
