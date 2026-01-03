import { getPlants } from './api.js';

export const initAdmin = async () => {
    // Lógica para cerrar sesión
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    });
    
    // Función para renderizar la tabla
    const renderTable = (plants) => {
        const tableBody = document.getElementById('admin-plant-table');
        tableBody.innerHTML = ''; // Limpiar
        plants.forEach(plant => {
            tableBody.innerHTML += `
                <tr class="border-b dark:border-gray-700">
                    <td class="px-6 py-4 font-bold">${plant.nombre}</td>
                    <td class="px-6 py-4">${plant.familia}</td>
                    <td class="px-6 py-4">${plant.dificultad}</td>
                    <td class="px-6 py-4 text-right">
                        <button class="text-blue-500 hover:underline mr-4">Editar</button>
                        <button class="text-red-500 hover:underline">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    };

    try {
        const plants = await getPlants();
        renderTable(plants);
    } catch (error) {
        console.error("Error al cargar el catálogo para admin:", error);
    }
};