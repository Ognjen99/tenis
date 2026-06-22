import Link from "next/link";
import { Trophy } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { sr } from "@/lib/i18n";
import { isAdminLoggedIn } from "@/lib/session";

type PageShellProps = {
  children: React.ReactNode;
};

export async function PageShell({ children }: PageShellProps) {
  const isAdmin = await isAdminLoggedIn();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#1e3a8a,transparent_35%),#020617]">
      <header className="border-b border-white/10 bg-slate-950/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
              <Trophy size={24} />
            </span>
            <span>
              <span className="block text-xl font-bold tracking-tight">
                {sr.app.title}
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <Link
              className="rounded-full px-4 py-2 text-slate-300 hover:bg-white/10 hover:text-white"
              href="/"
            >
              {sr.nav.dashboard}
            </Link>
            <Link
              className="rounded-full px-4 py-2 text-slate-300 hover:bg-white/10 hover:text-white"
              href="/matches"
            >
              {sr.nav.matches}
            </Link>
            {isAdmin ? (
              <>
                <Link
                  className="rounded-full bg-emerald-400 px-4 py-2 text-slate-950 hover:bg-emerald-300"
                  href="/admin"
                >
                  {sr.nav.admin}
                </Link>
                <form action={logoutAction}>
                  <button className="rounded-full px-4 py-2 text-slate-300 hover:bg-white/10 hover:text-white">
                    {sr.nav.logout}
                  </button>
                </form>
              </>
            ) : (
              <Link
                className="rounded-full bg-white px-4 py-2 text-slate-950 hover:bg-slate-200"
                href="/admin/login"
              >
                {sr.nav.adminLogin}
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
