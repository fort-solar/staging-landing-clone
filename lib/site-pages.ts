import type {
  SitePageDetailApiResponse,
  SitePageListApiResponse,
  SitePageRecord,
} from "@/types/api.types";

const DEFAULT_API_HOST = "https://api.fortsolar.ng";

export function buildApiUrl(path: string, overrideBase?: string): string {
  const configured = overrideBase ?? (
    process.env.BACKEND_API_URL ??
    process.env.FORTSOLAR_API_BASE_URL ??
    process.env.NEXT_PUBLIC_FORTSOLAR_API_BASE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL
  )?.trim();

  const isServer = typeof window === "undefined";

  let base = configured || "";
  if (!base || (isServer && base.startsWith("/"))) {
    base = process.env.BACKEND_API_URL || process.env.FORTSOLAR_API_BASE_URL || DEFAULT_API_HOST;
  }

  base = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  let cleanPath = normalizedPath;
  if (base.endsWith("/api/v1") && cleanPath.startsWith("/api/v1")) {
    cleanPath = cleanPath.slice("/api/v1".length);
    if (!cleanPath.startsWith("/")) {
      cleanPath = `/${cleanPath}`;
    }
  }

  return `${base}${cleanPath}`;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  const primaryUrl = buildApiUrl(path);

  try {
    const response = await fetch(primaryUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      return (await response.json().catch(() => null)) as T | null;
    }
  } catch (error) {
    if (primaryUrl.includes("localhost") || primaryUrl.includes("127.0.0.1")) {
      try {
        const fallbackUrl = buildApiUrl(path, DEFAULT_API_HOST);
        const fallbackRes = await fetch(fallbackUrl, {
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (fallbackRes.ok) {
          return (await fallbackRes.json().catch(() => null)) as T | null;
        }
      } catch {
        // Fallback also failed
      }
    }
  }

  return null;
}


