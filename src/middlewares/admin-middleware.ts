import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/gardener';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== Role.ADMIN) {
        return res.status(403).json({ message: "Acceso denegado: Se requiere rol de Administrador" });
    }
    next();
};

