# Storefront redesign

The customer storefront now uses an editorial charcoal, ivory, and gold design. Styles and self-hosted Cormorant Garamond / Manrope fonts are scoped to `.atelier-store`. No admin, database, API, authentication, or data-layer files were changed for this redesign. Existing uncommitted changes to shared files were preserved.

- Full-width campaign hero with Motion (Framer Motion), GSAP scroll parallax, and a dynamically loaded Three.js light-thread scene.
- Editorial navigation and category directory showing every active category, with responsive collection filters and product cards.
- Refined product detail, image enlargement, cart, wishlist, about, contact, policy, and missing-page layouts.
- Existing CMS content, product photos, prices, discounts, stock, options, contact details, analytics, and WhatsApp inquiry behavior retained.
- Search now navigates explicitly before dismissing its overlay. Mobile filters contain their offscreen animation and trap keyboard focus.
- Reduced-motion preferences disable the decorative scene and parallax. The Three.js scene pauses offscreen and in background tabs and disposes its resources on unmount. Reveal animations do not apply hidden initial styles. The existing root streaming/loading flow still requires JavaScript.

## Palette

The request referenced colors without attaching a palette. The existing palette was retained: charcoal `#0b0b0c`, ivory `#f5f2ea`, gold `#d2ad45`, and the existing neutral/status tokens. Product photography and option swatches retain their actual colors.

## Campaign asset

Saved asset: `public/images/atelier-campaign.webp` (71,748 bytes).
Generated using the built-in imagegen tool and optimized to WebP with Sharp. This is an atmospheric campaign asset, not a catalogue product photograph. An administrator's existing hero image takes precedence.

Final generation prompt:

> Use case: photorealistic-natural. Asset type: luxury menswear website campaign hero, landscape 3:2. Create a premium cinematic black and white fashion editorial photograph of one adult South Asian male fashion model, short dark hair, elegant dark tailored suit with open collar ivory shirt, waist-up portrait, looking off-camera, composed in the RIGHT HALF of the image. Dramatic side lighting and deep charcoal architectural shadows, fine natural film grain, authentic cloth texture. Left half mostly dark charcoal negative space. Restrained, sophisticated high-fashion magazine photography, confident and contemplative. Palette exclusively black, charcoal and warm ivory grayscale. No typography, no logos, no watermarks, no gold objects. This is an atmospheric brand campaign, not a product listing.

## Review notes

Desktop/mobile screenshots are in `artifacts/`. Populated cart and wishlist screenshots use disposable browser-local fixtures; these were never written to the catalogue.

The local database has no published products, and policy pages are unpublished. Collection empty states and unpublished-page behavior were preserved. Product detail and policy rendering compile against their existing data contracts; live product ordering and published policy text could not be reviewed with the current catalogue. No WhatsApp message or order was sent.

Verification includes TypeScript, ESLint, the existing 36 unit tests, production build, route rendering, storefront/admin style isolation, browser errors, mobile navigation and search, filter controls, cart quantities, wishlist actions, and reduced-motion behavior.
