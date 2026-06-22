import { addMatchResultAction } from "@/app/actions/matches";
import { AdminNav } from "@/components/admin-nav";
import { Notice } from "@/components/notice";
import { PageShell } from "@/components/page-shell";
import { getActivePlayers } from "@/lib/data";
import { sr } from "@/lib/i18n";
import { requireAdmin } from "@/lib/session";

type NewMatchPageProps = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function NewMatchPage({
  searchParams,
}: NewMatchPageProps) {
  await requireAdmin();

  const [params, players] = await Promise.all([
    searchParams,
    getActivePlayers(),
  ]);

  return (
    <PageShell>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            {sr.admin.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
            {sr.admin.addMatchTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            {sr.admin.addMatchDescription}
          </p>
        </div>

        <AdminNav />
        <Notice error={params.error} success={params.success} />

        <form
          action={addMatchResultAction}
          className="space-y-5 rounded-3xl border border-white/10 bg-white/[0.06] p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-200">
                {sr.matches.player1}
              </span>
              <select
                name="player1Id"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-4"
                defaultValue=""
              >
                <option value="" disabled>
                  {sr.admin.choosePlayer1}
                </option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">
                {sr.matches.player2}
              </span>
              <select
                name="player2Id"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-4"
                defaultValue=""
              >
                <option value="" disabled>
                  {sr.admin.choosePlayer2}
                </option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-200">
              {sr.admin.resultForPlayer1}
            </span>
            <input
              name="exactScore"
              type="text"
              required
              placeholder={sr.admin.exactScorePlaceholder}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-4"
            />
            <p className="mt-2 text-sm text-slate-400">{sr.admin.resultHint}</p>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-200">
                {sr.admin.player1Games}
              </span>
              <input
                name="player1Games"
                type="number"
                min={0}
                placeholder="15"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-4"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-200">
                {sr.admin.player2Games}
              </span>
              <input
                name="player2Games"
                type="number"
                min={0}
                placeholder="12"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-4"
              />
            </label>
          </div>

          <button
            className="rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={players.length < 2}
          >
            {sr.admin.saveResult}
          </button>

          {players.length < 2 ? (
            <p className="text-sm text-slate-400">{sr.admin.needTwoPlayers}</p>
          ) : null}
        </form>
      </div>
    </PageShell>
  );
}
