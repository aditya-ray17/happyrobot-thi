/*
  Warnings:

  - You are about to drop the column `extracted_data` on the `CallRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CallRecord" DROP COLUMN "extracted_data",
ADD COLUMN     "negotiation_rounds" INTEGER;
