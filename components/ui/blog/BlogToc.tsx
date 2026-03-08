"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type TocSection = {
  id: string;
  heading: string;
};

type BlogTocProps = {
  sections: TocSection[];
};

export default function BlogToc({ sections }: BlogTocProps) {
  const sectionIds = useMemo(() => [...sections.map((section) => section.id), "conclusion"], [sections]);
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "conclusion");

  useEffect(() => {
    const updateActiveFromScroll = () => {
      const offset = 180;
      let currentId = sectionIds[0] ?? "conclusion";

      for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (section && window.scrollY + offset >= section.offsetTop) {
          currentId = id;
        }
      }

      setActiveId(currentId);
    };

    const updateActiveFromHash = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash && sectionIds.includes(hash)) {
        setActiveId(hash);
      }
    };

    updateActiveFromHash();
    updateActiveFromScroll();

    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("hashchange", updateActiveFromHash);

    return () => {
      window.removeEventListener("scroll", updateActiveFromScroll);
      window.removeEventListener("hashchange", updateActiveFromHash);
    };
  }, [sectionIds]);

  return (
    <ul className="mt-5 space-y-4 text-lg text-[#667085]">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            onClick={() => setActiveId(section.id)}
            className={cn(
              "font-semibold transition-colors hover:text-[#111827]",
              activeId === section.id && "text-[#111827]",
            )}
          >
            {section.heading}
          </a>
        </li>
      ))}
      <li>
        <a
          href="#conclusion"
          onClick={() => setActiveId("conclusion")}
          className={cn(
            "font-semibold transition-colors hover:text-[#111827]",
            activeId === "conclusion" && "text-[#111827]",
          )}
        >
          Conclusion
        </a>
      </li>
    </ul>
  );
}
