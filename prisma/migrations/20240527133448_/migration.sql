-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "NotificationEnum" AS ENUM ('INFO', 'WARNING', 'PROMO');

-- CreateEnum
CREATE TYPE "Plane_Status" AS ENUM ('Delayed', 'Boarding', 'Cancelled', 'Arrived');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "no_telp" TEXT NOT NULL,
    "tanggal_lahir" TEXT,
    "alamat" TEXT,
    "photo_profile" TEXT,
    "pin" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tanggal_waktu" TIMESTAMPTZ NOT NULL,
    "kategori" "NotificationEnum" NOT NULL DEFAULT 'INFO',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes" (
    "id" SERIAL NOT NULL,
    "kode_pesawat" TEXT NOT NULL,
    "model_pesawat" TEXT NOT NULL,
    "bagasi_kabin" INTEGER NOT NULL,
    "bagasi" INTEGER NOT NULL,
    "jarak_kursi" INTEGER NOT NULL,
    "jumlah_kursi" INTEGER NOT NULL,
    "status" "Plane_Status" NOT NULL,
    "airlineId" INTEGER,

    CONSTRAINT "planes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" SERIAL NOT NULL,
    "kode_maskapai" TEXT NOT NULL,
    "nama_maskapai" TEXT NOT NULL,
    "logo_maskapai" TEXT NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airports" (
    "id" SERIAL NOT NULL,
    "kode_bandara" TEXT NOT NULL,
    "nama_bandara" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flights" (
    "id" SERIAL NOT NULL,
    "bandara_keberangkatan_id" INTEGER NOT NULL,
    "bandara_kedatangan_id" INTEGER NOT NULL,
    "terminal_keberangkatan" TEXT NOT NULL,
    "terminal_kedatangan" TEXT NOT NULL,
    "status" "Plane_Status" NOT NULL,
    "planeId" INTEGER,

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

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "kelas" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "scheduleId" INTEGER NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggal_lahir" TEXT NOT NULL,
    "kewarganegaraan" TEXT NOT NULL,
    "ktp_pasport" TEXT,
    "is_baby" BOOLEAN NOT NULL,
    "negara_penerbit" TEXT NOT NULL,
    "berlaku_sampai" TIMESTAMPTZ NOT NULL,
    "no_kursi" INTEGER NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkouts" (
    "id" SERIAL NOT NULL,
    "metode_pembayaran" TEXT NOT NULL,
    "is_payment" BOOLEAN NOT NULL,
    "total" INTEGER NOT NULL,
    "tanggal_waktu" TIMESTAMPTZ NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "checkouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History_Transaction" (
    "id" SERIAL NOT NULL,
    "checkoutId" INTEGER NOT NULL,

    CONSTRAINT "History_Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transits" (
    "id" SERIAL NOT NULL,
    "flightId" INTEGER NOT NULL,
    "airportId" INTEGER NOT NULL,

    CONSTRAINT "transits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_kode_maskapai_key" ON "airlines"("kode_maskapai");

-- CreateIndex
CREATE UNIQUE INDEX "airports_kode_bandara_key" ON "airports"("kode_bandara");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_flightId_key" ON "schedules"("flightId");

-- CreateIndex
CREATE UNIQUE INDEX "checkouts_orderId_key" ON "checkouts"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "History_Transaction_checkoutId_key" ON "History_Transaction"("checkoutId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes" ADD CONSTRAINT "planes_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "airlines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_bandara_keberangkatan_id_fkey" FOREIGN KEY ("bandara_keberangkatan_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_bandara_kedatangan_id_fkey" FOREIGN KEY ("bandara_kedatangan_id") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_planeId_fkey" FOREIGN KEY ("planeId") REFERENCES "planes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkouts" ADD CONSTRAINT "checkouts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History_Transaction" ADD CONSTRAINT "History_Transaction_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "checkouts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transits" ADD CONSTRAINT "transits_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transits" ADD CONSTRAINT "transits_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
