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
      toastOptions={{
        classNames: {
          toast:
            "flex items-center gap-3 px-8 py-8 text-base rounded-xl shadow-lg",
          title: "font-bold",
          description: "text-[16px]",
        },
      }}
      icons={{
        success: (
          <CircleCheckIcon
            className="size-6 text-[#048A05]"
            color={BRAND_GREEN}
          />
        ),
        loading: (
          <Loader2Icon
            className="size-6 animate-spin #048A05"
            color={BRAND_GREEN}
          />
        ),
        info: <InfoIcon className="size-6" />,
        warning: <TriangleAlertIcon className="size-6" />,
        error: <OctagonXIcon className="size-6" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
