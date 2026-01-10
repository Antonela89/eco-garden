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
	const meses = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];
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
		: 'border border-transparent'; // Borde transparente si no

	return `
        <div data-plant-id="${
			plant.id
		}" class="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ${cardBorder}"">
            <!-- Imagen de la planta -->
            <img src="${plant.imagen}" alt="${
		plant.nombre
	}" class="w-full h-48 object-cover">

            <!-- Badge de "¡Siembra Ahora!" -->
                ${
					isReadyToSow
						? `
                <span class="absolute top-2 right-2 bg-eco-green-dark text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg ring-2 ring-white/50 animate-heartbeat">
                    <i class="fas fa-star mr-1"></i>¡Siembra Ahora!
                </span>`
						: ''
				}
            
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
 * Generar el HTML para la tarjeta de un Lote de Cultivo en "Mi Huerta".
 * @param {object} batch - El objeto del lote de cultivo (CropBatch).
 * @returns {string} El string HTML de la tarjeta del lote.
 */
export const createCropBatchCard = (batch) => {
	const plantInfo = batch.plantInfo;
	if (!plantInfo) return ''; // Seguridad por si no se encuentra la info de la planta

	// --- LÓGICA DE FECHA DE COSECHA ---
	const plantedDate = new Date(batch.plantedAt);

    // --- LÓGICA DE FECHA DE COSECHA (CORREGIDA) ---
    // Calcular la fecha mínima de cosecha
    const minHarvestDate = new Date(plantedDate);
    minHarvestDate.setDate(plantedDate.getDate() + plantInfo.diasCosecha.min);
    const minHarvestDateString = minHarvestDate.toLocaleDateString();

    // Calcular la fecha máxima de cosecha
    const maxHarvestDate = new Date(plantedDate);
    maxHarvestDate.setDate(plantedDate.getDate() + plantInfo.diasCosecha.max);
    const maxHarvestDateString = maxHarvestDate.toLocaleDateString();

    // Crear el string final para mostrar
    const harvestRangeString = (minHarvestDateString === maxHarvestDateString)
        ? minHarvestDateString // Si son iguales, mostrar solo una
        : `${minHarvestDateString} - ${maxHarvestDateString}`;
	// Calcular estadísticas del lote
	const totalInstances = batch.instances.length;
	const growingCount = batch.instances.filter(
		(i) => i.status === 'creciendo' || i.status === 'germinando'
	).length;
	const readyCount = batch.instances.filter(
		(i) => i.status === 'lista'
	).length;
	const harvestedCount = batch.instances.filter(
		(i) => i.status === 'cosechada'
	).length;
	const failedCount = batch.instances.filter(
		(i) => i.status === 'fallida'
	).length;

	return `
        <article data-batch-id="${
			batch.batchId
		}" class="bg-white dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl">
            <img src="${plantInfo.imagen}" alt="${
		plantInfo.nombre
	}" class="w-full h-40 object-cover">
            
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">${
					plantInfo.nombre
				}</h3>
                <p class="text-sm text-gray-500 mb-2">Sembrado el: ${plantedDate.toLocaleDateString()}</p>
                <p class="text-sm font-bold text-gray-600 mb-2  dark:text-gray-400">Cosecha aprox: ${harvestRangeString}</p>
                ${
					batch.notes
						? `<p class="text-xs italic text-gray-500 mb-3">Notas: "${batch.notes}"</p>`
						: `<p class="text-xs italic text-gray-500 mb-3">Notas:</p>`
				}

                <!-- Sección de Estadísticas -->
                <div class="text-sm space-y-2 mb-4 border-t dark:border-gray-700 pt-3 mt-2">
                    <div class="flex justify-between items-center">
                        <span>Total Plantado:</span> 
                        <span class="font-bold w-12 text-right">${totalInstances}</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Creciendo:</span> 
                        <span class="font-bold text-blue-500 w-12 flex items-center justify-between gap-2">
                            <i class="fas fa-leaf fa-fw"></i> ${growingCount}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Listas:</span> 
                        <span class="font-bold text-green-500 w-12 flex items-center justify-between gap-2">
                            <i class="fas fa-check-circle fa-fw"></i> ${readyCount}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Cosechadas:</span> 
                        <span class="font-bold text-yellow-500 w-12 flex items-center justify-between gap-2">
                            <i class="fa-solid fa-truck-ramp-box"></i> ${harvestedCount}
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Fallidas:</span> 
                        <span class="font-bold text-red-500 w-12 flex items-center justify-between gap-2">
                            <i class="fas fa-times-circle fa-fw"></i> ${failedCount}
                        </span>
                    </div>
                </div>

                <!-- Botones de Acción -->
                <div class="mt-auto pt-4 flex justify-between items-center border-t dark:border-gray-700">
                    <button data-action="manage-batch" class="bg-blue-500 text-white px-4 py-2 text-sm font-bold rounded hover:bg-blue-600 transition-colors">
                        Gestionar Lote
                    </button>
                    <button data-action="delete-batch" class="text-gray-500 hover:text-red-500 transition-colors px-2">
                        <i class="fas fa-trash pointer-events-none"></i>
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
            <div class="mt-4">
                <label for="rotacion" class="block text-sm font-medium">Rotación Recomendada (separada por coma)</label>
                <input type="text" id="rotacion" name="rotacion" value="${
					plant?.rotacion.join(', ') || ''
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
 * Crear el HTML para el formulario de edición de perfil.
 * @param {object} user - El usuario actual para pre-rellenar el campo.
 * @returns {string}
 */
