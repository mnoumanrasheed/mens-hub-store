-- Simplify catalogue data while preserving the current available inventory.
ALTER TABLE "Product" ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;
UPDATE "Product" SET "stock" = "availableArticles";

ALTER TABLE "Product"
  DROP CONSTRAINT IF EXISTS "Product_inventory_nonnegative",
  DROP CONSTRAINT IF EXISTS "Product_inventory_within_total",
  DROP CONSTRAINT IF EXISTS "Product_sale_window_valid";

DROP INDEX IF EXISTS "Product_sku_key";
DROP INDEX IF EXISTS "Product_slug_key";
DROP INDEX IF EXISTS "Product_saleEnabled_isPublished_saleStartAt_saleEndAt_idx";
DROP INDEX IF EXISTS "Product_availableArticles_isPublished_idx";
DROP INDEX IF EXISTS "Product_productType_idx";

ALTER TABLE "Product"
  DROP COLUMN "sku",
  DROP COLUMN "slug",
  DROP COLUMN "productType",
  DROP COLUMN "description",
  DROP COLUMN "material",
  DROP COLUMN "totalArticles",
  DROP COLUMN "availableArticles",
  DROP COLUMN "soldArticles",
  DROP COLUMN "saleEnabled",
  DROP COLUMN "saleStartAt",
  DROP COLUMN "saleEndAt",
  DROP COLUMN "seoTitle",
  DROP COLUMN "seoDescription";

ALTER TABLE "Product"
  ADD CONSTRAINT "Product_stock_nonnegative" CHECK ("stock" >= 0);

DROP TABLE "PolicyPage";
DROP TABLE "Announcement";
DROP TABLE "AnalyticsEvent";
DROP TYPE "AnnouncementBackground";
DROP TYPE "AnalyticsEventType";
DELETE FROM "PublicRateLimit" WHERE "scope" = 'analytics';

ALTER TABLE "AdminAuditLog" ALTER COLUMN "action" TYPE TEXT;
UPDATE "AdminAuditLog"
SET "action" = 'CONTENT_UPDATED'
WHERE "action" IN ('POLICY_UPDATED', 'ANNOUNCEMENT_UPDATED', 'INVENTORY_UPDATED');

ALTER TYPE "AdminAuditAction" RENAME TO "AdminAuditAction_old";
CREATE TYPE "AdminAuditAction" AS ENUM (
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'LOGOUT',
  'CATEGORY_CREATED',
  'CATEGORY_UPDATED',
  'CATEGORY_STATE_CHANGED',
  'CATEGORY_REORDERED',
  'CATEGORY_DELETED',
  'SUBCATEGORY_CREATED',
  'SUBCATEGORY_UPDATED',
  'SUBCATEGORY_STATE_CHANGED',
  'SUBCATEGORY_REORDERED',
  'SUBCATEGORY_DELETED',
  'PRODUCT_CREATED',
  'PRODUCT_UPDATED',
  'PRODUCT_DELETED',
  'PRODUCT_STATE_CHANGED',
  'SETTINGS_UPDATED',
  'CONTENT_UPDATED'
);
ALTER TABLE "AdminAuditLog"
  ALTER COLUMN "action" TYPE "AdminAuditAction"
  USING "action"::"AdminAuditAction";
DROP TYPE "AdminAuditAction_old";
