import { Router } from 'express';
import { createRuta } from '../controllers/rutas';

const router = Router();

router.post('/', createRuta);

export default router;