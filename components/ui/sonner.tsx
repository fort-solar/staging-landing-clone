"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const BRAND_GREEN = "#048A05";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton
      duration={15000}
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast flex items-start gap-4 px-6 py-5 text-base rounded-2xl shadow-2xl border-2 border-[#101828]/10 bg-white text-[#101828] min-w-[320px] sm:min-w-[390px]",
          title: "font-bold text-base text-[#101828]",
          description: "text-sm text-[#475467] leading-relaxed mt-1",
          actionButton: "bg-[#048A05] text-white font-semibold rounded-lg px-3 py-1.5",
          cancelButton: "bg-[#F2F4F7] text-[#344054] rounded-lg px-3 py-1.5",
          closeButton: "!bg-[#F2F4F7] !text-[#344054] hover:!bg-[#E4E7EC] !border-none !size-7 !top-3 !right-3 transition-colors",
        },
      }}
      icons={{
        success: (
          <CircleCheckIcon
            className="size-7 text-[#048A05] shrink-0 mt-0.5"
            color={BRAND_GREEN}
          />
        ),
        loading: (
          <Loader2Icon
            className="size-7 animate-spin text-[#048A05] shrink-0 mt-0.5"
            color={BRAND_GREEN}
          />
        ),
        info: <InfoIcon className="size-7 shrink-0 mt-0.5 text-[#0086C9]" />,
        warning: <TriangleAlertIcon className="size-7 shrink-0 mt-0.5 text-[#F79009]" />,
        error: <OctagonXIcon className="size-7 shrink-0 mt-0.5 text-[#D92D20]" />,
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#101828",
          "--normal-border": "#E4E7EC",
          "--border-radius": "16px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
