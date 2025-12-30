import { Router } from 'express';
import { GardenerController } from '../controllers/gardener-controller';
import { validateSchema } from '../middlewares/validator-middleware';
import { registerGardenerSchema, loginSchema } from '../schemas/gardener-schema';

const authRouter = Router();

// /api/auth/register
authRouter.post('/register', validateSchema(registerGardenerSchema), GardenerController.register);

// /api/auth/login
authRouter.post('/login', validateSchema(loginSchema), GardenerController.login);

export default authRouter;