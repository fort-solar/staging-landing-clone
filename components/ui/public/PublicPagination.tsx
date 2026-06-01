import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PublicPaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
};

function createPageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?page=${page}`;
}

function PaginationButton({
  children,
  disabled,
  href,
}: {
  children: ReactNode;
  disabled: boolean;
  href: string;
}) {
  const className =
    "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition " +
    (disabled
      ? "cursor-not-allowed border-[#D0D5DD] bg-[#F2F4F7] text-[#98A2B3]"
      : "border-[#D0D5DD] bg-white text-[#344054] hover:border-[#2CB22C] hover:text-[#058A05]");

  if (disabled) {
    return (
      <span aria-disabled="true" className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function PublicPagination({
  basePath,
  page,
  totalPages,
}: PublicPaginationProps) {
  const resolvedTotalPages = Math.max(1, totalPages);
  const isPreviousDisabled = page <= 1;
  const isNextDisabled = page >= resolvedTotalPages;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-4 border-t border-[#EAECF0] pt-6 sm:flex-row"
    >
      <PaginationButton
        disabled={isPreviousDisabled}
        href={createPageHref(basePath, page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </PaginationButton>

      <p className="text-sm text-[#667085]">
        Page <span className="font-semibold text-[#111827]">{page}</span> of{" "}
        <span className="font-semibold text-[#111827]">{resolvedTotalPages}</span>
      </p>

      <PaginationButton
        disabled={isNextDisabled}
        href={createPageHref(basePath, page + 1)}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </PaginationButton>
    </nav>
  );
}
