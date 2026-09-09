# Men’s Hub administrator guide

The private admin is available at `/admin/login`. There is no public admin registration and no customer-account area. Never share credentials or paste secrets into CMS fields.

## Catalogue workflow

1. Create and order categories and subcategories under **Categories**. Storefront navigation and filters are database-driven.
2. Add a product under **Products** with a unique real name, SKU/article number, slug, current price, inventory, description, and primary image.
3. Assign only a subcategory belonging to the selected category.
4. Keep the product unpublished while reviewing it. Publish only after content, image, inventory, options, and SEO fields are accurate.
5. Use **Inventory** to maintain total, available, and sold article counts. WhatsApp clicks never alter inventory.

Do not add placeholder products, prices, SKUs, ratings, reviews, “Best Sellers,” newsletter claims, or unsupported commercial promises.

## Sales

A sale requires a positive sale price lower than the original price. Optional start/end values are interpreted as UTC. The storefront calculates whether the sale is active at request time and uses the same calculation for displayed prices and reconciled WhatsApp inquiries.

## Content and business settings

**Content** manages homepage sections, About/Contact copy, policies, and the announcement bar. **Settings** manages brand/contact defaults and verified optional fields.

Authoritative values are:

- Men’s Hub
- Style Made for Men
- Taha Soni / Shahzaib Soni
- 03081000025
- WhatsApp 923081000025
- mens.hub919@gmail.com

Leave address, map URL, store timing, and social URLs empty until the business supplies verified values. Publish a policy only after the business has approved its exact wording; the software does not invent legal promises.

Images must be JPG, PNG, or WebP and no larger than 5 MB. Replacing an image uploads the new asset before changing the database reference. If Cloudinary is unavailable, stop editing media and ask an operator to verify database/media consistency before retrying.

## WhatsApp and analytics

Product and cart inquiry messages are rebuilt from current database data immediately before WhatsApp opens. They include the product, SKU, selected options, quantity, current price, canonical URL, and product subtotal. Delivery charges are only described as “Calculated / Confirmed on WhatsApp.”

The analytics page contains anonymous product views, product clicks, WhatsApp inquiry clicks, recent activity, and inventory alerts. A `WHATSAPP_CLICK` is engagement only—it is not an order, reservation, payment, confirmed sale, or stock change.

## Operational safety

- Use a unique administrator password and rotate it after suspected exposure.
- Sign out when using a shared device.
- Do not run seed commands casually: the controlled seed resets the seeded administrator password.
- Back up PostgreSQL before major content or schema operations.
- Never run development migrations or database reset commands against production.
- Report failed media deletion to the deployment operator; do not delete Cloudinary folders wholesale.
