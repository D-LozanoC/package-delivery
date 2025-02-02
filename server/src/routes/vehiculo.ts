import { Router } from 'express'
import { createVehiculo, getVehiculos } from '../controllers/vehiculos'

const router = Router()

router.get('/', getVehiculos)
router.post('/', createVehiculo)

export default router