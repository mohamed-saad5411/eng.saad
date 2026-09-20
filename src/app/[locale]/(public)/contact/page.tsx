import { MessageCircle, Mail } from "lucide-react";

const copy = {
  ar: {
    title: "تواصل معنا",
    body: "لو عندك أي استفسار عن البرامج أو الاشتراك، تقدر تتواصل معنا من خلال:",
    whatsapp: "تواصل عبر واتساب",
    facebook: "صفحتنا على فيسبوك",
    email: "راسلنا عبر الإيميل",
  },
  en: {
    title: "Contact us",
    body: "For any question about our programs or subscriptions, reach us through:",
    whatsapp: "Message on WhatsApp",
    // facebook: "Our Facebook page",
    email: "Email us",
  },
};

export default async function ContactPage({ params }: { params: Promise<{ locale: "ar" | "en" }> }) {
  const { locale } = await params;
  const t = copy[locale];

  const cards = [
    { icon: MessageCircle, label: t.whatsapp, href: "https://wa.me/000000000000" },
    // { icon: Facebook, label: t.facebook, href: "https://facebook.com" },
    { icon: Mail, label: t.email, href: "mailto:info@example.com" },
  ];

  return (
    <section className="container-page py-24 text-center">
      <h1 className="text-4xl font-bold md:text-5xl">{t.title}</h1>
      <p className="mx-auto mt-4 max-w-md leading-7 text-[var(--color-muted)]">{t.body}</p>

      <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
        {cards.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            className="flex flex-col items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-8 transition-colors hover:border-[var(--color-brand)]"
          >
            <Icon size={28} className="text-[var(--color-brand)]" />
            <span className="text-sm font-medium">{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}