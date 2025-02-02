import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRuta = async (req: Request, res: Response) => {
    const { conductorId, vehiculoPlaca, fecha } = req.body;

    try {
        // Validar existencia de conductor y vehículo
        const conductor = await prisma.conductor.findUnique({
            where: { id: Number(conductorId) }
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
                conductorId: Number(conductorId),
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