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
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300 sm:text-sm sm:tracking-[0.3em]">
            {sr.matches.eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {sr.matches.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            {sr.matches.description}
          </p>
        </div>
        <Notice error={params.error} success={params.success} />
        <MatchHistoryTable matches={matches} isAdmin={isAdmin} />
      </div>
    </PageShell>
  );
}
