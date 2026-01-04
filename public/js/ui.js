	const diasCosecha = (plant) => {
		if (plant.diasCosecha.min === plant.diasCosecha.max) {
			return `${plant.diasCosecha.max}`;
		} else {
			return `${plant.diasCosecha.min} - ${plant.diasCosecha.max}`;
		}
	};

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

	return `
        <div data-plant-id="${
			plant.id
		}" class="cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <!-- Imagen de la planta -->
            <img src="${plant.imagen}" alt="${
		plant.nombre
	}" class="w-full h-48 object-cover">
            
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
                    <p><strong>Cosecha en:</strong> ${diasCosecha(plant)} días</p>
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

	return `
        <article class="bg-white dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src="${myPlant.imagen}" alt="${
		myPlant.nombre
	}" class="w-full h-40 object-cover">
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">${
					myPlant.nombre
				}</h3>
                <span class="font-semibold px-2 py-1 rounded-full text-xs self-start my-2 ${
					currentStatus.color
				}">
                    <i class="fas ${currentStatus.icon} mr-1"></i>
                    ${currentStatus.text}
                </span>
                <p class="text-sm text-gray-600 dark:text-gray-400">Siembra: ${new Date(
					myPlant.plantedAt
				).toLocaleDateString()}</p>
                <!-- Aquí podría ir el loader de crecimiento -->
                <div class="mt-auto pt-4 flex justify-end gap-2">
                    <button class="text-gray-500 hover:text-red-500 transition" aria-label="Eliminar planta">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
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
 * Crear el contenido HTML para el modal de detalles de una planta.
 * @param {object} plant - El objeto completo de la planta.
 * @returns {string} - El string HTML para el interior del modal.
 */
export const createPlantDetailsContent = (plant) => {
	return `
        <header class="p-6 border-b dark:border-gray-700 flex justify-between items-start">
            <div>
                <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">${
					plant.nombre
				}</h2>
                <p class="text-md text-gray-500">${plant.familia}</p>
            </div>
            <button id="close-details-modal" class="text-3xl text-gray-400 hover:text-red-500 transition transform hover:rotate-90">
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
                    <p><strong>Tiempo de Cosecha:</strong> ${diasCosecha(plant)} días</p>
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
            <button class="bg-eco-green-dark text-white font-bold px-6 py-2 rounded-md hover:bg-opacity-80 transition active:scale-95">
                <i class="fas fa-plus-circle mr-2"></i>Añadir a mi Huerta
            </button>
        </footer>
    `;
};
