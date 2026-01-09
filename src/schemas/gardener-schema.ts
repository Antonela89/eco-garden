// Importación de modulo
import { z } from 'zod';
// Importación de Enum
import { Role } from '../types/gardener';

/**
 * registerGardenerSchema
 * Define las reglas de validación para el registro de nuevos usuarios.
 * Actúa como la primera línea de defensa para asegurar la integridad de 'gardeners.json'.
 */
export const registerGardenerSchema = z.object({
	// Validación de nombre: longitud mínima y máxima para evitar nombres vacíos o excesivos
	username: z
		.string()
		.min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
		.max(20, 'El nombre de usuario no puede superar los 20 caracteres'),
	// Validación de email: comprueba que tenga un formato de correo real (ej@ej.com)
	email: z.email('Formato de email inválido'),
	// Validación de contraseña: exige longitud y complejidad mediante Expresiones Regulares (Regex)
	password: z
		.string()
		.min(8, 'La contraseña debe tener al menos 8 caracteres')
        // Expresión regular para obligar al menos una letra mayúscula
		.regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        // Expresión regular para obligar al menos un número
		.regex(/[0-9]/, 'Debe contener al menos un número'),
	// Validación de Rol: asegura que el valor coincida exactamente con el Enum (admin o gardener)
	role: z.enum(Role, {
		error: () => ({
			message: "Rol inválido. Debe ser 'admin' o 'gardener'",
		}),
	}),
	// Inicialización de la huerta: se asegura de que sea un array con default vacío
	myPlants: z.array(z.any()).default([]), // Por defecto empieza vacío
});

/**
 * loginSchema
 * Esquema simplificado para el proceso de inicio de sesión.
 * Solo requiere las credenciales básicas de acceso.
 */
export const loginSchema = z.object({
	email: z.email('Email inválido'),
	password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * updateProfileSchema
 * Esquema simplificado para la edición del perfil de usuario.
 * Solo requiere las credenciales básicas de acceso.
 */
export const updateProfileSchema = z.object({
	// Validación de nombre: longitud mínima y máxima para evitar nombres vacíos o excesivos
	username: z
		.string()
		.min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
		.max(20, 'El nombre de usuario no puede superar los 20 caracteres'),
	// Validación de email: comprueba que tenga un formato de correo real (ej@ej.com)
	email: z.email('Formato de email inválido'),
	// Validación de contraseña: exige longitud y complejidad mediante Expresiones Regulares (Regex)
	password: z
		.string()
		.min(8, 'La contraseña debe tener al menos 8 caracteres')
        // Expresión regular para obligar al menos una letra mayúscula
		.regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        // Expresión regular para obligar al menos un número
		.regex(/[0-9]/, 'Debe contener al menos un número')
})

/**
 * addPlantToHuertaSchema
 * Valida la información necesaria para que un jardinero agregue un cultivo a su huerta.
 */
export const addPlantToGardenSchema = z.object({
	// El plantId debe ser un string no vacío que coincida con un ID del catálogo de plantas
	plantId: z.string().min(1, 'El ID de la planta es requerido'),
});
