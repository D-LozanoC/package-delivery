import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addDetallesRuta = async (req: Request, res: Response) => {
    const { rutaId } = req.params;
    const detalles = req.body; // Array de detalles

    try {
        // Validar existencia de la ruta
        const ruta = await prisma.ruta.findUnique({
            where: { id: rutaId }
        });

        if (!ruta) {
            return res.status(404).json({ error: "Ruta no encontrada" });
        }

        // Crear múltiples detalles
        const createdDetalles = await prisma.detalleRuta.createMany({
            data: detalles.map((detalle: any) => ({
                ...detalle,
                rutaId: rutaId
            }))
        });

        res.status(201).json(createdDetalles);
    } catch (error) {
        res.status(500).json({ error: "Error agregando detalles a la ruta" });
    }
};

export const getAllDetalles = async (req: Request, res: Response) => {
    const { rutaId } = req.params;
    try {
        // Validar existencia de la ruta
        const ruta = await prisma.ruta.findUnique({
            where: { id: rutaId }
        });

        if (!ruta) {
            return res.status(404).json({ error: "Ruta no encontrada" });
        }

        // Obtener todos los detalles de la ruta
        const detalles = await prisma.ruta.findUnique({
            where: { id: rutaId },
            select: {
                id: true,
                fecha: true,
                conductor: true,
                vehiculo: true,
                detalles: true
            }
        });

        res.json(detalles);

    } catch (error) {
        res.status(500).json({ error: "Error obteniendo detalles de la ruta" });
    }
}