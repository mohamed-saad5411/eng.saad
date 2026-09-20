
export function SectionHeading({
  label,
  title,
  body,
  align = "start",
}: {
  label?: string;
  title: string;
  body?: string;
  align?: "start" | "center";
}) {
  return (
    <div>
      <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
        {label && (
          <span className="text-sm font-medium text-[var(--color-brand)]">{label}</span>
        )}
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
        {body && <p className="mt-4 leading-7 text-[var(--color-muted)]">{body}</p>}
      </div>
      
    </div>
  );
}
