import { isSowableNow, formatHarvestDays } from "./helpers";

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


