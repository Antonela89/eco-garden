import { createPlantCard } from './cards'
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