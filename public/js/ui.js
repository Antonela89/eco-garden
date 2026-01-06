// -----------------------------------
// FUNCIONES AUXILIARES (HELPERS)
// -----------------------------------

/**
 * Formatear el rango de días de cosecha para mostrarlo al usuario.
 * @param {object} plant - La planta con el objeto diasCosecha.
 * @returns {string} - "90" o "90 - 120".
 */
const formatHarvestDays = (plant) => {
	if (plant.diasCosecha.min === plant.diasCosecha.max) {
		return `${plant.diasCosecha.max}`;
	} else {
		return `${plant.diasCosecha.min} - ${plant.diasCosecha.max}`;
	}
};

/**
 * Crear un calendario visual de siembra para una planta.
 * @param {string[]} siembraMonths - Array de meses aptos para la siembra.
 * @returns {string} - El string HTML del calendario.
 */
const createSowingCalendar = (siembraMonths) => {
	const allMonths = [
		'Ene',
		'Feb',
		'Mar',
		'Abr',
		'May',
		'Jun',
		'Jul',
		'Ago',
		'Sep',
		'Oct',
		'Nov',
		'Dic',
	];

	// flat() para manejar casos como el Repollo
	const aptMonths = siembraMonths.flat();

	let calendarHTML =
		'<div class="grid grid-cols-6 sm:grid-cols-12 gap-1 mt-2">';

	allMonths.forEach((month) => {
		const isSowable = aptMonths.some((aptMonth) =>
			aptMonth.startsWith(month)
		);

		// Colorear el mes si es apto
		const bgColor = isSowable
			? 'bg-eco-green-light'
			: 'bg-gray-200 dark:bg-gray-600';
		const textColor = isSowable
			? 'text-green-600'
			: 'text-gray-500 dark:text-gray-100';

		calendarHTML += `
            <div class="flex flex-col items-center">
                <span class="text-xs font-bold ${textColor}">${month}</span>
                <div class="w-full h-2 rounded-full ${bgColor}"></div>
            </div>
        `;
	});

	calendarHTML += '</div>';
	return calendarHTML;
};

/**
 * Verificar si una planta se puede sembrar en el mes actual.
 * @param {object} plant - El objeto de la planta.
 * @returns {boolean} - true si es temporada, false si no.
 */
const isSowableNow = (plant) => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const mesActual = meses[new Date().getMonth()];
    return plant.siembra.flat().includes(mesActual);
};

// -----------------------------------
// FUNCIONES DE RENDERIZADO (EXPORTADAS)
// -----------------------------------

/**
 * Crear el HTML para una tarjeta de planta individual.
 * @param {object} plant - El objeto de la planta con todos sus datos.
 * @returns {string} - El string HTML de la tarjeta.
 */
export const createPlantCard = (plant) => {
	// Pequeño helper para los badges de dificultad
	const difficultyColors = {
		Fácil: 'bg-green-100 text-green-800',
		Media: 'bg-yellow-100 text-yellow-800',
		Difícil: 'bg-red-100 text-red-800',
	};

     // Determinar si la planta es apta para la siembra actual
    const isReadyToSow = isSowableNow(plant);
    
    // Definir clases dinámicas para el borde
    const cardBorder = isReadyToSow 
        ? 'border-4 border-eco-green-light' // Borde verde si es apta
        : 'border border-transparent';      // Borde transparente si no

	return `
        <div data-plant-id="${plant.id}" class="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ${cardBorder}"">
            <!-- Imagen de la planta -->
            <img src="${plant.imagen}" alt="${plant.nombre}" class="w-full h-48 object-cover">

            <!-- Badge de "¡Siembra Ahora!" -->
                ${isReadyToSow ? `
                <span class="absolute top-2 right-2 bg-eco-green-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    <i class="fas fa-star mr-1"></i>¡Siembra Ahora!
                </span>` : ''}
            
            <div class="p-4">
                <!-- Nombre y Familia -->
                <h3 class="text-xl font-bold text-gray-800">${plant.nombre}</h3>
                <p class="text-sm text-gray-500 mb-2">${plant.familia}</p>
                
                <!-- Badges de información rápida -->
                <div class="flex flex-wrap gap-2 text-xs mb-4">
                    <span class="font-semibold px-2 py-1 rounded-full ${
						difficultyColors[plant.dificultad]
					}">
                        ${plant.dificultad}
                    </span>
                    ${
						plant.aptoMaceta
							? '<span class="font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">Apto Maceta 🌱</span>'
							: ''
					}
                </div>
                
                <!-- Tiempos de Cosecha -->
                <div class="text-sm text-gray-700">
                    <p><strong>Cosecha en:</strong> ${formatHarvestDays(
						plant
					)} días</p>
                </div>
            </div>
        </div>
    `;
};

/**
 * Renderizar el catálogo completo en el DOM.
 * @param {object[]} plants - El array de plantas obtenido de la API.
 */
