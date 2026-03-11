# Fortsolar Landing Web App

Landing site for Fortsolar built with Next.js (App Router), Tailwind CSS, and a set of reusable UI sections.

## Quick Start

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3126`.

## Requirements

- Node.js 20+ recommended
- npm (or yarn / pnpm / bun)

## Environment Variables

Create a `.env.local` file in the project root.

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_BASE_URL=http://your-api-host/api/
```

Notes:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is used by the Contact page map component.
- `NEXT_PUBLIC_BASE_URL` is used for API calls from the client.
- Do not commit real keys to source control.

## Scripts

```bash
npm run dev     # Start dev server on 0.0.0.0:3126
npm run build   # Production build
npm run start   # Start production server
npm run lint    # ESLint
```

## Routes

This project uses the Next.js App Router.

- `/` → `app/page.tsx`
- `/home` → `app/(main)/home/page.tsx`
- `/about` → `app/(main)/about/page.tsx`
- `/contact` → `app/(main)/contact/page.tsx`
- `/energy-calculator` → `app/(main)/energy-calculator/page.tsx`
- `/coming-soon` → `app/coming-soon/page.tsx`

Route group `(main)` does not appear in the URL; it is just for layout grouping.

## Project Structure

```text
app/                 # App Router pages and layouts
components/          # UI components and page sections
  features/          # Shared sections, icons, image exports
  ui/                # Page-specific UI blocks + base controls
hooks/               # Custom hooks
lib/                 # Utilities (e.g., className helpers)
public/              # Static assets
store/               # State/store (if used)
types/               # Shared TypeScript types
  api.types.ts       # Contains Api related data types
  common.types.ts    # Contains General app related data types
```

## Key UI Areas

- `components/features/global/` contains global sections like Navbar, Footer, FAQ, Testimonials.
- `components/ui/home/`, `components/ui/about/`, `components/ui/contact/`, `components/ui/calculator/` contain page-specific sections.
- `components/ui/` also includes base controls like `button`, `input`, `dialog`, `accordion`, `tabs`.

## Styling

- Tailwind CSS is configured via `tailwindcss` and `postcss`.
- Global styles live in `app/globals.css`.

## Common Tasks

- Update hero content: check `components/ui/home/HomeHero.tsx` and related sections.
- Edit navbar or footer: `components/features/global/Navbar.tsx`, `components/features/global/Footer.tsx`.
- Update FAQ content: `components/features/global/Faq.tsx`.

## Troubleshooting

- Map not showing on Contact page: confirm `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` exists and is valid.
- API calls failing: confirm `NEXT_PUBLIC_BASE_URL` points to the correct backend and allows CORS.

## Analytics and SEO

Current SEO setup lives in `app/layout.tsx` via the Next.js `metadata` export:
- Site title + template, description
- Canonical URL
- Open Graph and Twitter card metadata


## Content Management Workflow

Where to update copy and images:
- Global section text (testimonials, blog cards, carousel items, nav) is in
  `components/features/constants/index.ts`.
- Page sections live in `components/ui/*`:
  - Home: `components/ui/home/`
  - About: `components/ui/about/`
  - Contact: `components/ui/contact/`
  - Calculator: `components/ui/calculator/`
- Shared layout items are in `components/features/global/` (Navbar, Footer, FAQ).
- Static images are in `components/features/images/` and exported via
  `components/features/images/index.ts`.

Suggested workflow:
1) Edit copy in `components/features/constants/index.ts` for reusable content.
2) Update page-specific content in the relevant `components/ui/...` files.
3) Add or replace images in `components/features/images/`, then re-export them.

## Design System Notes

- Fonts are loaded in `app/layout.tsx` (Inter and Poppins) and applied via CSS vars.
- Color tokens and radii are defined in `app/globals.css` under `:root` and `@theme`.
- Tailwind CSS utilities drive spacing and layout (standard Tailwind spacing scale).


## Notes

- There are no automated tests configured at the moment.
- The `out/` directory is build output and should not be edited directly.

