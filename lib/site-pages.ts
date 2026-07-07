import type {
  SitePageDetailApiResponse,
  SitePageListApiResponse,
  SitePageRecord,
} from "@/types/api.types";

const API_BASE_URL =
  process.env.BACKEND_API_URL ??
  process.env.FORTSOLAR_API_BASE_URL ??
  process.env.NEXT_PUBLIC_FORTSOLAR_API_BASE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL;

function buildApiUrl(path: string) {
  if (!API_BASE_URL) {
    return null;
  }

  try {
    // If it's relative and we are somehow on the client or in a proxy context, simple concat.
    if (API_BASE_URL.startsWith("/")) {
      const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;
      return `${base}${normalizedPath}`;
    }
    
    // Make sure we form a valid base URL (if it's missing trailing slash or path has leading slash, URL constructor handles it but we should be safe)
    const baseStr = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
    const pathStr = path.startsWith("/") ? path.slice(1) : path;
    
    return new URL(pathStr, baseStr).toString();
  } catch (error) {
    console.error("Error building URL:", error, "path:", path, "base:", API_BASE_URL);
    return null;
  }
}

async function fetchJson<T>(path: string) {
  const url = buildApiUrl(path);

  if (!url) {
    return null;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json().catch(() => null)) as T | null;
  } catch {
    return null;
  }
}

export async function getSitePageBySlug(slug: string) {
  const detailPayload = await fetchJson<SitePageDetailApiResponse>(
    `/api/v1/admin/site-pages/${slug}`,
  );

  if (detailPayload?.success && detailPayload.data?.sections?.length) {
    return detailPayload.data;
  }

  const listPayload = await fetchJson<SitePageListApiResponse>(
    `/api/v1/admin/site-pages/?slug=${encodeURIComponent(slug)}`,
  );

  if (!listPayload?.success || !listPayload.data?.length) {
    return null;
  }

  return (
    listPayload.data.find((page) => page.slug === slug && page.sections?.length > 0) ??
    listPayload.data.find((page) => page.sections?.length > 0) ??
    null
  );
}

export async function resolveSitePageOrFallback(slug: string) {
  const page = await getSitePageBySlug(slug);

  return {
    page,
    hasDynamicContent: Boolean(page?.sections?.length),
  };
}

export function getSectionCards(section: SitePageRecord["sections"][number]) {
  if (!section.card || !section.number_of_cards || section.number_of_cards <= 0) {
    return [];
  }

  return Array.from({ length: section.number_of_cards }, (_, index) => ({
    title: `${section.title || "Card"} ${index + 1}`,
    content: section.content || section.subtitle || "Content pending from the admin dashboard.",
  }));
}
