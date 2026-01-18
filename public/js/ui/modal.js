import { createSowingCalendar, formatHarvestDays } from './helpers.js'

/**
 * Crear el contenido HTML para el modal de detalles de una planta.
 * @param {object} plant - El objeto completo de la planta.
 * @param {object|null} user - El objeto de usuario decodificado del token (o null si no está logueado).
 * @returns {string} - El string HTML para el interior del modal.
 */
export const createPlantDetailsContent = (plant, user) => {
	// Definir el contenido del footer dinámicamente según usuario
	const footerContent = user
		? `<!-- Usuario Logueado: Botón funcional -->
            <button id="add-to-garden-btn" data-plant-id="${plant.id}" 
                class="bg-eco-green-dark text-white font-bold px-6 py-2 rounded-md hover:bg-opacity-80 transition active:scale-95">
                <i class="fas fa-plus-circle mr-2"></i>Añadir a mi Huerta
            </button>`
		: `<!-- Visitante: Mensaje y botón para iniciar sesión -->
            <div class="text-center">
                <p class="mb-2">Inicia sesión para empezar a cultivar.</p>
                <button id="login-prompt-btn" class="bg-gray-500 text-white font-bold px-6 py-2 rounded-md">
                    Ingresar
                </button>
            </div>`;

	return `
            <!-- HEADER -->
            <header class="p-6 border-b dark:border-gray-700 flex justify-between items-start flex-shrink-0">
                <div>
                    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">${
						plant.nombre
					}</h2>
                    <p class="text-md text-gray-500">${plant.familia}</p>
                </div>
                <button class="js-close-modal text-3xl text-gray-400 hover:text-red-500 transition transform hover:rotate-90">
                    <i class="fas fa-times"></i>
                </button>
            </header>

            <!-- CUERPO DEL MODAL (Con scroll) -->
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-scroll flex-grow">
                <!-- Columna de Imagen y Badges -->
                <div>
                    <img src="${plant.imagen}" alt="${
		plant.nombre
	}" class="w-full h-64 object-cover rounded-lg shadow-md mb-4">
                    <div class="flex flex-wrap gap-2 text-sm">
                        <span class="font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">${
							plant.dificultad
						}</span>
                        <span class="font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">${
							plant.aptoMaceta ? 'Apto Maceta' : 'No Apto Maceta'
						}</span>
                        <span class="font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">${
							plant.toleranciaSombra
								? 'Tolera Sombra'
								: 'Requiere Sol'
						}</span>
                    </div>
                </div> 
                <!-- Columna de Detalles Técnicos -->
                <div>
                    <div class="mb-4">
                        <h4 class="font-bold text-lg mb-2 border-b dark:border-gray-600 pb-1">Siembra</h4>
                        <p><strong>Método:</strong> ${plant.metodo.join(
							', '
						)}</p>
                        ${createSowingCalendar(plant.siembra)}
                    </div>
                    <div class="mb-4">
                        <h4 class="font-bold text-lg mb-2 border-b dark:border-gray-600 pb-1">Cosecha y Espacio</h4>
                        <p><strong>Tiempo de Cosecha:</strong> ${formatHarvestDays(
							plant
						)} días</p>
                        <p><strong>Distancia:</strong> ${
							plant.distancia.entrePlantas
						} cm entre plantas, ${
		plant.distancia.entreLineas
	} cm entre líneas</p>
                    </div>
                    <div>
                        <h4 class="font-bold text-lg mb-2 border-b dark:border-gray-600 pb-1">Asociaciones y Rotación</h4>
                        <p><strong>Cultivos Amigos:</strong> ${plant.asociacion.join(
							', '
						)}</p>
                        <p><strong>Rotación Recomendada:</strong> ${plant.rotacion.join(
							', '
						)}</p>
                    </div>
                </div>
            </div>

            <!-- FOOTER FIJO -->
            <footer class="p-6 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 text-right mt-auto flex-shrink-0">
                ${footerContent}
            </footer>
    `;
};

/**
 * Crear el HTML para el modal de Login.
 * @returns {string}
 */
export const createLoginModalContent = () => {
	return `
        <header class="p-6 flex justify-between items-center border-b dark:border-gray-700">
            <h2 class="text-2xl font-bold text-eco-green-dark">Iniciar Sesión</h2>
            <button class="js-close-modal text-3xl text-gray-400 hover:text-red-500 transition transform hover:rotate-90">
                <i class="fas fa-times"></i>
            </button>
        </header>
        <div class="p-6">
            <form id="login-form" class="flex flex-col gap-4">
				<div class="relative group">
                    <label for="email" class="block text-sm font-medium text-eco-brown dark:text-gray-300">Email</label>
                    <div class="relative mt-1">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <i
                                class="fas fa-envelope text-gray-400 group-focus-within:text-eco-green-dark transition"></i>
                        </span>
                        <input type="email" id="email" name="email" required placeholder="tu@email.com"
                            class="mt-1 block w-full rounded-md px-3 py-2 bg-transparent border-2 pl-10 border-gray-200 focus:border-eco-green-dark focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-dark-surface dark:focus:border-eco-green-light";
">
                    </div>
                </div>
                <div class="relative group">
                    <label for="password"
                        class="block text-sm font-medium text-eco-brown dark:text-gray-300">Contraseña</label>
                    <div class="relative mt-1">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <i class="fas fa-lock text-gray-400 group-focus-within:text-eco-green-dark transition"></i>
                        </span>
                        <input type="password" id="password" name="password" required placeholder="••••••••"
                            class="mt-1 block w-full rounded-md px-3 py-2 bg-transparent border-2 pl-10 border-gray-200 focus:border-eco-green-dark focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-dark-surface dark:focus:border-eco-green-light">
                    </div>
                </div>

                <button type="submit"
                    class="w-full bg-eco-green-dark text-white py-2 rounded-md font-bold hover:bg-opacity-80 transition active:scale-95 mt-4">
                    Ingresar
                </button>


            </form>
            <p id="login-error-message" class="text-red-500 text-sm mt-4 text-center h-5"></p>
            <footer class="text-center mt-4 text-sm">
                <p>¿No tienes cuenta? <a href="/html/register.html" class="text-eco-green-dark font-bold hover:underline">Regístrate</a></p>
            </footer>
        </div>
    `;
};

