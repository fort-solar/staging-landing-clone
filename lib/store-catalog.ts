import { cache } from "react";

import { fetchJson, withQuery } from "@/lib/public-content";

type ApiCollectionPayload<T> =
  | T[]
  | {
      success?: boolean;
      data?: T[];
    };

type ProductCategorySummaryRecord = {
  name?: string | null;
};

type UnifiedProductRecord = {
  id: string;
  name: string;
  price: number;
  stock_quantity?: number | null;
  overview?: string | null;
  category?: ProductCategorySummaryRecord | null;
  product_image_url?: string | null;
  product_image_urls?: string[];
  image_url?: string | null;
  image_urls?: string[];
  image?: string | null;
  is_active?: boolean;
};

type PackageProductRecord = {
  name?: string | null;
};

type PackageItemRecord = {
  product_name?: string | null;
  product?: PackageProductRecord | null;
};

type ProductPackageRecord = {
  id: string;
  name: string;
  price: number;
  overview?: string | null;
  description?: string | null;
  image_url?: string | null;
  thumbnail_url?: string | null;
  package_image_url?: string | null;
  what_it_powers?: string[];
  items?: PackageItemRecord[];
  products?: PackageItemRecord[];
  discount_percentage?: number | null;
  is_active?: boolean;
};

export type LandingStoreProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  availability: string;
  categoryLabel: string;
};

export type LandingStorePackage = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  finalPrice: number;
  packageIncludes: string[];
  powers: string[];
};

const PRODUCT_IMAGE_FALLBACK = "/double_solar_panels.png";
const PACKAGE_IMAGE_FALLBACK = "/our_packages_one.png";
const PREVIEW_LIMIT = 4;

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

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
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

function readStringArray(record: Record<string, unknown>, keys: string[]) {
  return readArray(record, keys)
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
}

function extractRecords<T>(payload: ApiCollectionPayload<T> | null) {
  if (!payload) {
    return [] as T[];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload.success === false || !Array.isArray(payload.data)) {
    return [] as T[];
  }

  return payload.data;
}

function buildAvailability(stockQuantity: number, isActive: boolean) {
  if (!isActive) {
    return "Unavailable";
  }

  if (stockQuantity <= 0) {
    return "Out of Stock";
  }

  if (stockQuantity < 5) {
    return "Limited Stock";
  }

  return "In Stock";
}

function collectProductImages(record: UnifiedProductRecord) {
  const raw = record as unknown as Record<string, unknown>;
  const imageUrls = [
    ...readStringArray(raw, ["product_image_urls", "image_urls", "images"]),
    readString(raw, ["product_image_url", "image_url", "image"]),
  ].filter(Boolean);

  const uniqueImages = imageUrls.filter((value, index, values) => values.indexOf(value) === index);
  return uniqueImages.length ? uniqueImages : [PRODUCT_IMAGE_FALLBACK];
}

function normalizeProduct(record: UnifiedProductRecord): LandingStoreProduct {
  const images = collectProductImages(record);
  const categoryLabel = record.category?.name?.trim() || "Solar Product";

  return {
    id: record.id,
    title: record.name,
    description: record.overview?.trim() || `Explore ${record.name} from Fortsolar.`,
    image: images[0],
    price: Number(record.price) || 0,
    availability: buildAvailability(Number(record.stock_quantity) || 0, record.is_active !== false),
    categoryLabel,
  };
}

function normalizePackageItemLabel(record: unknown) {
  if (!isRecord(record)) {
    return "";
  }

  const productRecord = isRecord(record.product) ? record.product : null;

  return readString(
    record,
    ["product_name"],
    productRecord ? readString(productRecord, ["name"]) : "",
  );
}

function normalizePackage(record: ProductPackageRecord): LandingStorePackage {
  const raw = record as unknown as Record<string, unknown>;
  const discountPercentage = readNumber(raw, ["discount_percentage", "discount"]);
  const items = readArray(raw, ["items", "products"])
    .map((item) => normalizePackageItemLabel(item))
    .filter(Boolean)
    .slice(0, 3);
  const powers = readStringArray(raw, ["what_it_powers"]).slice(0, 4);
  const price = Number(record.price) || 0;

  return {
    id: record.id,
    title: record.name,
    description:
      record.overview?.trim() ||
      record.description?.trim() ||
      `Explore the ${record.name} solar package from Fortsolar.`,
    image:
      record.thumbnail_url?.trim() ||
      record.image_url?.trim() ||
      record.package_image_url?.trim() ||
      PACKAGE_IMAGE_FALLBACK,
    price,
    finalPrice: Math.max(0, price - (price * discountPercentage) / 100),
    packageIncludes: items,
    powers,
  };
}

export const getLandingStoreCatalogPreview = cache(async () => {
  const [productsPayload, packagesPayload] = await Promise.all([
    fetchJson<ApiCollectionPayload<UnifiedProductRecord>>(
      withQuery("/api/v1/products/", { page: 1, limit: PREVIEW_LIMIT }),
    ),
    fetchJson<ApiCollectionPayload<ProductPackageRecord>>(
      withQuery("/api/v1/products/packages", { page: 1, limit: PREVIEW_LIMIT }),
    ),
  ]);

  return {
    products: extractRecords(productsPayload).map(normalizeProduct).slice(0, PREVIEW_LIMIT),
    packages: extractRecords(packagesPayload).map(normalizePackage).slice(0, PREVIEW_LIMIT),
  };
});
