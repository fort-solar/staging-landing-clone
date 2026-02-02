import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon",
  description: "This Fortsolar page is under construction. Check back soon.",
  alternates: {
    canonical: "/coming-soon",
  },
  openGraph: {
    title: "Fortsolar | Coming Soon",
    description: "We’re building something new for Fortsolar. Stay tuned.",
    url: "/coming-soon",
    type: "website",
  },
};

export default function ComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
