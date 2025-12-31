// 4° Nivel de Seguridad: Proteger la integridad del servidor

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware: errorHandler
 * Manejador de errores 500
 * Captura cualquier error que ocurra durante la ejecución de las rutas.
 * Evita que el servidor se caiga y envía una respuesta JSON limpia.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Imprimir el error en la consola del servidor para debug
    console.error("LOG DE ERROR:", err.message);

    // Responder al cliente con el status del error o 500 por defecto
    res.status(err.status || 500).json({
        message: err.message || "Ocurrió un error inesperado en el servidor de Eco-Garden"
    });
};

/**
 * Middleware: notFound
 * Se activa cuando ninguna ruta definida anteriormente coincide con la URL solicitada.
 */
export const notFound = (req: Request, res: Response) => {
    res.status(404).json({ message: "La ruta solicitada no existe en Eco-Garden" });
};