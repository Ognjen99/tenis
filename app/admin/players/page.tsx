import {
  addPlayerAction,
} from "@/app/actions/players";
import { AdminNav } from "@/components/admin-nav";
import { AdminPlayersList } from "@/components/admin-players-list";
import { Notice } from "@/components/notice";
import { PageShell } from "@/components/page-shell";
import { getPlayers } from "@/lib/data";
import { sr } from "@/lib/i18n";
import { requireAdmin } from "@/lib/session";

type PlayersPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function PlayersPage({ searchParams }: PlayersPageProps) {
  await requireAdmin();

  const [params, players] = await Promise.all([searchParams, getPlayers()]);

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300 sm:text-sm sm:tracking-[0.3em]">
            {sr.admin.eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {sr.admin.playersTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
            {sr.admin.playersDescription}
          </p>
        </div>

        <AdminNav />
        <Notice error={params.error} success={params.success} />

        <form
          action={addPlayerAction}
          className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-4 sm:p-5 lg:grid-cols-[1fr_1fr_auto]"
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-200">
              {sr.admin.newPlayerName}
            </span>
            <input
              name="name"
              required
              minLength={2}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-4"
              placeholder="Novak Đoković"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-200">
              {sr.admin.playerPhoto}
            </span>
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 text-sm text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-400 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-950 sm:file:mr-4 sm:file:px-4"
            />
          </label>
          <button className="rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300 lg:self-end">
            {sr.admin.addPlayer}
          </button>
        </form>

        <AdminPlayersList players={players} />
      </div>
    </PageShell>
  );
}
