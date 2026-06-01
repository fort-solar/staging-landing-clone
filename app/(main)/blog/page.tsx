import type { Metadata } from "next";

import Footer from "@/components/features/global/Footer";
import Newsletter from "@/components/features/global/Newsletter";
import BlogListingClient from "@/components/ui/blog/BlogListingClient";
import { getBlogPostsPage } from "@/lib/blog-data";
import { parsePageParam } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Blog | Fortsolar",
  description:
    "Explore Fortsolar blog insights on solar installations, financing, maintenance, and smart energy usage.",
  alternates: {
    canonical: "/blog",
  },
};

type BlogPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parsePageParam(resolvedSearchParams.page);
  const { data, pagination } = await getBlogPostsPage(page);

  return (
    <div className="bg-white">
      <BlogListingClient posts={data} pagination={pagination} />
      <Newsletter />
      <Footer />
    </div>
  );
}
