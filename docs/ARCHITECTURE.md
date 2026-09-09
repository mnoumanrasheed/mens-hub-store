# Men's Hub Architecture

Status: source of truth  
Last updated: 2026-09-08

## 1. System overview

Men's Hub is a single Vercel-compatible Next.js application. It serves a public product catalog and a private administrator interface. PostgreSQL is the system of record, Prisma is the only ORM, Cloudinary stores administrator-uploaded media, and WhatsApp is an external inquiry handoff rather than an order-processing system.

```text
Browser
  |-- public RSC pages and small client islands
  |-- localStorage: cart, wishlist, recently viewed
  |
Next.js App Router on Vercel
  |-- Server Components -> server-only DAL -> Prisma -> PostgreSQL/Neon
  |-- Server Actions -> requireAdmin + Zod -> domain service -> Prisma
  |-- Route Handlers -> auth/rate limit/Zod -> integrations or analytics
  |-- proxy.ts -> optimistic signed-session check only (no Prisma)
  |
  |-- Cloudinary: managed image uploads and delivery
  `-- wa.me: URL-encoded customer inquiry handoff
```

No Express server, Firebase, MongoDB, external ecommerce platform, customer identity provider, payment gateway, or order service is part of the system.

## 2. Runtime and package policy

- Keep the existing stable Next.js App Router application and npm lockfile.
- TypeScript remains strict. Avoid `any`; validate at trust boundaries and infer types from Zod/Prisma where appropriate.
- React Server Components are the default. Client Components are limited to interactive controls, browser storage, animation, and browser-only APIs.
- Use Server Actions for first-party form mutations and Route Handlers for web-style endpoints, uploads/signatures, analytics ingestion, or responses consumed outside React actions.
- Next.js 16 renamed Middleware to Proxy. Use `src/proxy.ts`, not deprecated `middleware.ts`.
- Add only stable, mutually compatible releases of Prisma, PostgreSQL adapter dependencies if required by the current Prisma major, Zod, bcryptjs, jose, Cloudinary, motion, and lucide-react. Resolve and lock exact transitive versions during the dependency phase; never select beta, RC, or canary tags.
- Do not enable experimental Next.js flags unless a later architecture decision records the need, stability status, fallback, and test coverage.

## 3. Proposed source layout

```text
src/
  app/
    (store)/                 public storefront routes
    admin/                   private admin routes and login
    api/                     narrowly scoped Route Handlers
    sitemap.ts
    robots.ts
  actions/                   thin Server Action entry points
  components/
    admin/
    storefront/
    layout/
    ui/
  data/                      server-only DAL and DTO queries
  domain/                    pure pricing, inventory, slug, WhatsApp rules
  lib/
    auth/                    token/cookie and requireAdmin helpers
    cloudinary/
    db/
    validation/
  styles/
  types/
  proxy.ts                   optimistic admin-route gate, no database import
prisma/
  schema.prisma
  migrations/
  seed.ts
