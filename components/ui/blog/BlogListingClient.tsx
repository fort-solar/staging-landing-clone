"use client";

import { useMemo, useState } from "react";
import { ArrowDown, Search } from "lucide-react";

import type { BlogPost } from "@/lib/blog-data";
import BlogCard from "@/components/ui/blog/BlogCard";
import { Button } from "@/components/ui/button";

type BlogListingClientProps = {
  posts: BlogPost[];
};

const INITIAL_VISIBLE_COUNT = 6;
const VISIBLE_INCREMENT = 3;

export default function BlogListingClient({ posts }: BlogListingClientProps) {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return posts;
    }

    return posts.filter((post) => {
      const haystacks = [post.title, post.category, post.excerpt, ...post.tags].map((text) =>
        text.toLowerCase(),
      );

      return haystacks.some((text) => text.includes(normalizedQuery));
    });
  }, [posts, query]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredPosts.length;

  return (
    <>
      <section className="relative overflow-hidden bg-[#EBFAEB] px-4 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex rounded-full border border-[#22A922] px-4 py-1 text-sm font-medium text-[#058A05]">
            Our Blog
          </span>
          <h1 className="mt-8 text-2xl font-semibold leading-tight font-poppins text-[#333333] lg:text-5xl">
            Solar Insights &amp; Energy Solutions
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-sm text-[#3B3B3B] lg:text-base">
            Stay informed with the latest in solar technology, energy trends, expert tips, and
            project highlights
          </p>

          <div className="relative mx-auto mt-8 max-w-3xl">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#667085]" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              placeholder="Search Blog"
              className="h-14 w-full rounded-2xl border border-[#00000066] bg-white px-12 text-lg outline-none placeholder:text-[#344054]"
              aria-label="Search blog posts"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:py-14">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D0D5DD] bg-[#F9FAFB] p-10 text-center text-[#667085]">
            No blog posts matched &quot;{query}&quot;.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {visiblePosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {canLoadMore && (
              <div className="mt-10 flex justify-center">
                <Button
                  onClick={() => setVisibleCount((count) => count + VISIBLE_INCREMENT)}
                  variant="outline"
                  className="h-11 rounded-xl border-[#D6EED6] bg-[#ECF8EC] px-5 text-[#058A05] hover:bg-[#e3f3e3] hover:text-[#058A05]"
                >
                  <ArrowDown className="h-4 w-4" />
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
