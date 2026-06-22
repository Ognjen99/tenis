"use client";

import { useState } from "react";
import { sr } from "@/lib/i18n";

type LeaderNameProps = {
  name: string;
};

export function LeaderName({ name }: LeaderNameProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setExpanded((current) => !current)}
      className="w-full min-w-0 text-left"
      aria-expanded={expanded}
    >
      <p
        className={
          expanded
            ? "break-words text-lg font-bold leading-snug text-white sm:text-xl"
            : "line-clamp-2 break-words text-lg font-bold leading-snug text-white sm:text-xl"
        }
      >
        {name}
      </p>
      <span className="mt-1 inline-block text-xs font-semibold text-emerald-300 hover:text-emerald-200">
        {expanded ? sr.stats.showLess : sr.stats.showFullName}
      </span>
    </button>
  );
}
