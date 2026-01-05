import { getMyGarden } from './api.js';
import { createMyGardenCard } from './ui.js';
import { getLoaderHTML } from './loader.js';

/**
 * Inicializar la lógica específica del Dashboard: cargar y renderizar la huerta del usuario.
 * @param {object} user - El objeto de usuario (actualmente no se usa, pero es bueno tenerlo para el futuro).
 */
export const initDashboard = async (user) => {
    const gardenContainer = document.getElementById('garden-container');
    if (!gardenContainer) return;
    
    try {
        // Cargar y mostrar la huerta
        gardenContainer.innerHTML = getLoaderHTML('Cargando tu huerta...'); 
        const myGarden = await getMyGarden();

        if (myGarden.length === 0) {
            gardenContainer.innerHTML = `
                <div class="col-span-full text-center p-8 bg-white dark:bg-dark-surface rounded-lg">
                    <i class="fas fa-leaf text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-xl font-bold">Tu huerta está vacía</h3>
                    <p class="text-gray-500">¡Es un gran día para empezar a plantar!</p>
                </div>
            `;
        } else {
            gardenContainer.innerHTML = ''; // Limpiar loader
            myGarden.forEach(plant => {
                gardenContainer.innerHTML += createMyGardenCard(plant);
            });
        }

    } catch (error) {
        // Si el token es inválido o hay otro error, el guardia de ruta en main.js ya lo manejó.
        gardenContainer.innerHTML = `<p class="col-span-full text-red-500">Error al cargar tu huerta.</p>`;
        console.error("Error al cargar la huerta:", error);
    }
};