docs/
```

Route groups must not change the public URLs. Keep domain logic independent from React so it can be unit tested.

## 4. Data access boundary

Use one consistent server-only Data Access Layer rather than issuing Prisma queries from arbitrary components.

- `src/lib/db` owns Prisma client construction and serverless-safe reuse.
- Prisma 7 uses `@prisma/adapter-pg` with the pooled `DATABASE_URL`; a development global prevents hot-reload client duplication. `DIRECT_URL`, when present, is preferred by Prisma CLI migrations through `prisma.config.ts`.
- `src/data` owns reads, authorization-aware writes, and minimal DTO projection.
- Add `import "server-only"` to modules that access Prisma, secrets, tokens, Cloudinary credentials, or privileged records.
- Server Components call DAL query functions directly; do not make internal HTTP round trips to this application's own Route Handlers.
- Client Components receive minimal serializable DTOs, never raw Prisma models or secret-bearing objects.
- Route parameters, query strings, form data, cookies, headers, localStorage payloads, and analytics payloads are untrusted.

Database errors are logged server-side with correlation context and mapped to safe UI errors. Expected validation/conflict errors are typed results; unexpected failures do not reveal SQL, stack traces, hashes, or secrets.

## 5. PostgreSQL and Prisma model

Phase 2 implements the schema in `prisma/schema.prisma` and the initial PostgreSQL migration in `prisma/migrations/20260908120000_initial_data_architecture`. IDs use CUIDs, persisted dates use `TIMESTAMPTZ(3)`, and prices use `Decimal(12,2)`. The migration adds SQL `CHECK` constraints for invariants Prisma cannot express.

### 5.1 Identity

`AdminUser` stores normalized unique email, bcrypt password hash, optional display name, active state, token version, optional last-login timestamp, and timestamps. The controlled seed creates or resets exactly one administrator from `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`; source and logs never contain the plaintext password. Phase 3 uses this record for credential verification and session revocation.

### 5.2 Taxonomy and category media

`Category` has globally unique name/slug, optional description, direct primary/banner URL and Cloudinary public-ID fields, ordering, active state, and timestamps. `imageUrl` is nullable deliberately: a missing seed directory/image must warn without fabricating a URL or failing the full seed.

`Subcategory` belongs to a category and has category-scoped unique slug and name rules. A unique `(id, categoryId)` key supports the product composite foreign key. Category/subcategory deletes are restricted while dependants exist; disabling via `isActive` is the safe retirement path.

Seed media stays under `/public/seed-media`. Category rows store either local web paths or, later, Cloudinary delivery URLs/public IDs. No separate media model is introduced in this phase because the authoritative model requires direct URL/public-ID fields.

### 5.3 Products and dynamic choices

`Product` contains the specified catalog, one-image, pricing, inventory, publication, sale-window, and SEO fields. SKU and slug are unique. The optional `(subcategoryId, categoryId)` composite relation guarantees that the selected subcategory belongs to the product category.

`ProductSize` and `ProductColor` are product-owned relational rows with product-scoped uniqueness and display order; colors may carry an optional validated hex value. They are dynamic database data, not application constants, and they do not claim per-variant inventory. Because no products may be invented, the initial seed creates no size/color rows.

Database constraints require non-negative price/inventory/order values, a positive stored sale price below original price, `availableArticles <= totalArticles`, `soldArticles <= totalArticles`, and `availableArticles + soldArticles <= totalArticles`. The gap between total and available-plus-sold represents stock not currently allocated to either counter and leaves room for later audited adjustments. Cart and WhatsApp actions never mutate inventory.

Storefront/admin indexes cover publication, taxonomy, new-arrival, featured, sale window, availability, creation date, name, product type, SKU, and slug access paths.

### 5.4 Settings and content

`SiteSettings` is enforced as one row with ID `site`. It holds authoritative identity/contact/delivery/currency values, optional social/address/map/timing values, low-stock threshold, website title, meta description, and optional Open Graph image. The seed leaves every unconfigured optional field `NULL`.

`ContentBlock` uses an area enum (`HOMEPAGE`, `ABOUT`, `CONTACT`, `FOOTER`), stable key, structured JSON content, ordering, and active state. `PolicyPage` separately stores unique route slug, structured content, publication fields, and SEO fields. JSON must be validated against block/page-specific Zod schemas before later mutations render it; raw executable HTML is not accepted.

The CMS implementation allowlists every block key and field in a shared registry. Body content is stored as structured JSON but rendered as escaped plain text (`white-space` preserves intentional line breaks); Markdown/HTML execution is not enabled. Policy shells seed as unpublished with empty content, so the seed makes no legal or operational promises. Repeat seeds do not overwrite administrator-managed settings or page content. The optional hero and Open Graph images use the managed `mens-hub/content` Cloudinary namespace and retain their public IDs for replacement cleanup.

`Announcement` stores text, optional link, a constrained background enum, enabled state, UTC schedule window, ordering, and timestamps. Invalid reversed windows are rejected by PostgreSQL; active state is calculated at request time.

### 5.5 Analytics

`AnalyticsEvent` records only `PRODUCT_VIEW`, `PRODUCT_CLICK`, or `WHATSAPP_CLICK`, an optional product relation, and creation time. Product deletion sets the relation to `NULL` to preserve aggregate history safely. No IP, phone, message/cart content, credential, token, fingerprint, or other unnecessary personal data is stored. Indexes cover event type/date, product/type/date, and date.

## 6. Pricing and inventory domain rules

Centralize pricing in a pure server-safe function used by storefront DTOs, search, cart reconciliation, and WhatsApp messages.

```text
saleIsActive = saleEnabled
  AND salePrice exists
  AND salePrice > 0
  AND salePrice < originalPrice
  AND (saleStartAt is null OR now >= saleStartAt)
  AND (saleEndAt is null OR now <= saleEndAt)

