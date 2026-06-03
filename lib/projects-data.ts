import { cache } from "react";

import {
  fetchCollectionPage,
  fetchAllCollectionRecords,
  type PaginationMeta,
} from "@/lib/public-content";

export type ProjectSystemDetails = {
  inverterSize: string;
  pvSize: string;
  batterySize: string;
};

export type ProjectItem = {
  slug: string;
  title: string;
  listingTitle: string;
  summary: string;
  location: string;
  locationLabel: string;
  dateLabel: string;
  detailDateLabel: string;
  heroImages: string[];
  galleryImages: string[];
  overview: string;
  community: string;
  highlights: string[];
  systemDetails: ProjectSystemDetails;
  whatItCanPower: string[];
  createdAt: string;
};

type ProjectApiRecord = {
  slug?: string;
  title?: string;
  name?: string;
  listing_title?: string;
  project_title?: string;
  summary?: string;
  overview?: string;
  description?: string;
  status?: string;
  address?: string;
  community?: string;
  city?: string;
  state?: string;
  country?: string;
  location?: string;
  image_url?: string;
  image_urls?: string[];
  images?: string[];
  product_images?: string[];
  media?:
    | {
        image_urls?: string[];
      }
    | Array<{
        url?: string;
        mime_type?: string | null;
      }>;
  video_urls?: string[];
  highlights?: string[];
  what_it_powers?: string[];
  system_details?: {
    inverter_label?: string;
    inverter_size?: string;
    pv_label?: string;
    pv_size?: string;
    battery_label?: string;
    battery_size?: string;
  } | null;
  inverter_type?: string;
  system_size_kw?: string | number;
  created_at?: string;
  updated_at?: string;
  scheduled_date?: string | null;
};

const PROJECT_PLACEHOLDER_IMAGE = "/contact_hero_image.png";
const PROJECT_PAGE_SIZE = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return fallback;
}

function readArray(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function toStringList(record: Record<string, unknown>, keys: string[]) {
  return readArray(record, keys)
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim());
}

function inferMediaKind(source: string, mimeType?: string | null) {
  const normalizedSource = source.toLowerCase();
  const normalizedMime = mimeType?.toLowerCase() ?? "";

  if (
    normalizedMime.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(normalizedSource)
  ) {
    return "image" as const;
  }

  if (
    normalizedMime.startsWith("video/") ||
    /\.(mp4|webm|mov|m4v|avi)$/i.test(normalizedSource)
  ) {
    return "video" as const;
  }

  return "file" as const;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toImageArray(record: Record<string, unknown>) {
  const mediaImages = Array.isArray(record.media)
    ? record.media
        .filter((item): item is Record<string, unknown> => isRecord(item))
        .map((item) => ({
          url: readString(item, ["url"]),
          mimeType: readString(item, ["mime_type"]),
        }))
        .filter(
          (item) =>
            item.url &&
            inferMediaKind(item.url, item.mimeType || null) === "image",
        )
        .map((item) => item.url)
        .filter(Boolean)
    : [];
  const mediaRecord = isRecord(record.media) ? record.media : null;
  const nestedImages = mediaRecord
    ? toStringList(mediaRecord, ["image_urls"])
    : [];
  const topLevelImages = toStringList(record, [
    "image_urls",
    "product_images",
    "images",
  ]);
  const fallbackImage = readString(record, ["image_url", "image"]);

  const images = [...topLevelImages, ...nestedImages, ...mediaImages, fallbackImage].filter(
    Boolean,
  );

  return images.filter((image, index) => images.indexOf(image) === index);
}

function isPublicProject(status: string) {
  const normalizedStatus = status.trim().toLowerCase();

  return (
    !normalizedStatus ||
    normalizedStatus === "published" ||
    normalizedStatus === "active" ||
    normalizedStatus === "completed"
  );
}

function formatProjectDateLabel(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { short: "Recent", long: "Recent project" };
  }

  return {
    short: new Intl.DateTimeFormat("en-NG", { month: "short", year: "numeric" }).format(date),
    long: new Intl.DateTimeFormat("en-NG", { month: "long", year: "numeric" }).format(date),
  };
}

