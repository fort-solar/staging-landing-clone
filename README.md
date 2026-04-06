# Fortsolar Landing Web App

Production-facing marketing and conversion web app for Fortsolar, built with Next.js (App Router), Tailwind CSS and modular page sections.

This README is intentionally detailed so development can continue quickly.

## 1. Current State (As of April 2026)

### Functional
- Marketing pages (Home, About, Contact, Projects, Blog, Calculator) render and are structured with reusable sections.
- Contact form submits to backend using shared submit helper with toast feedback.
- Newsletter subscription submits to backend using shared submit helper with toast feedback.
- Energy calculator:
  - Appliance search/autocomplete uses backend API after 2+ typed characters.
  - Users can still manually type custom appliances if no suggestions are returned.
  - Calculator auto-submits complete appliance rows to backend and renders returned sizing values.
  - `Get Quote` is disabled until at least one complete appliance row exists and successful calculation has run.
  - Quote dialog submits composed payload (contact fields + selected appliances + calculated totals) to backend.

### In progress / caveats
- No automated tests are set up yet.
- API calls are currently client-side (`use client`) and rely on `NEXT_PUBLIC_BASE_URL`.

## 2. Tech Stack

- Next.js `16.x` (App Router)
- React `19.x`
- TypeScript
- Tailwind CSS `4`
- Radix UI primitives
- Sonner for toasts
- React Hook Form + Zod (contact form)
- jsPDF + jspdf-autotable (calculator PDF export)

## 3. Local Development

### Requirements
- Node.js 20+
- npm

### Install
```bash
npm install
```

### Run dev server
```bash
npm run dev
```

Default dev URL:
- `http://localhost:3000`

### Build + run production
```bash
npm run build
npm run start
```

### Lint
```bash
npm run lint
```

Note: No error currently.

## 4. Environment Variables

