// Importación de módulo
import { Request, Response } from 'express';
// Importación de modelo
import { PlantModel } from '../models/plant-model';

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
		// Obtener el ID de los parámetros de la URL
		const plant = PlantModel.getById(req.params.id as string);

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
		const { level } = req.params; // Ejemplo: 'Fácil', 'Media', 'Difícil'

		// Delegar el filtrado al modelo
		const plants = PlantModel.getByDifficulty(level as any);
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
		const { id } = req.params;

		// Se consulta al modelo
		const can = PlantModel.canBePlanted(id as string);
		const plant = PlantModel.getById(id as string);

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
		// Crear la planta con el modelo
		const newPlant = PlantModel.create(req.body);

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
		// Obtener los datos: ID de la url y nuevos datos: Body
		const updated = PlantModel.update(req.params.id as string, req.body);

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
		// Llamar al modelo
		const deleted = PlantModel.delete(req.params.id as string);

		// Verificación
		if (!deleted)
			return res.status(404).json({ message: 'No se pudo eliminar: la planta no existe' });
		res.json({ message: 'La planta ha sido eliminada del catálogo maestro' });
	};
}
