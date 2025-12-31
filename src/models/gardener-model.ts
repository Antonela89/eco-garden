import path from 'path';;
import crypto from 'crypto';
import { Gardener, UserPlant } from '../types/gardener';
import { readJSON, writeJSON } from '../utils/fileHandle';

// Ruta de archivo json (BBDD)
const pathFile = path.join(__dirname, '../data/gardeners.json');

// Encapsulamiento de métodos
export class GardenerModel {
	// LÓGICA DE JARDINERO
	// Lectura de archivo -> obtener datos
	static getAll = (): Gardener[] => {
		return readJSON(pathFile);
	};

	// Guardado de información
	static save = (list: Gardener[]): void => {
		writeJSON(pathFile, list);
	};
	// Buscar por ID -> obtener perfil, editar, eliminar
	static getById = (id: string): Gardener | undefined => {
		const gardeners = this.getAll();
		return gardeners.find((g) => g.id === id);
	};

	// Buscar por Email -> Login y Registro
	static getByEmail = (email: string): Gardener | undefined => {
		const gardeners = this.getAll();
		return gardeners.find((g) => g.email === email);
	};

	// Agregar Jardinero
	static create = (dataGardener: Omit<Gardener, 'id'>): Gardener => {
		const gardeners = this.getAll();

		const newGardener: Gardener = {
			...dataGardener,
			id: crypto.randomUUID(),
		};
		gardeners.push(newGardener);
		this.save(gardeners);
		return newGardener;
	};

	// Editar Jardinero
	static updateByID = (
		id: string,
		newData: Partial<Gardener>
	): Gardener | null => {
		const gardeners = this.getAll();
		const index = gardeners.findIndex((g) => g.id === id);

		if (index === -1) return null; // No encontrado

		// Combinar los datos viejos con los nuevos
		gardeners[index] = { ...gardeners[index]!, ...newData };

		this.save(gardeners);
		return gardeners[index]; // devuelve jardinero editado
	};

	// Eliminar Jardinero
	static deleteByID = (id: string): boolean => {
		const gardeners = this.getAll();
		const initialLength = gardeners.length;

		// Filtrar: todos los que NO tengan ese email
		const filteredGardeners = gardeners.filter((g) => g.id !== id);

		if (filteredGardeners.length === initialLength) {
			return false; // No se eliminó nada (no existía)
		}

		this.save(filteredGardeners);
		return true;
	};

	// LÓGICA DE HUERTA

	// AGREGAR PLANTA A LA HUERTA
	static addPlantToHuerta = (
		gardenerId: string,
		plantId: string
	): boolean => {
		const gardeners = this.getAll();
		const index = gardeners.findIndex((g) => g.id === gardenerId);
		if (index === -1) return false;

		const newEntry: UserPlant = {
			plantId,
			plantedAt: new Date().toISOString(),
			status: 'creciendo',
		};

		gardeners[index]!.misPlantas.push(newEntry);
		this.save(gardeners);
		return true;
	};

	// EDITAR ESTADO DE UNA PLANTA EN LA HUERTA
	static updateHuertaStatus = (
		gardenerId: string,
		plantId: string,
		newStatus: 'listo' | 'cosechado'
	): boolean => {
		const gardeners = this.getAll();
		const gIndex = gardeners.findIndex((g) => g.id === gardenerId);
		if (gIndex === -1) return false;

		// Buscar la planta dentro del array del usuario
		const pIndex = gardeners[gIndex]!.misPlantas.findIndex(
			(p) => p.plantId === plantId
		);
		if (pIndex === -1) return false;

		gardeners[gIndex]!.misPlantas[pIndex]!.status = newStatus;
		this.save(gardeners);
		return true;
	};

	// ELIMINAR PLANTA DE LA HUERTA
	static removePlantFromHuerta = (
		gardenerId: string,
		plantId: string
	): boolean => {
		const gardeners = this.getAll();
		const index = gardeners.findIndex((g) => g.id === gardenerId);
		if (index === -1) return false;

		gardeners[index]!.misPlantas = gardeners[index]!.misPlantas.filter(
			(p) => p.plantId !== plantId
		);
		this.save(gardeners);
		return true;
	};
}

export default GardenerModel;
