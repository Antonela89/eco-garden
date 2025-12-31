import * as path from 'path';;
import { Plant, Dificultad } from '../types/plant';
import { readJSON, writeJSON } from '../utils/fileHandle';

const pathFile = path.join(__dirname, '../data/plants.json');

export class PlantModel {
	// Traer todos
	static getAll = (): Plant[] => {
		return readJSON(pathFile);
	};

	// Guardado de información
	static save = (list: Plant[]): void => {
		writeJSON(pathFile, list);
	};

	// Traer por id
	static getById = (id: string): Plant | undefined => {
		const plants = this.getAll();
		return plants.find((p) => p.id === id);
	};

	// Lógica para filtrar por dificultad
	static getByDifficulty = (level: Dificultad): Plant[] => {
		const plants = this.getAll();
		// Filtrar las plantas cuyo campo 'dificultad' coincida con el level recibido
		return plants.filter((p) => p.dificultad === level);
	};

	// Lógica para saber si se puede plantar ahora
	static canBePlanted = (id: string): boolean => {
		const plant = this.getById(id);
		if (!plant) return false;

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
		const mesActual = meses[new Date().getMonth()]!;

		// flat() por si hay arreglos anidados (como en Repollo)
		return plant.siembra.flat().includes(mesActual);
	};

	// --- MÉTODOS DE ADMIN ---
	// Crear
	static create = (plantData: Plant): Plant => {
		const plants = this.getAll();
		plants.push(plantData);

		this.save(plants);
		return plantData;
	};

	// Modificar
	static update = (id: string, newData: Partial<Plant>): Plant | null => {
		const plants = this.getAll();
		const index = plants.findIndex((p) => p.id === id);
		if (index === -1) return null;

		plants[index] = { ...plants[index]!, ...newData };

		this.save(plants);
		return plants[index]!;
	};

	// Eliminar
	static delete = (id: string): boolean => {
		const plants = this.getAll();
		const filtered = plants.filter((p) => p.id !== id);
		if (filtered.length === plants.length) return false;
		this.save(filtered);
		return true;
	};
}