effectivePrice = saleIsActive ? salePrice : originalPrice
discountPercent = saleIsActive
  ? floor/round according to one documented UI rule
  : null
```

Sale windows are inclusive and evaluated from UTC instants at runtime, so no cron job is needed. `src/domain/product/sale.ts` compares decimal strings as integer minor units and is boundary-tested. The discount rounding rule is finalized when discount display is implemented. Prisma Decimal values are converted to explicit serialized money strings/integers at the DTO boundary, never passed to Client Components.

Inventory updates run in database transactions. The service calculates the new consistent counters rather than trusting three unrelated client-supplied values. Because there is no online order, cart and WhatsApp actions do not reserve/decrement inventory; the administrator records real-world inventory/sales changes.

## 7. Authentication and authorization

### 7.1 Login flow

1. `/admin/login` posts email and password to a Server Action.
2. Zod validates and normalizes the input.
3. PostgreSQL-backed rate limiting checks HMAC-digested email/source keys before expensive password verification; raw identifiers are not stored.
4. Query the administrator by normalized email and compare with `bcryptjs`.
5. Return the same generic failure for unknown email, wrong password, or inactive account.
6. On success, issue a short-lived signed JWT with `jose` and set the admin cookie.
7. Atomically confirm active/token-version state, update `lastLoginAt`, and write a minimal audit event.

The initial password is provided securely at seed/deployment time and persisted only as a hash. It must never appear in seed source, docs, browser code, build logs, or error messages.

### 7.2 Session token and cookie

The signed token contains only minimal claims: `sub` (admin ID), role marker, `tokenVersion`, `iat`, `exp`, and `jti`. Sign using an explicit modern HMAC algorithm supported by `jose`; load a high-entropy `SESSION_SECRET` only from the server environment and fail closed if absent.

Cookie requirements:

- Dedicated non-public name such as `mh_admin_session`
- `HttpOnly: true`
- `Secure: true` in production
- `SameSite: Lax`
- `Path: /`
- `Max-Age` aligned with the implemented 10-hour token lifetime

Logout is a POST Server Action that independently calls `requireAdmin()`, increments `tokenVersion` to revoke outstanding sessions, records a minimal audit event, clears the cookie, and redirects to login. Password change/deactivation must likewise increment `tokenVersion` when implemented.

### 7.3 Defense in depth

- `src/proxy.ts` matches admin routes except login/static assets. It may verify signature and expiry for a fast redirect but never imports Prisma, the DAL, or Cloudinary.
- `requireAdmin()` is a cached-per-render server-only helper. It verifies the token, loads a minimal admin projection, and checks active status and `tokenVersion`.
- Protected page data calls use the DAL; do not assume a layout check protects descendants.
- Every Server Action and protected Route Handler starts with `requireAdmin()` and then validates inputs/authorization for the addressed resource.
- Route Handlers return 401/403 as appropriate; UI Server Actions return safe typed failures or redirects without leaking sensitive detail.
- Admin DTOs never contain `passwordHash` or session secrets.

Server Actions are treated as externally reachable POST endpoints. Use Next.js same-origin protections, SameSite cookies, input allowlists, and explicit authorization. Do not rely on encrypted action IDs or hidden buttons as access control.

### 7.4 Login abuse controls and audit data

`LoginThrottle` provides a shared, serverless-compatible PostgreSQL throttle instead of process-local memory. It stores only keyed HMAC digests derived with `SESSION_SECRET`, attempt/window data, and block expiry. Email keys are limited more tightly than source keys. Invalid syntax, unknown users, incorrect passwords, inactive users, and throttled requests all receive the same public credential error; a valid bcrypt cost-12 dummy hash keeps unknown-email verification on the bcrypt path.

`AdminAuditLog` stores only `LOGIN_SUCCESS`, `LOGIN_FAILURE`, and `LOGOUT`, an optional safe administrator relation, and timestamp. It contains no password, submitted email, IP address, session token, user agent, or arbitrary metadata. Login throttles and audit records require the Phase 3 migration before authentication is enabled.

## 8. Media strategy

### Seed media

The Prisma seed maps a fixed directory-to-category-name table, then discovers regular `.jpg`, `.jpeg`, `.png`, and `.webp` files case-insensitively and natural-sorts them. It assigns first/second paths directly to category primary/banner URL fields and performs idempotent upserts. Missing directories, empty directories, and missing second images warn but do not abort the remaining seed. It never modifies media files or derives products, options, SKUs, prices, or stock from them.

### Cloudinary uploads

- Upload authorization/signature is produced server-side only after `requireAdmin()`.
- Validate MIME signature/type, extension, byte size, dimensions, and category (`product`, `category`, or `content`).
- Use deterministic, namespaced folders and unique public IDs; do not overwrite unrelated assets.
- Persist only returned secure delivery data and metadata.
- Configure `next/image` remote patterns narrowly for the account's Cloudinary delivery host/path.
- Product replacement is one-primary-image-in/one-primary-image-out. Commit the new DB reference before asynchronously deleting the old remote asset so a failed upload cannot remove the working image.
- Orphan cleanup is retryable and audited. Database transactions cannot atomically cover Cloudinary, so failure states must be explicit.

Image transformations are delivery-time Cloudinary/Next Image optimizations. Originals are retained according to the configured Cloudinary policy. Alt text is required for meaningful imagery and may be empty only for genuinely decorative assets.

## 9. Rendering, caching, and invalidation

- Public pages are Server Components unless interaction requires a client island.
- Query the database through DTO-producing DAL functions. Public queries always constrain publication/deletion and enabled taxonomy.
- Admin pages are request-time and non-public; never cache personalized/private data in a shared cache.
- Start with stable Next.js caching APIs only. Do not enable experimental Cache Components merely for optimization.
- On admin mutations, invalidate the narrow affected paths/tags using current stable Next.js 16 APIs and ensure read-your-own-writes where the admin UI requires it.
- Use `loading.tsx`/Suspense around meaningful data boundaries, not around every component.
- Generate metadata on the server from the same public DTO rules used by pages.
- Keep related-product and collection queries bounded and indexed.

The initial implementation should favor correct request-time database reads over premature caching. Add cache policy only with freshness rules and invalidation tests documented per query.

## 10. Search and URL state

Search/filter/sort inputs live in `searchParams`, are parsed by Zod, normalized, bounded, and translated into Prisma queries. Unknown filters are ignored or rejected consistently. Pagination is required for unbounded result sets.

Initial search uses PostgreSQL-supported case-insensitive matching over indexed/normalized product fields and joins to category/subcategory. If catalog size/latency later justifies it, introduce PostgreSQL full-text/trigram indexes through migrations; do not add a separate search service prematurely.

Suggestion requests are debounced client-side, rate-limited server-side, length-limited, and return minimal public DTOs. Keyboard navigation follows accessible combobox/listbox behavior.

## 11. Browser state and WhatsApp reconciliation

Cart, wishlist, and recently viewed state use versioned JSON in localStorage behind small Client Component providers/hooks. Parse stored data with Zod, recover from corruption, deduplicate entries, cap recently viewed items, and avoid reading browser APIs during server render.

Local data is not authoritative. Before creating a WhatsApp URL, send product IDs, selections, and quantities to a server boundary that:

1. Validates and bounds the payload.
2. Re-reads published products and their allowed size/color options.
3. Recalculates active prices and checks availability.
4. Returns any reconciliation issues.
5. Builds the branded message from canonical data.
6. Records a WhatsApp inquiry click only when the handoff is intentionally initiated.

The returned `wa.me/923081000025?...` URL is navigated by a small client boundary. Product URLs derive from the validated canonical site URL. The response and analytics must state inquiry intent, never order completion.

## 12. Content rendering and external links

- Validate social links by provider and HTTPS origin before saving. `NULL` means hidden.
- Validate map configuration as optional content; never infer it from other fields.
- External links use safe `rel` attributes when opening new tabs.
- Render content from a sanitized Markdown/constrained rich-text pipeline. Disallow scripts, event attributes, unsafe protocols, and arbitrary embeds.
- Contact and footer components consume the same settings DTO to prevent inconsistent business facts.

## 13. Environment contract

The committed `.env.example` documents names and contains no secret values. It includes the authoritative recommended admin email, which is public business data, while the seed password remains blank. Expected server variables:

- `DATABASE_URL`: pooled runtime Neon/PostgreSQL connection
- `DIRECT_URL`: direct connection for migrations when the selected Prisma/Neon configuration requires it
- `SESSION_SECRET`
- Secure initial-admin seed input (prefer an out-of-band password or precomputed hash workflow)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SITE_URL`: deliberately public canonical application origin

