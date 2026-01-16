// Importación de módulo
import { Request, Response } from 'express';
// Importación de modelo
import { PlantModel } from '../models/plant-model';
// Importación de Enum
import { Dificultad } from '../types/plant';
// Importación de función auxiliar
import {
	formatInputData,
	formatIdData,
	slugify
} from '../../shared/formatters';

/**
 * Clase PlantController
 * Gestiona las peticiones HTTP relacionadas con el catálogo maestro de plantas.
 * Proporciona acceso público a la información técnica y herramientas de administración.
 */
export class PlantController {
	// ----------------------------------------
	// CONSULTAS DEL CATÁLOGO
	// ----------------------------------------

	/**
	 * Obtiene la lista completa de todas las especies disponibles en el catálogo.
	 */
	static getAllPlants = (req: Request, res: Response) => {
		const plants = PlantModel.getAll();
		res.json(plants);
	};

	/**
	 * Busca y devuelve los detalles de una planta específica mediante su ID.
	 */
	static getPlantById = (req: Request, res: Response) => {
		// Normalizar el ID recibido: "Tomate Perita" -> "tomate-perita"
		const id = slugify(req.params.id as string);
		// Llamar al modelo
		const plant = PlantModel.getById(id);

		// Validación: Si no existe en el JSON, devolver error 404
		if (!plant)
			return res.status(404).json({ message: 'Planta no encontrada' });
		res.json(plant);
	};

	/**
	 * Filtra el catálogo según el nivel de dificultad de cultivo.
	 * Útil para interfaces de usuario que categorizan plantas por experiencia.
	 */
	static getByDifficulty = (req: Request, res: Response) => {
		// Obtener el parametro de busqueda
		const level = req.params.level as string;

		// Delegar el filtrado al modelo
		const plants = PlantModel.getByDifficulty(level as Dificultad);
		res.json(plants);
	};

	// ----------------------------------------
	// LÓGICA ESTACIONAL
	// ----------------------------------------

	/**
	 * Verifica si la planta solicitada se encuentra en su temporada ideal de siembra.
	 * Cruza la fecha actual del sistema con los datos del calendario del INTA.
	 */
	static checkSeason = (req: Request, res: Response) => {
		// Normalizar antes de consultar
		const id = slugify(req.params.id as string);

		// Se consulta al modelo
		const can = PlantModel.canBePlanted(id);
		const plant = PlantModel.getById(id);

		if (can) {
			res.json({
				status: 'Ideal',
				message: `¡Sí! Estamos en temporada de siembra para ${plant?.nombre}.`,
			});
		} else {
			res.json({
				status: 'No recomendada',
				message: `Actualmente no es el mejor momento para sembrar ${plant?.nombre}. Consulta el catálogo para ver opciones de temporada.`,
			});
		}
	};

	// ----------------------------------------
	//         MÉTODOS DE ADMINISTRACIÓN
	// ----------------------------------------

	/**
	 * Registra una nueva especie en el catálogo maestro.
	 * Solo accesible para usuarios con rol 'admin'.
	 */
	static createPlant = (req: Request, res: Response) => {
		// Formatear nombres y descripciones (Primer Mayúscula)
		let plantData = formatInputData(req.body);

		// Formatear el ID (Todo a minúsculas y con guiones)
		plantData = formatIdData(plantData);

		// Llamar al modelo
		const newPlant = PlantModel.create(plantData);

		/**
		 * Validación de duplicados:
		 * Si el modelo detecta que el ID ya existe, devuelve null.
		 */
		if (!newPlant) {
			return res.status(400).json({
				message: 'Error: El ID de la planta ya existe en el catálogo.',
			});
		}
		res.status(201).json(newPlant);
	};

	/**
	 * Actualiza parcialmente la información técnica de una planta existente.
	 */
	static updatePlant = (req: Request, res: Response) => {
		// Normalizar el ID de búsqueda
		const id = slugify(req.params.id as string);
		// Formatear solo los campos que vienen para actualizar
		const formattedBody = formatInputData(req.body);
		// Llamar al modelo con ID obtenido de la url y los datos formateados
		const updated = PlantModel.update(id, formattedBody);

		// Verificación
		if (!updated)
			return res
				.status(404)
				.json({ message: 'No se encontró la planta' });
		res.json({ message: 'Planta actualizada', plant: updated });
	};

	/**
	 * Elimina una especie del catálogo maestro de forma permanente.
	 */
	static deletePlant = (req: Request, res: Response) => {
		 // Normalizar el ID antes de solicitar la eliminación
        const id = slugify(req.params.id as string);
		// Llamar al modelo
		const deleted = PlantModel.delete(id);

		// Verificación
		if (!deleted)
			return res
				.status(404)
				.json({ message: 'No se pudo eliminar: la planta no existe' });
		res.json({
			message: 'La planta ha sido eliminada del catálogo maestro',
		});
	};
}
