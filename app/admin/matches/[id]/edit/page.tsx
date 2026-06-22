import { notFound } from "next/navigation";
import {
  deleteMatchResultAction,
  updateMatchResultAction,
} from "@/app/actions/matches";
import { AdminNav } from "@/components/admin-nav";
import { Notice } from "@/components/notice";
import { PageShell } from "@/components/page-shell";
import { prisma } from "@/lib/db";
import { sr } from "@/lib/i18n";
import { formatScore, VALID_SCORES } from "@/lib/scoring";
import { requireAdmin } from "@/lib/session";

type EditMatchPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function EditMatchPage({
  params,
  searchParams,
}: EditMatchPageProps) {
  await requireAdmin();

  const [{ id }, pageParams] = await Promise.all([params, searchParams]);
  const match = await prisma.match.findUnique({
    where: { id },
    include: { player1: true, player2: true },
  });

  if (!match) {
    notFound();
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            {sr.admin.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
            {sr.admin.editMatchTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            {sr.admin.editMatchDescription}
          </p>
        </div>

        <AdminNav />
        <Notice error={pageParams.error} success={pageParams.success} />

        <section className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
          <p className="text-sm text-slate-400">{sr.admin.fixture}</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {match.player1.name} {sr.matches.vs} {match.player2.name}
          </h2>
          <p className="mt-1 text-slate-300">
            {sr.admin.currentResult}: {formatScore(match)}
          </p>
        </section>

        <form
          action={updateMatchResultAction}
          className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.06] p-6"
        >
          <input type="hidden" name="matchId" value={match.id} />
          <label className="block">
            <span className="text-sm font-medium text-slate-200">
              {sr.admin.newResult}
            </span>
            <select
              name="score"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-4"
              defaultValue={formatScore(match)}
            >
              {VALID_SCORES.map((score) => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </label>
          <button className="rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300">
            {sr.admin.saveChange}
          </button>
        </form>

        <form
          action={deleteMatchResultAction}
          className="rounded-3xl border border-red-400/30 bg-red-950/30 p-6"
        >
          <input type="hidden" name="matchId" value={match.id} />
          <h2 className="text-xl font-bold text-red-100">
            {sr.admin.deleteResultTitle}
          </h2>
          <p className="mt-2 text-sm text-red-100/80">
            {sr.admin.deleteResultDescription}
          </p>
          <button className="mt-4 rounded-2xl bg-red-400 px-5 py-3 font-bold text-red-950 hover:bg-red-300">
            {sr.admin.deleteResult}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
