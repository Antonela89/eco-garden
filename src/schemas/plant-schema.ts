import { z } from 'zod';
import { Dificultad } from '../types/plant';

export const plantSchema = z.object({
    id: z.string().min(1, "El ID es obligatorio (ej: 'tomate')"),
    nombre: z.string().min(2, "El nombre es obligatorio"),
    familia: z.string().min(1, "La familia es obligatoria"),
    // Acepta array de strings o array de arrays (por el caso del Repollo)
    siembra: z.array(z.union([z.string(), z.array(z.string())])),
    metodo: z.array(z.string()).min(1, "Debe tener al menos un método"),
    diasCosecha: z.object({
        min: z.number().positive(),
        max: z.number().positive()
    }),
    distancia: z.object({
        entrePlantas: z.number().positive(),
        entreLineas: z.number().positive()
    }),
    asociacion: z.array(z.string()),
    rotacion: z.array(z.string()),
    toleranciaSombra: z.boolean(),
    aptoMaceta: z.boolean(),
    dificultad: z.enum(Dificultad),
    clima: z.string(),
    imagen: z.url("La imagen debe ser una URL válida de Cloudinary")
});

// Schema para actualización (hace que todos los campos sean opcionales)
export const updatePlantSchema = plantSchema.partial();