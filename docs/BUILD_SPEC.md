# Men's Hub Build Specification

Status: source of truth  
Last updated: 2026-09-08  
Application root: `D:\Men's Hub\mens-hub-web`

## 1. Purpose and precedence

This document defines the approved product scope and acceptance criteria for the Men's Hub ecommerce catalog. Later implementation must conform to this document and `docs/ARCHITECTURE.md`. `docs/TODO.md` controls delivery order.

When requirements conflict, use this precedence:

1. Security, privacy, data integrity, and accessibility requirements.
2. Explicit business facts and exclusions in this specification.
3. Architecture decisions in `docs/ARCHITECTURE.md`.
4. Visual and interaction preferences.

Do not invent missing business information. Optional fields that are not configured must be omitted from the rendered UI rather than filled with placeholders.

## 2. Current baseline

- One Next.js application exists at `D:\Men's Hub\mens-hub-web`; do not create another or nest one inside it.
- Installed baseline: Next.js 16.3.4 stable, React 19.2.8, TypeScript strict mode, App Router, Tailwind CSS 4, ESLint 9, npm, and the `@/*` import alias.
- Phase 1 provides a restrained branded placeholder, route-grouped storefront shell, admin layout placeholder, shared UI primitives, design tokens, error/loading states, environment validation, and quality tooling. The final homepage and all ecommerce, database-model, authentication, and admin features remain unimplemented.
- `public/seed-media` contains all 11 expected category directories and 22 category/editorial images, two per category at the time of this audit.
- The workspace and application are not currently Git repositories.
- Stable foundation dependencies include Motion, Zod, Lucide React, Prisma Client/CLI, bcryptjs, jose, Cloudinary, server-only, and Vitest. Phase 2 adds the PostgreSQL models, initial migration, PostgreSQL driver adapter, server-only Prisma singleton, deterministic category-media seed, and price/inventory validation; no database-backed feature UI exists yet.
- Phase 3 adds single-admin login/logout, a signed 10-hour HttpOnly session, Next.js 16 Proxy route guarding, database-backed `requireAdmin()`, shared login throttling, minimal authentication audit records, and a protected admin placeholder. There is still no customer identity or registration flow.
- The CMS/settings milestone adds authenticated `/admin/content` and `/admin/settings`, structured homepage/about/contact/footer content, scheduled announcements, draft/published policy pages, global SEO values, and optional store/social fields that remain hidden when absent. CMS text is rendered as escaped plain text rather than arbitrary HTML.
- The storefront foundation adds the database/CMS-driven global shell, cinematic homepage in the required section order, responsive navigation/search, premium footer, reusable product cards, truthful product-collection empty states, and bounded foundational public collection routes. It uses only stored products and the supplied category media.
- Generated dependency/build directories (`node_modules`, `.next`, `src/generated/prisma`) exist and are not source files.

## 3. Authoritative business data

| Field | Value |
| --- | --- |
| Brand | Men's Hub |
| Tagline | Style Made for Men |
| Proprietors | Taha Soni / Shahzaib Soni |
| Phone display | 03081000025 |
| WhatsApp normalized number | 923081000025 |
| Email | mens.hub919@gmail.com |
| Currency | PKR |
| Delivery charges | Calculated / Confirmed on WhatsApp |
| Instagram | Not configured |
| Facebook | Not configured |
| TikTok | Not configured |

The initial database seed must use these values exactly. Social links, address, map, and store timings are optional and must remain hidden until an administrator explicitly configures them. Never synthesize URLs, an address, coordinates, map embeds, or opening hours.

## 4. Business model and exclusions

Men's Hub is a browsable ecommerce catalog with local cart and wishlist features and an order-inquiry handoff to WhatsApp.

- There is no online payment or payment collection.
- A WhatsApp handoff is not a completed order or sale.
- There are no customer accounts, customer login, or public registration.
- There is one administrator initially. The data model may safely support additional admins later, but the UI must not expose public or self-service admin registration.
- There are no ratings or reviews.
- There is no newsletter.
- There is no Best Sellers section or claim.
- No product may be generated from an image. Products are created only from explicit administrator-entered data.

## 5. Catalog taxonomy

