import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'Mi_Semilla'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "No se proporcionó un token de acceso" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token!, JWT_SECRET) as any;
        req.user = decoded; // Guardar el payload (id, role, email) en la request
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};