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

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
