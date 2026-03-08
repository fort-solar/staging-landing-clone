export type BlogSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  italic?: boolean;
};

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  sections: BlogSection[];
  conclusion: string[];
  tags: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-solar-energy-can-save-you-money-every-month",
    category: "Panels",
    title: "How Solar Energy Can Save You Money Every Month",
    excerpt:
      "Electricity bills keep rising, but solar power offers a sustainable and cost-effective solution for homes and businesses.",
    publishedAt: "March 6, 2026",
    readTime: "8 min read",
    coverImage: "/panels_on_a_roof.jpg",
    sections: [
      {
        id: "introduction",
        heading: "Introduction",
        paragraphs: [
          "Electricity bills keep rising, and power instability has become a daily struggle for homes and businesses across Nigeria. Many people spend huge amounts each month on fuel or unreliable power alternatives.",
          "With solar energy, you can break free from that cycle.",
          "At FortSolar, we believe everyone deserves steady, affordable, and clean power. This article breaks down how switching to solar can help you save money while enjoying consistent electricity every day.",
        ],
        italic: true,
      },
      {
        id: "cut-down-on-monthly-expenses",
        heading: "Cut Down on Monthly Expenses",
        paragraphs: [
          "Every month, your electricity bill reflects how dependent you are on the grid. With a properly sized solar system, you can offset a large portion or even all of your energy use.",
          "Solar panels convert sunlight into free energy, and when combined with batteries, you can store that power for nighttime use. Over time, these savings easily outweigh your initial installation cost.",
          "A 3kVA solar system can save an average household over ₦25,000 monthly on energy expenses.",
        ],
      },
      {
        id: "a-long-term-investment-that-pays-off",
        heading: "A Long-Term Investment That Pays Off",
        paragraphs: [
          "Think of solar as a one-time purchase that keeps giving back for years. While there is an upfront cost, you stop paying monthly bills for decades.",
          "At FortSolar, we also offer solar financing plans, allowing you to pay in small, convenient instalments over 3 to 24 months, making it easier for families and businesses to get started.",
        ],
      },
    ],
    conclusion: [
      "Switching to solar is not just about saving money, it is about securing your energy future.",
      "With our verified products, free installation, and 24/7 support, FortSolar makes the switch effortless.",
    ],
    tags: ["solar savings", "energy bills", "homeowners"],
  },
  {
    slug: "five-reasons-now-is-the-best-time-to-switch-to-solar",
    category: "Solar Installations",
    title: "5 Reasons Now Is the Best Time to Switch to Solar Energy",
    excerpt:
      "From rising tariffs to improved financing options, there has never been a better time to start your solar journey.",
    publishedAt: "March 8, 2026",
    readTime: "6 min read",
    coverImage: "/double_solar_panels.png",
    sections: [
      {
        id: "reason-1-rising-electricity-costs",
        heading: "1. Rising Electricity Costs",
        paragraphs: [
          "Grid electricity and fuel prices are increasing, and households are feeling the pressure every month.",
          "Solar lets you lock in predictable energy costs and reduce your dependence on unstable pricing.",
        ],
      },
      {
        id: "reason-2-better-solar-technology",
        heading: "2. Better Solar Technology",
        paragraphs: [
          "Modern panels and inverters are more efficient and durable than ever before.",
          "This means greater output from smaller systems and better long-term return on investment.",
        ],
      },
      {
        id: "reason-3-flexible-financing",
        heading: "3. Flexible Financing",
        paragraphs: [
          "You no longer need to pay everything upfront. FortSolar financing allows you to spread payments over time.",
          "That reduces entry barriers and gets your system running sooner.",
        ],
      },
    ],
    conclusion: [
      "Going solar now protects you from uncertainty and gives you control over your power.",
      "The sooner you switch, the sooner you start saving.",
    ],
    tags: ["solar installations", "financing", "panels"],
  },
  {
    slug: "how-to-choose-the-right-inverter-and-battery-size",
    category: "Solar Installations",
    title: "How to Choose the Right Inverter and Battery Size",
    excerpt:
      "Sizing mistakes can be expensive. Use your daily load profile to choose a system that truly fits your needs.",
    publishedAt: "March 7, 2026",
    readTime: "7 min read",
    coverImage: "/about_services_two.png",
    sections: [
      {
        id: "understand-your-load",
        heading: "Understand Your Load",
        paragraphs: [
          "Start by listing the appliances you need to run and their watt ratings.",
          "Your installer can then calculate peak load and daily consumption accurately.",
        ],
      },
      {
        id: "match-inverter-capacity",
        heading: "Match Inverter Capacity",
        paragraphs: [
          "Your inverter should handle your peak demand with room for startup surges.",
          "Undersized inverters trip often, while oversized ones waste budget.",
        ],
      },
      {
        id: "size-battery-for-runtime",
        heading: "Size Battery for Runtime",
        paragraphs: [
          "Battery size should reflect how many backup hours you want each night.",
          "A well-sized battery balances convenience, reliability, and budget.",
        ],
      },
    ],
    conclusion: [
      "Correct sizing gives you stable performance and longer equipment life.",
      "A detailed audit is always better than guesswork.",
    ],
    tags: ["inverter", "battery", "system design"],
  },
  {
    slug: "maintenance-checklist-for-long-lasting-solar-systems",
    category: "Maintenance",
    title: "Maintenance Checklist for Long-Lasting Solar Systems",
    excerpt:
      "A simple maintenance routine keeps your system efficient and protects your investment for years.",
    publishedAt: "July 28, 2025",
    readTime: "5 min read",
    coverImage: "/solar_panel_in_sun.png",
    sections: [
      {
        id: "panel-cleaning",
        heading: "Keep Panels Clean",
        paragraphs: [
          "Dust and debris reduce panel efficiency over time.",
          "Routine cleaning and visual inspection help preserve output.",
        ],
      },
      {
        id: "battery-health",
        heading: "Track Battery Health",
        paragraphs: [
          "Monitor battery charge cycles and avoid deep discharge when possible.",
          "Early detection of unusual behavior prevents costly downtime.",
        ],
      },
      {
        id: "annual-professional-service",
        heading: "Schedule Annual Professional Service",
        paragraphs: [
          "A qualified technician should inspect wiring, protections, and inverter logs yearly.",
          "Preventive service keeps your system safe and dependable.",
        ],
      },
    ],
    conclusion: [
      "Small maintenance habits make a big difference in system lifespan.",
      "Preventive checks cost less than emergency repairs.",
    ],
    tags: ["maintenance", "solar care", "efficiency"],
  },
  {
    slug: "solar-for-small-businesses-cut-operating-costs",
    category: "Business",
    title: "Solar for Small Businesses: Cut Operating Costs and Downtime",
    excerpt:
      "Shops, salons, and offices can stabilize operations with reliable solar power and lower monthly expenses.",
    publishedAt: "June 19, 2025",
    readTime: "6 min read",
    coverImage: "/about_hero_update.jpg",
    sections: [
      {
        id: "business-energy-pain",
        heading: "Why Businesses Need Energy Stability",
        paragraphs: [
          "Power outages interrupt sales, reduce productivity, and damage customer experience.",
          "Solar backup keeps your operations running during grid failures.",
        ],
      },
      {
        id: "monthly-cost-control",
        heading: "Control Monthly Energy Costs",
        paragraphs: [
          "Fuel generators are expensive to run daily.",
          "Solar reduces generator usage and lowers recurring operational costs.",
        ],
      },
      {
        id: "system-planning",
        heading: "Plan a Business-Ready System",
        paragraphs: [
          "Commercial systems should be designed around working hours, equipment load, and growth plans.",
          "A tailored design ensures you get value from day one.",
        ],
      },
    ],
    conclusion: [
      "Reliable power is a competitive advantage for small businesses.",
      "Solar helps protect revenue and improves customer confidence.",
    ],
    tags: ["business solar", "cost reduction", "uptime"],
  },
  {
    slug: "solar-financing-101-how-pay-small-over-time",
    category: "Financing",
    title: "Solar Financing 101: How to Pay Small Over Time",
    excerpt:
      "Financing can make solar affordable without sacrificing quality or system performance.",
    publishedAt: "May 11, 2025",
    readTime: "6 min read",
    coverImage: "/about_services_three.png",
    sections: [
      {
        id: "how-financing-works",
        heading: "How Solar Financing Works",
        paragraphs: [
          "Instead of one large payment, financing spreads your system cost into manageable instalments.",
          "That lets you start saving on energy while paying gradually.",
        ],
      },
      {
        id: "who-qualifies",
        heading: "Who Can Apply",
        paragraphs: [
          "Eligibility often depends on basic identity and income documentation.",
          "Our team helps applicants select plans that fit their budget.",
        ],
      },
      {
        id: "choosing-tenor",
        heading: "Choose the Right Tenor",
        paragraphs: [
          "Shorter tenors reduce overall repayment while longer tenors lower monthly obligations.",
          "Pick a plan that aligns with your cash flow.",
        ],
      },
    ],
    conclusion: [
      "Financing removes the biggest barrier to solar adoption.",
      "With the right plan, you can switch confidently without financial strain.",
    ],
    tags: ["solar financing", "affordability", "payment plans"],
  },
];

export function getBlogBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
