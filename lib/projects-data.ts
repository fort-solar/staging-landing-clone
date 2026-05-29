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
};

const API_BASE_URL =
  process.env.FORTSOLAR_API_BASE_URL ??
  process.env.NEXT_PUBLIC_FORTSOLAR_API_BASE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL;

const placeholderImages = [
  "/contact_hero_image.png",
  "/contact_hero_image.png",
  "/contact_hero_image.png",
];

export const projects: ProjectItem[] = [
  {
    slug: "bellies-lounge-5kw-5kwh",
    title: "Bellies Lounge 5kW/5kWh",
    listingTitle: "5kVA Hybrid Solar System - Port Harcourt Home",
    summary:
      "Installed for a family home in Port Harcourt, this hybrid system ensures steady day and night power for essential appliances.",
    location: "Port Harcourt",
    locationLabel: "Port Harcourt",
    dateLabel: "Jan 2024",
    detailDateLabel: "January 2024",
    heroImages: placeholderImages,
    galleryImages: Array.from({ length: 6 }, () => "/contact_hero_image.png"),
    overview:
      "Fortsolar successfully installed a complete solar energy solution for this property, including solar panels, batteries, and an inverter system. The setup was commissioned after performance and reliability testing for everyday residential use.",
    community: "Port Harcourt - Egbelu community",
    highlights: [
      "24/7 uninterrupted power support",
      "Smart inverter setup for seamless power changeover",
      "Long-lasting lithium batteries with 5-year warranty",
      "Eco-friendly backup energy with significant monthly savings",
    ],
    systemDetails: {
      inverterSize: "12kVA",
      pvSize: "12kWp",
      batterySize: "15kWh",
    },
    whatItCanPower: [
      "1 Deep Freezer or Refrigerator",
      "6-8 Fans",
      "10-15 Bulbs",
      "2 Televisions",
      "1 Washing Machine",
      "1 Pumping Machine (intermittently)",
      "Charging Ports, Laptops & Small Appliances",
    ],
  },
  {
    slug: "lagos-office-10kva-commercial",
    title: "10kVA Commercial Solar Installation - Lagos Office",
    listingTitle: "10kVA Commercial Solar Installation - Lagos Office",
    summary:
      "A mid-size corporate office in Ikeja now runs 24/7 on solar, reducing diesel costs by over 70%.",
    location: "Lagos",
    locationLabel: "Lagos",
    dateLabel: "Jan 2024",
    detailDateLabel: "January 2024",
    heroImages: placeholderImages,
    galleryImages: Array.from({ length: 6 }, () => "/contact_hero_image.png"),
    overview:
      "This commercial deployment was tailored for stable daytime operations and battery-supported backup. The installation was designed to reduce fuel dependency and improve uptime across workstations and critical office equipment.",
    community: "Ikeja business district",
    highlights: [
      "Reduced diesel generator usage by over 70%",
      "Optimized solar production for daytime office load",
      "Battery backup for critical systems",
      "Clean cable management and professional installation finish",
    ],
    systemDetails: {
      inverterSize: "10kVA",
      pvSize: "8kWp",
      batterySize: "10kWh",
    },
    whatItCanPower: [
      "Office lighting for multiple rooms",
      "Desktop computers and laptops",
      "Internet routers and networking devices",
      "Printers and POS systems",
      "Fans and selected AC loads",
      "Security and surveillance systems",
      "Phone charging stations",
    ],
  },
  {
    slug: "uyo-home-hybrid-system",
    title: "Uyo Home Hybrid Solar System",
    listingTitle: "7.5kVA Hybrid Solar System - Uyo Residence",
    summary:
      "Designed for a multi-room home in Uyo, this package delivers reliable power for lighting, cooling, and entertainment.",
    location: "Uyo",
    locationLabel: "Uyo",
    dateLabel: "Feb 2024",
    detailDateLabel: "February 2024",
    heroImages: placeholderImages,
    galleryImages: Array.from({ length: 6 }, () => "/contact_hero_image.png"),
    overview:
      "Fortsolar provided a balanced hybrid solution for day and night household consumption, prioritizing dependable energy supply and long-term operating cost reduction.",
    community: "Uyo residential estate",
    highlights: [
      "Consistent evening and overnight backup",
      "Scalable system architecture",
      "Noise-free alternative to generators",
      "Designed for efficient household energy management",
    ],
    systemDetails: {
      inverterSize: "7.5kVA",
      pvSize: "6kWp",
      batterySize: "10kWh",
    },
    whatItCanPower: [
      "Refrigerator",
      "Multiple fans",
      "House lighting circuits",
      "Television and decoder",
      "Laptop and phone charging",
      "Washing machine (managed use)",
      "Small kitchen appliances",
    ],
  },
  {
    slug: "abuja-shop-solar-upgrade",
    title: "Abuja Retail Shop Solar Upgrade",
    listingTitle: "5kVA Solar Upgrade - Abuja Retail Shop",
    summary:
      "A retail outlet in Abuja upgraded to a compact solar backup system for lighting, tills, and refrigeration continuity.",
    location: "Abuja",
    locationLabel: "Abuja",
    dateLabel: "Mar 2024",
    detailDateLabel: "March 2024",
    heroImages: placeholderImages,
    galleryImages: Array.from({ length: 6 }, () => "/contact_hero_image.png"),
    overview:
      "This compact commercial installation supports core retail operations during grid outages and helps control recurring energy costs for daily business activity.",
    community: "Abuja city center",
    highlights: [
      "Improved business continuity during outages",
      "Supports refrigeration and checkout operations",
      "Compact footprint installation",
      "Lower operating cost versus fuel backup",
    ],
    systemDetails: {
      inverterSize: "5kVA",
      pvSize: "4kWp",
      batterySize: "5kWh",
    },
    whatItCanPower: [
      "Shop lighting",
      "POS and billing devices",
      "Router and CCTV",
      "Small refrigerator/freezer",
      "Fans",
      "Phone/laptop charging",
      "Selected small appliances",
    ],
  },
];

