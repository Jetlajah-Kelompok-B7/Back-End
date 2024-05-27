/*
  Warnings:

  - Added the required column `terminal_keberangkatan` to the `flights` table without a default value. This is not possible if the table is not empty.
  - Added the required column `terminal_kedatangan` to the `flights` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flights" ADD COLUMN     "terminal_keberangkatan" TEXT NOT NULL,
ADD COLUMN     "terminal_kedatangan" TEXT NOT NULL;
