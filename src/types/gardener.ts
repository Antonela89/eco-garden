/**
 * Enum: Role
 * Define los niveles de acceso permitidos en el sistema.
 * El uso de Enums garantiza que solo se utilicen valores válidos ("admin" o "gardener"),
 * evitando errores de tipeo en la lógica de permisos.
 */
export enum Role {
    ADMIN = "admin",
    GARDENER = "gardener"
}

/**
 * Interface: UserPlant
 * Representa la instancia de un cultivo dentro de la huerta personal de un usuario.
 * No contiene toda la info técnica, sino solo la referencia y el estado actual.
 */
export interface UserPlant {
    plantId: string;     // ID que vincula con el catálogo maestro (plants.json)
    plantedAt: string;    // Fecha en formato ISO string
    status: 'creciendo' | 'listo' | 'cosechado'; // Estados posibles del ciclo de vida
} 

/**
 * Interface: Gardener
 * Modelo de datos principal para el usuario (Jardinero).
 */
export interface Gardener {
	id: string;           // Identificador único (UUID)
	username: string;     // Nombre de usuario para mostrar en la interfaz
    email: string;        // Correo electrónico (identificador para login)
	role: Role;           // Rol asignado (Admin o Jardinero)
	password: string;     // Contraseña almacenada en formato Hash (encriptada)
	myPlants: UserPlant[]; // Colección de cultivos que posee en su parcela
}

