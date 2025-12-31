// Importación de Router
import { Router } from 'express';
// Importación de controlador
import { GardenerController } from '../controllers/gardener-controller';
// Importación de middleware de autenticación
import { verifyToken } from '../middlewares/authentication-middleware';

// Instancia de Router
const gardenerRouter = Router();

/**
 * MIDDLEWARE DE NIVEL DE ROUTER:
 * Todas las rutas definidas a continuación requieren que el usuario esté logueado.
 * 'verifyToken' extraerá el ID del usuario del encabezado de la petición.
 */
gardenerRouter.use(verifyToken);

// --- PERFIL Y CONSULTAS ---

/** @route GET /api/gardener/profile -> Obtiene datos básicos del usuario */
gardenerRouter.get('/profile', GardenerController.getProfile);
/** @route GET /api/gardener/garden -> Obtiene la huerta con información detallada del catálogo */
gardenerRouter.get('/garden', GardenerController.getMyGarden);


// --- GESTIÓN DE CULTIVOS ---

/** @route POST /api/gardener/garden -> Agrega una planta del catálogo a la huerta personal */
gardenerRouter.post('/garden', GardenerController.addToGarden);
/** @route PATCH /api/gardener/garden/status -> Cambia el estado del cultivo (ej: de creciendo a listo) */
gardenerRouter.patch('/garden/status', GardenerController.updatePlantStatus);
/** @route DELETE /api/gardener/garden/:plantId -> Quita un cultivo de la huerta personal */
gardenerRouter.delete('/garden/:plantId', GardenerController.removeFromGarden);

export default gardenerRouter;