export const renderCatalog = (plants) => {
	const catalogContainer = document.getElementById('plant-catalog');
	if (!catalogContainer) return;

	// Limpiamos el contenedor por si había algo antes
	catalogContainer.innerHTML = '';

	// Generamos y añadimos cada tarjeta
	plants.forEach((plant) => {
		const cardHTML = createPlantCard(plant);
		catalogContainer.innerHTML += cardHTML;
	});
};

/**
 * Crear el HTML para una tarjeta de cultivo dentro de "Mi Huerta".
 * @param {object} myPlant - El objeto de la planta del usuario.
 * @returns {string} - El string HTML de la tarjeta.
 */
export const createMyGardenCard = (myPlant) => {
	const statusInfo = {
		creciendo: {
			text: 'Creciendo',
			color: 'bg-blue-100 text-blue-800',
			icon: 'fa-leaf',
		},
		listo: {
			text: 'Listo para Cosechar',
			color: 'bg-green-100 text-green-800',
			icon: 'fa-check-circle',
		},
		cosechado: {
			text: 'Cosechado',
			color: 'bg-yellow-100 text-yellow-800',
			icon: 'fa-seedling',
		},
	};
	const currentStatus = statusInfo[myPlant.status] || statusInfo.creciendo;

	const plantedDate = new Date(myPlant.plantedAt);
	const harvestDate = new Date(plantedDate);
	harvestDate.setDate(plantedDate.getDate() + myPlant.diasRestantes);
	const today = new Date();
	const totalDays = (harvestDate - plantedDate) / (1000 * 60 * 60 * 24);
	const daysPassed = (today - plantedDate) / (1000 * 60 * 60 * 24);
	const progressPercentage = Math.min(100, (daysPassed / totalDays) * 100);

	return `
        <article data-plant-id="${myPlant.plantId}" class="bg-white dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src="${myPlant.imagen}" alt="${
		myPlant.nombre
	}" class="w-full h-40 object-cover">
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">${
					myPlant.nombre
				}</h3>

                <!-- DROPDOWN DE ESTADO -->
                <div class="relative inline-block text-left my-2">
                    <button data-action="toggle-status-menu" class="font-semibold px-2 py-1 rounded-full text-xs self-start ${
						currentStatus.color
					}">
                        <i class="fas ${currentStatus.icon} mr-1"></i>
                        ${currentStatus.text}
                        <i class="fas fa-chevron-down ml-1 text-xs"></i>
                    </button>
                    <!-- Menú oculto -->
                    <div class="status-menu hidden absolute z-10 mt-1 w-48 bg-white dark:bg-dark-surface rounded-md shadow-lg">
                        <a href="#" data-status="creciendo" class="block px-4 py-2 text-sm">Creciendo</a>
                        <a href="#" data-status="listo" class="block px-4 py-2 text-sm">Listo para Cosechar</a>
                        <a href="#" data-status="cosechado" class="block px-4 py-2 text-sm">Cosechado</a>
                    </div>
                </div>

                <div class="text-sm text-gray-600 dark:text-gray-400">
                    <p>Siembra: ${plantedDate.toLocaleDateString()}</p>
                    <p class="font-bold">Cosecha aprox: ${harvestDate.toLocaleDateString()}</p>
                </div>
        
                <!-- BARRA DE PROGRESO -->
                <div class="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                    <div class="bg-eco-green-dark h-2.5 rounded-full" style="width: ${progressPercentage}%"></div>
                </div>

                
                <div class="mt-auto pt-4 flex justify-end gap-2">
                    <button data-action="delete" class="text-gray-500 hover:text-red-500 transition" aria-label="Eliminar planta">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
};

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
        <header class="p-6 border-b dark:border-gray-700 flex justify-between items-start">
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

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p><strong>Método:</strong> ${plant.metodo.join(', ')}</p>

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
                <div class="mb-4">
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

        <footer class="p-6 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 text-right">
            ${footerContent}
        </footer>
    `;
};

/**
 * Crear el HTML para el formulario de "Crear/Editar Planta" para el Admin.
 * @param {object} [plant=null] - Si se provee una planta, rellena el formulario para edición.
 * @returns {string} El string HTML del formulario.
 */
