// Api Desarrollo
// const API_URL = 'http://localhost:3000/api';

// Api Produccion
const API_URL = 'https://ecogarden-w8ks.onrender.com/api';

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
		if (!token)
			throw new Error(
				'Acción no autorizada. Se requiere iniciar sesión.'
			);
		headers['Authorization'] = `Bearer ${token}`;
	}
	return headers;
};

/**
 * Clase de error personalizada para problemas de autenticación.
 */
class AuthError extends Error {
	constructor(message) {
		super(message);
		this.name = 'AuthError';
	}
}

/**
 * Función centralizada para manejar respuestas de la API.
 * Si detecta un 401, limpia la sesión y redirige al login.
 * @param {Response} response - La respuesta del fetch.
 */
const handleResponse = async (response) => {
	// Si el token es inválido o expiró
	if (response.status === 401) {
		// Limpiar credenciales
		localStorage.removeItem('token');
		localStorage.removeItem('user');

		
		throw new AuthError('Sesión expirada');
	}

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(
			errorData.message || 'Ocurrió un error en la petición.'
		);
	}

	return response.json();
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
		headers: createHeaders(),
		body: JSON.stringify({
			username,
			email,
			password,
			role: 'gardener',
		}),
	});

	// Zod nos devolverá un 400 con los errores
	if (response.status === 400) {
		const errorData = await response.json();
		throw new Error(
			errorData.errors ? errorData.errors[0].mensaje : errorData.message
		);
	}

	if (!response.ok) {
		throw new Error('No se pudo completar el registro.');
	}

	return handleResponse(response);
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
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		throw new Error('Error en las credenciales');
	}

	return handleResponse(response);
};

// ------------------------------------
// FUNCIONES DE JARDINERO (PROTEGIDAS)
// ------------------------------------

/**
 * Añadir un nuevo lote de cultivo a la huerta personal.
 * @param {object} batchData - Datos del lote (plantId, quantity, notes).
 * @returns {Promise<any>}
 */
export const addCropBatch = async (batchData) => {
	const response = await fetch(`${API_URL}/gardener/garden/batch`, {
		method: 'POST',
		headers: createHeaders(true),
		body: JSON.stringify(batchData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'No se pudo añadir el lote.');
	}
	return handleResponse(response);
};

/**
 * Obtener la huerta personal del usuario. Requiere token.
 * @returns {Promise<any>}
 */
export const getMyGarden = async () => {
	const response = await fetch(`${API_URL}/gardener/garden`, {
		headers: createHeaders(true), // Ruta protegida
		cache: 'no-cache',
	});
	if (!response.ok) throw new Error('No se pudo cargar la huerta.');
	return handleResponse(response);
};

/**
 * Actualizar el estado de una instancia de planta específica dentro de un lote.
 * @param {string} batchId - El ID del lote que contiene la instancia.
 * @param {string} instanceId - El ID de la instancia a actualizar.
 * @param {string} status - El nuevo estado ('germinando', 'creciendo', etc.).
 * @returns {Promise<any>}
 */
export const updateInstanceStatus = async (batchId, instanceId, status) => {
	const response = await fetch(`${API_URL}/gardener/garden/instance`, {
		method: 'PATCH',
		headers: createHeaders(true), // Ruta protegida
		body: JSON.stringify({ batchId, instanceId, status }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(
			errorData.message ||
				'No se pudo actualizar el estado de la instancia.'
		);
	}

	return handleResponse(response);
};

/**
 * Eliminar una planta de la huerta personal.
 * @param {string} batchId - El ID del cultivo a eliminar.
 * @returns {Promise<any>}
 */
export const deleteBatchFromGarden = async (batchId) => {
	const response = await fetch(
		`${API_URL}/gardener/garden/batch/${batchId}`,
		{
			method: 'DELETE',
			headers: createHeaders(true), // Ruta protegida
		}
	);

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'No se pudo eliminar la planta.');
	}
	return handleResponse(response);
};

/**
 * Obtener el perfil del usuario. Requiere token.
 * @returns {Promise<any>}
 */
export const getProfile = async () => {
	const response = await fetch(`${API_URL}/gardener/profile`, {
		headers: createHeaders(true), // Ruta protegida
		cache: 'no-cache',
	});
	if (!response.ok) throw new Error('No se pudo cargar el perfil.');
	return handleResponse(response);
};

/**
 * Editarr el perfil del usuario. Requiere token.
 * @returns {Promise<any>}
 */
export const updateProfile = async (dataToUpdate) => {
	const response = await fetch(`${API_URL}/gardener/profile`, {
		method: 'PUT',
		headers: createHeaders(true),
		body: JSON.stringify(dataToUpdate),
	});
	if (!response.ok) throw new Error('No se pudo editar el perfil.');
	return handleResponse(response);
};

// ------------------------------------
//  FUNCIONES DEL CATÁLOGO (PÚBLICAS)
// ------------------------------------

/**
 * Función para obtener el catálogo de plantas.
 * @returns {Promise<any>}
 */
export const getPlants = async () => {
	const response = await fetch(`${API_URL}/plants`, {
		cache: 'no-cache',
	});
	return handleResponse(response);
};

export const getPlantById = async (id) => {
	const response = await fetch(`${API_URL}/plants/${id}`, {
		cache: 'no-cache',
	});
	if (!response.ok) throw new Error('Planta no encontrada');
	return handleResponse(response);
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
		body: JSON.stringify(plantData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Error al crear la planta');
	}
	return handleResponse(response);
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
		body: JSON.stringify(plantData),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Error al actualizar la planta');
	}
	return handleResponse(response);
};

/**
 * Eliminar una especie del catálogo maestro.
 * @param {string} id - El ID de la planta a eliminar.
 * @returns {Promise<any>}
 */
export const deletePlant = async (id) => {
	const response = await fetch(`${API_URL}/plants/${id}`, {
		method: 'DELETE',
		headers: createHeaders(true),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Error al eliminar la planta');
	}
	return handleResponse(response);
};
