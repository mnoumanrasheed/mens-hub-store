ALTER TYPE "AdminAuditAction" ADD VALUE 'SETTINGS_UPDATED';
ALTER TYPE "AdminAuditAction" ADD VALUE 'CONTENT_UPDATED';
ALTER TYPE "AdminAuditAction" ADD VALUE 'POLICY_UPDATED';
ALTER TYPE "AdminAuditAction" ADD VALUE 'ANNOUNCEMENT_UPDATED';

ALTER TABLE "SiteSettings"
ADD COLUMN "ogImagePublicId" TEXT,
ADD COLUMN "whatsappGreeting" TEXT,
ADD COLUMN "whatsappOrderStatement" TEXT;

UPDATE "SiteSettings"
SET "brandName" = 'Men’s Hub', "websiteTitle" = CASE WHEN "websiteTitle" = 'Men''s Hub' THEN 'Men’s Hub' ELSE "websiteTitle" END
WHERE "id" = 'site' AND "brandName" = 'Men''s Hub';
