"use client";

import { useState, useTransition } from "react";
import { approveStudent, rejectStudent } from "@/actions/admin/students";

const copy = {
  ar: {
    cancel: "إلغاء",
    reasonPlaceholder: "سبب الرفض...",
    confirmReject: "تأكيد الرفض",
    working: "جارِ الحفظ...",
  },
  en: {
    cancel: "Cancel",
    reasonPlaceholder: "Rejection reason...",
    confirmReject: "Confirm rejection",
    working: "Saving...",
  },
};

export function ApproveButton({
  studentId,
  label,
  locale,
}: {
  studentId: string;
  label: string;
  locale: "ar" | "en";
}) {
  const [pending, startTransition] = useTransition();
  const t = copy[locale];

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => approveStudent(studentId))}
      className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
    >
      {pending ? t.working : label}
    </button>
  );
}

export function RejectForm({
  studentId,
  label,
  locale,
}: {
  studentId: string;
  label: string;
  locale: "ar" | "en";
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const t = copy[locale];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700"
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      <input
        autoFocus
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={t.reasonPlaceholder}
        className="flex-1 rounded-md border border-[var(--color-border)] px-3 py-1.5 text-sm"
      />
      <div className="flex gap-2">
        <button
          disabled={pending || !reason.trim()}
          onClick={() =>
            startTransition(async () => {
              await rejectStudent(studentId, reason.trim());
              setOpen(false);
            })
          }
          className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
        >
          {pending ? t.working : t.confirmReject}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-full bg-[var(--color-bg)] px-4 py-1.5 text-sm text-[var(--color-muted)]"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}