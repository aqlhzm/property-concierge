# Property Concierge — Design System (MASTER)

Source of truth for every page. Page-specific overrides go in `design-system/pages/<page>.md`.
Built from the ui-ux-pro-max skill (v2.15.0) and adjusted to the owner's brief.

## How the skill output was adapted

| Skill recommendation | Decision | Why |
|---|---|---|
| Light black + gold palette (`--design-system "luxury real estate advisory"`) | **Rejected** | Brief is dark-mode first with forest green / emerald accents |
| Cinzel + Josefin Sans | **Rejected** | Too classical for an Apple-inspired interface |
| Playfair Display + Inter ("Classic Elegant", `--domain typography`) | **Adopted** | Matches brief and the `display_font` already set per project |
| Liquid Glass (`--domain style`) | **Adopted, selectively** | Only for nav, search bar and WhatsApp controls. Content stays on solid layers. Test reduced transparency. |
| Minimalism & Swiss, spacious density (dials: variance 3, motion 4, density 3) | **Adopted** | Generous spacing, clear hierarchy |
| Dark-luxury structure (deep background, raised cards, muted text) | **Adopted, recoloured** | Green-tinted neutrals instead of slate |

## Revision 2 (23 Nov 2026, owner feedback)

- Secondary colour changed from brochure golds/yellows to **sage**; every development now sits on the same dark base with emerald (primary actions) and sage (labels, chips, supporting icons). Each development keeps only a subtle green-family accent: Terrace `#8FD9B6`, Garden Homes `#BFCDB3`, Norton `#9CCBB9`.
- Listing cards: title block lives in a contained Apple-style Liquid Glass panel (`.glass-photo`: clear tint, 22px blur, specular highlight, light rim; the photo carries a bottom scrim so text stays ≥ 6.7:1 even over white walls) at the bottom of the image; spring press (`.card-press`), hover sheen, and a shared-element morph from card image to project hero (React `<ViewTransition share="morph">`).
- Photography upscaled to 4K and served as 2560px WebP at quality 85.
- Buttons are Apple-style **Liquid Glass**: light underlay + low-alpha tint (more see-through, owner feedback) + `backdrop-filter: blur(10px) saturate(190%)`, a specular highlight along the top edge and a light rim. Primary is tinted emerald, secondary is tinted sage; selected tabs use the emerald glass (`.pill-active`). White text (with a soft text shadow) measures ≥ 11:1 on the dark page, ≥ 8:1 on dark hero areas and about 4.4:1 over mid-tone photo areas. Solid fallbacks under `prefers-reduced-transparency`. (Replaced the gradient pills from the palette reference, 23 Nov.)
- Wordmark enlarged: PROPERTY CONCIERGE 13/15px in the header, 18/20px in the footer.
- About page follows the owner's profile reference on every screen. Phones: the keys portrait fills the screen, three-layer progressive blur from just under the face, bold name, glass segmented control (WhatsApp active white, Call, Viewing), glass card with avatar, scroll pill; round glass close and share buttons replace the header. Desktop: the whole portrait sits sharp and centred at full height; the screen's sides continue the photo's own sage wall (colours sampled from its edges) with feathered seams and a soft vignette; blur only sits low behind the content.
- No dashes in UI copy: ranges read "X to Y"; em dashes replaced with commas or full stops. Official identifiers (permit numbers, company numbers, phase codes) keep their original format.

## Colour tokens (platform)

All pairs verified for WCAG AA. Ratios measured against `--bg` unless noted.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--bg` | `#070B09` | Page background | — |
| `--surface` | `#0F1613` | Cards | — |
| `--surface-2` | `#16201B` | Raised cards, inputs | — |
| `--line` | `rgba(255,255,255,0.08)` | Borders, dividers | — |
| `--text` | `#F2F4F1` | Body & headings | 17.9:1 |
| `--muted` | `#A3B0A8` | Secondary text | 8.8:1 (7.4:1 on surface-2) |
| `--subtle` | `#6F7C75` | Captions ≥ 14px only | 4.54:1 |
| `--emerald` | `#3CCB8C` | Primary CTA fill, active state | 8.8:1 on surface |
| `--on-emerald` | `#04150D` | Text on emerald | 9.0:1 |
| `--forest` | `#1E5A42` | Secondary fills, chips | white 8.1:1 |
| `--emerald-text` | `#4ADE9B` | Links / accents on dark | 11.5:1 |

## Project themes

Each development keeps its own identity (from brochure colours, stored in `src/data/projects.ts`).
Project pages set `--p-bg`, `--p-surface`, `--p-primary`, `--p-accent`, `--p-text`, `--p-muted` on the page wrapper.
All three themes pass AA: text ≥ 15.8:1, muted ≥ 8.4:1, primary ≥ 7.8:1, dark text on primary ≥ 8.4:1.
Platform chrome (nav, WhatsApp, footer) stays on platform tokens so the brand stays consistent.

## Typography

- Display: **Playfair Display** (400–600). Headlines, project names, big numbers.
- UI / body: **Inter** variable. Base 16px, line-height 1.6, max 68ch.
- Signature: **Mr Dafoe** (free, OFL), the closest open alternative to the owner's "Onehart" reference (a licensed brush script). Only for "by aqilgotkeys" under the PROPERTY CONCIERGE wordmark.
- Wordmark: Inter 600, uppercase, letter-spacing 0.28em.
- Scale: 12 / 14 / 16 / 18 / 22 / 28 / 36 / 48 / 64. No body text below 14px.
- Numbers in calculator and facts use `font-variant-numeric: tabular-nums`.

## Spacing, radius, elevation

- Spacing (spacious): 8, 12, 16, 24, 32, 48, 64, 96.
- Radius: 12 (inputs), 20 (cards), 28 (hero panels), 999 (pills).
- Elevation by lightness, not heavy shadows. One soft shadow for floating glass only.

## Liquid Glass

```css
background: rgba(22, 32, 27, 0.55);
backdrop-filter: blur(20px) saturate(160%);
border: 1px solid rgba(255,255,255,0.12);
```
- `@media (prefers-reduced-transparency: reduce)` → solid `--surface-2`.
- Never put long text on glass.

## Motion

- 150–250ms for hover and press; 300–400ms for sheet/dialog enter, exits ~30% faster.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Animate transform and opacity only. Respect `prefers-reduced-motion`.

## Interaction & accessibility checklist

- Touch targets ≥ 44×44px; 8px+ between targets.
- Visible focus ring: 2px `--emerald-text`, 2px offset.
- Icons: Lucide SVG only, no emoji. Icon-only buttons have `aria-label`.
- Every image labelled with its status (Artist's impression / Actual photograph).
- Forms: visible labels, errors next to fields, consent checkbox unticked by default.
- Mobile: bottom tab bar ≤ 5 items, safe-area padding, no horizontal scroll at 375px.
- Deep links: compare state lives in the URL (`/compare?p=a,b`), calculator accepts `?price=`.
- Prices only show when `showPrice` is true; otherwise "Pricing to be reconfirmed".
