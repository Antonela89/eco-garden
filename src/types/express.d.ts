import { Role } from './gardener.js';

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