Only deliberately public, non-secret configuration may use `NEXT_PUBLIC_`. Cloudinary API secret, database URLs, session secret, password/hash, and admin identity data are never public.

## 14. Observability, abuse prevention, and privacy

- Use structured server logs with request/correlation IDs and redaction.
- Record admin audit events for authentication outcomes at a safe granularity and for catalog/content/settings mutations.
- Rate-limit login, upload/signature, search suggestion, analytics, and WhatsApp reconciliation endpoints using a Vercel-compatible shared store in production; in-memory limits are development-only.
- Apply request body limits and reject unsupported content types.
- Analytics are first-party, minimal, pseudonymous, and retention-bounded. Do not collect data without a product need.
- Add security headers and a tested Content Security Policy compatible with Cloudinary and WhatsApp navigation during the hardening phase.

## 15. Testing strategy

- Unit: pricing windows/discount rounding, inventory transitions, slug/normalization, WhatsApp encoding, seed natural sort, and Zod schemas.
- Integration: Prisma constraints, idempotent seed, DAL publication filters, `requireAdmin()`, token revocation, safe deletion, content validation, and analytics semantics.
- Component: cart line identity, localStorage recovery, accessible search, inventory messages, and reduced motion.
- End-to-end: public browse/search/filter/product flow; cart-to-WhatsApp handoff; admin login/logout; unauthorized direct Server Action/Route Handler attempts; CRUD/media workflows; mobile keyboard/focus behavior.
- Quality: lint, strict typecheck, production build, accessibility scan, responsive visual checks, and performance budgets.

