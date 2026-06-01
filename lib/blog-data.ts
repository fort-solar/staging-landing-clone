import { cache } from "react";

import {
  fetchAllCollectionRecords,
  paginateCollection,
  type PaginationMeta,
} from "@/lib/public-content";

type BlogApiRecord = {
  id?: string;
  slug?: string;
  title?: string;
  summary?: string;
  body?: string;
  category?: string;
  status?: string;
  image?: string;
  image_url?: string;
  seo_title?: string;
  meta_description?: string;
  read_time_minutes?: number | string;
  views?: number | string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
};

export type BlogHeading = {
  id: string;
  heading: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  summary: string;
  publishedAt: string;
  publishedAtIso: string;
  readTime: string;
  readTimeMinutes: number;
  coverImage: string;
  bodyHtml: string;
  headings: BlogHeading[];
  views: number;
  seoTitle: string;
  metaDescription: string;
};

const BLOG_PLACEHOLDER_IMAGE = "/panels_on_a_roof.jpg";
const BLOG_PAGE_SIZE = 6;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return fallback;
}

function readNumber(record: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    const value = record[key];
    const normalized =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number(value)
          : Number.NaN;

    if (Number.isFinite(normalized)) {
      return normalized;
    }
  }

  return fallback;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toHtml(value: string) {
  if (!value.trim()) {
    return "";
  }

  if (/<[a-z][\s\S]*>/i.test(value)) {
    return value;
  }

  return value
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
}

function formatPublishedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat("en-NG", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date());
  }

  return new Intl.DateTimeFormat("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function createHeadingId(value: string, usedIds: Set<string>) {
  const baseId = slugify(value) || `section-${usedIds.size + 1}`;
  let id = baseId;
  let suffix = 2;

  while (usedIds.has(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(id);
  return id;
}

function decorateBodyHtml(body: string) {
  if (!body.trim()) {
    return {
      bodyHtml: "",
      headings: [] as BlogHeading[],
    };
  }

  const usedIds = new Set<string>();
  const headings: BlogHeading[] = [];
  const bodyHtml = body.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, level, attributes, content) => {
      const heading = stripHtml(content);

      if (!heading) {
        return `<h${level}${attributes}>${content}</h${level}>`;
      }

      const id = createHeadingId(heading, usedIds);
      headings.push({ id, heading });

      if (/\sid=("|').*?\1/i.test(attributes)) {
        return `<h${level}${attributes}>${content}</h${level}>`;
      }

      return `<h${level}${attributes} id="${id}">${content}</h${level}>`;
    },
  );

  return { bodyHtml, headings };
}

function isPublicPost(status: string) {
  const normalizedStatus = status.trim().toLowerCase();

  return !normalizedStatus || normalizedStatus === "published" || normalizedStatus === "active";
}

function normalizeBlogRecord(record: unknown) {
  if (!isRecord(record)) {
    return null;
  }

  const title = readString(record, ["title", "name"]);

  if (!title) {
    return null;
  }

  const status = readString(record, ["status"]);

  if (status && !isPublicPost(status)) {
    return null;
  }

  const slug = readString(record, ["slug"], slugify(title));
  const summary = readString(record, ["summary", "excerpt", "meta_description"]);
  const rawBody = readString(record, ["body", "content"]);
  const bodyHtml = toHtml(rawBody);
  const decoratedBody = decorateBodyHtml(bodyHtml);
  const excerpt =
    summary ||
    stripHtml(rawBody).slice(0, 180).trim() ||
    "Blog content will be published here soon.";
  const publishedAtIso =
    readString(record, ["published_at", "created_at", "updated_at"]) ||
    new Date().toISOString();
  const readTimeMinutes = Math.max(
    1,
    Math.round(readNumber(record, ["read_time_minutes"], 5)),
  );

  return {
    id: readString(record, ["id"], slug),
    slug,
    category: readString(record, ["category"], "Solar"),
    title,
    excerpt,
    summary: summary || excerpt,
    publishedAt: formatPublishedAt(publishedAtIso),
    publishedAtIso,
    readTime: `${readTimeMinutes} min read`,
    readTimeMinutes,
    coverImage: readString(record, ["image_url", "image"], BLOG_PLACEHOLDER_IMAGE),
    bodyHtml: decoratedBody.bodyHtml,
    headings: decoratedBody.headings,
    views: Math.max(0, Math.round(readNumber(record, ["views"]))),
    seoTitle: readString(record, ["seo_title"], title),
    metaDescription: readString(record, ["meta_description"], summary || excerpt),
  } satisfies BlogPost;
}

const loadAllBlogPosts = cache(async () => {
  const records = await fetchAllCollectionRecords<BlogApiRecord>(
    ["/api/v1/blog", "/api/v1/blog/"],
    { limit: 100 },
  );

  return records
    .map((record) => normalizeBlogRecord(record))
    .filter((record): record is BlogPost => Boolean(record))
    .sort(
      (left, right) =>
        new Date(right.publishedAtIso).getTime() - new Date(left.publishedAtIso).getTime(),
    );
});

export async function getAllBlogPosts() {
  return loadAllBlogPosts();
}

export async function getBlogPostsPage(
  page = 1,
  limit = BLOG_PAGE_SIZE,
): Promise<{
  data: BlogPost[];
  pagination: PaginationMeta;
}> {
  const posts = await loadAllBlogPosts();
  return paginateCollection(posts, page, limit);
}

export async function getBlogBySlug(slug: string) {
  const posts = await loadAllBlogPosts();
  const normalizedSlug = slug.trim().toLowerCase();

  return (
    posts.find((post) => post.slug.trim().toLowerCase() === normalizedSlug) ?? null
  );
}
