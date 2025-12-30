// evitar errores de tipeo
export enum Dificultad {
    FACIL = "Fácil",
    MEDIA = "Media",
    DIFICIL = "Difícil"
}

export interface DiasCosecha {
    min: number;
    max: number;
}

export interface Distancia {
    entrePlantas: number;
    entreLineas: number;
}

export interface Plant {
    id: string;
    nombre: string;
    familia: string;
    siembra: string[];      // Array de meses
    metodo: string[];      // Array de métodos 
    diasCosecha: DiasCosecha;
    distancia: Distancia;
    asociacion: string[];
    rotacion: string[];
    toleranciaSombra: boolean;
    aptoMaceta: boolean;
    dificultad: Dificultad; // Enum 
    clima: string;
    imagen: string;         // URL de Cloudinary
}