/**
 * Crear el HTML para un modal de confirmación genérico.
 * Útil para acciones destructivas como eliminar.
 * @param {string} message - El mensaje o pregunta a mostrar.
 * @param {string} [confirmText='Confirmar'] - El texto del botón de confirmación.
 * @returns {string} El string HTML del modal.
 */
export const createConfirmModalContent = (
	message,
	confirmText = 'Confirmar',
	entityId = null
) => {
	return `
        <div class="p-8 text-center flex flex-col items-center gap-6">
            <i class="fas fa-exclamation-triangle text-4xl text-yellow-400"></i>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">${message}</h3>
            <div class="flex justify-center gap-4 mt-4">
                <button class="js-close-modal px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 font-semibold">
                    Cancelar
                </button>
                <button id="confirm-action-button" data-entity-id="${entityId}" class="bg-red-500 text-white font-bold px-6 py-2 rounded-md hover:bg-red-600">
                    ${confirmText}
                </button>
            </div>
        </div>
    `;
};

/**
 * Crear el contenido HTML para el modal de perfil del usuario.
 * @param {object} user - El objeto de usuario.
 * @returns {string}
 */
export const createProfileModalContent = (user) => {
	return `
        <header class="p-6 flex justify-between items-center border-b dark:border-gray-700">
            <h2 class="text-2xl font-bold">Mi Perfil</h2>
            <button class="js-close-modal text-3xl text-gray-400 hover:text-red-500 transition transform hover:rotate-90">
                <i class="fas fa-times"></i>
            </button>
        </header>
        <div class="p-8">
            <p><strong>Nombre:</strong> ${user.username}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Rol:</strong> ${user.role}</p>
        </div>
    `;
};

/**
 * Crear el HTML para un modal de Alerta (éxito o error).
 * @param {string} title - El título del mensaje.
 * @param {string} message - El cuerpo del mensaje.
 * @param {'success' | 'error'} type - El tipo de alerta.
 */
export const createAlertModalContent = (title, message, type = 'success') => {
	const icon =
		type === 'success'
			? '<i class="fas fa-check-circle text-5xl text-green-500"></i>'
			: '<i class="fas fa-times-circle text-5xl text-red-500"></i>';

	return `
        <div class="p-8 text-center flex flex-col items-center gap-4">
            ${icon}
            <h3 class="text-2xl font-bold">${title}</h3>
            <p>${message}</p>
            <button class="js-close-modal mt-4 bg-eco-green-dark text-white font-bold px-8 py-2 rounded-md">
                Entendido
            </button>
        </div>
    `;
};

/**
 * Crear el contenido HTML para el modal de "Gestionar Lote".
 * @param {object} batch - El lote de cultivo enriquecido (con plantInfo).
 * @returns {string}
 */
export const createManageBatchModalContent = (batch) => {
    let instancesHTML = '';
    batch.instances.forEach((instance, index) => {
        // Objeto para mapear estados a íconos y colores
        const statusInfo = {
            germinando: {icon: 'fa-circle-notch', color:'text-gray-500 dark:text-gray-300' },
            creciendo: {icon: 'fa-leaf', color: 'text-blue-500' },
            lista: {icon: 'fa-check-circle', color: 'text-green-500' },
            cosechada: {icon: 'fa-truck-ramp-box', color: 'text-yellow-600' },
            fallida: {icon: 'fa-times-circle', color: 'text-red-500' }
        };

        instancesHTML += `
            <div class="flex items-center justify-between p-3 border-b dark:border-gray-700">
                <div class="flex items-center gap-3">
                    <i class="fas ${statusInfo[instance.status].icon} ${statusInfo[instance.status].color} fa-fw text-lg"></i>
                    <span class="font-bold">Planta #${index + 1}</span>
                </div>
                <!-- Dropdown para cambiar el estado de ESTA instancia -->
                <select data-instance-id="${instance.instanceId}" class="instance-status-select bg-gray-100 dark:bg-gray-700 rounded p-1 text-sm">
                    <option value="germinando" ${instance.status === 'germinando' ? 'selected' : ''}>Plantada</option>
                    <option value="creciendo" ${instance.status === 'creciendo' ? 'selected' : ''}>Creciendo</option>
                    <option value="lista" ${instance.status === 'lista' ? 'selected' : ''}>Lista</option>
                    <option value="cosechada" ${instance.status === 'cosechada' ? 'selected' : ''}>Cosechada</option>
                    <option value="fallida" ${instance.status === 'fallida' ? 'selected' : ''}>Fallida</option>
                </select>
            </div>
        `;
    });

    return `
    <div data-batch-id-in-modal="${batch.batchId}">
        <header class="p-6 flex justify-between items-center border-b dark:border-gray-700">
            <h2 class="text-2xl font-bold">Gestionar Lote de ${batch.plantInfo.nombre}</h2>
            <button class="js-close-modal text-3xl">&times;</button>
        </header>
        <div class="max-h-[60vh] overflow-y-auto">
            ${instancesHTML}
        </div>
        <footer class="p-4 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 text-right">
            <button class="js-close-modal bg-eco-green-dark text-white font-bold px-6 py-2 rounded-md">Cerrar</button>
        </footer>
    </div>
    `;
};