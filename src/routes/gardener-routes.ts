// Importación de Router
import { Router } from 'express';
// Importación de controlador
import { GardenerController } from '../controllers/gardener-controller';
// Importación de middleware de autenticación
import { verifyToken } from '../middlewares/authentication-middleware';
// Importación de middleware de validación
import { validateSchema } from '../middlewares/validator-middleware';
// Importación de esquema de edición de usuario
import { updateProfileSchema } from '../schemas/gardener-schema';

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
/** @route PUT /api/gardener/profile -> Edita datos básicos del usuario */
gardenerRouter.put('/profile', validateSchema(updateProfileSchema), GardenerController.updateProfile);
/** @route GET /api/gardener/garden -> Obtiene la huerta con información detallada del catálogo */
gardenerRouter.get('/garden', GardenerController.getMyGarden);


// --- GESTIÓN DE CULTIVOS ---

/** @route POST /api/garden/batch -> Agrega una cultivo de la planta del catálogo a la huerta personal */
gardenerRouter.post('/garden/batch', GardenerController.addBatchToGarden);
/** @route PATCH /api/garden/instance -> Edita del cultivo (ej: de creciendo a listo) */
gardenerRouter.patch('/garden/instance', GardenerController.updateInstance);
/** @route DELETE /api/garden/batch/:batchId -> Quita un cultivo de la huerta personal */
gardenerRouter.delete('/garden/batch/:batchId', GardenerController.removeBatchFromGarden);

export default gardenerRouter;



