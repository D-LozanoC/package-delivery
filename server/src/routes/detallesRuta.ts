import { Router } from 'express';
import { addDetallesRuta, getAllDetalles } from '../controllers/detallesRuta';

const router = Router();

router.get('/:rutaId', getAllDetalles)
router.post('/:rutaId/detalles', addDetallesRuta);

export default router;