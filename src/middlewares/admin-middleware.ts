// 2° Nivel de Seguridad: solo el Admin puede hacer cambios importantes.
import { Request, Response, NextFunction } from 'express';
import { Role } from '../types/gardener';

/**
 * Middleware: isAdmin
 * Se asegura de que el usuario autenticado tenga permisos de administrador.
 * IMPORTANTE: Debe ejecutarse SIEMPRE después de 'verifyToken'.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    /**
     * Verificar si existe el usuario en la request (inyectado por verifyToken)
     * y si su rol coincide con el valor ADMIN del Enum.
     */
    if (!req.user || req.user.role !== Role.ADMIN) {
        return res.status(403).json({ message: "Acceso denegado: Se requiere rol de Administrador" });
    }
    // Si es admin, continúa a la acción solicitada
    next();
};

