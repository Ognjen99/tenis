import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { Notice } from "@/components/notice";
import { PageShell } from "@/components/page-shell";
import { sr } from "@/lib/i18n";
import { isAdminLoggedIn } from "@/lib/session";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await isAdminLoggedIn()) {
    redirect("/admin");
  }

  const params = await searchParams;

  return (
    <PageShell>
      <div className="mx-auto max-w-md space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300 sm:text-sm sm:tracking-[0.3em]">
            {sr.admin.eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {sr.admin.loginTitle}
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            {sr.admin.loginDescription}
          </p>
        </div>

        <Notice
          error={params.error ? sr.admin.wrongPassword : undefined}
        />

        <form
          action={loginAction}
          className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.06] p-6"
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-200">
              {sr.admin.password}
            </span>
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-emerald-400/40 focus:ring-4"
            />
          </label>
          <button className="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-bold text-slate-950 hover:bg-emerald-300">
            {sr.admin.loginButton}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
