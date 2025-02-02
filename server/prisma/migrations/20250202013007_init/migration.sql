-- CreateTable
CREATE TABLE "Vehiculo" (
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "capacidad_carga" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("placa")
);

-- CreateTable
CREATE TABLE "Conductor" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "numero_licencia" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,

    CONSTRAINT "Conductor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruta" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "conductorId" INTEGER NOT NULL,
    "vehiculoPlaca" TEXT NOT NULL,

    CONSTRAINT "Ruta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleRuta" (
    "id" SERIAL NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "direccion" TEXT NOT NULL,
    "numero_paquete" TEXT NOT NULL,
    "rutaId" INTEGER NOT NULL,

    CONSTRAINT "DetalleRuta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_placa_key" ON "Vehiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Conductor_numero_licencia_key" ON "Conductor"("numero_licencia");

-- CreateIndex
CREATE UNIQUE INDEX "Conductor_correo_key" ON "Conductor"("correo");

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "Conductor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruta" ADD CONSTRAINT "Ruta_vehiculoPlaca_fkey" FOREIGN KEY ("vehiculoPlaca") REFERENCES "Vehiculo"("placa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleRuta" ADD CONSTRAINT "DetalleRuta_rutaId_fkey" FOREIGN KEY ("rutaId") REFERENCES "Ruta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
