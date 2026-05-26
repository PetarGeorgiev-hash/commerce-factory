/*
  Warnings:

  - You are about to drop the column `size` on the `Product_Variant` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product_Variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product_Variant" DROP COLUMN "size",
DROP COLUMN "stock",
ALTER COLUMN "color" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Product_Variant_Size" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Product_Variant_Size_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product_Variant_Size" ADD CONSTRAINT "Product_Variant_Size_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Product_Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
