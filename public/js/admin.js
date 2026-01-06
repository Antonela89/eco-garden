import { getPlants, createPlant, updatePlant, deletePlant } from './api.js';
import { openModal, closeModal } from './modal.js';
import { createAdminPlantForm, createConfirmModalContent, } from './ui.js';
import { formatIdData, formatInputData } from '../../shared/formatters.js';

/**
 * Procesar los datos de un formulario de planta y convertirlos a un objeto JSON válido.
 * @param {HTMLFormElement} form - El formulario a procesar.
 * @returns {object} - El objeto de planta listo para enviar a la API.
 */
const processPlantForm = (form) => {
    return {
        id: form.id.value,
        nombre: form.nombre.value,
        familia: form.familia.value,
        clima: form.clima.value,
        imagen: form.imagen.value,
        diasCosecha: {
            min: parseInt(form.diasCosechaMin.value),
            max: parseInt(form.diasCosechaMax.value)
        },
        distancia: {
            entrePlantas: parseInt(form.distanciaEntre.value),
            entreLineas: parseInt(form.distanciaLineas.value)
        },
        dificultad: form.dificultad.value,
        aptoMaceta: form.aptoMaceta.checked,
        toleranciaSombra: form.toleranciaSombra.checked,
        siembra: form.siembra.value.split(',').map(s => s.trim()),
        asociacion: form.asociacion.value.split(',').map(s => s.trim()),
        rotacion: form.rotacion.value.split(',').map(s => s.trim()) // Asegúrate de que este campo exista en el form
    };
};

/**
* Inicializar la página de administración con todas sus funcionalidades.
*/
export const initAdmin = async () => {
    // Referencias a elementos del DOM
    const logoutButton = document.getElementById('logout-button');
    const addPlantButton = document.getElementById('add-plant-button');
    const tableBody = document.getElementById('admin-plant-table');

    // Configurar el botón de cierre de sesión
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    });
    
    // Función para renderizar (o re-renderizar) la tabla de plantas
    const renderTable = (plants) => {
        tableBody.innerHTML = ''; // Limpiar tabla
        plants.forEach(plant => {
            tableBody.innerHTML += `
                <tr class="border-b dark:border-gray-700" data-plant-id="${plant.id}">
                    <td class="px-6 py-4 font-bold">${plant.nombre}</td>
                    <td class="px-6 py-4">${plant.familia}</td>
                    <td class="px-6 py-4">${plant.dificultad}</td>
                    <td class="px-6 py-4 text-right">
                        <button data-action="edit" class="text-blue-500 hover:underline mr-4">Editar</button>
                        <button data-action="delete" class="text-red-500 hover:underline">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    };

    // Función principal para cargar y renderizar los datos
    const loadAdminData = async () => {
        try {
            const plants = await getPlants();
            renderTable(plants);
        } catch (error) {
            tableBody.innerHTML = `<tr><td colspan="4" class="text-center p-8 text-red-500">Error al cargar el catálogo.</td></tr>`;
        }
    };

    // --- MANEJO DE EVENTOS ---

    // Evento para abrir el modal de CREAR planta
    addPlantButton.addEventListener('click', () => {
        openModal(createAdminPlantForm(), '4xl');
        
        // Añadir listener para el submit del formulario recién creado
        const form = document.getElementById('admin-plant-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            let plantData = processPlantForm(form);
            plantData = formatIdData(plantData);   // Normalizar ID
            plantData = formatInputData(plantData); // Capitalizar textos
            
            try {
                await createPlant(plantData);
                closeModal();
                loadAdminData(); // Recargar la tabla
            } catch (error) {
                alert(`Error al crear la planta: ${error.message}`);
            }
        });
    });

    // Delegación de eventos para los botones EDITAR y ELIMINAR de la tabla
    tableBody.addEventListener('click', async (e) => {
        const action = e.target.dataset.action;
        if (!action) return;

        const row = e.target.closest('tr');
        const plantId = row.dataset.plantId;
        const plant = (await getPlants()).find(p => p.id === plantId);

        if (action === 'edit') {
            openModal(createAdminPlantForm(plant));
            
            // Lógica para el submit del formulario de EDICIÓN
            const form = document.getElementById('admin-plant-form');
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const updatedData = processPlantForm(form);
                
                try {
                    await updatePlant(plantId, updatedData);
                    closeModal();
                    loadAdminData();
                } catch (error) {
                    alert(`Error al actualizar: ${error.message}`);
                }
            });
        }
        
        if (action === 'delete') {
            openModal(createConfirmModalContent(`¿Seguro que quieres eliminar "${plant.nombre}" del catálogo?`));
            
            // Lógica para el botón de confirmación de borrado
            document.getElementById('confirm-delete-button').addEventListener('click', async () => {
                try {
                    await deletePlant(plantId);
                    closeModal();
                    loadAdminData();
                } catch (error) {
                    alert(`Error al eliminar: ${error.message}`);
                }
            });
        }
    });

    // Carga inicial de datos al entrar en la página
    loadAdminData();
};