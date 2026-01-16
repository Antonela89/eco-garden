// Importación de Router
import { Router } from 'express';
// Importación de controlador
import { GardenerController } from '../controllers/gardener-controller.js';
// Importación de middleware de autenticación
import { verifyToken } from '../middlewares/authentication-middleware.js';
// Importación de middleware de validación
import { validateSchema } from '../middlewares/validator-middleware.js';
// Importación de esquemas
import { updateProfileSchema, addBatchSchema, updateInstanceSchema } from '../schemas/gardener-schema.js';

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
/** @route GET /api/gardener/garden -> Obtiene los cultivos de la huerta*/
gardenerRouter.get('/garden', GardenerController.getMyBatches);


// --- GESTIÓN DE CULTIVOS ---

/** @route POST /api/gardener/garden/batch -> Agrega un lote de cultivo */
gardenerRouter.post('/garden/batch', validateSchema(addBatchSchema), GardenerController.addBatchToGarden);
/** @route PATCH /api/gardener/garden/instance -> Edita el estado de una instancia */
gardenerRouter.patch('/garden/instance', validateSchema(updateInstanceSchema), GardenerController.updateInstance);
/** @route DELETE /api/gardener/garden/batch/:batchId -> Quita un lote completo */
// Esta ruta no necesita validación de body, solo el parámetro de la URL
gardenerRouter.delete('/garden/batch/:batchId', GardenerController.removeBatchFromGarden);

export default gardenerRouter;