function normalizeProjectRecord(record: unknown) {
  if (!isRecord(record)) {
    return null;
  }

  const title = readString(record, ["title", "name", "listing_title", "project_title"]);

  if (!title) {
    return null;
  }

  const status = readString(record, ["status"]);

  if (status && !isPublicProject(status)) {
    return null;
  }

  const createdAt =
    readString(record, ["scheduled_date", "created_at", "updated_at"]) ||
    new Date().toISOString();
  const dateLabel = formatProjectDateLabel(createdAt);
  const systemDetailsRecord = isRecord(record.system_details) ? record.system_details : null;
  const address = readString(record, ["address", "community"]);
  const city = readString(record, ["city"]);
  const state = readString(record, ["state"]);
  const country = readString(record, ["country"]);
  const locationLabel =
    [city, state, country].filter(Boolean).join(", ") ||
    readString(record, ["location"], address || "Nigeria");
  const images = toImageArray(record);

  const galleryImages = images.length ? images : [PROJECT_PLACEHOLDER_IMAGE];

  return {
    slug: readString(record, ["slug"], slugify(title)),
    title,
    listingTitle: readString(record, ["listing_title", "title", "name"], title),
    summary: readString(
      record,
      ["summary", "overview", "description"],
      "Project details will be published here soon.",
    ),
    location: locationLabel,
    locationLabel,
    dateLabel: dateLabel.short,
    detailDateLabel: dateLabel.long,
    heroImages: galleryImages.slice(0, 4),
    galleryImages,
    overview: readString(
      record,
      ["overview", "description", "summary"],
      "Project overview will be published here soon.",
    ),
    community: address || locationLabel,
    highlights: toStringList(record, ["highlights"]),
    systemDetails: {
      inverterSize: readString(
        systemDetailsRecord ?? {},
        ["inverter_label", "inverter_size"],
        readString(record, ["inverter_type"], "Not specified"),
      ),
      pvSize: readString(
        systemDetailsRecord ?? {},
        ["pv_label", "pv_size"],
        readString(record, ["system_size_kw"], "Not specified"),
      ),
      batterySize: readString(
        systemDetailsRecord ?? {},
        ["battery_label", "battery_size"],
        "Not specified",
      ),
    },
    whatItCanPower: toStringList(record, ["what_it_powers"]),
    createdAt,
  } satisfies ProjectItem;
}

function uniqueProjects(projects: ProjectItem[]) {
  const seen = new Set<string>();

  return projects.filter((project) => {
    const key = project.slug || `${project.title}:${project.createdAt}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

const loadAllProjects = cache(async () => {
  const projectRecords = await fetchAllCollectionRecords<ProjectApiRecord>(
    ["/api/v1/projects", "/api/v1/projects/"],
    {
      limit: PROJECT_PAGE_SIZE,
      query: {
        status: "published",
      },
    },
  );

  return uniqueProjects(
    projectRecords
      .map((record) => normalizeProjectRecord(record))
      .filter((record): record is ProjectItem => Boolean(record))
      .sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
  );
});

export async function getProjects() {
  return loadAllProjects();
}

export async function getProjectsPage(
  page = 1,
  limit = PROJECT_PAGE_SIZE,
): Promise<{
  data: ProjectItem[];
  pagination: PaginationMeta;
}> {
  const payload = await fetchCollectionPage<ProjectApiRecord>(
    ["/api/v1/projects", "/api/v1/projects/"],
    {
      page,
      limit,
      query: {
        status: "published",
      },
    },
  );

  if (!payload) {
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }

  return {
    data: payload.data
      .map((record) => normalizeProjectRecord(record))
      .filter((record): record is ProjectItem => Boolean(record)),
    pagination: payload.pagination,
  };
}

export async function getProjectBySlug(slug: string) {
  const projectsPayload = await fetchCollectionPage<ProjectApiRecord>(
    ["/api/v1/projects", "/api/v1/projects/"],
    {
      page: 1,
      limit: PROJECT_PAGE_SIZE,
      query: {
        search: slug.trim(),
        status: "published",
      },
    },
  );
  const normalizedSlug = slug.trim().toLowerCase();

  return (
    projectsPayload?.data
      .map((record) => normalizeProjectRecord(record))
      .filter((record): record is ProjectItem => Boolean(record))
      .find((project) => project.slug.trim().toLowerCase() === normalizedSlug) ?? null
  );
}
