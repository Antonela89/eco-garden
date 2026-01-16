// Importación de módulos
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
// Importación de Tipos
import { Gardener, CropBatch, PlantInstance } from '../types/gardener.js';
// Importación de funciones auxiliares
import { readJSON, writeJSON } from '../utils/fileHandle.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
	// MÉTODOS DE LECTURA
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

	// ---------------------------
	// LÓGICA DE JARDINERO - CRUD
	// ---------------------------
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
	 * Reemplazar los datos de un jardinero con un nuevo objeto completo.
	 * Mantiene campos inmutables como 'id' y 'role'.
	 * @param {string} id - ID del usuario a editar.
	 * @param {Gardener} fullNewData - El objeto completo con los nuevos datos.
	 * @returns {Gardener | null}
	 */
	static updateByID = (
		id: string,
		fullNewData: Gardener
	): Gardener | null => {
		const gardeners = this.getAll();
		const index = gardeners.findIndex((g) => g.id === id);
		if (index === -1) return null;

		const originalUser = gardeners[index]!;

		// Reemplazar el objeto, pero preservar campos que no deben cambiar
		gardeners[index] = {
			...fullNewData,
			id: originalUser.id, // El ID nunca cambia
			role: originalUser.role, // El rol no se edita aquí
			myPlants: originalUser.myPlants, // La huerta se gestiona por separado
		};

		this.save(gardeners);
		return gardeners[index]!;
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

	// ---------------------------
	//  MÉTODOS PRIVADOS (DRY)
	// ---------------------------

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
	 * Añadir un nuevo lote de cultivo a la huerta de un jardinero.
	 * @param {string} gardenerId - ID del jardinero.
	 * @param {object} batchData - Datos del lote (plantId, quantity, notes).
	 * @returns {CropBatch | null} El lote creado o null si falla.
	 */
	static addCropBatch = (
		gardenerId: string,
		batchData: { plantId: string; quantity: number; notes?: string }
	): CropBatch | null => {
		const { gardeners, index } = this.getGardenerContext(gardenerId);
		if (index === -1) return null;

		// Crear las instancias individuales
		const instances: PlantInstance[] = [];
		for (let i = 0; i < batchData.quantity; i++) {
			instances.push({
				instanceId: crypto.randomUUID(),
				status: 'germinando',
			});
		}

		// Crear el nuevo lote
		const newBatch: CropBatch = {
			batchId: crypto.randomUUID(),
			plantId: batchData.plantId,
			plantedAt: new Date().toISOString(),
			instances: instances,
		};

		// Validación: Añadir 'notes' solo si existe y tiene contenido
		if (batchData.notes) {
			newBatch.notes = batchData.notes;
		}

		// Añadir el lote a la huerta del usuario
		if (!gardeners[index]!.myPlants) {
			gardeners[index]!.myPlants = [];
		}
		gardeners[index]!.myPlants.push(newBatch);

		this.save(gardeners);
		return newBatch;
	};

	/**
	 * Actualizar el estado de una instancia de planta específica dentro de un lote.
	 * @param {string} gardenerId
	 * @param {string} batchId
	 * @param {string} instanceId
	 * @param {PlantInstance['status']} newStatus
	 * @returns {boolean}
	 */
	static updateInstanceStatus = (
		gardenerId: string,
		batchId: string,
		instanceId: string,
		newStatus: PlantInstance['status']
	): boolean => {
		const { gardeners, index } = this.getGardenerContext(gardenerId);
		if (index === -1) return false;

		// Encontrar el lote correcto
		const batch = gardeners[index]!.myPlants.find(
			(b) => b.batchId === batchId
		);
		if (!batch) return false;

		// Encontrar la instancia correcta dentro del lote
		const instance = batch.instances.find(
			(i) => i.instanceId === instanceId
		);
		if (!instance) return false;

		// Actualizar el estado
		instance.status = newStatus;
		this.save(gardeners);
		return true;
	};

	/**
	 * Eliminar un lote de cultivo completo de la huerta.
	 * @param {string} gardenerId
	 * @param {string} batchId
	 * @returns {boolean}
	 */
	static removeCropBatch = (gardenerId: string, batchId: string): boolean => {
		const { gardeners, index } = this.getGardenerContext(gardenerId);
		if (index === -1) return false;

		const initialLength = gardeners[index]!.myPlants.length;

		// Filtrar para quitar el lote por su batchId
		gardeners[index]!.myPlants = gardeners[index]!.myPlants.filter(
			(b) => b.batchId !== batchId
		);

		if (gardeners[index]!.myPlants.length === initialLength) return false;

		this.save(gardeners);
		return true;
	};
}
