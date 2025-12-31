// 3° Nivel de Seguridad: usa Zod para filtrar la información que entra al servidor.

import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

/**
 * Middleware: validateSchema
 * Valida el cuerpo de la petición (req.body) contra un esquema de Zod predefinido.
 * @param {ZodObject} schema - El esquema contra el cual validar.
 */
export const validateSchema =
	(schema: ZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			// Parsear los datos recibidos
			schema.parse(req.body);
			// Si son correctos, pasar al siguiente paso
			next();
		} catch (error) {
			// Si Zod detecta errores, capturar
			if (error instanceof ZodError) {
				return res.status(400).json({
					message: 'Error de validación en los datos ingresados',
					// Mapear los errores para que el frontend sepa exactamente qué falló
					errors: error.issues.map((e) => ({
						campo: e.path[0],
						mensaje: e.message,
					})),
				});
			}
			// Error genérico si algo falla fuera de Zod
			res.status(500).json({
				message: 'Error interno durante la validación',
			});
		}
	};
