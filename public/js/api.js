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

export const getPlantById = async (id) => {
    const response = await fetch(`${API_URL}/plants/${id}`);
    if (!response.ok) throw new Error('Planta no encontrada');
    return response.json();
};

// ==========================================
//    FUNCIONES DE ADMINISTRADOR (PROTEGIDAS)
// ==========================================

/**
 * Crear una nueva especie en el catálogo maestro.
 * @param {object} plantData - Objeto con todos los datos de la nueva planta.
 * @returns {Promise<any>}
 */
export const createPlant = async (plantData) => {
    const token = localStorage.getItem('token'); // Asumimos que el admin está logueado
    const response = await fetch(`${API_URL}/plants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(plantData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la planta');
    }
    return response.json();
};

/**
 * Actualizar los datos de una especie existente en el catálogo.
 * @param {string} id - El ID de la planta a modificar.
 * @param {object} plantData - Objeto con los campos a actualizar.
 * @returns {Promise<any>}
 */
export const updatePlant = async (id, plantData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/plants/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(plantData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la planta');
    }
    return response.json();
};

/**
 * Eliminar una especie del catálogo maestro.
 * @param {string} id - El ID de la planta a eliminar.
 * @returns {Promise<any>}
 */
export const deletePlant = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/plants/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la planta');
    }
    return response.json();
};