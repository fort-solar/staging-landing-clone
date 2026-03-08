import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3 } from "lucide-react";

import Footer from "@/components/features/global/Footer";
import Newsletter from "@/components/features/global/Newsletter";
import { Button } from "@/components/ui/button";
import { SlantedArrow } from "@/components/features/icons/SlantedArrow";
import BlogToc from "@/components/ui/blog/BlogToc";
import { blogPosts, getBlogBySlug } from "@/lib/blog-data";
import { FaInstagram, FaFacebook, FaLinkedin, FaShare } from 'react-icons/fa';

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    return {
      title: "Blog Not Found | Fortsolar",
    };
  }

  return {
    title: `${post.title} | Fortsolar Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 pb-10 pt-8 lg:pb-16 lg:pt-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.65fr_0.8fr] lg:gap-8">
          <article>
            <div className="space-y-4">
              <div className="flex items-center gap-5 text-sm text-[#667085]">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{post.publishedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight font-poppins text-[#333333] lg:text-6xl">
                {post.title}
              </h1>
            </div>

            <div className="relative mt-8 h-70 overflow-hidden rounded-[28px] lg:h-115">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 72vw"
              />
            </div>

            <div className="mt-9 space-y-10">
              {post.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="text-2xl font-semibold font-poppins text-[#111827]">{section.heading}</h2>
                  <div className="mt-4 space-y-5 text-base leading-relaxed text-[#3F3F46]">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={`${section.id}-${index}`} className={section.italic ? "italic" : ""}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              <section id="conclusion" className="scroll-mt-28">
                <h2 className="text-2xl font-semibold font-poppins text-[#111827]">Conclusion</h2>
                <div className="mt-4 space-y-5 text-base leading-relaxed text-[#3F3F46]">
                  {post.conclusion.map((paragraph, index) => (
                    <p key={`conclusion-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </section>

            </div>
          </article>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-3xl border border-black/5 bg-[#F9FAFB] p-6">
              <p className="text-base font-semibold text-[#98A2B3]">ON THIS PAGE</p>
              <BlogToc sections={post.sections.map(({ id, heading }) => ({ id, heading }))} />

              <div className="mt-4 flex items-center gap-3 text-[#5A646B]">
                <FaInstagram />
                <FaFacebook />
                <FaLinkedin />
                <FaShare />
              </div>
            </div>
          </aside>
        </div>
      </main>




      <section className="mx-auto max-w-7xl px-4 pb-8 lg:pb-12">
        <div className="rounded-3xl  bg-white">
          <h2 className="text-3xl font-bold font-poppins text-[#101828] lg:text-4xl">Continue Reading</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {blogPosts
              .filter((item) => item.slug !== post.slug)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#D0D5DD] px-4 py-2 text-sm font-medium text-[#344054] hover:bg-[#F9FAFB]"
                >
                  {item.title}
                  <SlantedArrow className="h-3.5 w-3.5" />
                </Link>
              ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-5 lg:pb-8">
        <div className="rounded-3xl  bg-white">
          <h3 className="text-3xl font-bold font-poppins text-[#101828] lg:text-4xl">
            Ready to Start Saving with Solar?
          </h3>
          <p className="mt-3 text-base text-[#475467]">
            Get a free energy audit and customized quote from our experts today.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="h-11 rounded-2xl bg-[linear-gradient(94.62deg,#2CB22C_-8.83%,#058A05_110.95%)] px-6 text-white hover:opacity-90">
              <Link href="/coming-soon">Explore Packages</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-2xl border-[#0000004D] bg-transparent px-6 text-[#111827] hover:text-[#111827]"
            >
              <Link href="/energy-calculator">Get a Free Quote</Link>
            </Button>
          </div>
        </div>

      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
