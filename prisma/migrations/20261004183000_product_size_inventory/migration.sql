-- Add independently managed inventory to each product size.
ALTER TABLE "ProductSize" ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_stock_nonnegative" CHECK ("stock" >= 0);
