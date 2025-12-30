import { Request, Response, NextFunction } from 'express';

// Manejador de errores 500
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("LOG DE ERROR:", err.message);
    res.status(err.status || 500).json({
        message: err.message || "Ocurrió un error inesperado en el servidor"
    });
};

// Manejador de rutas no encontradas 404
export const notFound = (req: Request, res: Response) => {
    res.status(404).json({ message: "La ruta solicitada no existe en Eco-Garden" });
};