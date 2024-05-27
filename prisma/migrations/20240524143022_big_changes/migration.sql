/*
  Warnings:

  - You are about to drop the column `nama_direktor` on the `airlines` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `airports` table. All the data in the column will be lost.
  - The `kategori` column on the `notifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `nama_pesawat` on the `planes` table. All the data in the column will be lost.
  - You are about to drop the column `bandara_keberangkatan_id` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `bandara_kedatangan_id` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `keberangkatan` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `kedatangan` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `kode_maskapai` to the `airlines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kode_bandara` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama_bandara` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kode_pesawat` to the `planes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model_pesawat` to the `planes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "NotificationEnum" AS ENUM ('INFO', 'WARNING', 'PROMO');

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_bandara_keberangkatan_id_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_bandara_kedatangan_id_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_planeId_fkey";

-- AlterTable
ALTER TABLE "airlines" DROP COLUMN "nama_direktor",
ADD COLUMN     "kode_maskapai" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "airports" DROP COLUMN "nama",
ADD COLUMN     "kode_bandara" TEXT NOT NULL,
ADD COLUMN     "nama_bandara" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "kategori",
ADD COLUMN     "kategori" "NotificationEnum" NOT NULL DEFAULT 'INFO';

-- AlterTable
ALTER TABLE "planes" DROP COLUMN "nama_pesawat",
ADD COLUMN     "airlineId" INTEGER,
ADD COLUMN     "kode_pesawat" TEXT NOT NULL,
ADD COLUMN     "model_pesawat" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "bandara_keberangkatan_id",
DROP COLUMN "bandara_kedatangan_id",
DROP COLUMN "keberangkatan",
DROP COLUMN "kedatangan",
ADD COLUMN     "scheduleId" INTEGER NOT NULL,
ALTER COLUMN "planeId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ALTER COLUMN "is_verified" SET DEFAULT false;

-- CreateTable
CREATE TABLE "flights" (
    "id" SERIAL NOT NULL,
    "bandara_keberangkatan_id" INTEGER NOT NULL,
    "bandara_kedatangan_id" INTEGER NOT NULL,
    "status" "Plane_Status" NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    "keberangkatan" TIMESTAMPTZ NOT NULL,
    "kedatangan" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schedules_flightId_key" ON "schedules"("flightId");

-- AddForeignKey
ALTER TABLE "planes" ADD CONSTRAINT "planes_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "airlines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_bandara_keberangkatan_id_fkey" FOREIGN KEY ("bandara_keberangkatan_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_bandara_kedatangan_id_fkey" FOREIGN KEY ("bandara_kedatangan_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_planeId_fkey" FOREIGN KEY ("planeId") REFERENCES "planes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
