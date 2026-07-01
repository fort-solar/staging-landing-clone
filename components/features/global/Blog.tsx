import Link from "next/link";

import { Button } from "@/components/ui/button";
import BlogCard from "@/components/ui/blog/BlogCard";
import PublicEmptyState from "@/components/ui/public/PublicEmptyState";
import { getBlogPostsPage } from "@/lib/blog-data";

const Blog = async () => {
  const { data: featuredPosts } = await getBlogPostsPage(1, 3);

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-between space-y-10 px-4 py-10 sm:items-start">
      <div className="mt-5 flex w-full flex-col items-center justify-center gap-6 text-center lg:flex-row lg:justify-between lg:gap-2 lg:text-start">
        <div className="mt-2 max-w-3xl text-3xl md:text-4xl lg:text-5xl font-bold leading-tight font-poppins lg:leading-tight">
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
            <Button className="w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#048A05_110.95%)] py-6 text-sm text-white transition-all hover:opacity-90 lg:w-fit">
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
        <PublicEmptyState
          title="No blog content published yet"
          description="There are no live Fortsolar articles right now. New solar insights, product updates, and project stories will appear here once they are published."
          className="mt-10 min-h-72"
        />
      )}
    </div>
  );
};

export default Blog;