Create `.env.local` in repo root:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=google_maps_api_key
NEXT_PUBLIC_BASE_URL=https://your-backend-host
```

Important:
- `NEXT_PUBLIC_BASE_URL` should be base host with  trailing slash.
- Endpoints are appended in code, e.g. `quotes`.
- Because this variable is `NEXT_PUBLIC_*`, it is exposed to the browser.

## 5. Route Map

- `/` (redirect/entry)
- `/home` → landing content
- `/about`
- `/contact`
- `/energy-calculator`
- `/projects`
- `/blog`
- `/coming-soon`

Primary route files live in `app/(main)/*`.

## 6. Directory Guide

```text
app/                              # App Router layouts/pages/metadata
actions/
  SubmitForm.tsx                  # Shared API submit helper
components/
  features/
    global/                       # Navbar, Footer, Newsletter, FAQ, etc.
    constants/index.ts            # Shared copy + content constants
  ui/
    calculator/                   # Energy calculator + quote dialog
    contact/                      # Contact page sections + form
    home/                         # Home sections
    about/                        # About sections
    ...                           # Shared primitive UI controls
types/
  api.types.ts                    # Shared API-related TS types + schemas
lib/                              # Utility helpers + static data sources
public/                           # Static assets
```

## 7. API Integration Overview

All form-like submission calls use:
- `actions/SubmitForm.tsx` → `submitForm({ endpoint, method, values })`

Behavior of `submitForm`:
- Builds URL from `NEXT_PUBLIC_BASE_URL + endpoint`.
- Throws `Error` on non-2xx responses (important for `toast.promise` error path).
- Extracts backend `message` where possible.

### 7.1 Contact
- Component: `components/ui/contact/ContactForm.tsx`
- Endpoint: `POST /contact-us`
- Uses `react-hook-form` + Zod.
- Uses `toast.promise` for loading/success/error.

### 7.2 Newsletter
- Component: `components/features/global/Newsletter.tsx`
- Endpoint: `POST /api/v1/newsletter/subscribe`
- Payload:
```json
{ "email": "user@example.com" }
```

### 7.3 Calculator appliance search
- Component: `components/ui/calculator/CalculatorSectionTwo.tsx`
- Endpoint: `GET /api/v1/appliances`
- Trigger: when current item text length >= 2
- Query params used now:
  - `q`
  - `limit=8`

### 7.4 Calculator computation
- Endpoint: `POST /api/v1/calculator/calculate`
- Trigger: automatic when there is at least one complete row
- Complete row means:
  - `item` non-empty
  - `quantity >= 1`
  - `watts >= 1`
  - `hours >= 1` (capped at 24 on blur)

Request shape used:
```json
{
  "appliances": [
    {
      "name": "LED TV",
      "quantity": 1,
      "wattage": 120,
      "hoursPerDay": 5
    }
  ],
  "constants": {
    "pshHours": 3.5,
    "inverterSurgeFactor": 1.5,
    "backupHours": 14,
    "batterySafetyFactor": 1.3,
    "pvLossFactor": 1.2
  }
}
```

### 7.5 Quote submission
- UI: `components/ui/calculator/GetQuoteDialog.tsx`
- Composition + submit logic: `components/ui/calculator/CalculatorSectionTwo.tsx`
- Endpoint: `POST /api/v1/quotes`
- Submit disabled until calculation exists.

Payload includes:
- Contact + project fields from dialog
- `appliances` from completed rows
- calculated totals (`totalLoadKw`, `totalWattHoursPerDay`, `dailyUsageKwh`, `monthlyUsageKwh`)
- additional quote fields (`requestInstallation`, `agreeToTerms`, etc.)

### 7.6 Error model expected from backend
Example currently supported well:
```json
{
  "statusCode": 400,
  "code": "FST_ERR_VALIDATION",
  "error": "Bad Request",
  "message": "body/email must match format \"email\""
}
```

## 8. Energy Calculator UX Rules (Current)

Implemented behavior in `CalculatorSectionTwo.tsx`:

- Numeric fields (`quantity`, `watts`, `hours`) can be fully cleared and stay visually empty.
- No forced `0` placeholder state while typing.
- Minimum value is enforced to `1` on blur.
- `hours` constrained to max `24` on blur.
- `Energy Consumed` cell stays empty until row is valid.
- Manual custom item entry is allowed even if no autocomplete matches.
- Autocomplete dropdown is portal-positioned and keyboard-enter protected on item input.

## 9. Toast Patterns

Toasts are shown via Sonner and local `<Toaster />` in active form-containing components.

Pattern used:
```ts
await toast.promise(apiPromise, {
  loading: "...",
  success: "...",
  error: (err) => err instanceof Error ? err.message : "..."
});
```

## 10. Styling and Design System

- Global styles in `app/globals.css`
- Fonts loaded in `app/layout.tsx` (`Inter`, `Poppins`)
- UI primitives in `components/ui/*`
- Page sections split by domain (`home`, `about`, `contact`, `calculator`)
- Shared text/data constants mainly in `components/features/constants/index.ts`

## 11. Content Update Workflow

### Update static text quickly
- Navbar/Footer/FAQ/Newsletter: `components/features/global/*`
- Landing carousel copy/constants: `components/features/constants/index.ts`
- Page-local content: `components/ui/<page>/*`

### Update images
- Put assets in `public/` or `components/features/images/`
- Prefer `public/` for direct URL usage in CSS background/image paths.

## 12. Extending the App Safely

### Adding a new backend form endpoint
1. Build payload in component.
2. Call `submitForm({ endpoint: "/api/v1/new-endpoint", method: "POST", values })`.
3. Wrap with `toast.promise`.
4. Reset local state on success.
5. Keep endpoint as absolute path from API root.

### Moving API calls server-side later
Current implementation is client-driven. To migrate to Server Actions/Route Handlers:
- We Keep `submitForm` shape as a stable abstraction.
- Move secret/private logic to server only.
- Keep UI contract same to avoid touching section components heavily.

### Adding calculator fields
- Add new row field type in `Row`.
- Include validation in `completeRows`.
- Map field into `appliances` request payload.
- Render returned server values in summary and PDF table.

## 13. Known Issues and Risks

- `npm run lint` fails due to existing issue:
  - `components/ui/about/NumberBanner.tsx` (setState in effect rule).
- No test coverage (unit/integration/e2e).
- API base URL is public env var; ensure backend CORS and rate limiting are configured.

## 14. Recommended Next Steps

1. Fix `NumberBanner.tsx` lint issue to restore clean CI linting.
2. Add API contract types for calculator/quote/newsletter responses in `types/api.types.ts`.
3. Add lightweight integration tests for calculator flow and quote button enable/disable conditions.
4. Centralize API endpoints in a single constants file to avoid string drift.

## 15. Quick File Index (Most Frequently Edited)

- `components/ui/calculator/CalculatorSectionTwo.tsx`
- `components/ui/calculator/GetQuoteDialog.tsx`
- `components/features/global/Newsletter.tsx`
- `components/ui/contact/ContactForm.tsx`
- `actions/SubmitForm.tsx`
- `components/features/constants/index.ts`
- `app/(main)/energy-calculator/page.tsx`

---

