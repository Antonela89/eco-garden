import { Router } from 'express';
import { GardenerController } from '../controllers/gardener-controller';
import { verifyToken } from '../middlewares/authentication-middleware';

const gardenerRouter = Router();

// Todas estas rutas requieren logueo.
gardenerRouter.use(verifyToken);

// Ver perfil y huerta detallada
gardenerRouter.get('/profile', GardenerController.getProfile);
gardenerRouter.get('/garden', GardenerController.getMyGarden);

// Gestión de cultivos personales
gardenerRouter.post('/garden', GardenerController.addToGarden);
gardenerRouter.patch('/garden/status', GardenerController.updatePlantStatus);
gardenerRouter.delete('/garden/:plantId', GardenerController.removeFromGarden);

export default gardenerRouter;