"use client";

import { useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { PublicVideo } from "@/lib/video-content";

function withAutoplayParams(src: string, muted: boolean) {
  try {
    const url = new URL(src, "https://www.fortsolar.ng");
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("playsinline", "1");

    if (muted) {
      url.searchParams.set("mute", "1");
      url.searchParams.set("muted", "1");
    }

    return src.startsWith("/")
      ? `${url.pathname}${url.search}${url.hash}`
      : url.toString();
  } catch {
    return src;
  }
}

type HoverVideoPreviewProps = {
  video: PublicVideo;
  children?: ReactNode;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function HoverVideoPreview({
  video,
  children,
  className,
  imageClassName,
  priority = false,
  sizes = "100vw",
}: HoverVideoPreviewProps) {
  const [isHovering, setIsHovering] = useState(false);
  const hoverIframeSrc = useMemo(
    () => (video.embedUrl ? withAutoplayParams(video.embedUrl, true) : undefined),
    [video.embedUrl],
  );

  return (
    <div
      className={cn("relative overflow-hidden bg-[#101828]", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {video.thumbnailSrc ? (
        <Image
          src={video.thumbnailSrc}
          alt={video.thumbnailAlt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div className="absolute inset-0 bg-[#E4E7EC]" />
      )}

      {isHovering && video.previewVideoSrc ? (
        <video
          src={video.previewVideoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      ) : null}

      {isHovering && !video.previewVideoSrc && hoverIframeSrc ? (
        <iframe
          title={`${video.title} preview`}
          src={hoverIframeSrc}
          className="pointer-events-none absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : null}

      {children}
    </div>
  );
}

type VideoDialogProps = {
  video: PublicVideo;
  trigger: ReactElement;
  iframeAspectRatioClassName: string;
  emptyTitle?: string;
};

export function VideoDialog({
  video,
  trigger,
  iframeAspectRatioClassName,
  emptyTitle = "No video yet",
}: VideoDialogProps) {
  const iframeSrc = useMemo(
    () => (video.embedUrl ? withAutoplayParams(video.embedUrl, false) : undefined),
    [video.embedUrl],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-w-5xl border-0 bg-white p-3 shadow-2xl sm:p-4">
        <DialogHeader className="sr-only">
          <DialogTitle>{video.title}</DialogTitle>
          <DialogDescription>{iframeSrc ? "Video player" : emptyTitle}</DialogDescription>
        </DialogHeader>

        <div className={cn("relative w-full overflow-hidden rounded-lg bg-[#101828]", iframeAspectRatioClassName)}>
          {iframeSrc ? (
            <iframe
              title={video.title}
              src={iframeSrc}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
              <p className="text-lg font-semibold text-white">{emptyTitle}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
