import { Request, Response } from 'express'
import { prisma } from '../utils/prismaConfig'

export const getVehiculos = async (_req: Request, res: Response) => {
    try {
        const vehiculos = await prisma.vehiculo.findMany()
        res.json(vehiculos)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los vehículos' })
    }
}

export async function createVehiculo(req: Request, res: Response) {
    const { placa, modelo, color, marca, capacidad_carga } = req.body
    // Validación básica
    if (!placa || !modelo || !color || !marca || !capacidad_carga) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }
    try {
        const vehiculo = await prisma.vehiculo.create({
            data: {
                placa,
                modelo,
                color,
                marca,
                capacidad_carga: Number(capacidad_carga),
            },
        })
        res.status(201).json(vehiculo)
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el vehículo' })
    }
}