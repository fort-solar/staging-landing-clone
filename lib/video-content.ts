export type PublicVideo = {
  id: string;
  title: string;
  thumbnailAlt: string;
  thumbnailSrc?: string;
  embedUrl?: string;
  previewVideoSrc?: string;
};

export const ABOUT_US_VIDEO: PublicVideo = {
  id: "about-us",
  title: "Fortsolar About Us Video",
  thumbnailAlt: "Solar installation video thumbnail",
  thumbnailSrc: "/video_background.jpg",
};

export const VIDEO_TESTIMONIALS: PublicVideo[] = [];

export const VIDEO_TESTIMONIAL_EMPTY_STATE = {
  title: "No video testimonials yet",
  description:
    "Please reach out to our admin via our contact email at enquiry@fortsolar.ng if you are interested in dropping your reviews.",
};