export const createProfileFormModalContent = (user) => {
	return `
        <header class="p-6 flex justify-between items-center border-b dark:border-gray-700">
            <h2 class="text-2xl font-bold">Editar Perfil</h2>
            <button class="js-close-modal text-3xl">&times;</button>
        </header>
        <form id="profile-form" class="p-8">
            <div>
                <label for="username" class="block text-sm font-medium">Nombre de Usuario</label>
                <input type="text" id="username" name="username" value="${user.username}" 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
            </div>
            <!-- NOTA: La edición de email y password es más compleja (requiere confirmación)
                por lo que se deja fuera por ahora para simplificar. -->

            <footer class="mt-8 flex justify-end gap-4">
                <button type="button" class="js-close-modal px-6 py-2 rounded-md">Cancelar</button>
                <button type="submit" class="bg-eco-green-dark text-white font-bold px-6 py-2 rounded-md">Guardar Cambios</button>
            </footer>
        </form>
    `;
};

/**
 * Crear el HTML para el formulario de "Añadir Lote a la Huerta".
 * @param {object} plant - La planta que se va a añadir.
 * @returns {string}
 */
export const createAddBatchFormContent = (plant) => {
	return `
        <header class="p-6 flex justify-between items-center border-b dark:border-gray-700">
            <h2 class="text-2xl font-bold">Añadir "${plant.nombre}"</h2>
            <button class="js-close-modal text-3xl">&times;</button>
        </header>
        <form id="add-batch-form" data-plant-id="${plant.id}" class="p-8 flex flex-col gap-4">
            <div>
                <label for="quantity" class="block text-sm font-medium">Cantidad de Semillas/Plantines</label>
                <input type="number" id="quantity" name="quantity" value="1" min="1" required 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700">
            </div>
            <div>
                <label for="notes" class="block text-sm font-medium">Notas (opcional)</label>
                <textarea id="notes" name="notes" placeholder="Ej: maceta de la esquina, lado sur..." 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700"></textarea>
            </div>
            <footer class="mt-6 flex justify-end gap-4">
                <button type="button" class="js-close-modal px-6 py-2 rounded-md">Cancelar</button>
                <button type="submit" class="bg-eco-green-dark text-white font-bold px-6 py-2 rounded-md">Confirmar Siembra</button>
            </footer>
        </form>
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
            germinando: { icon: 'fa-seedling', color: 'text-white' },
            creciendo: { icon: 'fa-leaf', color: 'text-blue-500' },
            lista: { icon: 'fa-check-circle', color: 'text-green-500' },
            cosechada: { icon: 'fa-truck-ramp-box', color: 'text-yellow-600' },
            fallida: { icon: 'fa-times-circle', color: 'text-red-500' }
        };

        instancesHTML += `
            <div class="flex items-center justify-between p-3 border-b dark:border-gray-700">
                <div class="flex items-center gap-3">
                    <i class="fas ${statusInfo[instance.status].icon} ${statusInfo[instance.status].color} fa-fw text-lg"></i>
                    <span class="font-bold">Planta #${index + 1}</span>
                </div>
                <!-- Dropdown para cambiar el estado de ESTA instancia -->
                <select data-instance-id="${instance.instanceId}" class="instance-status-select bg-gray-100 dark:bg-gray-700 rounded p-1 text-sm">
                    <option value="germinando" ${instance.status === 'germinando' ? 'selected' : ''}>Germinando</option>
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