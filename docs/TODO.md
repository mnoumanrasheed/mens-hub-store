# Men's Hub Implementation Plan

Status: source of truth  
Last updated: 2026-09-08

Complete phases in order unless a documented dependency permits parallel work. A phase is complete only when its acceptance checks pass and `BUILD_SPEC.md`/`ARCHITECTURE.md` reflect any approved decision changes.

## Phase 0 — Repository discovery and specification

- [x] Inspect application structure, configuration, first-party source, seed folders, and package baseline.
- [x] Confirm there is only one Next.js app and no existing ecommerce implementation.
- [x] Record business truth, exclusions, routes, UX, catalog, and quality requirements in `BUILD_SPEC.md`.
- [x] Record data, auth, media, rendering, security, and deployment decisions in `ARCHITECTURE.md`.
- [x] Create this phased implementation plan.
- [ ] Initialize/version-control the application only when explicitly requested or approved.

Acceptance: the three docs exist, agree with one another, and no product feature has been implemented.

## Phase 1 — Foundation and quality tooling

- [x] Verify current stable mutually compatible releases before installing Prisma/PostgreSQL support, Zod, bcryptjs, jose, Cloudinary, motion, lucide-react, and test tooling.
- [x] Keep npm and update the lockfile; install no beta/RC/canary package. Commit the lockfile when version control is explicitly initialized.
- [x] Add scripts for typecheck, tests, Prisma generation, and CI verification. Migration and seed execution scripts remain in Phase 2 with their implementations.
- [x] Add `.env.example` with the documented variable names and no secrets.
- [x] Add server-only environment validation with clear failure messages when a dependent feature reads incomplete configuration.
- [x] Establish source folders, error/result types, DTO conventions, and import boundaries.
- [x] Establish design tokens, shared UI primitives, loading/error/not-found states, and base accessibility styles without building feature pages.
- [x] Add a CI workflow for install, typecheck, lint, test, and build verification.

Completed: 2026-09-08. At Phase 1 completion Prisma was generator-only; Phase 2 subsequently added the approved data architecture. No authentication or catalog/admin feature UI was introduced in Phase 1.

Acceptance: clean install, lint, strict typecheck, tests, and production build pass; environment failures are explicit; client bundles cannot import server-only modules.

## Phase 2 — Database schema, migrations, and seed

- [x] Configure Prisma for PostgreSQL/Neon with `@prisma/adapter-pg`, pooled runtime connection handling, development singleton reuse, and optional direct migration URL.
- [x] Implement the Phase 2 models and enums in `prisma/schema.prisma`.
- [x] Add unique/composite foreign keys, storefront/admin/analytics indexes, and SQL checks for pricing, inventory, singleton settings, ordering, and schedule windows.
- [x] Generate the initial PostgreSQL migration without requiring a live database.
- [x] Implement deterministic, case-insensitive supported-extension filtering and natural filename sorting in the seed.
- [x] Implement an idempotent seed for authoritative settings, 11 categories, listed subcategories, and category image URL fields.
- [x] Warn and continue for missing/empty directories or a missing second image.
- [x] Seed one administrator from required environment input and persist only a bcrypt cost-12 hash.
- [x] Keep sizes/colors product-owned and dynamic; intentionally seed none because no real products exist.
- [x] Create no products, SKUs, prices, descriptions, sale values, or inventory from seed imagery.
- [x] Verify the current 22 seed images remain present and are only read by seed discovery.
- [ ] Apply the migration and repeat the seed against a disposable PostgreSQL database when database credentials are configured.

Implemented: 2026-09-08. Local schema format/validation, strict typecheck, lint, unit tests, and production build pass without requiring a database connection. Live migration/seed repeatability remains an environment verification step because no `DATABASE_URL` or admin seed password is committed or available.

Acceptance: fresh database migration and repeated seed succeed; taxonomy/settings match the specification; constraints reject invalid data; product count remains zero.

## Phase 3 — Admin authentication and security boundary

- [x] Implement Zod login validation, email normalization, and minimal credential lookup.
- [x] Implement bcryptjs verification with a cost-12 dummy path and one generic credential error.
- [x] Implement jose HS256 signing/verification and the 10-hour HttpOnly admin cookie.
- [x] Implement POST logout, token-version revocation, cookie deletion, and redirect.
- [x] Implement Next.js 16 `src/proxy.ts` as a signature/expiry route guard with no Prisma import/query.
- [x] Implement server-only cached `requireAdmin()` with active-admin and token-version database checks.
- [x] Protect the admin route group and independently authorize the current sensitive logout mutation.
- [x] Add PostgreSQL-backed HMAC-keyed login throttling, minimal auth audit events, and baseline response security headers.
- [x] Test anonymous `/admin` and `/admin/products`, valid/tampered/expired tokens, token-version mismatch, admin mismatch, login normalization, and cookie attributes.
- [ ] Run the Phase 3 migration/seed and complete browser login/dashboard/logout verification against a configured PostgreSQL database.

Implemented: 2026-09-08. Static checks, 19 authentication/domain tests, production build, and anonymous local HTTP redirects pass. Full credential login/logout verification remains environment-dependent because this workspace has no `.env.local`, database URL, session secret, or admin seed password.

