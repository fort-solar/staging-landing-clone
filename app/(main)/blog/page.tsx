import type { Metadata } from "next";

import Footer from "@/components/features/global/Footer";
import Newsletter from "@/components/features/global/Newsletter";
import BlogListingClient from "@/components/ui/blog/BlogListingClient";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog | Fortsolar",
  description:
    "Explore Fortsolar blog insights on solar installations, financing, maintenance, and smart energy usage.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="bg-white">
      <BlogListingClient posts={blogPosts} />
      <Newsletter />
      <Footer />
    </div>
  );
}
