/**
 * Transformar un texto para que la primera letra sea mayúscula y el resto minúsculas.
 */
export declare function capitalize(text: string): string;

/**
 * Recorrer las propiedades de un objeto y capitalizar sus valores si son cadenas de texto.
 */
export declare function formatInputData(data: any): any;

/**
 * Transformar un texto a minúsculas, eliminar acentos y reemplazar espacios por guiones.
 */
export declare function slugify(text: string): string;

/**
 * Recorrer un objeto y aplicar el formato de minúsculas (slug) únicamente al campo ID.
 */
export declare function formatIdData(data: any): any;

/**
 * Normalizar un texto: convertir a minúsculas y quitar acentos.
 */
export declare function normalizeText(text: string): tring;