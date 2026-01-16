// Importación de módulo
import path from 'path';
// Importación de interfaces
import { Plant, Dificultad } from '../types/plant.js';
// Importación de funciones auxiliares
import { readJSON, writeJSON } from '../utils/fileHandle.js';
import { normalizeText } from '../../shared/formatters.js';

/**
 * Ruta absoluta hacia el archivo JSON que funciona como base de datos de plantas.
 * Se utiliza __dirname para asegurar que la ruta sea correcta desde cualquier entorno.
 */
const pathFile = path.join(__dirname, '../data/plants.json');

/**
 * Clase PlantModel
 * Gestiona el catálogo maestro de plantas basado en la información del INTA ProHuerta.
 */
export class PlantModel {
	// ---------------------------
	// MÉTODOS DE LECTURA
	// ---------------------------

	/**
	 * Obtiene el catálogo completo de plantas.
	 * @returns {Plant[]}
	 */
	static getAll = (): Plant[] => {
		return readJSON(pathFile);
	};

	/**
	 * Persiste la lista de plantas en el archivo JSON.
	 * @param {Plant[]} list
	 */
	static save = (list: Plant[]): void => {
		writeJSON(pathFile, list);
	};

	// ---------------------------
	// LÓGICA DE PLANTA - CRUD
	// ---------------------------

	/**
	 * Busca una planta por su ID único.
	 * @param {string} id
	 * @returns {Plant | undefined}
	 */
	static getById = (id: string): Plant | undefined => {
		// Obtener todas las plantas
		const plants = this.getAll();
		// Devolver la planta segun id
		return plants.find((p) => p.id === id);
	};

	/**
	 * Filtra el catálogo según el nivel de dificultad.
	 * @param {Dificultad} level - 'Fácil', 'Media' o 'Difícil'.
	 * @returns {Plant[]}
	 */
	static getByDifficulty = (level: Dificultad): Plant[] => {
		// Obtener todas las plantas
		const plants = this.getAll();
		// Normalizar el parámetro de búsqueda
		const normalizedLevel = normalizeText(level);
		// Filtrar las plantas cuyo campo 'dificultad' coincida con el level recibido
		return plants.filter((p) => normalizeText(p.dificultad) === normalizedLevel);
	};

	// ---------------------------
	//  MÉTODOS PRIVADOS (DRY)
	// ---------------------------

	/**
	 * Método privado para obtener la lista completa y el índice de una planta.
	 * Evita repetir la lógica de búsqueda en update y delete.
	 * @param {string} id
	 * @returns {{plants: Plant[], index: number}}
	 */
	private static getPlantContext = (id: string) => {
		// Obtener todas las plantas
		const plants = this.getAll();
		// Filtrar y obtener el indice
		const index = plants.findIndex((p) => p.id === id);
		// Devolver el array y el indice
		return { plants, index };
	};

	// ---------------------------
	//      LÓGICA DE NEGOCIO
	// ---------------------------

	/**
	 * Determina si una planta se puede sembrar en el mes actual.
	 * @param {string} id - ID de la planta a consultar.
	 * @returns {boolean}
	 */
	static canBePlanted = (id: string): boolean => {
		// obtener la planta según id
		const plant = this.getById(id);
		// Validación
		if (!plant) return false;

		// Array de meses
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

		// Obtener mes actual basado en el sistema
		const mesActual = meses[new Date().getMonth()]!;

		// .flat() se usa porque algunas plantas (como el Repollo) tienen
		// temporadas de siembra divididas en sub-arrays en el JSON.
		return plant.siembra.flat().includes(mesActual);
	};

	// ---------------------------
	//      MÉTODOS DE ADMIN
	// ---------------------------

	/**
	 * Agrega una nueva especie al catálogo.
	 * @param {Plant} plantData
	 * @returns {Plant}
	 */
	static create = (plantData: Plant): Plant | null => {
		// VALIDACIÓN DE DUPLICADOS:
		// Si ya existe una planta con ese ID, no se crea.
		if (this.getById(plantData.id)) {
			return null;
		}
		// Obtener todas las plantas
		const plants = this.getAll();
		// Agregar la planta al array
		plants.push(plantData);

		// Guardar
		this.save(plants);
		// Devolver nueva planta
		return plantData;
	};

	/**
	 * Actualiza los datos técnicos de una planta.
	 * @param {string} id
	 * @param {Partial<Plant>} newData
	 * @returns {Plant | null}
	 */
	static update = (id: string, newData: Partial<Plant>): Plant | null => {
		// Obtener todas las plantas y el indice
		const { plants, index } = this.getPlantContext(id);
		// Validación
		if (index === -1) return null;

		// Modificar el objeto con los datos ingresados
		plants[index] = { ...plants[index]!, ...newData };

		// Guardar
		this.save(plants);
		// Devolver planta modificada
		return plants[index]!;
	};

	/**
	 * Elimina una planta del catálogo maestro (JSON).
	 * @param {string} id
	 * @returns {boolean}
	 */
	static delete = (id: string): boolean => {
		// Obtener todas las plantas y el indice
		const { plants, index } = this.getPlantContext(id);

		// Valdiación
		if (index === -1) return false;

		// Eliminar el elemento en la posición encontrada
		plants.splice(index, 1);

		// Guardar lista actualizada
		this.save(plants);
		// Devolver Verdadero
		return true;
	};
}
