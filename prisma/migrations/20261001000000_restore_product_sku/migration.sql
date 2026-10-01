-- Restore the optional product tag/SKU removed by the catalogue simplification migration.
ALTER TABLE "Product" ADD COLUMN "sku" TEXT;

CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
