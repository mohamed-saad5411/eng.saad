"use client";

import { useState } from "react";

const copy = {
  ar: {
    label: "حالة الأب",
    working: "على قيد الحياة ويعمل",
    retired: "على قيد الحياة ومتقاعد",
    deceased: "متوفى",
    deathCertLabel: "شهادة وفاة الأب",
  },
  en: {
    label: "Father's status",
    working: "Alive — working",
    retired: "Alive — retired",
    deceased: "Deceased",
    deathCertLabel: "Father's death certificate",
  },
};

export function FatherStatusField({ locale }: { locale: "ar" | "en" }) {
  const t = copy[locale];
  const [status, setStatus] = useState("working");

  return (
    <div>
      <label className="block text-sm font-medium">{t.label}</label>
      <select
        name="father_status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm"
      >
        <option value="working">{t.working}</option>
        <option value="retired">{t.retired}</option>
        <option value="deceased">{t.deceased}</option>
      </select>

      {status === "deceased" && (
        <div className="mt-3">
          <label className="block text-sm font-medium">{t.deathCertLabel}</label>
          <input
            type="file"
            name="death_certificate"
            accept="image/*,.pdf"
            required
            className="mt-1.5 w-full text-sm"
          />
        </div>
      )}
    </div>
  );
}