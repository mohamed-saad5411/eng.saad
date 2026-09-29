import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export function DashboardShell({
  children,
  navItems,
  activeHref,
  userName,
  badge,
  locale,
}: {
  children: React.ReactNode;
  navItems: NavItem[];
  activeHref: string;
  userName: string;
  badge?: string;
  locale: "ar" | "en";
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] md:grid md:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="hidden border-e border-[var(--color-border)] bg-white md:block">
        <div className="p-6">
          <span className="text-base font-bold">{locale === "ar" ? "مهندس سعد" : "Eng. Saad"}</span>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--color-ink)] text-white"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-bg)]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div>
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-white px-6">
          <span className="font-semibold">{userName}</span>
          {badge && (
            <span className="rounded-full bg-[var(--color-bg)] px-3 py-1 text-xs font-medium text-[var(--color-brand)]">
              {badge}
            </span>
          )}
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}