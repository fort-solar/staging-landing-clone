import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Fortsolar",
  description:
    "Get in touch with Fortsolar for solar products, installations, and support. We’re here to help you go solar.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Fortsolar",
    description:
      "Talk to the Fortsolar team about solar products, installations, and financing options.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
