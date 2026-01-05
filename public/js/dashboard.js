import { getMyGarden, getProfile } from './api.js';
import { createMyGardenCard } from './ui.js';

export const initDashboard = async () => {
    const usernameDisplay = document.getElementById('username-display');
    const gardenContainer = document.getElementById('garden-container');
    const logoutButton = document.getElementById('logout-button');

    // Manejar el cierre de sesión
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    });
    
    try {
        // Cargar y mostrar el nombre de usuario
        const profile = await getProfile();
        usernameDisplay.textContent = profile.username;

        // Cargar y mostrar la huerta
        gardenContainer.innerHTML = `<p>Cargando tu huerta...</p>`;
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
        // Si el token es inválido o hay otro error, redirigir al login
        console.error("Error al cargar el dashboard:", error);
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }
};