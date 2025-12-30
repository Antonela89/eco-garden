import path from 'path';
import { Plant } from '../types/plant';
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

	// traer por id
	static getById = (id: string): Plant | undefined => {
		const plants = this.getAll();
		return plants.find((p) => p.id === id);
	};

	// --- MÉTODOS DE ADMIN ---

	static create = (plantData: Plant): Plant => {
		const plants = this.getAll();
		plants.push(plantData);

		this.save(plants);
		return plantData;
	};

	static update = (id: string, newData: Partial<Plant>): Plant | null => {
		const plants = this.getAll();
		const index = plants.findIndex((p) => p.id === id);
		if (index === -1) return null;

		plants[index] = { ...plants[index]!, ...newData };

		this.save(plants);
		return plants[index]!;
	};

	static delete = (id: string): boolean => {
		const plants = this.getAll();
		const filtered = plants.filter((p) => p.id !== id);
		if (filtered.length === plants.length) return false;
		this.save(filtered);
		return true;
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
}
