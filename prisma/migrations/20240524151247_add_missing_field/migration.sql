/*
  Warnings:

  - Added the required column `tanggal_waktu` to the `History_Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History_Transaction" ADD COLUMN     "tanggal_waktu" TIMESTAMPTZ NOT NULL;
