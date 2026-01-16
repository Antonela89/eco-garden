// Importación de Router
import { Router } from 'express';
// Importación de controlador
import { PlantController } from '../controllers/plant-controller.js';
// Importación de Middleware de autenticación
import { verifyToken } from '../middlewares/authentication-middleware.js';
// Importación de Middleware de rol administrador
import { isAdmin } from '../middlewares/admin-middleware.js';
// Importación de Middleware de validación
import { validateSchema } from '../middlewares/validator-middleware.js';
// Importación del esquema
import { plantSchema } from '../schemas/plant-schema.js';

// Instancia de Router
const plantRouter = Router();

// ------------------------------------
// RUTAS PÚBLICAS
// ------------------------------------
// No requieren token, cualquier visitante puede consultar el catálogo.

/** @route GET /api/plants -> Ver todas las plantas */
plantRouter.get('/', PlantController.getAllPlants);
/** @route GET /api/plants/:id -> Ver detalle técnico de una planta específica */
plantRouter.get('/:id', PlantController.getPlantById);
/** @route GET /api/plants/difficulty/:level -> Filtrar el catálogo por nivel de experiencia */
plantRouter.get('/difficulty/:level', PlantController.getByDifficulty);
/** @route GET /api/plants/check/:id -> Consultar si la planta es apta para sembrar hoy (clima/mes) */
plantRouter.get('/check/:id', PlantController.checkSeason);

// ------------------------------------
//           RUTAS DE ADMINISTRADOR
// ------------------------------------
/**
 * Estas rutas requieren doble validación:
 * 1. Estar autenticado (verifyToken)
 * 2. Tener el rol 'admin' (isAdmin)
 */

/** @route POST /api/plants -> Agregar nueva especie al catálogo maestro */
plantRouter.post('/', verifyToken, isAdmin, validateSchema(plantSchema), PlantController.createPlant);
/** @route PATCH /api/plants/:id -> Modificar datos técnicos de una especie */
plantRouter.patch('/:id', verifyToken, isAdmin, PlantController.updatePlant);
/** @route DELETE /api/plants/:id -> Eliminar una especie del catálogo maestro */
plantRouter.delete('/:id', verifyToken, isAdmin, PlantController.deletePlant);

export default plantRouter;