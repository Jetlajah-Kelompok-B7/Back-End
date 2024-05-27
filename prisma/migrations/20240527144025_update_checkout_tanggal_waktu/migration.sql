-- AlterTable
ALTER TABLE "checkouts" ALTER COLUMN "is_payment" SET DEFAULT false,
ALTER COLUMN "tanggal_waktu" DROP NOT NULL;
