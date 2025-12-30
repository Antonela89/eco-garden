import { Router } from 'express';
import authRoutes from './auth-routes';
import plantRoutes from './plant-routes';
import gardenerRoutes from './gardener-routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/plants', plantRoutes);
router.use('/gardener', gardenerRoutes);

export default router;