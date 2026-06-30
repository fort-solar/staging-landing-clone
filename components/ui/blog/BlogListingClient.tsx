import type { BlogPost } from "@/lib/blog-data";
import type { PaginationMeta } from "@/lib/public-content";
import BlogCard from "@/components/ui/blog/BlogCard";
import PublicEmptyState from "@/components/ui/public/PublicEmptyState";
import PublicPagination from "@/components/ui/public/PublicPagination";

type BlogListingClientProps = {
  posts: BlogPost[];
  pagination: PaginationMeta;
};

export default function BlogListingClient({
  posts,
  pagination,
}: BlogListingClientProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#EBFAEB] px-4 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full border border-[#22A922] px-4 py-1 text-sm font-medium text-[#048A05]">
            Our Blog
          </span>
          <h1 className="mt-8 text-2xl font-semibold leading-tight font-poppins text-[#333333] lg:text-5xl">
            Solar Insights &amp; Energy Solutions
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-sm text-[#3B3B3B] lg:text-base">
            Stay informed with the latest in solar technology, energy trends, expert tips, and
            project highlights.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        <div className="flex min-h-[70vh] flex-col justify-between gap-10">
          {posts.length ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <PublicEmptyState
              title="No blog content published yet"
              description="There are no live Fortsolar articles right now. New solar insights, product updates, and project stories will appear here once they are published."
              className="min-h-72"
            />
          )}

          {pagination.total > 0 ? (
            <PublicPagination
              basePath="/blog"
              page={pagination.page}
              totalPages={pagination.totalPages}
            />
          ) : null}
        </div>
      </section>
    </>
  );
}