## 16. Deployment strategy

- Vercel hosts the Next.js application.
- Neon or another serverless-compatible PostgreSQL provider supplies pooled runtime connections and a migration-safe direct connection where required.
- Run migrations as an explicit deployment/release step, not unpredictably during request startup.
- Seed initial taxonomy/settings/admin deliberately and idempotently; do not rerun destructive seed behavior on every deploy.
- Cloudinary serves managed remote media; existing seed media ships in `public` until administrators replace it.
- Preview deployments use isolated/non-production data and credentials.
- Production promotion requires successful migrations, lint/type/build/tests, environment validation, and smoke checks.

## 17. Recorded architecture decisions

1. One Next.js application; no separate backend.
2. DAL-centric Prisma access with server-only boundaries and minimal DTOs.
3. Stateless short-lived signed admin cookie plus database-backed `tokenVersion`/active checks for revocation.
4. Next.js 16 `proxy.ts` is optimistic only and performs no database query.
5. Aggregate product inventory for the initial release; size/color are selectable attributes, not stock-bearing variants.
6. One product image; categories use direct primary/banner URL and optional Cloudinary public-ID fields.
7. Product deletion strategy is finalized with admin CRUD; taxonomy deletion is already restricted when referenced.
8. Local browser cart/wishlist/history reconciled against canonical server data before WhatsApp handoff.
9. WhatsApp events are inquiries/engagement, never orders, payments, or sales.
10. Seed images populate category URL fields only and never create products.
11. Product sizes/colors are product-owned dynamic rows; no global option constants or fake option rows are seeded.
12. Database checks allow `available + sold <= total`; any remainder is unallocated inventory and later inventory mutations must be audited transactions.
13. Website copy uses allowlisted structured CMS blocks and escaped plain-text policy bodies; arbitrary HTML is never accepted or rendered.
14. Optional social, address, Google Maps, store-timing, WhatsApp-copy, and media values are nullable and omitted publicly until configured. Social/map origins and internal/external link protocols are validated before persistence.
15. Announcement activation is calculated from inclusive UTC start/end windows at request time; no cron job mutates announcement state.
16. The storefront shell and homepage remain React Server Components; only the sticky/mobile navigation, search overlay, local wishlist toggle, and Motion hero are client islands. Public product DTOs serialize Decimal values and calculate effective sale price/discount at the server boundary.
17. Homepage queries require published products and active taxonomy, evaluate sale windows against the request UTC instant, and return bounded collections. Empty collections render explicit states and never generate substitute products.
