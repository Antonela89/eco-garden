// Importación de modulo
import { z } from 'zod';
// Importación de Enum
import { Dificultad } from '../types/plant.js';

/**
 * plantSchema
 * Define las reglas de validación para el catálogo maestro de plantas.
 * Es utilizado por el Administrador para crear nuevas especies en 'plants.json'.
 */
export const plantSchema = z.object({
	// Identificador único (slug): debe ser una cadena no vacía
	id: z.string().min(1, "El ID es obligatorio (ej: 'tomate')"),
	// Nombre común de la planta
	nombre: z.string().min(2, 'El nombre es obligatorio'),
	// Clasificación botánica
	familia: z.string().min(1, 'La familia es obligatoria'),
	/**
	 * siembra: Validación compleja.
	 * Acepta un array que puede contener strings (meses) o arrays de strings
	 * (útil para especies con temporadas divididas como el Repollo).
	 */
	siembra: z.array(z.union([z.string(), z.array(z.string())])),
	// Métodos de siembra: debe ser un array con al menos un elemento (ej: 'Directa')
	metodo: z.array(z.string()).min(1, 'Debe tener al menos un método'),
	/**
	 * diasCosecha: Objeto con valores numéricos.
	 * '.positive()' asegura que no se ingresen días negativos.
	 */
	diasCosecha: z.object({
		min: z.number().positive(),
		max: z.number().positive(),
	}),
	/**
	 * distancia: Define el marco de plantación.
	 * Valores numéricos en centímetros.
	 */
	distancia: z.object({
		entrePlantas: z.number().positive(),
		entreLineas: z.number().positive(),
	}),
    // Listado de plantas compañeras y cultivos previos/posteriores
	asociacion: z.array(z.string()),
	rotacion: z.array(z.string()),
    // Valores booleanos para filtros rápidos en el frontend
	toleranciaSombra: z.boolean(),
	aptoMaceta: z.boolean(),
    // Valida que el nivel coincida con el Enum (Fácil, Media, Difícil)
	dificultad: z.enum(Dificultad),
    // Requerimientos climáticos
	clima: z.string(),
    // Valida que el string tenga un formato de URL válido para la imagen de Cloudinary
	imagen: z.url('La imagen debe ser una URL válida de Cloudinary'),
});

/**
 * updatePlantSchema
 * Genera un esquema basado en 'plantSchema' pero con todas sus propiedades opcionales.
 * Esto permite al Admin realizar actualizaciones parciales (PATCH) enviando 
 * solo los campos que desea modificar.
 */
export const updatePlantSchema = plantSchema.partial();
