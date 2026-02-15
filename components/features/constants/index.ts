import {   home_slider_solar, home_slider_trust } from "../images";

export const CAROUSEL_CONTENT = [
  {
    toast: "Solar Installations",
    toast_color: "#FF0000",
    toast_background_color: "#FF000014",
    title: "Residential & Commercial Solar Solutions",
    content:
      "Whether you’re powering a residence or a commercial space, our solar solutions deliver consistent performance, lower bills, and total peace of mind.",
    buttonName: "Get a Quote",
    image: home_slider_trust,
  },
  {
    toast: "Solar Financing",
    toast_color: "#168ABD",
    toast_background_color: "#168ABD14",
    title: "Go Solar Now, Pay Later",
    content:
      "Enjoy clean, reliable energy without breaking the bank. Our flexible financing options let you install your system today and pay over time.",
    buttonName: "Apply for Financing",
    image: home_slider_solar,
  },
  {
    toast: "Solar Products & Packages",
    toast_color: "#FFC800",
    toast_background_color: "#FFC80014",
    title: "Quality Products & Bundles You Can Trust",
    content:
      "Explore our collection of verified solar panels, batteries, and inverters, all sourced from trusted manufacturers and built for lasting performance.",
    buttonName: "View Store",
    image: home_slider_trust,
  },
];

export const TESTIMONIAL_CONTENT = [
  {
    name: "Bridget Samuel",
    role: "Creator",
    testimony:
      "FortSolar pays attention to details and ensures you get the best energy solutions for your home and business. The best!",
    star: 5,
  },
  {
    name: "Atanda Micheal",
    role: "Home Owner",
    testimony:
      "I did a 2kva solar. Since the beginning of using it, it has never failed me. The 2kva worked with my Freezer of 115watt. Fort Solar Energy is the best. ",
    star: 5,
  },
  {
    name: "Sule Umar",
    role: "Home Owner",
    testimony:
      "Quality product with experience technicians offering responsive during and after installations services.",
    star: 5,
  },
  {
    name: "Lintochi Razor",
    role: "Home Owner",
    testimony:
      "Swift and very reliable. They know their onion's and are extremely fast. Will always recommend them to anyone looking to have solar",
    star: 5,
  },
  {
    name: "Bridget Samuel",
    role: "Creator",
    testimony:
      "FortSolar pays attention to details and ensures you get the best energy solutions for your home and business. The best!",
    star: 5,
  },
  {
    name: "Atanda Micheal",
   role: "Home Owner",
    testimony:
      "I did a 2kva solar. Since the beginning of using it, it has never failed me. The 2kva worked with my Freezer of 115watt. Fort Solar Energy is the best. ",
    star: 5,
  },
];

export const BLOG_CONTENT = [
  {
    subheading: "Panels",
    title: "5 Reasons Now Is the Best Time to Switch to Solar Energy",
    preview:
      "Electricity costs keep rising, but solar power offers a sustainable and cost-effective solution. Discover why there’s no better time to invest in solar energy—whether you’re powering your home, office, or business.",
  },
  {
    subheading: "Solar Installations",
    title: "5 Reasons Now Is the Best Time to Switch to Solar Energy",
    preview:
      "Electricity costs keep rising, but solar power offers a sustainable and cost-effective solution. Discover why there’s no better time to invest in solar energy—whether you’re powering your home, office, or business.",
  },
  {
    subheading: "Partnerships",
    title: "5 Reasons Now Is the Best Time to Switch to Solar Energy",
    preview:
      "Electricity costs keep rising, but solar power offers a sustainable and cost-effective solution. Discover why there’s no better time to invest in solar energy—whether you’re powering your home, office, or business.",
  },
];

export const navItems = [
  { label: "Home", path: "/home" },
  { label: "About", path: "/about" },
  { label: "Store", path: "/coming-soon" },
  { label: "Projects", path: "/coming-soon" },
  { label: "Blog", path: "/coming-soon" },
  { label: "Contact", path: "/contact" },
];

export const NotDesigned = [
  {
    name: "", 
  },
];

export const servicesSlides = [
    {
        title: "Solar Products",
        description: "Power your space with our wide range of quality solar panels, batteries, inverters, fans, streetlights, floodlights and more sourced from reliable manufacturers, designed for durability and performance.",
        buttonName: "Shop Products",
        link: "/coming-soon",
        leftColor: "#F1F2F5",
        marginBottom: "mb-3",
        rightBackgroundImage: "/about_services_one.png"

    },
    {
        title: "Solar Installations",
        description: "Professional setup from start to finish, fast, clean, and backed by expert technicians.",
        buttonName: "Book Installation",
        link: "/coming-soon",
        leftColor: "#EBFAEB",
        marginBottom: "mb-6",
        rightBackgroundImage: "/about_services_two.png"
    },
    {
        title: "Solar Financing",
        description: "Go solar now and pay flexibly over time making renewable energy more affordable for everyone.",
        buttonName: "Learn More",
        link: "/coming-soon",
        leftColor: "#EDF6FA",
        marginBottom: "mb-9",
        rightBackgroundImage: "/about_services_three.png"
    },
    {
        title: "Solar Streetlights",
        description: "Brighten up communities and businesses with efficient, long-lasting solar streetlight solutions.",
        buttonName: "View Streetlights",
         link: "/coming-soon",
        leftColor: "#FFFBEB",
        marginBottom: "mb-12",
        rightBackgroundImage: "/about_services_four.png"
    },
    {
        title: "Solar CCTV",
        description: "Secure your property 24/7 with smart solar-powered surveillance systems.",
        buttonName: "View Solutions",
         link: "/coming-soon",
        leftColor: "#FEF5EF",
        marginBottom: "mb-0",
        rightBackgroundImage: "/about_services_five.png"
    },
]

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
