"use client";
import { useTheme } from "next-themes";
import React from "react";
import Image from "next/image";
import "./style.css";

export const ThemeToggle: React.FC<{ className?: string }> = ({
  className = "theme-toggle absolute right-[0px] z-10 cursor-pointer md:relative p-2 md:p-0",
}) => {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={className}>
        <Image
          src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
          width={24}
          height={24}
          sizes="24x24"
          alt="Loading Light/Dark Toggle"
          priority={false}
          title="Loading Light/Dark Toggle"
          className="h-6 w-6"
        />
      </div>
    );
  }

  const toggleTheme = (): void => {
    setTheme(
      theme === "dark" ||
        (theme === "system" &&
          document.documentElement.classList.contains("dark"))
        ? "light"
        : "dark"
    );
  };

  return (
    <button
      className={className}
      id="theme-toggle"
      title="Toggles light & dark"
      aria-label={theme}
      aria-live="polite"
      onClick={toggleTheme}
    >
      {/** used from https://web.dev/patterns/theming/theme-switch */}
      <svg
        className="sun-and-moon"
        aria-hidden="true"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <mask className="moon" id="moon-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <circle cx="24" cy="10" r="6" fill="black" />
        </mask>
        <circle
          className="sun"
          cx="12"
          cy="12"
          r="6"
          mask="url(#moon-mask)"
          fill="currentColor"
        />
        <g className="sun-beams" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
      </svg>
    </button>
  );
};
