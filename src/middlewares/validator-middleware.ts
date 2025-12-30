import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export const validateSchema = (schema: ZodObject) => 
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: "Datos inválidos",
                    errors: error.issues.map(e => ({ campo: e.path[0], mensaje: e.message }))
                });
            }
            res.status(500).json({ message: "Error interno en la validación" });
        }
    };