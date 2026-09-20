import { SectionHeading } from "./section-heading";

const copy = {
  ar: {
    label: "طريقة التعلم",
    title: "ثلاث خطوات بس",
    steps: [
      { n: "١", title: "احصل على الملزمة", body: "الأسئلة والأمثلة مرتبة مع كل درس." },
      { n: "٢", title: "شاهد الشرح", body: "تابع الشرح خطوة بخطوة بالفيديو." },
      { n: "٣", title: "تدرب بنفسك", body: "حل التمارين وراجع مستواك بامتحان قصير." },
    ],
  },
  en: {
    label: "How it works",
    title: "Three steps",
    steps: [
      { n: "1", title: "Get the workbook", body: "Questions and examples organized with every lesson." },
      { n: "2", title: "Watch the explanation", body: "Follow the video, step by step." },
      { n: "3", title: "Practice on your own", body: "Solve exercises and check your level with a short exam." },
    ],
  },
};

export function HowItWorks({ locale }: { locale: "ar" | "en" }) {
  const t = copy[locale];

  return (
    <section className="container-page py-20">
      <SectionHeading label={t.label} title={t.title} align="center" />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {t.steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-[var(--color-border)] bg-white p-7">
            <span className="math-mono text-2xl font-bold text-[var(--color-amber)]">{s.n}</span>
            <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
            <p className="mt-2 leading-7 text-[var(--color-muted)]">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
