// Enum para roles -> evita errores de tipeo
export enum Role {
    ADMIN = "admin",
    GARDENER = "gardener"
}

// Definición de datos importantes para guardar plantas
export interface UserPlant {
    plantId: string;      // ID que hace referencia al plants.json
    plantedAt: string;    // Fecha en formato ISO string
    status: 'creciendo' | 'listo' | 'cosechado';
}

export interface Gardener {
	id: string;
	username: string;
    email: string,
	role: Role; // enum
	password: string;
	misPlantas: UserPlant[]; // Array de objetos con la interfaz UserPlant
}

