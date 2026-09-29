import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: number | string }) {
    return (
        <div className="rounded-3xl border border-[var(--color-border)] bg-white p-6">
            <Icon size={20} className="text-[var(--color-brand)]" />
            <div className="math-mono mt-4 text-3xl font-bold">{value}</div>
            <div className="mt-1 text-sm text-[var(--color-muted)]">{label}</div>
        </div>
    );
}