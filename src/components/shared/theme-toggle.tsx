"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  // null until mounted — avoids a mismatch flash between server render and
  // whatever the inline script already set on <html> before hydration
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  if (theme === null) {
    // render a stable-size placeholder so layout doesn't shift once mounted
    return <span className="inline-block h-9 w-9" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label="toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-ink)] transition-colors hover:border-[var(--color-brand)]"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}