import Image from "next/image";
import Link from "next/link";
import headerBanner from "@/assets/league-header.png";
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
      <header className="relative min-h-36 overflow-hidden border-b border-white/10 sm:min-h-40">
        <div className="absolute inset-0">
          <Image
            src={headerBanner}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/80" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="block text-xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] sm:text-2xl">
              {sr.app.title}
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2 text-sm font-medium">
            <Link
              className="rounded-full bg-slate-950/45 px-4 py-2 text-slate-100 backdrop-blur hover:bg-slate-950/70 hover:text-white"
              href="/"
            >
              {sr.nav.dashboard}
            </Link>
            <Link
              className="rounded-full bg-slate-950/45 px-4 py-2 text-slate-100 backdrop-blur hover:bg-slate-950/70 hover:text-white"
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
                  <button className="rounded-full bg-slate-950/45 px-4 py-2 text-slate-100 backdrop-blur hover:bg-slate-950/70 hover:text-white">
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
