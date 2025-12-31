// Importación de Enum Role
import { Role } from './gardener';

/**
 * EXTENSIÓN GLOBAL DE EXPRESS
 * Mediante 'Declaration Merging', se añade la propiedad opcional 'user' al objeto Request.
 * Esto permite que, tras pasar por el middleware de autenticación, se pueda acceder a 
 * los datos del token (req.user.id, req.user.role) de forma segura en los controladores.
 */
declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				role: Role;
				email: string;
			};
		}
	}
}
