// 1° Nivel de Seguridad: Comprueba quién es el usuario.

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Semilla secreta para desencriptar los tokens.
 * Debe coincidir con la usada en el Login.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'Mi_Semilla';

/**
 * Middleware: verifyToken
 * Verifica que la petición incluya un token válido en los encabezados.
 * Si es válido, extrae los datos del usuario y los inyecta en el objeto 'req'.
 */
export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Obtener el encabezado 'Authorization'
	const authHeader = req.headers.authorization;

	// Validar que el encabezado exista y tenga el formato 'Bearer <token>'
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res
			.status(401)
			.json({ message: 'No se proporcionó un token de acceso' });
	}

	// Extraer solo el string del token
	const token = authHeader.split(' ')[1];

	try {
		/**
		 * Verificar el token con la semilla secreta.
		 * Si es válido, 'decoded' contendrá el payload (id, email, role).
		 */
		const decoded = jwt.verify(token!, JWT_SECRET) as any;
		// Inyectar los datos del usuario en la request para que los controladores los usen
		req.user = decoded; // Guardar el payload (id, role, email) en la request
		// Ceder el paso al siguiente middleware o controlador
		next();
	} catch (error) {
		// Si el token expiró o fue manipulado, devolver error
		res.status(401).json({ message: 'Token inválido o expirado' });
	}
};
