import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, BookOpen, ClipboardCheck, CreditCard, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { DashboardShell, type NavItem } from "@/components/dashboard/shell";

const copy = {
    ar: {
        nav: { home: "الرئيسية", program: "برنامجي", exams: "الامتحانات والنتائج", subscription: "اشتراكي", account: "حسابي" },
        title: "الامتحانات والنتائج",
        notStarted: "لسه ما بدأتش",
        inProgress: "جاري",
        submitted: "مُرسَل",
        graded: "مُصحَّح",
        score: "الدرجة",
        noExams: "لا يوجد امتحانات متاحة حاليًا.",
    },
    en: {
        nav: { home: "Home", program: "My Program", exams: "Exams & Results", subscription: "Subscription", account: "Account" },
        title: "Exams & Results",
        notStarted: "Not started",
        inProgress: "In progress",
        submitted: "Submitted",
        graded: "Graded",
        score: "Score",
        noExams: "No exams available yet.",
    },
};

type Relation<T> = T | T[] | null;
type StudentProgram = { id: string; title: string };
type ExamRow = {
    id: string;
    scope: string;
    lessons?: Relation<{ title: string }>;
    units?: Relation<{ title: string }>;
};
type ExamAttempt = {
    exam_id: string;
    status: string;
    mcq_score: number | null;
    essay_status: string | null;
    essay_score: number | null;
};

function firstRelation<T>(relation: Relation<T> | undefined): T | null {
    if (relation == null) return null;
    return Array.isArray(relation) ? relation[0] ?? null : relation;
}

export default async function StudentExamsPage({
    params,
}: {
    params: Promise<{ locale: "ar" | "en" }>;
}) {
    const { locale } = await params;
    const t = copy[locale];

    const userId = await getCurrentUserId();
    if (!userId) redirect("/login");

    const supabase = await createClient();

    const { data: student } = await supabase
        .from("students")
        .select("programs ( id, title )")
        .eq("id", userId)
        .single();

    if (!student) redirect("/register");
    const program = firstRelation(
        (student as { programs: Relation<StudentProgram> }).programs
    );
    if (!program) redirect("/register");

    // every lesson-exam + unit-exam that belongs to this program
    const [lessonExamResult, unitExamResult] = await Promise.all([
        supabase
            .from("exams")
            .select("id, scope, lessons!inner(title, units!inner(terms!inner(program_id)))")
            .eq("is_published", true)
            .eq("scope", "lesson")
            .eq("lessons.units.terms.program_id", program.id),
        supabase
            .from("exams")
            .select("id, scope, units!inner(title, terms!inner(program_id))")
            .eq("is_published", true)
            .eq("scope", "unit")
            .eq("units.terms.program_id", program.id),
    ]);

    if (lessonExamResult.error || unitExamResult.error) {
        const error = lessonExamResult.error ?? unitExamResult.error;
        console.error("Student exams query failed:", error);
        throw new Error("Failed to load student exams", { cause: error });
    }

    const programExams = [
        ...(lessonExamResult.data ?? []),
        ...(unitExamResult.data ?? []),
    ] as ExamRow[];
    const examIds = programExams.map((exam) => exam.id);
    const { data: attemptRows, error: attemptsError } = examIds.length
        ? await supabase
            .from("exam_attempts")
            .select("exam_id, status, mcq_score, essay_status, essay_score")
            .eq("student_id", userId)
            .in("exam_id", examIds)
        : { data: [], error: null };

    if (attemptsError) {
        console.error("Student exam attempts query failed:", attemptsError);
        throw new Error("Failed to load student exam attempts", { cause: attemptsError });
    }
    const attempts = (attemptRows ?? []) as ExamAttempt[];

    const attemptByExam = new Map(attempts.map((attempt) => [attempt.exam_id, attempt]));

    const navItems: NavItem[] = [
        { href: "/student/dashboard", label: t.nav.home, icon: Home },
        { href: "/student/program", label: t.nav.program, icon: BookOpen },
        { href: "/student/exams", label: t.nav.exams, icon: ClipboardCheck },
        { href: "/student/subscription", label: t.nav.subscription, icon: CreditCard },
        { href: "/student/account", label: t.nav.account, icon: User },
    ];

    function statusLabel(attempt: ExamAttempt | undefined) {
        if (!attempt) return t.notStarted;
        if (attempt.status === "in_progress") return t.inProgress;
        if (attempt.status === "submitted") return t.submitted;
        return t.graded;
    }

    return (
        <DashboardShell navItems={navItems} activeHref="/student/exams" userName={program.title} badge={program.title} locale={locale}>
            <h1 className="text-xl font-bold">{t.title}</h1>

            {programExams.length === 0 ? (
                <p className="mt-6 text-sm text-[var(--color-muted)]">{t.noExams}</p>
            ) : (
                <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white">
                    <table className="w-full text-sm">
                        <tbody>
                            {programExams.map((ex) => {
                                const attempt = attemptByExam.get(ex.id);
                                const title = firstRelation(ex.lessons)?.title ?? firstRelation(ex.units)?.title;
                                const totalScore =
                                    (attempt?.mcq_score ?? 0) + (attempt?.essay_score ?? 0);
                                return (
                                    <tr key={ex.id} className="border-b border-[var(--color-border)] last:border-0">
                                        <td className="p-4 font-medium">
                                            <Link href={`/student/exams/${ex.id}`} className="hover:text-[var(--color-brand)]">
                                                {title}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-[var(--color-muted)]">{statusLabel(attempt)}</td>
                                        <td className="p-4 text-[var(--color-muted)]">
                                            {attempt?.status === "graded" ? `${t.score}: ${totalScore}` : "—"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardShell>
    );
}