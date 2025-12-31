import fs from 'fs';

// Leer json
export const readJSON = (path: string): any[] => {
    try {
        const data = fs.readFileSync(path, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return []; // Si no existe el archivo, devuelve array vacío
    }
};

// Guardar información
export const writeJSON = (path: string, data: any[]): void => {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
};