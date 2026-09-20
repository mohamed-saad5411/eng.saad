import { SectionHeading } from "@/components/landing/section-heading";

const copy = {
  ar: {
    heroTitle: "التعليم مش مجرد مشاهدة فيديو",
    heroBody:
      "المنصة مبنية على فكرة إن الفهم أهم من الحفظ، وإن كل خطوة في الشرح لازم تكون واضحة ومترابطة مع اللي قبلها.",
    principlesLabel: "أسلوبنا",
    principlesTitle: "٤ مبادئ أساسية",
    principles: [
      { title: "فهم بدل حفظ", body: "كل درس بيوضح السبب مش الخطوة بس." },
      { title: "شرح خطوة بخطوة", body: "من غير قفزات في الأفكار أو افتراض معرفة سابقة." },
      { title: "محتوى مرتب", body: "الملزمة والفيديو والتدريب مبنيين على نفس الترتيب." },
      { title: "متابعة واضحة", body: "الطالب دايمًا عارف هو واقف فين في المنهج." },
    ],
    teacherLabel: "عن المدرس",
    teacherName: "محمد سعد",
    teacherRole: "مدرّس رياضيات — بكالوريوس هندسة مدنية",
    teacherBody:
      "خريج هندسة مدنية، متخصص في تدريس الرياضيات والإحصاء والمحاسبة وإدارة الأعمال لطلبة الثانوية العامة.",
    missionLabel: "هدف المنصة",
    missionBody:
      "تقديم تجربة تعليمية منظمة تجمع بين الشرح الواضح والمحتوى المرتب والتدريب المستمر.",
  },
  en: {
    heroTitle: "Learning is more than watching a video",
    heroBody:
      "This platform is built on the idea that understanding matters more than memorizing, and every step in an explanation should connect clearly to the one before it.",
    principlesLabel: "Our approach",
    principlesTitle: "4 core principles",
    principles: [
      { title: "Understanding over memorizing", body: "Every lesson explains the why, not just the step." },
      { title: "Step-by-step explanations", body: "No jumps in logic, no assumed prior knowledge." },
      { title: "Organized content", body: "Workbook, video, and practice follow the same structure." },
      { title: "Clear progress tracking", body: "Students always know where they stand in the curriculum." },
    ],
    teacherLabel: "About the teacher",
    teacherName: "Mohamed Saad",
    teacherRole: "Mathematics Teacher — B.Sc. Civil Engineering",
    teacherBody:
      "A civil engineering graduate specializing in teaching Mathematics, Statistics, and Business & Accounting to secondary students.",
    missionLabel: "Our mission",
    missionBody:
      "To provide an organized learning experience combining clear explanations, structured content, and continuous practice.",
  },
};

export default async function AboutPage({ params }: { params: Promise<{ locale: "ar" | "en" }> }) {
  const { locale } = await params;
  const t = copy[locale];

  return (
    <>
      <section className="container-page py-20 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold md:text-5xl">{t.heroTitle}</h1>
        <p className="mx-auto mt-5 max-w-xl leading-8 text-[var(--color-muted)]">{t.heroBody}</p>
      </section>

      <section className="container-page py-16">
        <SectionHeading label={t.principlesLabel} title={t.principlesTitle} align="center" />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {t.principles.map((p) => (
            <div key={p.title} className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[var(--color-border)] bg-white p-10 text-center">
          <span className="text-sm font-medium text-[var(--color-brand)]">{t.teacherLabel}</span>
          <h2 className="mt-2 text-2xl font-bold">{t.teacherName}</h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{t.teacherRole}</p>
          <p className="mt-5 leading-7 text-[var(--color-muted)]">{t.teacherBody}</p>
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="rounded-3xl bg-[var(--color-bg)] p-10 text-center">
          <span className="text-sm font-medium text-[var(--color-brand)]">{t.missionLabel}</span>
          <p className="mx-auto mt-3 max-w-xl text-lg leading-8">{t.missionBody}</p>
        </div>
      </section>
    </>
  );
}