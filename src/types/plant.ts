/**
 * Enum: Dificultad
 * Clasificación de la complejidad de cultivo de cada especie.
 */
export enum Dificultad {
    FACIL = "Fácil",
    MEDIA = "Media",
    DIFICIL = "Difícil"
}

/**
 * Interface: DiasCosecha
 * Estructura para definir el tiempo estimado de maduración.
 */
export interface DiasCosecha {
    min: number; // Tiempo mínimo para empezar a cosechar
    max: number; // Tiempo máximo recomendado de permanencia
}

/**
 * Interface: Distancia
 * Define el marco de plantación necesario para el correcto desarrollo.
 */
export interface Distancia {
    entrePlantas: number; // Espacio en cm entre cada ejemplar
    entreLineas: number;  // Espacio en cm entre surcos o filas
}

/**
 * Interface: Plant
 * Modelo de datos exhaustivo para una especie del catálogo de Eco-Garden.
 */
export interface Plant {
    id: string;             // Identificador amigable o 'slug' (ej: "tomate")
    nombre: string;         // Nombre común de la especie
    familia: string;        // Familia botánica (ej: Solanáceas)
    siembra: string[];      // Listado de meses aptos para la siembra
    metodo: string[];       // Técnicas de siembra (ej: "Almácigo", "Directa")
    diasCosecha: DiasCosecha; // Rango temporal de maduración
    distancia: Distancia;     // Requerimientos de espacio
    asociacion: string[];   // Plantas "amigas" que benefician el crecimiento
    rotacion: string[];     // Cultivos recomendados para el siguiente ciclo
    toleranciaSombra: boolean; // Indica si la especie requiere sol pleno o no
    aptoMaceta: boolean;       // Filtro clave para huertas urbanas/balcones
    dificultad: Dificultad;    // Nivel de experiencia requerido
    clima: string;             // Requerimientos climáticos específicos
    imagen: string;            // URL de la imagen (alojada en Cloudinary)
}