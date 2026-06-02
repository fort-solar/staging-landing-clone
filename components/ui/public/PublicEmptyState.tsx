import { cn } from "@/lib/utils";

type PublicEmptyStateProps = {
  title: string;
  description: string;
  className?: string;
};

export default function PublicEmptyState({
  title,
  description,
  className,
}: PublicEmptyStateProps) {
  return (
    <div
      className={cn(
        "col-span-full flex w-full flex-col items-center justify-center rounded-[32px] border border-dashed border-[#D0D5DD] bg-[linear-gradient(180deg,#FCFDFD_0%,#F4F7F5_100%)] px-6 py-16 text-center",
        className,
      )}
    >
      <h3 className="text-xl font-semibold font-poppins text-[#111827]">{title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667085]">{description}</p>
    </div>
  );
}
