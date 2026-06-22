import Link from "next/link";
import { sr } from "@/lib/i18n";

const links = [
  { href: "/admin", label: sr.admin.navOverview },
  { href: "/admin/players", label: sr.admin.navPlayers },
  { href: "/admin/matches/new", label: sr.admin.navAddResult },
  { href: "/matches", label: sr.admin.navMatchHistory },
];

export function AdminNav() {
  return (
    <nav className="grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-white/[0.06] p-2 sm:flex sm:flex-wrap">
      {links.map((link) => (
        <Link
          key={link.href}
          className="rounded-2xl px-3 py-2 text-center text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white sm:px-4 sm:text-left"
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
