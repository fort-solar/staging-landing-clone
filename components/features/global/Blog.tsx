import Link from "next/link";

import { Button } from "@/components/ui/button";
import BlogCard from "@/components/ui/blog/BlogCard";
import { getBlogPostsPage } from "@/lib/blog-data";

const Blog = async () => {
  const { data: featuredPosts } = await getBlogPostsPage(1, 3);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-between space-y-10 px-4 py-10 sm:items-start">
      <div className="mt-5 flex w-full flex-col items-center justify-center gap-6 text-center lg:flex-row lg:justify-between lg:gap-2 lg:text-start">
        <div className="mt-2 max-w-3xl text-3xl font-bold leading-10 font-poppins lg:text-5xl lg:leading-16">
          Insights and Updates from Fortsolar
        </div>

        <div className="block max-w-4xl lg:hidden">
          <p>
            Stay informed with the latest in solar technology, energy trends, expert tips, and project
            highlights.
          </p>
        </div>

        <div className="w-full lg:w-fit">
          <Link href="/blog" className="w-full lg:w-fit">
            <Button className="w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] py-6 text-sm text-white transition-all hover:opacity-90 lg:w-fit">
              Explore All Articles -&gt;
            </Button>
          </Link>
        </div>
      </div>

      <div className="hidden max-w-4xl lg:block">
        <p>
          Stay informed with the latest in solar technology, energy trends, expert tips, and project
          highlights.
        </p>
      </div>

      {featuredPosts.length ? (
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {featuredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-10 flex min-h-64 items-center justify-center rounded-3xl border border-dashed border-[#D0D5DD] bg-[#F9FAFB] px-6 text-center text-[#667085]">
          Blog articles will appear here once content is published.
        </div>
      )}
    </div>
  );
};

export default Blog;