Categories and subcategories are persisted and ordered in PostgreSQL. Runtime navigation, filters, category pages, and admin choices must query them rather than use hardcoded application arrays. The following are initial seed data, not permanent code constants.

### Categories in initial order

1. Shirts
2. Pants
3. Shalwar Qameez
4. Trousers
5. Shoes
6. Watches
7. Perfumes
8. Glasses
9. Belts
10. Accessories
11. Tracksuits

### Initial subcategories

| Category | Subcategories |
| --- | --- |
| Shirts | Dress Shirts; Polo Shirts; Casual Shirts; T-Shirts; Down Shoulder Shirts |
| Pants | Jeans; Cotton Pants; Dress Pants |
| Shoes | Sneakers; Formal Shoes; Loafers; Sandals |
| Shalwar Qameez | Casual; Cotton; Wash & Wear |
| Accessories | Rings; Bracelets; Chains; Wallets |

Categories without listed examples begin with no subcategories. Administrators can add, reorder, disable, and safely remove subcategories later.

## 6. Required routes

### Storefront

- `/`
- `/shop`
- `/shop/[category]`
- `/shop/[category]/[subcategory]`
- `/product/[slug]`
- `/new-arrivals`
- `/sale`
- `/wishlist`
- `/cart`
- `/about`
- `/contact`
- `/faq`
- `/size-guide`
- `/shipping-policy`
- `/return-exchange-policy`
- `/privacy-policy`
- `/terms-and-conditions`

Unknown, disabled, unpublished, or malformed slugs must produce the appropriate not-found response. Out-of-stock products remain published and routable.

### Admin

- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/categories`
- `/admin/inventory`
- `/admin/content`
- `/admin/analytics`
- `/admin/settings`

Edit/detail subroutes may be added beneath these route families when implementation requires them.

## 7. Homepage composition

The homepage must use this order:

1. Announcement Bar
2. Premium Navigation
3. 100svh Cinematic Hero
4. Shop by Category
5. New Arrivals
6. Sale / Discount Collection
7. Featured Collection
8. Why Men's Hub
9. Accessories Spotlight
10. Visit Our Store
11. Premium Footer

Sections whose required content is not configured must degrade intentionally. The Visit Our Store section may show configured contact methods, but must omit address, map, and timings until provided. Product collections must show truthful empty states and never fabricate inventory.

## 8. Visual and interaction direction

The experience is premium, masculine, contemporary menswear: dark editorial fashion blended with modern streetwear and restrained luxury.

- Black and charcoal dominate.
- Warm yellow/gold is the secondary accent.
- Red is limited to roughly 10% of the interface and reserved mainly for discounts, destructive actions, and warnings.
- Ivory, off-white, and neutral gray provide readable contrast.
- Avoid cheap gradients, generic SaaS composition, excessive glass effects, decorative blobs, random glow circles, template-like cards, and gratuitous animation.
- The hero is `100svh`, visually integrates with navigation, uses a concise editorial message, premium imagery, subtle depth/parallax, and CSS perspective only where it improves composition.
- Use `motion/react` only for purposeful, lightweight interaction and entrance behavior. Respect `prefers-reduced-motion` and avoid heavy WebGL.
- Layouts must work from 320px through mobile, tablet, laptop, desktop, and large displays.

The future design system must define tokens for color, type, spacing, radii, elevation, motion duration/easing, focus rings, container widths, and touch targets before page-by-page styling diverges.

## 9. Product requirements

Each product has exactly one primary image and the following fields:

- Name
- Unique SKU/article number
- Category
- Optional subcategory, constrained to the selected category
- Optional product type
- Original price
- Optional sale price
- Description
- Material/fabric
- Available colors
- Available sizes
- Total articles
- Available articles
- Sold articles
- Published flag
- Featured flag
- New-arrival flag
- Sale-enabled flag
- Optional sale start and end timestamps
- SEO title
- SEO description
- Unique SEO slug

Rules:

- Store money as fixed-precision decimal values; never use binary floating point for persistence.
- The effective sale price applies only when sale is enabled, a valid lower sale price exists, and the configured time window is active.
- Calculate discount percentage from original price and effective sale price. Do not persist an independently editable discount percentage.
- Original price must be non-negative. An entered sale price must be positive and lower than original price.
- Inventory values must be non-negative whole numbers and remain internally consistent.
- `availableArticles = 0` renders `OUT OF STOCK` without removing the page.
- `0 < availableArticles <= lowStockThreshold` renders `ONLY X LEFT`.
- The low-stock threshold is administrator-configurable with a safe positive default.
- Sizes are data, not code constants. Examples include shirts `S/M/L/XL/XXL`, pants `28/30/32/34/36/38`, and shoes `6/7/8/9/10/11`.
- Colors and sizes are valid selectable choices but inventory is aggregate at product level for the initial release; no unsupported variant-stock promise is implied.

## 10. Product page

The primary desktop composition is a large image on the left and product information on the right. Mobile stacks content in a purchase-friendly order.

Required primary information and actions:

- Category and subcategory context
- Product title
- Article/SKU
- Original and active sale price
- Computed discount when valid
- Inventory state
- Color choice
- Size choice
- Size guide
- Quantity
- Add to Cart
- Order on WhatsApp
- Wishlist
- Share

Required lower content:

- Description
- Material/fabric
- Product details
- Delivery information
- Related products
- Recently viewed products

There are no ratings or reviews. Selected size/color must be required when the product supplies those choices. Quantity cannot exceed currently available inventory in the UI; the server must still treat incoming values as untrusted.

## 11. Cart, wishlist, and recently viewed

These features require no account and persist in versioned browser storage.

Cart lines contain:

- Product identifier and current canonical URL
- Display image
- Product name
- SKU/article
- Selected size
- Selected color
- Quantity
- Effective unit price
- Subtotal

The UI supports remove, increment, and decrement. A line is uniquely identified by product plus selected size and color. Stored snapshots improve immediate rendering, but current published status, options, price, and availability must be reconciled with server data before the WhatsApp handoff.

Cart totals display:

- Products Total
- Delivery Charges: Calculated / Confirmed on WhatsApp
- Grand website subtotal, equal to product total only

Wishlist and recently viewed are also localStorage-based, schema-versioned, hydration-safe, deduplicated, and bounded to prevent unbounded growth. Storage failure or disabled storage must not break navigation or purchasing.

## 12. WhatsApp handoff

All order inquiry links target normalized number `923081000025` and use correctly URL-encoded text. The message includes:

- A Men's Hub greeting
- Product name for each line
- Article/SKU
- Selected size when applicable
- Selected color when applicable
- Quantity
- Current price
- Canonical product URL
- Cart product subtotal
- A statement that the customer wants to place the order
- A reminder that delivery charges are calculated/confirmed on WhatsApp when appropriate

Copy must not state or imply that opening WhatsApp completes an order, reserves stock, processes payment, or records a sale. A direct product-page inquiry follows the same rules for one selected product.

## 13. Search, filters, and sorting

Search covers product name, SKU/article, category, subcategory, and optional product type. The UI provides a keyboard-accessible, debounced suggestion dropdown with a useful empty state.

Filters:

- Category
- Subcategory
- Price range
- Size
- Color
- Sale
- New arrival
- Availability

Sort options:

- Newest
- Price low to high
- Price high to low
- Discount
- Featured

Public results include only published products in enabled taxonomy. Filter and sort state should be represented in the URL so results are shareable and server-renderable.

## 14. Administration and content management

### Catalog administration

- Full product create, read, update, safe delete/archive, duplicate, publish/unpublish, feature, new-arrival, sale, and inventory workflows.
- Category and subcategory create, edit, safe delete, reorder, enable/disable, and image management.
- A category supports a primary image and optional secondary/banner image.
- Deletion must be blocked or converted to an explicit archival/disable workflow when dependent records would be orphaned.

### Dashboard and analytics

Display truthful metrics for:

- Total products
- Available products
- Out-of-stock products
- Low-stock products
- Sale products
- New arrivals
- Categories
- Subcategories
- WhatsApp clicks
- Most viewed products
- Most clicked products
- Most WhatsApp-inquired products
- Recent products
- Inventory alerts

Analytics are engagement metrics, not sales or orders. No dashboard label may reinterpret a WhatsApp click as revenue or a completed sale.

### Managed content

The administrator can update structured content without source edits:

- Hero and homepage copy
- Why Men's Hub
- About, mission, vision, and values
- Contact information
- Optional social links
- WhatsApp and email
- Optional map configuration
- Footer
- FAQ and policy pages
- Announcement bar
- Global SEO configuration

Structured fields and validated rich text/Markdown are preferred over unrestricted raw HTML. Optional values render only when configured and valid.

## 15. Authentication and security requirements

- Admin login accepts email and password only at `/admin/login`.
- Passwords are stored only as bcrypt hashes; plaintext passwords must never be logged, returned, persisted, or committed.
- Sessions use signed, short-lived `jose` tokens in Secure, HttpOnly, SameSite cookies. `SESSION_SECRET` is server-only and required outside test contexts.
- There is no public registration endpoint or UI.
- Current Next.js 16 uses `proxy.ts` rather than the deprecated `middleware.ts` name. Proxy may perform an optimistic cookie/signature/expiry check but must never import Prisma or query the database.
- A server-only `requireAdmin()` boundary re-verifies the token, administrator identity, active status, and token version close to protected data.
- Every Server Action and Route Handler independently authenticates, authorizes, and validates input. Hiding UI or protecting only a layout is insufficient.
- Server Actions are public POST entry points from a threat-model perspective.
- Login and public analytics endpoints require rate limiting and abuse controls.
- Use generic login errors and constant-path credential handling where practical to reduce account enumeration.
- Mutations use Zod allowlists, database constraints, minimal return DTOs, and explicit cache invalidation.
- Secrets and database models cannot cross into Client Components. Server-only modules use `server-only` boundaries.
- Validate file type, size, dimensions, and intent before Cloudinary upload. Cloudinary API secrets stay server-side.
- Security-sensitive events and admin mutations create audit records without storing secrets.

## 16. Performance, accessibility, and SEO

- React Server Components are the default. Add `'use client'` only at the smallest interactive boundary.
- Use `next/image`, meaningful alt text, responsive `sizes`, stable aspect ratios, and lazy loading below the fold.
- Only the actual LCP hero image receives priority/preload treatment.
- Use streaming and route-level loading/skeleton UI where it improves perceived speed without layout shift.
- Avoid large client state frameworks unless measured need justifies one.
- Animations use transforms/opacity where possible and respect reduced-motion preferences.
- Semantic landmarks, heading order, labels, keyboard operation, visible focus styles, sufficient contrast, and practical minimum touch targets are mandatory.
- Dynamic metadata, canonical URLs, Open Graph data, sitemap, and robots behavior derive from validated site/category/product content.
- Unpublished/disabled content must not leak through metadata, sitemap, search, or related-product queries.

## 17. Seed media contract

The seed process scans these directories:

- `public/seed-media/01-Shirts`
- `public/seed-media/02-Pants`
- `public/seed-media/03-Shalwar-Qameez`
- `public/seed-media/04-Trousers`
- `public/seed-media/05-Shoes`
- `public/seed-media/06-Watches`
- `public/seed-media/07-Perfumes`
- `public/seed-media/08-Glasses`
- `public/seed-media/09-Belts`
- `public/seed-media/10-Accessories`
- `public/seed-media/11-Tracksuits`

For each expected directory, discover regular files ending in `.jpg`, `.jpeg`, `.png`, or `.webp` case-insensitively. Do not assume filenames or contiguous numbering. Sort naturally and deterministically; use the first image as category primary imagery and the second, when present, as optional category/banner secondary imagery.

The seed must be idempotent, preserve files, and report missing/empty directories clearly. It must not create products from images, rename or transform files, or require a second image.

## 18. Quality gates

Every implementation phase must preserve these gates:

- `npm run lint`
- TypeScript validation through `npm run build` or a dedicated typecheck script
- `npm run build`
- Relevant automated tests for domain logic, authorization, validation, and user-critical flows
- No leaked secrets or unintended `NEXT_PUBLIC_` variables
- No fabricated business or catalog data
- Responsive checks from 320px upward
- Keyboard and reduced-motion checks
- Migration and seed repeatability checks for database phases

The production release additionally requires configured environment variables, migrated production database, seeded administrator hash, configured Cloudinary account, verified canonical site URL, and a deployment smoke test.
