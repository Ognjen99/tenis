import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";
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
      <header className="border-b border-white/10">
        <Image
          src={headerBanner}
          alt=""
          width={headerBanner.width}
          height={headerBanner.height}
          priority
          className="h-auto w-full max-w-full"
          sizes="100vw"
        />

        <div className="border-t border-white/10 bg-slate-950/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-4 lg:px-8">
            <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 sm:h-11 sm:w-11">
                <Trophy size={22} />
              </span>
              <span className="min-w-0 break-words text-base font-bold leading-tight tracking-tight text-white sm:text-xl md:text-2xl">
                {sr.app.title}
              </span>
            </Link>

            <nav className="grid grid-cols-2 gap-2 text-sm font-medium sm:flex sm:flex-wrap sm:items-center">
              <Link
                className="rounded-full px-3 py-2 text-center text-slate-300 hover:bg-white/10 hover:text-white sm:px-4 sm:text-left"
                href="/"
              >
                {sr.nav.dashboard}
              </Link>
              <Link
                className="rounded-full px-3 py-2 text-center text-slate-300 hover:bg-white/10 hover:text-white sm:px-4 sm:text-left"
                href="/matches"
              >
                {sr.nav.matches}
              </Link>
              {isAdmin ? (
                <>
                  <Link
                    className="rounded-full bg-emerald-400 px-3 py-2 text-center text-slate-950 hover:bg-emerald-300 sm:px-4 sm:text-left"
                    href="/admin"
                  >
                    {sr.nav.admin}
                  </Link>
                  <form action={logoutAction} className="contents">
                    <button className="rounded-full px-3 py-2 text-slate-300 hover:bg-white/10 hover:text-white sm:px-4">
                      {sr.nav.logout}
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  className="col-span-2 rounded-full bg-white px-3 py-2 text-center text-slate-950 hover:bg-slate-200 sm:col-span-1 sm:px-4 sm:text-left"
                  href="/admin/login"
                >
                  {sr.nav.adminLogin}
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