export const createAdminPlantForm = (plant = null) => {
	const isEditing = plant !== null;
	const title = isEditing ? 'Editar Especie' : 'Añadir Nueva Especie';

	return `
        <header class="p-6 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${title}</h2>
            <button class="js-close-modal text-3xl text-gray-400 hover:text-red-500 transition transform hover:rotate-90">
                <i class="fas fa-times"></i>
            </button>
        </header>
        
        <form id="admin-plant-form" class="p-6 max-h-[70vh] overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <!-- Columna Izquierda -->
                <div class="flex flex-col gap-4">
                    <div>
                        <label for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID (slug)</label>
                        <input type="text" id="id" name="id" value="${
							plant?.id || ''
						}" 
                            ${isEditing ? 'readonly' : 'required'} 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 ${
								isEditing
									? 'bg-gray-100 cursor-not-allowed'
									: ''
							}">
                    </div>
                    <div>
                        <label for="nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                        <input type="text" id="nombre" name="nombre" value="${
							plant?.nombre || ''
						}" required 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
                    </div>
                    <div>
                        <label for="familia" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Familia</label>
                        <input type="text" id="familia" name="familia" value="${
							plant?.familia || ''
						}" required 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
                    </div>
                    <div>
                        <label for="clima" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Clima</label>
                        <input type="text" id="clima" name="clima" value="${
							plant?.clima || ''
						}" required 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
                    </div>
                    <div>
                        <label for="imagen" class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL de Imagen</label>
                        <input type="url" id="imagen" name="imagen" value="${
							plant?.imagen || ''
						}" required 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
                    </div>
                </div>

                <!-- Columna Derecha -->
                <div class="flex flex-col gap-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="diasCosechaMin" class="block text-sm font-medium">Cosecha (Mín)</label>
                            <input type="number" id="diasCosechaMin" name="diasCosechaMin" value="${
								plant?.diasCosecha.min || ''
							}" required 
                                class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
                        </div>
                        <div>
                            <label for="diasCosechaMax" class="block text-sm font-medium">Cosecha (Máx)</label>
                            <input type="number" id="diasCosechaMax" name="diasCosechaMax" value="${
								plant?.diasCosecha.max || ''
							}" required 
                                class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="distanciaEntre" class="block text-sm font-medium">Dist. Plantas (cm)</label>
                            <input type="number" id="distanciaEntre" name="distanciaEntre" value="${
								plant?.distancia.entrePlantas || ''
							}" required 
                                class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
                        </div>
                        <div>
                            <label for="distanciaLineas" class="block text-sm font-medium">Dist. Líneas (cm)</label>
                            <input type="number" id="distanciaLineas" name="distanciaLineas" value="${
								plant?.distancia.entreLineas || ''
							}" required 
                                class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
                        </div>
                    </div>
                    <div>
                        <label for="dificultad" class="block text-sm font-medium">Dificultad</label>
                        <select id="dificultad" name="dificultad" required class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
                            <option value="Fácil" ${
								plant?.dificultad === 'Fácil' ? 'selected' : ''
							}>Fácil</option>
                            <option value="Media" ${
								plant?.dificultad === 'Media' ? 'selected' : ''
							}>Media</option>
                            <option value="Difícil" ${
								plant?.dificultad === 'Difícil'
									? 'selected'
									: ''
							}>Difícil</option>
                        </select>
                    </div>
                    <div class="flex items-center space-x-8 mt-2">
                        <label class="flex items-center gap-2">
                            <input type="checkbox" id="aptoMaceta" name="aptoMaceta" ${
								plant?.aptoMaceta ? 'checked' : ''
							} class="rounded">
                            <span>Apto Maceta</span>
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="checkbox" id="toleranciaSombra" name="toleranciaSombra" ${
								plant?.toleranciaSombra ? 'checked' : ''
							} class="rounded">
                            <span>Tolera Sombra</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Campos de texto largos (Arrays) -->
            <div class="mt-4">
                <label for="siembra" class="block text-sm font-medium">Meses de Siembra (separados por coma)</label>
                <input type="text" id="siembra" name="siembra" value="${
					plant ? plant.siembra.flat().join(', ') : ''
				}" required 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
            </div>
            <div class="mt-4">
                <label for="asociacion" class="block text-sm font-medium">Asociaciones (separadas por coma)</label>
                <input type="text" id="asociacion" name="asociacion" value="${
					plant?.asociacion.join(', ') || ''
				}" 
                	class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
            </div>

            <footer class="mt-8 pt-4 border-t dark:border-gray-700 flex justify-end gap-4">
                <button type="button" class="js-close-modal" class="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancelar</button>
                <button type="submit" class="bg-eco-green-dark text-white font-bold px-6 py-2 rounded-md hover:bg-opacity-80 transition active:scale-95">
                    ${isEditing ? 'Guardar Cambios' : 'Crear Planta'}
                </button>
            </footer>
        </form>
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
                    <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <div class="relative mt-1">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <i
                                class="fas fa-envelope text-gray-400 group-focus-within:text-eco-green-dark transition"></i>
                        </span>
                        <input type="email" id="email" name="email" required placeholder="tu@email.com"
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 pl-10 shadow-sm focus:border-eco-green-dark focus:ring-eco-green-dark">
                    </div>
                </div>
                <div class="relative group">
                    <label for="password"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                    <div class="relative mt-1">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <i class="fas fa-lock text-gray-400 group-focus-within:text-eco-green-dark transition"></i>
                        </span>
                        <input type="password" id="password" name="password" required placeholder="••••••••"
                            class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 pl-10 shadow-sm focus:border-eco-green-dark focus:ring-eco-green-dark">
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
                <button id="confirm-action-button" data-plant-id="${entityId}" class="bg-red-500 text-white font-bold px-6 py-2 rounded-md hover:bg-red-600">
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
