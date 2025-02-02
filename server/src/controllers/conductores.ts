import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getConductores = async (_req: Request, res: Response) => {
    try {
        const conductores = await prisma.conductor.findMany();
        res.json(conductores);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los conductores" });
    }
}

export const createConductor = async (req: Request, res: Response) => {
    const { nombres, apellidos, numero_licencia, telefono, correo } = req.body;

    try {
        // Validar que el número de licencia y correo sean únicos
        const existingConductor = await prisma.conductor.findFirst({
            where: {
                OR: [
                    { numero_licencia },
                    { correo }
                ]
            }
        });

        if (existingConductor) {
            return res.status(400).json({
                error: "El número de licencia o correo ya están registrados"
            });
        }

        const conductor = await prisma.conductor.create({
            data: { nombres, apellidos, numero_licencia, telefono, correo }
        });

        res.status(201).json(conductor);
    } catch (error) {
        res.status(500).json({ error: "Error al registrar el conductor" });
    }
};