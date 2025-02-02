import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRuta = async (req: Request, res: Response) => {
    const { conductorId, vehiculoPlaca, fecha } = req.body;

    try {
        // Validar existencia de conductor y vehículo
        const conductor = await prisma.conductor.findUnique({
            where: { id: conductorId }
        });

        const vehiculo = await prisma.vehiculo.findUnique({
            where: { placa: vehiculoPlaca }
        });

        if (!conductor || !vehiculo) {
            return res.status(404).json({ error: "Conductor o vehículo no encontrado" });
        }

        const ruta = await prisma.ruta.create({
            data: {
                fecha: new Date(fecha),
                conductorId,
                vehiculoPlaca
            },
            include: {
                conductor: true,
                vehiculo: true
            }
        });

        res.status(201).json(ruta);
    } catch (error) {
        res.status(500).json({ error: "Error al programar la ruta" });
    }
};

export const searchRutas = async (req: Request, res: Response) => {
    const { fecha, conductorId, vehiculoPlaca } = req.query;

    const where: any = {};

    if (fecha) {
        const startDate = new Date(fecha as string);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(fecha as string);
        endDate.setHours(23, 59, 59, 999);

        where.fecha = {
            gte: startDate,
            lte: endDate
        };
    }

    if (conductorId) where.conductorId = conductorId;
    if (vehiculoPlaca) where.vehiculoPlaca = vehiculoPlaca;

    try {
        const rutas = await prisma.ruta.findMany({
            where,
            include: {
                conductor: true,
                vehiculo: true,
                detalles: true
            },
            orderBy: { fecha: 'desc' }
        });

        res.json(rutas);
    } catch (error) {
        res.status(500).json({ error: "Error en la búsqueda" });
    }
};