Acceptance: no public registration exists; protected reads and mutations fail closed even when called outside the UI; proxy contains no database access.

## Phase 4 — Catalog domain and public data layer

- [ ] Implement server-only category, subcategory, product, option, settings, content, and media DAL modules.
- [ ] Implement minimal public/admin DTOs; never return raw Prisma records.
- [ ] Implement and unit-test effective price, sale windows, discount rounding, and PKR formatting.
- [ ] Implement and unit-test aggregate inventory transitions and low-stock state.
- [ ] Implement publication/enabled filters consistently.
- [ ] Implement safe taxonomy deletion checks and finalize the product delete/archive policy before admin CRUD.
- [ ] Implement slug/SKU normalization and uniqueness conflict handling.
- [ ] Define stable cache/freshness behavior and mutation invalidation paths using current Next.js APIs.

Acceptance: domain/DAL tests cover invalid prices, sale boundaries, inventory invariants, subcategory/category mismatch, disabled taxonomy, unpublished/deleted products, and safe DTO projection.

## Phase 5 — Design system and global storefront shell

- [x] Replace default template metadata/assets/copy with truthful Men's Hub identity.
- [x] Build semantic global layout, announcement bar, integrated sticky navigation, responsive menus, search entry, and premium footer.
- [x] Implement black/charcoal, gold, restrained red, and ivory storefront tokens.
- [x] Establish typography, containers, editorial image treatments, reusable product cards, navigation controls, collection empty states, and public loading/error foundations.
- [x] Add purposeful `motion/react` hero choreography/parallax with reduced-motion variants.
- [x] Ensure optional social/address/map/timing content is omitted when null.
- [ ] Verify keyboard navigation, focus visibility, contrast, touch targets, and 320px behavior.

Acceptance: shell is responsive and accessible, uses database settings/taxonomy, exposes no invented content, and adds minimal client JavaScript.

## Phase 6 — Homepage and editorial content

- [x] Implement all homepage sections in the required order.
- [x] Build the `100svh` cinematic hero with Next.js 16 image preload for the LCP image and restrained motion/depth.
- [x] Implement database-driven category, new-arrival, runtime-active-sale, featured, and accessories queries.
- [x] Add intentional empty states or section omission where catalog/content is absent.
- [x] Implement About, Contact, FAQ, Size Guide, and policy page rendering from managed content.
- [x] Ensure Visit Our Store never fabricates address, map, or timings.

Storefront foundation/homepage milestone completed: 2026-09-08. The shell and homepage are server-rendered from CMS/settings/taxonomy/product DTOs, with client JavaScript limited to navigation/search interaction, wishlist toggles, and restrained hero motion. The existing category media supplies the editorial composition; no products or store details were invented. Static inspection covers 320px wrapping and overflow safeguards, while live browser visual verification remains pending a configured PostgreSQL environment.

Acceptance: homepage order is exact, no Best Sellers/newsletter/ratings exist, and all content is truthful and responsive.

## Phase 7 — Shop, search, filtering, and sorting

- [x] Implement `/shop`, category, subcategory, new-arrivals, and sale pages.
- [x] Parse pagination/filter/sort URL state with Zod.
- [x] Implement database-driven category, subcategory, price, size, color, sale, new-arrival, and availability filters.
- [x] Implement newest, price ascending/descending, computed discount, and featured sorting.
- [x] Implement bounded cross-field product search and keyboard-accessible suggestion dropdown.
- [x] Add debouncing, empty/loading/error states, and responsive filter controls.
- [x] Add shared-store rate limiting if search traffic warrants it.
- [ ] Add query/index performance tests with representative non-fake test fixtures.

Acceptance: URLs are shareable, only public eligible products appear, unknown inputs are safe, suggestions are accessible, and queries are paginated/indexed.

Foundation note: `/shop`, `/shop/[category]`, `/new-arrivals`, and `/sale` now have bounded public collection views and the navbar search submits a bounded cross-field query. Subcategory routing, full filters/sorts, pagination, suggestions, and rate limiting remain intentionally unchecked for the dedicated shop phase.

## Phase 8 — Product page and shopper-local features

- [x] Implement `/product/[slug]` with the required image/information composition and metadata.
- [x] Keep published out-of-stock product pages available with correct state.
- [x] Implement dynamic size/color selection, quantity bounds, size guide, wishlist, and share actions.
- [x] Implement related products using bounded truthful rules.
- [x] Implement versioned, defensive, hydration-safe product cart addition, wishlist, and recently viewed storage.
- [x] Implement cart line identity by product/size/color and required total labels.
- [x] Reconcile local cart lines with current server price/options/availability.
- [x] Implement WhatsApp and Facebook share targets, copy link, and `navigator.share` progressive enhancement.

Acceptance: no ratings appear; corrupt/disabled storage is survivable; stale carts reconcile; mobile and keyboard flows pass.

## Phase 9 — WhatsApp inquiry handoff

