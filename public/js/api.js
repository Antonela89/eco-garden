const API_URL = 'http://localhost:3000/api'; // URL del backend

/**
 * Función para realizar el login de un usuario.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<any>}
 */
export const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        throw new Error('Error en las credenciales');
    }

    return response.json();
};

/**
 * Función para obtener el catálogo de plantas.
 * @returns {Promise<any>}
 */
export const getPlants = async () => {
    const response = await fetch(`${API_URL}/plants`);
    return response.json();
};