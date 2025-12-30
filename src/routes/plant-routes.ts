import { Router } from 'express';
import { PlantController } from '../controllers/plant-controller';
import { verifyToken } from '../middlewares/authentication-middleware';
import { isAdmin } from '../middlewares/admin-middleware';
import { validateSchema } from '../middlewares/validator-middleware';
import { plantSchema } from '../schemas/plant-schema';

const plantRouter = Router();

// RUTAS PÚBLICAS
plantRouter.get('/', PlantController.getAllPlants);
plantRouter.get('/:id', PlantController.getPlantById);
plantRouter.get('/difficulty/:level', PlantController.getByDifficulty);
plantRouter.get('/check/:id', PlantController.checkSeason);

// RUTAS DE ADMINISTRADOR (Requieren Token + Rol Admin)
plantRouter.post('/', verifyToken, isAdmin, validateSchema(plantSchema), PlantController.createPlant);
plantRouter.patch('/:id', verifyToken, isAdmin, PlantController.updatePlant);
plantRouter.delete('/:id', verifyToken, isAdmin, PlantController.deletePlant);

export default plantRouter;