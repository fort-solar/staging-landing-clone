type BreakpointAspectRatio = {
  ratio: string;
  className: string;
};

type ResponsiveAspectRatio = {
  name: string;
  usage: string;
  mobile: BreakpointAspectRatio;
  tablet: BreakpointAspectRatio;
  desktop: BreakpointAspectRatio;
};

export const VIDEO_ASPECT_RATIOS = {
  whyChooseUsVideoThumbnail: {
    name: "Why Choose Us video thumbnail",
    usage: "Home and about Why Choose Us video thumbnail image.",
    mobile: { ratio: "16:9", className: "aspect-video" },
    tablet: { ratio: "16:9", className: "md:aspect-video" },
    desktop: { ratio: "16:9", className: "lg:aspect-video" },
  },
  videoIframe: {
    name: "Video iframe",
    usage: "Shared video modal iframe for about-us and testimonial videos.",
    mobile: { ratio: "16:9", className: "aspect-video" },
    tablet: { ratio: "16:9", className: "md:aspect-video" },
    desktop: { ratio: "16:9", className: "lg:aspect-video" },
  },
  aboutVideoTestimonialThumbnail: {
    name: "About video testimonial thumbnail",
    usage: "Portrait thumbnail cards in the about page Video Testimonials section.",
    mobile: { ratio: "9:16", className: "aspect-[9/16]" },
    tablet: { ratio: "9:16", className: "md:aspect-[9/16]" },
    desktop: { ratio: "9:16", className: "lg:aspect-[9/16]" },
  },
} as const satisfies Record<string, ResponsiveAspectRatio>;

export const IMAGE_ASPECT_RATIOS = {
  homeHeroSliderImage: {
    name: "Home hero slider image",
    usage: "Hero carousel artwork. Source images should keep the full subject safe for mobile clipping.",
    mobile: { ratio: "8:9 source, clipped to a narrow right-side crop", className: "aspect-[8/9]" },
    tablet: { ratio: "8:9", className: "md:aspect-[8/9]" },
    desktop: { ratio: "8:9", className: "lg:aspect-[8/9]" },
  },
  aboutServicesSliderImage: {
    name: "About services slider image",
    usage: "Service slide image panel on the about page.",
    mobile: { ratio: "4:3 display crop, 1:1 safe source", className: "aspect-[4/3]" },
    tablet: { ratio: "1:1", className: "md:aspect-square" },
    desktop: { ratio: "1:1", className: "lg:aspect-square" },
  },
} as const satisfies Record<string, ResponsiveAspectRatio>;

export const MEDIA_ASPECT_RATIOS = {
  ...VIDEO_ASPECT_RATIOS,
  ...IMAGE_ASPECT_RATIOS,
} as const;
