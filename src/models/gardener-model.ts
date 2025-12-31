// Importación de módulos
import path from 'path';
import crypto from 'crypto';
// Importación de Tipos
import { Gardener, UserPlant } from '../types/gardener';
// Importación de funciones auxiliares
import { readJSON, writeJSON } from '../utils/fileHandle';

/**
 * Ruta absoluta hacia el archivo JSON que funciona como base de datos de jardineros.
 * Se utiliza __dirname para asegurar que la ruta sea correcta desde cualquier entorno.
 */
const pathFile = path.join(__dirname, '../data/gardeners.json');

/**
 * Clase GardenerModel
 * Centraliza la lógica de acceso y manipulación de datos de los usuarios (Jardineros)
 * y sus respectivas huertas personales.
 * Encapsulamiento de métodos
 */
export class GardenerModel {
	// ---------------------------
	// LÓGICA DE JARDINERO - CRUD
	// ---------------------------

	/**
	 * Lee el archivo JSON y devuelve la lista completa de jardineros.
	 * @returns {Gardener[]} Array de objetos tipo Gardener.
	 */
	static getAll = (): Gardener[] => {
		return readJSON(pathFile);
	};

	/**
	 * Recibe una lista de jardineros y la persiste en el archivo JSON.
	 * @param {Gardener[]} list - La lista actualizada a guardar.
	 */
	static save = (list: Gardener[]): void => {
		writeJSON(pathFile, list);
	};

	/**
	 * Busca un jardinero específico mediante su identificador único (ID).
	 * @param {string} id - UUID del jardinero.
	 * @returns {Gardener | undefined} El objeto jardinero o undefined si no existe.
	 */
	static getById = (id: string): Gardener | undefined => {
		// Obtener todos los jardineros
		const gardeners = this.getAll();
		// Filtrar según id ingresado
		return gardeners.find((g) => g.id === id);
	};

	/**
	 * Busca un jardinero por su correo electrónico.
	 * Útil para procesos de Login y validación de duplicados en Registro.
	 * @param {string} email
	 * @returns {Gardener | undefined}
	 */
	static getByEmail = (email: string): Gardener | undefined => {
		// Obtener todos los jardineros
		const gardeners = this.getAll();
		// Filtrar según email ingresado
		return gardeners.find((g) => g.email === email);
	};

	/**
	 * Crea un nuevo registro de jardinero asignándole un ID dinámico.
	 * @param {Omit<Gardener, 'id'>} dataGardener - Datos del usuario sin el ID.
	 * @returns {Gardener} El nuevo objeto jardinero creado.
	 */
	static create = (dataGardener: Omit<Gardener, 'id'>): Gardener => {
		// Obtener todos los jardineros
		const gardeners = this.getAll();

		// Crear nuevo jardinero
		const newGardener: Gardener = {
			// Datos ingresados
			...dataGardener,
			// Agregar id generado automaticamente
			id: crypto.randomUUID(),
		};
		// Agregar el nuevo jardinero
		gardeners.push(newGardener);
		// Guardar la nueva lista de jardineros
		this.save(gardeners);
		// Devolver el nuevo jardinero
		return newGardener;
	};

	/**
	 * Actualiza la información de un jardinero existente.
	 * @param {string} id - ID del usuario a editar.
	 * @param {Partial<Gardener>} newData - Objeto con los campos a modificar.
	 * @returns {Gardener | null} El objeto actualizado o null si no se encontró.
	 */
	static updateByID = (
		id: string,
		newData: Partial<Gardener>
	): Gardener | null => {
		// Obtener todos los jardineros
		const gardeners = this.getAll();
		// Obtener el index del jaridnero por el id ingresado
		const index = gardeners.findIndex((g) => g.id === id);

		// Validación
		if (index === -1) return null; // No encontrado

		// Combinar los datos viejos con los nuevos
		gardeners[index] = { ...gardeners[index]!, ...newData };

		// Guardar lista editada
		this.save(gardeners);
		// Devolver jardinero editado
		return gardeners[index];
	};

	/**
	 * Elimina un jardinero de la base de datos.
	 * @param {string} id - ID del usuario a eliminar.
	 * @returns {boolean} true si se eliminó, false si el ID no existía.
	 */
	static deleteByID = (id: string): boolean => {
		// Obtener todos los jardineros
		const gardeners = this.getAll();
		// Obtener la longitud original del array
		const initialLength = gardeners.length;

		// Filtrar: todos los que NO tengan ese email
		const filteredGardeners = gardeners.filter((g) => g.id !== id);

		// Validación
		if (filteredGardeners.length === initialLength) {
			return false; // No se eliminó nada (no existía)
		}

		// Guardar nueva lista
		this.save(filteredGardeners);
		// Devolver true
		return true;
	};

