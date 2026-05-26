/*
  Warnings:

  - The `size` column on the `Product_Variant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product_Variant" DROP COLUMN "size",
ADD COLUMN     "size" TEXT[];
