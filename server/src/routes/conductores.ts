import { Router } from 'express';
import { createConductor, getConductores } from '../controllers/conductores';

const router = Router();

router.get('/', getConductores);
router.post('/', createConductor);

export default router;