- [x] Implement canonical server-side cart/direct-product validation and message construction.
- [x] Encode greeting, name, SKU, selections, quantity, current price, canonical URLs, subtotal, inquiry statement, and delivery-charge notice.
- [x] Target only `923081000025` from validated settings/default seed.
- [x] Reject oversized/invalid payloads and unavailable choices with actionable reconciliation UI.
- [x] Record an inquiry-click event without changing inventory or creating a sale/order.
- [x] Ensure UI language never claims completion, reservation, payment, or confirmed delivery charge.
- [x] Unit-test Unicode, punctuation, spaces, multiple products, optional options, and URL encoding.

Acceptance: decoded messages are correct and canonical; product total equals displayed website subtotal; WhatsApp clicks remain engagement only.

## Phase 10 — Admin catalog, inventory, and media

- [x] Build the responsive product/inventory admin navigation and purpose-built light-neutral operations surfaces.
- [x] Implement product list/create/edit/duplicate/delete and publish/feature/new-arrival/sale workflows.
- [x] Implement dynamic, removable, reorderable size/color editing and explicit aggregate inventory maintenance with validated invariants.
- [x] Implement category/subcategory create/edit/reorder/enable/disable/safe-delete workflows.
- [x] Implement server-authorized Cloudinary product image upload, replacement, and deletion with exactly one primary image.
- [x] Validate product upload MIME type, extension, file signature, size, dimensions, and managed-folder ownership.
- [x] Add persistent remote orphan cleanup/retry handling for managed media failures.
- [x] Revalidate affected admin/catalogue routes after product and inventory mutations.

Product administration and inventory milestone completed: 2026-09-08, with category/subcategory management and persistent media cleanup completed during the final audit on 2026-09-09.

Acceptance: every mutation re-authorizes and validates; one product image is enforced; referential integrity and existing working media survive failures.

## Phase 11 — Content, settings, announcements, and SEO admin

- [x] Build structured editors for hero/homepage, Why Men's Hub, About/mission/vision/values, contact, footer, FAQ, size guide, and policies.
- [x] Build validated settings for brand/contact/WhatsApp/email, optional provider-checked social URLs, optional address/map/timings, delivery/ordering copy, low-stock threshold, PKR currency, and SEO defaults.
- [x] Build the announcement editor with UTC runtime scheduling, constrained background, and enable/disable behavior.
- [x] Validate constrained content and external URLs; render CMS bodies as escaped plain text with no arbitrary executable HTML.
- [x] Implement hero/OG image preview and policy publication controls.
- [x] Generate canonical metadata, Open Graph data, sitemap, and robots behavior from eligible content.

Website CMS/settings milestone completed: 2026-09-08. Global storefront metadata and policy metadata consume managed settings, active announcements are selected at request time without cron, repeat seed runs preserve owner-managed values, and optional public contact/store/social fields are omitted when unconfigured. Canonical URL, sitemap, and robots generation remain in the later SEO/release scope.

Acceptance: normal content changes need no code edit; unconfigured optional fields stay hidden; unpublished content does not leak.

## Phase 12 — Analytics dashboard

- [x] Implement minimal first-party view, click, and WhatsApp inquiry-click ingestion.
- [x] Add validation, noise controls, shared-store rate limiting, and a documented retention approach.
- [x] Implement dashboard counts for catalog/inventory/taxonomy and bounded engagement rankings.
- [x] Label all engagement metrics accurately and provide empty states.
- [ ] Add daily aggregation only if measured event volume requires it.

Acceptance: metrics reconcile with source queries, contain no sales/revenue claims, and collect no unnecessary personal/cart content.

## Phase 13 — Hardening, accessibility, performance, and release

- [ ] Complete threat-model review for auth, IDOR, CSRF, XSS, upload abuse, secret exposure, rate-limit bypass, and analytics spam.
- [ ] Add/test CSP and security headers compatible with required image and navigation origins.
- [ ] Run dependency/security audit and resolve actionable findings without unstable package upgrades.
- [ ] Complete automated unit/integration/component/end-to-end suite.
- [ ] Run accessibility automation plus keyboard/screen-reader/reduced-motion manual checks.
- [ ] Test responsive layouts at 320px, mobile, tablet, laptop, desktop, and large display sizes.
- [ ] Measure Core Web Vitals/bundle impact; correct LCP priority, image sizes, layout shifts, and excessive client JS.
- [ ] Verify database indexes and serverless connection behavior under load.
- [ ] Verify backup/recovery, migrations, idempotent seed, Cloudinary failure recovery, and preview isolation.
- [ ] Run `npm run lint`, strict typecheck, full tests, and `npm run build` in CI and production-like environment.
- [ ] Perform Vercel/Neon/Cloudinary production smoke test and validate every required environment variable.

Acceptance: all quality gates pass, no critical/high security defects remain, performance/accessibility budgets are met, and the production handoff checklist is signed off.

## Deferred unless explicitly approved

- Customer accounts or registration
- Online checkout or payments
- Order management or stock reservation
- Ratings/reviews
- Newsletter
- Best Sellers
- Multiple product images
- Per-size/per-color variant inventory
- Native mobile application
- Separate backend/search service
- Heavy WebGL effects
