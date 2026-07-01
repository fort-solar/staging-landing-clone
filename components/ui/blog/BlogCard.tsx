import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { BlogPost } from "@/lib/blog-data";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
  className?: string;
};

export default function BlogCard({ post, className }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block h-full", className)}>
      <article className="h-full rounded-3xl border border-black/5 bg-white p-4 shadow-[0_12px_36px_-26px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.45)]">
        <div className="relative h-52 overflow-hidden rounded-2xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="space-y-3 px-1 pb-2 pt-5">
          <p className="text-sm font-semibold text-[#048A05]">{post.category}</p>

          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-xl font-semibold leading-tight font-poppins text-[#111827]">
              {post.title}
            </h3>
            <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[#111827]" />
          </div>

          <p className="line-clamp-2 text-base text-[#667085]">{post.excerpt}</p>
        </div>
      </article>
    </Link>
  );
}
