/**
 * Transforma un texto para que la primera letra sea mayúscula y el resto minúsculas.
 * @param {string} text - Cadena de texto a formatear.
 * @returns {string} Texto formateado.
 */
export const capitalize = (text: string): string => {
    if (!text || typeof text !== 'string') return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Recorre las propiedades de un objeto y capitaliza sus valores si son cadenas de texto.
 * Mantener las claves (keys) y valores no textuales sin cambios.
 * @param {any} data - Objeto de entrada (ej. req.body).
 * @returns {any} Objeto con sus valores de texto formateados.
 */
export const formatInputData = (data: any): any => {
    const formattedData = { ...data };

    // Definir una lista de claves que NO deben ser modificadas bajo ningún concepto
    const protectedFields = ['password', 'email', 'id', 'token', 'imagen', 'role'];

    for (const key in formattedData) {
        // Validar que sea un string y que la clave no esté en la lista protegida
        if (typeof formattedData[key] === 'string' && !protectedFields.includes(key)) {
            formattedData[key] = capitalize(formattedData[key]);
        }
    }

    return formattedData;
};

/**
 * Transformar un texto a minúsculas, eliminar acentos y reemplazar espacios por guiones.
 * Útil para generar IDs amigables (slugs).
 * @param {string} text - Cadena de texto a procesar.
 * @returns {string} Texto normalizado en formato slug.
 */
export const slugify = (text: string): string => {
    if (!text || typeof text !== 'string') return text;

    return text
        .trim()                 // Eliminar espacios al inicio y al final
        .toLowerCase()          // Convertir todo a minúsculas
        .normalize("NFD")       // Descomponer caracteres especiales (acentos)
        .replace(/[\u0300-\u036f]/g, "") // Eliminar los acentos mediante Regex
        .replace(/\s+/g, "-")   // Reemplazar todos los espacios por guiones
        .replace(/[^\w-]+/g, ""); // Eliminar cualquier caracter que no sea letra, número o guion
};

/**
 * Recorrer un objeto y aplicar el formato de minúsculas (slug) únicamente al campo ID.
 * @param {any} data - Objeto con los datos de entrada.
 * @returns {any} Objeto con el ID formateado.
 */
export const formatIdData = (data: any): any => {
    const formattedData = { ...data };

    // Validar si existe la clave 'id' y si su valor es una cadena de texto
    if (formattedData.id && typeof formattedData.id === 'string') {
        formattedData.id = slugify(formattedData.id);
    }

    return formattedData;
};