import { z } from 'zod';
import { Role } from '../types/gardener.js';

// Schema para el Registro
export const registerGardenerSchema = z.object({
    username: z.string()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(20, "El nombre de usuario no puede superar los 20 caracteres"),
    email: z.email("Formato de email inválido"),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número"),
    role: z.nativeEnum(Role, {
        error: () => ({ message: "Rol inválido. Debe ser 'admin' o 'gardener'" })
    }),
    misPlantas: z.array(z.any()).optional().default([]) // Por defecto empieza vacío
});

// Schema para el Login
export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es requerida")
});

// Schema para agregar una planta a la huerta (lo que envía el usuario)
export const addPlantToHuertaSchema = z.object({
    plantId: z.string().min(1, "El ID de la planta es requerido")
});