function buildApiUrl(path: string) {
  if (!API_BASE_URL) {
    return null;
  }

  return new URL(path, API_BASE_URL).toString();
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

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function readArray(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
}

function toImageArray(raw: Record<string, unknown>) {
  const mediaRecord = isRecord(raw.media) ? raw.media : null;
  const mediaImages = mediaRecord
    ? readArray(mediaRecord, ["image_urls"])
        .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
        .map((value) => value.trim())
    : [];
  const topLevelImages = readArray(raw, ["image_urls", "product_images", "images"])
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim());
  const fallbackImage = readString(raw, ["image_url", "product_image_url", "image"]);

  return [...topLevelImages, ...mediaImages, fallbackImage]
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index);
}

function toStringList(raw: Record<string, unknown>, keys: string[]) {
  return readArray(raw, keys)
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim());
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

function normalizeProjectRecord(record: unknown): ProjectItem | null {
  if (!isRecord(record)) {
    return null;
  }

  const title = readString(record, ["title", "name", "listing_title", "project_title"]);

  if (!title) {
    return null;
  }

  const images = toImageArray(record);
  const createdAt = readString(record, ["created_at", "updated_at"]);
  const dateLabel = formatProjectDateLabel(createdAt || new Date().toISOString());
  const systemDetailsRecord = isRecord(record.system_details) ? record.system_details : null;
  const address = readString(record, ["address", "community"]);
  const city = readString(record, ["city"]);
  const state = readString(record, ["state"]);
  const country = readString(record, ["country"]);
  const locationLabel = [city, state, country].filter(Boolean).join(", ") || readString(record, ["location"], address || "Nigeria");
  const summary = readString(record, ["summary", "overview", "description"], "Project details coming soon.");
  const overview = readString(record, ["overview", "description", "summary"], summary);

  return {
    slug: readString(record, ["slug"], slugify(title)),
    title,
    listingTitle: readString(record, ["listing_title", "title", "name"], title),
    summary,
    location: locationLabel,
    locationLabel,
    dateLabel: dateLabel.short,
    detailDateLabel: dateLabel.long,
    heroImages: images.slice(0, 4),
    galleryImages: images.length ? images : placeholderImages,
    overview,
    community: address || locationLabel,
    highlights: toStringList(record, ["highlights"]).length ? toStringList(record, ["highlights"]) : ["Project highlights will be added here."],
    systemDetails: {
      inverterSize: readString(systemDetailsRecord ?? {}, ["inverter_label", "inverter_size"], readString(record, ["inverter_type"], "N/A")),
      pvSize: readString(systemDetailsRecord ?? {}, ["pv_label", "pv_size"], readString(record, ["system_size_kw"], "N/A")),
      batterySize: readString(systemDetailsRecord ?? {}, ["battery_label", "battery_size"], "N/A"),
    },
    whatItCanPower: toStringList(record, ["what_it_powers"]).length ? toStringList(record, ["what_it_powers"]) : ["Project load coverage details coming soon."],
  };
}

export async function getProjects() {
  const [projectsPayload, installationsPayload] = await Promise.all([
    fetchJson<{ success?: boolean; data?: unknown[] }>("/api/v1/projects"),
    fetchJson<{ success?: boolean; data?: unknown[] }>("/api/v1/installations"),
  ]);

  const records = [
    ...(projectsPayload?.data ?? []),
    ...(installationsPayload?.data ?? []),
  ]
    .map((record) => normalizeProjectRecord(record))
    .filter((record): record is ProjectItem => Boolean(record));

  return records.length ? records : projects;
}

export async function getProjectBySlug(slug: string) {
  const dynamicProjects = await getProjects();
  return dynamicProjects.find((project) => project.slug === slug) ?? projects.find((project) => project.slug === slug) ?? null;
}
