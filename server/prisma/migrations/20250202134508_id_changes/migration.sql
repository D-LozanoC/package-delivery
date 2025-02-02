/*
  Warnings:

  - The primary key for the `Conductor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DetalleRuta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Ruta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Conductor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `DetalleRuta` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Ruta` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DetalleRuta" DROP CONSTRAINT "DetalleRuta_rutaId_fkey";

-- DropForeignKey
ALTER TABLE "Ruta" DROP CONSTRAINT "Ruta_conductorId_fkey";

-- AlterTable
ALTER TABLE "Conductor" DROP CONSTRAINT "Conductor_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Conductor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Conductor_id_seq";

-- AlterTable
ALTER TABLE "DetalleRuta" DROP CONSTRAINT "DetalleRuta_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "rutaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "DetalleRuta_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "DetalleRuta_id_seq";

-- AlterTable
ALTER TABLE "Ruta" DROP CONSTRAINT "Ruta_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "conductorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Ruta_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Ruta_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Conductor_id_key" ON "Conductor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleRuta_id_key" ON "DetalleRuta"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Ruta_id_key" ON "Ruta"("id");

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "Conductor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleRuta" ADD CONSTRAINT "DetalleRuta_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
