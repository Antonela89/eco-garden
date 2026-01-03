const API_URL = 'http://localhost:3000/api'; // URL del backend

/**
 * Función para registrar un nuevo usuario.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>}
 */
export const registerUser = async (username, email, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            username, 
            email, 
            password,
            role: 'gardener' 
        })
    });

    // Zod nos devolverá un 400 con los errores
    if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors[0].mensaje : errorData.message);
    }
    
    if (!response.ok) {
        throw new Error('No se pudo completar el registro.');
    }

    return response.json();
};

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
 * Obtener la huerta personal del usuario. Requiere token.
 * @returns {Promise<any>}
 */
export const getMyGarden = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/gardener/garden`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('No se pudo cargar la huerta.');
    return response.json();
};

/**
 * Obtener el perfil del usuario. Requiere token.
 * @returns {Promise<any>}
 */
export const getProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/gardener/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('No se pudo cargar el perfil.');
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