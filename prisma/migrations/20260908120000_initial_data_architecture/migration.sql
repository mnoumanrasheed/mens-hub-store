-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "ContentArea" AS ENUM ('HOMEPAGE', 'ABOUT', 'CONTACT', 'FOOTER');

-- CreateEnum
CREATE TYPE "AnnouncementBackground" AS ENUM ('DARK', 'GOLD', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('PRODUCT_VIEW', 'PRODUCT_CLICK', 'WHATSAPP_CLICK');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "displayName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    "lastLoginAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "imagePublicId" TEXT,
    "bannerImageUrl" TEXT,
    "bannerImagePublicId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productType" TEXT,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "imageUrl" TEXT NOT NULL,
    "imagePublicId" TEXT,
    "originalPrice" DECIMAL(12,2) NOT NULL,
    "salePrice" DECIMAL(12,2),
    "description" TEXT NOT NULL,
    "material" TEXT,
    "totalArticles" INTEGER NOT NULL DEFAULT 0,
    "availableArticles" INTEGER NOT NULL DEFAULT 0,
    "soldArticles" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isNewArrival" BOOLEAN NOT NULL DEFAULT false,
    "saleEnabled" BOOLEAN NOT NULL DEFAULT false,
    "saleStartAt" TIMESTAMPTZ(3),
    "saleEndAt" TIMESTAMPTZ(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSize" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ProductSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductColor" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ProductColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'site',
    "brandName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "proprietors" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "deliveryChargesMessage" TEXT NOT NULL DEFAULT 'Calculated / Confirmed on WhatsApp',
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "tiktokUrl" TEXT,
    "address" TEXT,
    "googleMapsUrl" TEXT,
    "storeTiming" TEXT,
    "lowStockThreshold" INTEGER NOT NULL DEFAULT 3,
    "currency" TEXT NOT NULL DEFAULT 'PKR',
    "websiteTitle" TEXT NOT NULL,
    "metaDescription" TEXT,
    "ogImageUrl" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentBlock" (
    "id" TEXT NOT NULL,
    "area" "ContentArea" NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT,
    "content" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ContentBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PolicyPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "publishedAt" TIMESTAMPTZ(3),
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "PolicyPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "linkUrl" TEXT,
    "linkLabel" TEXT,
    "background" "AnnouncementBackground" NOT NULL DEFAULT 'DARK',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "startAt" TIMESTAMPTZ(3),
    "endAt" TIMESTAMPTZ(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "type" "AnalyticsEventType" NOT NULL,
    "productId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_isActive_idx" ON "AdminUser"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_isActive_sortOrder_idx" ON "Category"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "Subcategory_categoryId_isActive_sortOrder_idx" ON "Subcategory"("categoryId", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_categoryId_slug_key" ON "Subcategory"("categoryId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_categoryId_name_key" ON "Subcategory"("categoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Subcategory_id_categoryId_key" ON "Subcategory"("id", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_isPublished_createdAt_idx" ON "Product"("isPublished", "createdAt");

-- CreateIndex
CREATE INDEX "Product_categoryId_isPublished_createdAt_idx" ON "Product"("categoryId", "isPublished", "createdAt");

-- CreateIndex
CREATE INDEX "Product_subcategoryId_isPublished_createdAt_idx" ON "Product"("subcategoryId", "isPublished", "createdAt");

-- CreateIndex
CREATE INDEX "Product_isNewArrival_isPublished_createdAt_idx" ON "Product"("isNewArrival", "isPublished", "createdAt");

-- CreateIndex
CREATE INDEX "Product_isFeatured_isPublished_createdAt_idx" ON "Product"("isFeatured", "isPublished", "createdAt");

-- CreateIndex
CREATE INDEX "Product_saleEnabled_isPublished_saleStartAt_saleEndAt_idx" ON "Product"("saleEnabled", "isPublished", "saleStartAt", "saleEndAt");

-- CreateIndex
CREATE INDEX "Product_availableArticles_isPublished_idx" ON "Product"("availableArticles", "isPublished");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "Product_productType_idx" ON "Product"("productType");

-- CreateIndex
CREATE INDEX "ProductSize_label_idx" ON "ProductSize"("label");

-- CreateIndex
CREATE INDEX "ProductSize_productId_sortOrder_idx" ON "ProductSize"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSize_productId_label_key" ON "ProductSize"("productId", "label");

-- CreateIndex
CREATE INDEX "ProductColor_name_idx" ON "ProductColor"("name");

-- CreateIndex
CREATE INDEX "ProductColor_productId_sortOrder_idx" ON "ProductColor"("productId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProductColor_productId_name_key" ON "ProductColor"("productId", "name");

-- CreateIndex
CREATE INDEX "ContentBlock_area_isActive_sortOrder_idx" ON "ContentBlock"("area", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ContentBlock_area_key_key" ON "ContentBlock"("area", "key");

-- CreateIndex
CREATE UNIQUE INDEX "PolicyPage_slug_key" ON "PolicyPage"("slug");

-- CreateIndex
CREATE INDEX "PolicyPage_isPublished_updatedAt_idx" ON "PolicyPage"("isPublished", "updatedAt");

-- CreateIndex
CREATE INDEX "Announcement_enabled_startAt_endAt_sortOrder_idx" ON "Announcement"("enabled", "startAt", "endAt", "sortOrder");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_type_createdAt_idx" ON "AnalyticsEvent"("type", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_productId_type_createdAt_idx" ON "AnalyticsEvent"("productId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subcategoryId_categoryId_fkey" FOREIGN KEY ("subcategoryId", "categoryId") REFERENCES "Subcategory"("id", "categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductColor" ADD CONSTRAINT "ProductColor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Domain invariants not expressible in the Prisma schema language.
ALTER TABLE "AdminUser"
ADD CONSTRAINT "AdminUser_tokenVersion_nonnegative" CHECK ("tokenVersion" >= 0);

ALTER TABLE "Category"
ADD CONSTRAINT "Category_sortOrder_nonnegative" CHECK ("sortOrder" >= 0);

ALTER TABLE "Subcategory"
ADD CONSTRAINT "Subcategory_sortOrder_nonnegative" CHECK ("sortOrder" >= 0);

ALTER TABLE "Product"
ADD CONSTRAINT "Product_price_valid" CHECK (
  "originalPrice" >= 0
  AND (
    "salePrice" IS NULL
    OR ("salePrice" > 0 AND "salePrice" < "originalPrice")
  )
),
ADD CONSTRAINT "Product_inventory_nonnegative" CHECK (
  "totalArticles" >= 0
  AND "availableArticles" >= 0
  AND "soldArticles" >= 0
),
ADD CONSTRAINT "Product_inventory_within_total" CHECK (
  "availableArticles" <= "totalArticles"
  AND "soldArticles" <= "totalArticles"
  AND "availableArticles" + "soldArticles" <= "totalArticles"
),
ADD CONSTRAINT "Product_sale_window_valid" CHECK (
  "saleStartAt" IS NULL
  OR "saleEndAt" IS NULL
  OR "saleEndAt" >= "saleStartAt"
);

ALTER TABLE "ProductSize"
ADD CONSTRAINT "ProductSize_sortOrder_nonnegative" CHECK ("sortOrder" >= 0);

ALTER TABLE "ProductColor"
ADD CONSTRAINT "ProductColor_sortOrder_nonnegative" CHECK ("sortOrder" >= 0);

ALTER TABLE "SiteSettings"
ADD CONSTRAINT "SiteSettings_singleton" CHECK ("id" = 'site'),
ADD CONSTRAINT "SiteSettings_lowStockThreshold_nonnegative" CHECK ("lowStockThreshold" >= 0);

ALTER TABLE "ContentBlock"
ADD CONSTRAINT "ContentBlock_sortOrder_nonnegative" CHECK ("sortOrder" >= 0);

ALTER TABLE "Announcement"
ADD CONSTRAINT "Announcement_sortOrder_nonnegative" CHECK ("sortOrder" >= 0),
ADD CONSTRAINT "Announcement_window_valid" CHECK (
  "startAt" IS NULL
  OR "endAt" IS NULL
  OR "endAt" >= "startAt"
);
