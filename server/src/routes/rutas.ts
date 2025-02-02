import { Router } from 'express';
import { createRuta, searchRutas } from '../controllers/rutas';

const router = Router();

router.get('/search', searchRutas);
router.post('/', createRuta);

export default router;