	/**
	 * Método privado para obtener la lista de jardineros y el índice del usuario específico.
	 * Centraliza la búsqueda inicial que se repite en todos los métodos de huerta.
	 * @param {string} gardenerId
	 * @returns {{gardeners: Gardener[], index: number}}
	 */
	private static getGardenerContext = (gardenerId: string) => {
		const gardeners = this.getAll();
		const index = gardeners.findIndex((g) => g.id === gardenerId);
		return { gardeners, index };
	};

	// ------------------------
	// LÓGICA DE LA HUERTA
	// ------------------------

	/**
	 * Método auxiliar para encontrar una planta específica dentro de la huerta de un jardinero.
	 * @param {string} gardenerId
	 * @param {string} plantId
	 * @returns {UserPlant | undefined}
	 */
	static getPlantInGarden = (
		gardenerId: string,
		plantId: string
	): UserPlant | undefined => {
		// Obtener jaridnero por id
		const gardener = this.getById(gardenerId);

		// Si el jardinero no existe o no tiene huerta, devolver undefined
		if (!gardener || !gardener.myPlants) return undefined;

		// Devolver la planta segun id ingresado
		return gardener.myPlants.find((p) => p.plantId === plantId);
	};

	/**
	 * Agrega una nueva planta a la colección personal de un jardinero.
	 * @param {string} gardenerId - ID del jardinero dueño de la huerta.
	 * @param {string} plantId - ID de la planta (referencia al catálogo).
	 * @returns {boolean}
	 */
	static addPlantToGarden = (
		gardenerId: string,
		plantId: string
	): boolean => {
		// Usar función auxiliar para evitar duplicados
		if (this.getPlantInGarden(gardenerId, plantId)) return false;

		// Obtener todos los jardineros y el indice
		const { gardeners, index } = this.getGardenerContext(gardenerId);

		// Validación si no se encuentra
		if (index === -1) return false;

		// Validación para agregar el array de plantas
		// ! -> al final: Operador de aserción de no nulidad
		if (!gardeners[index]!.myPlants) {
			gardeners[index]!.myPlants = [];
		}

		// Crear entrada de planta
		const newEntry: UserPlant = {
			plantId,
			plantedAt: new Date().toISOString(),
			status: 'creciendo',
		};

		// Agregar la entrada al array de plantas
		gardeners[index]!.myPlants.push(newEntry);
		// Guardar los cambios
		this.save(gardeners);
		// Devolver verdadero
		return true;
	};

	/**
	 * Cambia el estado de un cultivo (ej: de 'creciendo' a 'listo').
	 * @param {string} gardenerId
	 * @param {string} plantId
	 * @param {string} newStatus
	 * @returns {boolean}
	 */
	static updateGardenStatus = (
		gardenerId: string,
		plantId: string,
		newStatus: 'listo' | 'cosechado'
	): boolean => {
		// Validación -> Usar la función auxiliar para ver si la planta existe
		if (!this.getPlantInGarden(gardenerId, plantId)) return false;

		// Obtener todos los jardineros y el indice
		const { gardeners, index } = this.getGardenerContext(gardenerId);
		// Validación si no se encuentra
		if (index === -1) return false;

		// Buscar la planta dentro del array del jardinero
		const plantReference = gardeners[index]!.myPlants.find(
			(p) => p.plantId === plantId
		);

		// Si se encuentra
		if (plantReference) {
			// Editar el status
			plantReference.status = newStatus;
			// Guardar los cambios
			this.save(gardeners);
			return true;
		}

		// Si no se encuentra
		return false;
	};

	/**
	 * Remueve una planta de la huerta del jardinero.
	 * @param {string} gardenerId
	 * @param {string} plantId
	 * @returns {boolean}
	 */
	static removePlantFromGarden = (
		gardenerId: string,
		plantId: string
	): boolean => {
		// Validación: Si no existe, cortar proceso
		if (!this.getPlantInGarden(gardenerId, plantId)) return false;

		// Obtener todos los jardineros y el indice
		const { gardeners, index } = this.getGardenerContext(gardenerId);

		// Validación si no se encuentra
		if (index === -1) return false;

		// Filtrar la planta
		gardeners[index]!.myPlants = gardeners[index]!.myPlants.filter(
			(p) => p.plantId !== plantId
		);
		
		// Guardar cambios
		this.save(gardeners);
		// Devolver verdadero
		return true;
	};
}
