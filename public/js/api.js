const API_URL = 'http://localhost:3000/api'; // URL del backend

// -----------------------------------
// FUNCIONES AUXILIARES (HELPERS)
// -----------------------------------

/**
 * Crear las cabeceras (headers) para una petición a la API.
 * Incluye el token de autorización si está disponible.
 * @param {boolean} [isProtected=false] - Indicar si la ruta requiere autenticación.
 * @returns {HeadersInit}
 */
const createHeaders = (isProtected = false) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (isProtected) {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Acción no autorizada. Se requiere iniciar sesión.');
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// -----------------------------------
// FUNCIONES DE AUTENTICACIÓN
// -----------------------------------

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
        headers:  createHeaders(),
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
        headers: createHeaders(),
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        throw new Error('Error en las credenciales');
    }

    return response.json();
};

// ------------------------------------
// FUNCIONES DE JARDINERO (PROTEGIDAS)
// ------------------------------------

/**
 * Añadir una planta a la huerta personal del usuario.
 * @param {string} plantId - El ID de la planta a añadir.
 * @returns {Promise<any>}
 */
export const addPlantToGarden = async (plantId) => {
    const response = await fetch(`${API_URL}/gardener/garden`, {
        method: 'POST',
        headers: createHeaders(true), // Ruta protegida
        body: JSON.stringify({ plantId })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo añadir la planta.');
    }

    return response.json();
};

/**
 * Obtener la huerta personal del usuario. Requiere token.
 * @returns {Promise<any>}
 */
export const getMyGarden = async () => {
    const response = await fetch(`${API_URL}/gardener/garden`, {
        headers: createHeaders(true) // Ruta protegida
    });
    if (!response.ok) throw new Error('No se pudo cargar la huerta.');
    return response.json();
};

/**
 * Actualizar el estado de un cultivo en la huerta personal.
 * @param {string} plantId - El ID de la planta a actualizar.
 * @param {'creciendo' | 'listo' | 'cosechado'} status - El nuevo estado.
 * @returns {Promise<any>}
 */
export const updatePlantStatusInGarden = async (plantId, status) => {
    const response = await fetch(`${API_URL}/gardener/garden/status`, {
        method: 'PATCH',
        headers: createHeaders(true), // Ruta protegida
        body: JSON.stringify({ plantId, status })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo actualizar el estado.');
    }
    return response.json();
};

/**
 * Eliminar una planta de la huerta personal.
 * @param {string} plantId - El ID de la planta a eliminar.
 * @returns {Promise<any>}
 */
export const deletePlantFromGarden = async (plantId) => {
    const response = await fetch(`${API_URL}/gardener/garden/${plantId}`, {
        method: 'DELETE',
        headers: createHeaders(true) // Ruta protegida
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo eliminar la planta.');
    }
    return response.json();
};

/**
 * Obtener el perfil del usuario. Requiere token.
 * @returns {Promise<any>}
 */
export const getProfile = async () => {
    const response = await fetch(`${API_URL}/gardener/profile`, {
        headers: createHeaders(true) // Ruta protegida
    });
    if (!response.ok) throw new Error('No se pudo cargar el perfil.');
    return response.json();
};

/**
 * Editarr el perfil del usuario. Requiere token.
 * @returns {Promise<any>}
 */
export const updateProfile = async (dataToUpdate) => {
    const response = await fetch(`${API_URL}/gardener/profile`, {
        method: 'PUT', 
        headers: createHeaders(true),
        body: JSON.stringify(dataToUpdate)
    });
    if (!response.ok) throw new Error('No se pudo editar el perfil.');
    return response.json();
};


// ------------------------------------
//  FUNCIONES DEL CATÁLOGO (PÚBLICAS)
// ------------------------------------

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

// ------------------------------------
//  FUNCIONES DE ADMINISTRADOR (PROTEGIDAS)
// ------------------------------------

/**
 * Crear una nueva especie en el catálogo maestro.
 * @param {object} plantData - Objeto con todos los datos de la nueva planta.
 * @returns {Promise<any>}
 */
export const createPlant = async (plantData) => {
    const response = await fetch(`${API_URL}/plants`, {
        method: 'POST',
        headers: createHeaders(true),
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
    const response = await fetch(`${API_URL}/plants/${id}`, {
        method: 'PATCH',
        headers: createHeaders(true),
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
    const response = await fetch(`${API_URL}/plants/${id}`, {
        method: 'DELETE',
        headers: createHeaders(true)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la planta');
    }
    return response.json();
};