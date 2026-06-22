import {
  addPlayerAction,
  removePlayerAction,
  updatePlayerAction,
  updatePlayerImageAction,
} from "@/app/actions/players";
import { AdminNav } from "@/components/admin-nav";
import { Notice } from "@/components/notice";
import { PageShell } from "@/components/page-shell";
import { PlayerAvatar } from "@/components/player-avatar";
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
            {sr.admin.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
            {sr.admin.playersTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            {sr.admin.playersDescription}
          </p>
        </div>

        <AdminNav />
        <Notice error={params.error} success={params.success} />

        <form
          action={addPlayerAction}
          className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5 lg:grid-cols-[1fr_1fr_auto]"
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
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
            />
          </label>
          <button className="self-end rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 hover:bg-emerald-300">
            {sr.admin.addPlayer}
          </button>
        </form>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-4">{sr.standings.player}</th>
                  <th className="px-4 py-4">{sr.admin.status}</th>
                  <th className="px-4 py-4">{sr.admin.rename}</th>
                  <th className="px-4 py-4">{sr.admin.photo}</th>
                  <th className="px-4 py-4 text-right">{sr.admin.remove}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {players.map((player) => (
                  <tr key={player.id}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar
                          name={player.name}
                          imageUrl={player.imageUrl}
                          size="md"
                        />
                        <span className="font-semibold text-white">
                          {player.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                        {player.isActive ? sr.admin.active : sr.admin.removed}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {player.isActive ? (
                        <form
                          action={updatePlayerAction}
                          className="flex gap-2"
                        >
                          <input type="hidden" name="id" value={player.id} />
                          <input
                            name="name"
                            defaultValue={player.name}
                            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none ring-emerald-400/40 focus:ring-4"
                          />
                          <button className="rounded-2xl bg-white px-3 py-2 font-semibold text-slate-950 hover:bg-slate-200">
                            {sr.admin.save}
                          </button>
                        </form>
                      ) : (
                        <span className="text-slate-500">
                          {sr.admin.reactivateHint}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {player.isActive ? (
                        <form
                          action={updatePlayerImageAction}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <input type="hidden" name="id" value={player.id} />
                          <input
                            name="image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            required
                            className="max-w-xs rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-950"
                          />
                          <button className="rounded-2xl border border-white/10 px-3 py-2 font-semibold text-white hover:bg-white/10">
                            {sr.admin.upload}
                          </button>
                        </form>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      {player.isActive ? (
                        <form action={removePlayerAction}>
                          <input type="hidden" name="id" value={player.id} />
                          <button className="rounded-2xl border border-red-400/30 px-3 py-2 font-semibold text-red-200 hover:bg-red-950">
                            {sr.admin.remove}
                          </button>
                        </form>
                      ) : (
                        <span className="text-slate-500">{sr.admin.removed}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
