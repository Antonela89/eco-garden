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

    for (const key in formattedData) {
        // Verificar si el valor es un string y no es una clave protegida (como email o id)
        if (typeof formattedData[key] === 'string' && key !== 'email' && key !== 'id') {
            formattedData[key] = capitalize(formattedData[key]);
        }
    }

    return formattedData;
};