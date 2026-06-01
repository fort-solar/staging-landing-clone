# Fortsolar Landing WebApp

Fortsolar Landing WebApp is the public marketing and lead-generation frontend for Fortsolar. It combines brand pages, contact flows, project showcases, editorial content, and an energy calculator that submits quote requests to the Fortsolar backend.

## Highlights

- Public website built on Next.js App Router
- Home, about, contact, projects, blog, and energy calculator experiences
- Contact and newsletter capture connected to backend endpoints
- Energy calculator with appliance lookup, sizing requests, and quote submission
- API-backed dynamic site page rendering with bundled fallback content
- Project listing and detail pages with API-first loading and local fallback data

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- React Hook Form + Zod
- Framer Motion
- Sonner

## Application Architecture

- `app/(main)` contains the public pages and layouts.
- `components/ui` contains page-specific sections for home, about, blog, contact, calculator, and projects.
- `components/site-pages` renders CMS-driven page sections returned by the admin API.
- `actions/SubmitForm.tsx` is the shared client-side submission helper for contact, newsletter, and related forms.
- `lib/site-pages.ts` and `lib/projects-data.ts` fetch backend content and fall back to local data if the API is unavailable.

## Functional Coverage

The current app includes:

- a public home page with reusable marketing sections
- about, contact, and projects pages
- blog listing and blog detail routes
- project listing and project detail routes
- a contact form and newsletter subscription flow
- an energy calculator that:
  - searches appliances from the backend
  - submits sizing inputs to the calculator API
  - opens a quote dialog once a valid calculation exists
- Google Maps rendering on the contact page

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- Access to the Fortsolar backend API for submissions and dynamic content

## Local Development

1. Create `.env.local` in the project root with the required variables.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` with values similar to the following:

```bash
NEXT_PUBLIC_BASE_URL=https://api.fortsolar.ng
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FORTSOLAR_API_BASE_URL=https://api.fortsolar.ng
NEXT_PUBLIC_FORTSOLAR_API_BASE_URL=https://api.fortsolar.ng
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Yes | Public API base URL used by client-side form submission and calculator requests. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps API key for the contact page map. |
| `FORTSOLAR_API_BASE_URL` | Recommended | Server-side API base URL for dynamic site pages and project fetching. |
| `NEXT_PUBLIC_FORTSOLAR_API_BASE_URL` | Optional | Compatibility alias used by some server-side content loaders. |

Recommendation: set all API base URL variables to the same backend origin unless you have a specific reason to split them.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server on port `3000`. |
| `npm run build` | Build the production bundle. |
| `npm run start` | Start the production server. |
| `npm run lint` | Run ESLint. |

This repository does not currently define an automated test script.

## Directory Overview

```text
app/
  (main)/              Public routes
  coming-soon/         Placeholder route group
actions/
  SubmitForm.tsx       Shared form submission helper
components/
  features/global/     Navbar, footer, newsletter, FAQ, shared sections
  site-pages/          Dynamic site page renderer
  ui/                  Page-specific sections and calculator UI
lib/
  blog-data.ts         Blog content and helpers
  projects-data.ts     Project API loader and fallback data
  site-pages.ts        Dynamic site page loader
types/
  api.types.ts         Shared API contracts
```

## Quality Checks

Run these before deploying:

```bash
npm run lint
npm run build
```

## Deployment Notes

- Deploy as a standard Next.js server application.
- Client-side conversion flows require `NEXT_PUBLIC_BASE_URL` to be reachable from the browser.
- Dynamic site-page and project rendering can fall back to bundled content when the backend is unavailable, but contact, newsletter, and calculator submissions still require a working API.
- Configure the Google Maps key with the correct domain restrictions for each environment.
