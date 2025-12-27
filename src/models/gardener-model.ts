// Importación de modulos para lectura de archivos
import fs from 'fs';
import path from 'path';
import crypto from 'crypto'; // Para generar IDs únicos
// Importación de interface
import { Gardener } from '../types/gardener.js';

// Ruta de archivo json (BBDD)
const pathFile = path.join(__dirname, '../data/gardeners.json');

// Encapsulamiento de métodos
export class GardenerModel {
	// Lectura de archivo -> obtener datos
	static getAll = async (): Promise<Gardener[]> => {
		try {
			const data = fs.readFileSync(pathFile, 'utf-8');
			// Formateo
			return JSON.parse(data);
		} catch (error) {
			return [];
		}
	};

	// Guardado de información
	static save = (list: Gardener[]): string => {
		try {
			fs.writeFileSync(pathFile, JSON.stringify(list, null, 2));
			return 'Jardineros guardados exitosamente.';
		} catch (error) {
			throw new Error('Error al escribir en la base de datos JSON');
		}
	};

    // Buscar por ID -> obtener perfil, editar, eliminar
    static getById = async (id: string): Promise<Gardener | undefined> => {
        const gardeners = await this.getAll();
        return gardeners.find((g) => g.id === id);
    };

	// Buscar por Email -> Login y Registro
	static getByEmail = async (
		email: string
	): Promise<Gardener | undefined> => {
		const gardeners = await this.getAll();
		return gardeners.find((g) => g.email === email);
	};

	// Agregar Jardinero
	static create = async (dataGardener: Omit<Gardener, 'id'>): Promise<Gardener> => {
		const gardeners = await this.getAll();

        const newGardener: Gardener = { ...dataGardener, id: crypto.randomUUID() };
		gardeners.push(newGardener);
		this.save(gardeners);
		return newGardener;
	};

	// Editar Jardinero
	static updateByID = async (
		id: string,
		newData: Partial<Gardener>
	): Promise<Gardener | null> => {
		const gardeners = await this.getAll();
		const index = gardeners.findIndex((g) => g.id === id);

		if (index === -1) return null; // No encontrado

		// Combinar los datos viejos con los nuevos
		gardeners[index] = { ...gardeners[index]!, ...newData };

		this.save(gardeners);
		return gardeners[index]; // devuelve jardinero editado
	};

	// Eliminar Jardinero
	static deleteByID = async (id: string): Promise<boolean> => {
		const gardeners = await this.getAll();
		const initialLength = gardeners.length;

		// Filtrar: odos los que NO tengan ese email
		const filteredGardeners = gardeners.filter((g) => g.id !== id);

		if (filteredGardeners.length === initialLength) {
			return false; // No se eliminó nada (no existía)
		}

		this.save(filteredGardeners);
		return true;
	};
}

export default GardenerModel;
