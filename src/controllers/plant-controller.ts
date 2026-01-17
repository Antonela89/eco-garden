// Importación de módulo
import { Request, Response } from 'express';
// Importación de modelo
import { PlantModel } from '../models/plant-model.js';
// Importación de Enum
import { Dificultad } from '../types/plant.js';
// Importación de función auxiliar
import {
	formatInputData,
	formatIdData,
	slugify,
} from '../../shared/formatters.js';

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
	static getAllPlants = async (req: Request, res: Response) => {
		try {
			const plants = await PlantModel.find().lean();
			res.json(plants);
		} catch (error) {
			res.status(500).json({ message: 'Error', error });
		}
	};

	/**
	 * Busca y devuelve los detalles de una planta específica mediante su ID.
	 */
	static getPlantById = async (req: Request, res: Response) => {
		try {
			// Normalizar el ID recibido: "Tomate Perita" -> "tomate-perita"
			const id = slugify(req.params.id as string);
			// Llamar al modelo
			const plant = await PlantModel.findOne({ id: id }).lean();
			// Validación: Si no existe en el JSON, devolver error 404
			if (!plant)
				return res
					.status(404)
					.json({ message: 'Planta no encontrada' });
			// Respuesta al usuario
			res.json(plant);
		} catch (error) {
			res.status(500).json({ message: 'Error', error });
		}
	};

	/**
	 * Filtra el catálogo según el nivel de dificultad de cultivo.
	 * Útil para interfaces de usuario que categorizan plantas por experiencia.
	 */
	static getByDifficulty = async (req: Request, res: Response) => {
		try {
			// Obtener el parametro de busqueda
			const level = req.params.level as string;

			// Delegar el filtrado al modelo
			const plants = await PlantModel.find({ dificultad: level }).lean();
			res.json(plants);
		} catch (error) {
			res.status(500).json({ message: 'Error', error });
		}
	};

	// ----------------------------------------
	// LÓGICA ESTACIONAL
	// ----------------------------------------

	/**
	 * Verifica si la planta solicitada se encuentra en su temporada ideal de siembra.
	 * Cruza la fecha actual del sistema con los datos del calendario del INTA.
	 */
	static checkSeason = async (req: Request, res: Response) => {
		try {
			// Normalizar antes de consultar
			const id = slugify(req.params.id as string);

			// Se consulta al modelo
			const plant = await PlantModel.findOne({ id: id }).lean();
			if (!plant)
				return res
					.status(404)
					.json({ message: 'Planta no encontrada' });

			const meses = [
				'Enero',
				'Febrero',
				'Marzo',
				'Abril',
				'Mayo',
				'Junio',
				'Julio',
				'Agosto',
				'Septiembre',
				'Octubre',
				'Noviembre',
				'Diciembre',
			];
			const mesActual = meses[new Date().getMonth()];
			const can = plant.siembra.flat().includes(mesActual as string);

			const message = can
				? `¡Sí! Estamos en temporada de siembra para ${plant.nombre}.`
				: `No es el mejor momento para sembrar ${plant.nombre}.`;

			res.json({ status: can ? 'Ideal' : 'No recomendada', message });
		} catch (error) {
			res.status(500).json({ message: 'Error', error });
		}
	};

	// ----------------------------------------
	//         MÉTODOS DE ADMINISTRACIÓN
	// ----------------------------------------

	/**
	 * Registra una nueva especie en el catálogo maestro.
	 * Solo accesible para usuarios con rol 'admin'.
	 */
	static createPlant = async (req: Request, res: Response) => {
		try {
			// Formatear nombres y descripciones (Primer Mayúscula)
			let plantData = formatInputData(req.body);

			// Formatear el ID (Todo a minúsculas y con guiones)
			plantData = formatIdData(plantData);

			// Mongoose maneja el error de ID duplicado automáticamente

			// Llamar al modelo
			const newPlant = await PlantModel.create(plantData);
			res.status(201).json(newPlant);
		} catch (error: any) {
			// Capturar error específico de duplicado de Mongoose
            if (error.code === 11000) {
                return res.status(400).json({ message: 'Error: El ID de la planta ya existe.' });
            }
			res.status(500).json({ message: 'Error', error });
		}
	};

	/**
	 * Actualiza parcialmente la información técnica de una planta existente.
	 */
	static updatePlant = async (req: Request, res: Response) => {
		try {
			// Normalizar el ID de búsqueda
			const id = slugify(req.params.id as string);
			// Formatear solo los campos que vienen para actualizar
			const formattedBody = formatInputData(req.body);
			// Llamar al modelo con ID obtenido de la url y los datos formateados
			// Usar findOneAndUpdate para encontrar por 'id' y devolver el documento actualizado
            const updatedPlant = await PlantModel.findOneAndUpdate(
                { id: id }, 
                formattedBody, 
                { new: true } // Opción para que devuelva la versión nueva
            );

			// Verificación
			if (!updatedPlant)
				return res
					.status(404)
					.json({ message: 'No se encontró la planta' });
			res.json({ message: 'Planta actualizada', plant: updatedPlant });
		} catch (error) {
			res.status(500).json({ message: 'Error', error });
		}
	};

	/**
	 * Elimina una especie del catálogo maestro de forma permanente.
	 */
	static deletePlant = async (req: Request, res: Response) => {
		try {
			// Normalizar el ID antes de solicitar la eliminación
			const id = slugify(req.params.id as string);
			// Llamar al modelo
			const result  = await PlantModel.deleteOne({id:id});

			// Verificación
			if (result.deletedCount === 0)
				return res.status(404).json({
					message: 'No se pudo eliminar: la planta no existe',
				});
			res.json({
				message: 'La planta ha sido eliminada del catálogo maestro',
			});
		} catch (error) {
			res.status(500).json({ message: 'Error', error });
		}
	};
}
