// Importación de modulo
import fs from 'fs';

/**
 * Lee un archivo físico en formato JSON y transforma su contenido en un arreglo de objetos.
 * @param {string} path - Ruta absoluta del archivo a consultar.
 * @returns {any[]} Arreglo con los datos procesados o un arreglo vacío en caso de error.
 */
export const readJSON = (path: string): any[] => {
	try {
		// Leer el contenido del archivo de forma sincrónica
		const data = fs.readFileSync(path, 'utf-8');
		// Convertir la cadena de texto en un objeto de JavaScript
		return JSON.parse(data);
	} catch (error) {
		// Retornar un arreglo vacío si el archivo no existe o no se puede leer
		return [];
	}
};

/**
 * Persiste información en un archivo físico transformando los datos a formato JSON.
 * @param {string} path - Ruta absoluta donde se guardará la información.
 * @param {any[]} data - Arreglo de objetos a serializar.
 */
export const writeJSON = (path: string, data: any[]): void => {
	// Convertir el objeto a string con una indentación de 2 espacios para mayor legibilidad
	const jsonString = JSON.stringify(data, null, 2);

	// Escribir el archivo en el disco de forma sincrónica
	fs.writeFileSync(path, jsonString);
};
