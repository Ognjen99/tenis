import {
  removePlayerAction,
  updatePlayerAction,
  updatePlayerImageAction,
} from "@/app/actions/players";
import { PlayerAvatar } from "@/components/player-avatar";
import { sr } from "@/lib/i18n";

type AdminPlayer = {
  id: string;
  name: string;
  imageUrl: string | null;
  isActive: boolean;
};

type AdminPlayersListProps = {
  players: AdminPlayer[];
};

export function AdminPlayersList({ players }: AdminPlayersListProps) {
  return (
    <>
      <div className="space-y-4 md:hidden">
        {players.map((player) => (
          <article
            key={player.id}
            className="rounded-2xl border border-white/10 bg-slate-900/80 p-4"
          >
            <div className="flex items-start gap-3">
              <PlayerAvatar
                name={player.name}
                imageUrl={player.imageUrl}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="break-words font-semibold text-white">
                  {player.name}
                </p>
                <span className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                  {player.isActive ? sr.admin.active : sr.admin.removed}
                </span>
              </div>
            </div>

            {player.isActive ? (
              <div className="mt-4 space-y-4">
                <form action={updatePlayerAction} className="space-y-2">
                  <input type="hidden" name="id" value={player.id} />
                  <label className="block text-sm font-medium text-slate-200">
                    {sr.admin.rename}
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      name="name"
                      defaultValue={player.name}
                      className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none ring-emerald-400/40 focus:ring-4"
                    />
                    <button className="rounded-2xl bg-white px-4 py-2 font-semibold text-slate-950 hover:bg-slate-200">
                      {sr.admin.save}
                    </button>
                  </div>
                </form>

                <form
                  action={updatePlayerImageAction}
                  className="space-y-2 border-t border-white/10 pt-4"
                >
                  <input type="hidden" name="id" value={player.id} />
                  <label className="block text-sm font-medium text-slate-200">
                    {sr.admin.photo}
                  </label>
                  <input
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-300 file:mr-3 file:rounded-xl file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-950"
                  />
                  <button className="w-full rounded-2xl border border-white/10 px-4 py-2 font-semibold text-white hover:bg-white/10 sm:w-auto">
                    {sr.admin.upload}
                  </button>
                </form>

                <form action={removePlayerAction} className="border-t border-white/10 pt-4">
                  <input type="hidden" name="id" value={player.id} />
                  <button className="w-full rounded-2xl border border-red-400/30 px-4 py-2 font-semibold text-red-200 hover:bg-red-950 sm:w-auto">
                    {sr.admin.remove}
                  </button>
                </form>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">{sr.admin.reactivateHint}</p>
            )}
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 md:block">
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
                      <form action={updatePlayerAction} className="flex gap-2">
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
    </>
  );
}
