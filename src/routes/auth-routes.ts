// Importación de Router
import { Router } from 'express';
// Importación de controlador
import { GardenerController } from '../controllers/gardener-controller';
// Importación de middleware de validación
import { validateSchema } from '../middlewares/validator-middleware';
// Importación de esquema
import { registerGardenerSchema, loginSchema } from '../schemas/gardener-schema';

// Instancia de Router
const authRouter = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registra un nuevo jardinero.
 * @access  Público
 * @process Valida los datos con Zod antes de crear el usuario.
 */
authRouter.post('/register', validateSchema(registerGardenerSchema), GardenerController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Autentica al usuario y devuelve un Token JWT.
 * @access  Público
 */
authRouter.post('/login', validateSchema(loginSchema), GardenerController.login);

export default authRouter;