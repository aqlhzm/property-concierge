# PROPERTY CONCIERGE · by aqilgotkeys

Premium multi-project property discovery and advisory platform — **Phase 1 MVP**.

> Don't just help people find a house. Help them make the right property decision, navigate the buying process and eventually receive their keys.

## Stack

- **Next.js 16** (App Router, Cache Components, Partial Prefetching) · React 19 · TypeScript
- **Tailwind CSS 4** with design tokens from [`design-system/MASTER.md`](design-system/MASTER.md)
- **Supabase** for lead capture (insert-only function, table locked by RLS)
- **Vercel** hosting + Web Analytics (cookieless)

## What's in Phase 1

| Page | Purpose (vision stage) |
|---|---|
| `/` | Hero, Liquid Glass search, featured developments, concierge journey, consultant (Discover) |
| `/projects` | Search, budget filter and sort, state kept in the URL (Discover) |
| `/projects/[slug]` | Themed per development: key facts, unit explorer with ground/first floor plans + full-screen zoom, gallery, specs, location, FAQ, legal particulars (Understand) |
| `/compare` | Side-by-side table, shareable link `?p=a,b` (Understand) |
| `/calculator` | Apple-style financial planner, accepts `?project=&price=` (Understand) |
| `/enquire` | Viewing / consultation / recommendation form with optional D.R.E.A.M. questions → Supabase (Qualify, Experience) |
| `/about`, `/privacy` | Consultant profile; draft privacy notice |

WhatsApp messages use the templates migrated from Base44 (`src/data/content.ts`).

## Content

All project data lives in `src/data/` and was migrated from the Base44 app on 23 Nov 2026. Every value comes from developer brochures.

- **Norton Garden** has `showPrice: false` — its advertising permit ended 10/08/2025. Reconfirm with the developer before showing a price.
- Wellington Terrace: only Types T2, T3, T5 are detailed in the brochure.
- Images are still hosted on Base44 media storage (`media.base44.com`). Move them to Vercel Blob or `public/` before the Base44 app is retired.

To update content, edit the files in `src/data/` and push — Vercel redeploys automatically.

## Leads (Supabase)

Schema: [`supabase/migrations/0001_leads.sql`](supabase/migrations/0001_leads.sql)

- `public.leads` has RLS enabled with **no policies** — nobody can read or write it through the API.
- The only way in is `public.submit_lead(payload jsonb)` (security definer, insert-only, enforces consent).
- The Next.js server calls it with the publishable key, kept server-side (`SUPABASE_PUBLISHABLE_KEY`, no `NEXT_PUBLIC_` prefix).
- View leads in the Supabase dashboard → Table editor → `leads`.

## Local development

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev
```

## Environment variables

| Name | Where | Notes |
|---|---|---|
| `SUPABASE_URL` | Server | `https://<ref>.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | Server | `sb_publishable_…` |
| `NEXT_PUBLIC_SITE_URL` | Both | Canonical URL for metadata |

If the Supabase variables are missing, the form shows a WhatsApp fallback instead of failing silently.

## Owner to supply

1. Verified bio, REN / agency details, PDPA privacy notice and consent wording (`src/data/content.ts`).
2. Confirmation of authorisation to use EcoWorld brochure imagery and naming.
3. Current price lists / packages; Norton Garden current status.
4. Better hero images for Norton Garden and Terrace if desired.

## Roadmap

- **Phase 2:** admin view for leads (Supabase Auth), CRM statuses and follow-ups, saved shortlists.
- **Phase 3:** AI property assistant grounded on `src/data`, follow-up drafting, transaction milestones.
- **Phase 4:** buyer tracking portal through to vacant possession and defects.
