import { getPlants, createPlant, updatePlant, deletePlant } from './api.js';
import { openModal, closeModal } from './handle-modal.js';
import { createAdminPlantForm } from './ui/form.js';
import {
	createConfirmModalContent,
	createAlertModalContent,
} from './ui/modal.js';
import { formatIdData, formatInputData } from '../../shared/formatters.js';

/**
 * Procesar los datos de un formulario de planta y convertirlos a un objeto JSON válido.
 * @param {HTMLFormElement} form - El formulario a procesar.
 * @returns {object} - El objeto de planta listo para enviar a la API.
 */
const processPlantForm = (form) => {

	// Función auxiliar para convertir a array
	const cleanArray = (value) => {
		if (!value) return [];
		return value
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
	};

	return {
		id: form.id.value,
		nombre: form.nombre.value,
		familia: form.familia.value,
		metodo: cleanArray(form.metodo.value),
		clima: form.clima.value,
		imagen: form.imagen.value,
		diasCosecha: {
			min: parseInt(form.diasCosechaMin.value),
			max: parseInt(form.diasCosechaMax.value),
		},
		distancia: {
			entrePlantas: parseInt(form.distanciaEntre.value),
			entreLineas: parseInt(form.distanciaLineas.value),
		},
		dificultad: form.dificultad.value,
		aptoMaceta: form.aptoMaceta.checked,
		toleranciaSombra: form.toleranciaSombra.checked,
		siembra: cleanArray(form.siembra.value),
        asociacion: cleanArray(form.asociacion.value),
        rotacion: cleanArray(form.rotacion.value) 
	};
};

/**
 * Inicializar la página de administración con todas sus funcionalidades.
 */
export const initAdmin = async () => {
	// Referencias a elementos del DOM
	const addPlantButton = document.getElementById('add-plant-button');
	const tableBody = document.getElementById('admin-plant-table');

	// Función para renderizar (o re-renderizar) la tabla de plantas
	const renderTable = (plants) => {
		tableBody.innerHTML = ''; // Limpiar tabla
		plants.forEach((plant) => {
			tableBody.innerHTML += `
                <tr class="border-b dark:border-gray-700" data-plant-id="${plant.id}">
                    <td class="px-6 py-4 font-bold">${plant.nombre}</td>
                    <td class="px-6 py-4 hidden sm:table-cell">${plant.familia}</td>
                    <td class="px-6 py-4 hidden md:table-cell">${plant.dificultad}</td>
                    <td class="px-6 py-4 text-right">
                        <button data-action="edit" class="bg-blue-500 text-white w-10 h-10 rounded-full"><i class="fa-solid fa-pen-to-square pointer-events-none"></i></button>
                        <button data-action="delete" class="bg-red-500 text-white w-10 h-10 rounded-full"><i class="fa-solid fa-delete-left pointer-events-none"></i></button>
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

			const submitButton = form.querySelector('button[type="submit"]');

			// --- APLICAR LOADER AL BOTÓN ---
			submitButton.disabled = true;
			submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Creando...`;

			try {
				let plantData = processPlantForm(form);
				plantData = formatIdData(plantData);
				plantData = formatInputData(plantData);

				await createPlant(plantData);
				closeModal();
				loadAdminData(); // Recargar la tabla

				// --- MOSTRAR MODAL DE ÉXITO ---
				openModal(
					createAlertModalContent(
						'¡Éxito!',
						'La nueva especie ha sido añadida al catálogo.',
					),
					'sm',
				);
			} catch (error) {
				console.log('--- ERROR CAPTURADO EN EL FORMULARIO ADMIN ---');
				console.dir(error); // .dir() es mejor para inspeccionar objetos de error

				let detailedMessage =
					'Ocurrió un error inesperado. Revisa la consola para más detalles.';

				// Verificamos si el error tiene la propiedad 'details'
				if (error && error.details) {
					detailedMessage =
						'Por favor, corrige los siguientes errores:\n' +
						error.details
							.map((err) => `- ${err.campo}: ${err.mensaje}`)
							.join('\n');
				} else if (error && error.message) {
					// Si no tiene 'details', usamos el 'message' genérico
					detailedMessage = error.message;
				}

				openModal(
					createAlertModalContent(
						'Error de Validación',
						detailedMessage,
						'error',
					),
					'md',
				);
			} finally {
				// Restaurar el botón en caso de error
				submitButton.disabled = false;
				submitButton.textContent = 'Crear Planta';
			}
		});
	});

	// Delegación de eventos para los botones EDITAR y ELIMINAR de la tabla
	tableBody.addEventListener('click', async (e) => {
		const action = e.target.dataset.action;
		if (!action) return;

		const row = e.target.closest('tr');
		const plantId = row.dataset.plantId;

		if (action === 'edit') {
			const plant = (await getPlants()).find((p) => p.id === plantId);
			openModal(createAdminPlantForm(plant), '4xl');

			// Lógica para el submit del formulario de EDICIÓN
			const form = document.getElementById('admin-plant-form');
			form.addEventListener('submit', async (e) => {
				e.preventDefault();
				const submitButton = form.querySelector(
					'button[type="submit"]',
				);

				// LOADER EN EL BOTÓN DE GUARDAR ---
				submitButton.disabled = true;
				submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Guardando...`;

				try {
					const updatedData = processPlantForm(form);
					await updatePlant(plantId, updatedData);
					closeModal();
					loadAdminData();
					openModal(
						createAlertModalContent(
							'¡Éxito!',
							'Los datos de la planta han sido actualizados.',
						),
						'sm',
					);
				} catch (error) {
					openModal(
						createAlertModalContent(
							'Error',
							error.message,
							'error',
						),
						'sm',
					);
				} finally {
					submitButton.disabled = false;
					submitButton.textContent = 'Guardar Cambios';
				}
			});
		}

		if (action === 'delete') {
			const plant = (await getPlants()).find((p) => p.id === plantId);
			openModal(
				createConfirmModalContent(
					`¿Eliminar "${plant.nombre}" del catálogo?`,
					'Sí, Eliminar',
					plantId,
				),
				'md',
			);

			// Delegar en el modal para el botón de confirmar
			const modalContainer = document.getElementById('modal-container');
			const confirmHandler = async (event) => {
				const confirmButton = event.target.closest(
					'#confirm-action-button',
				);
				if (
					confirmButton &&
					confirmButton.dataset.plantId === plantId
				) {
					// --- LOADER EN EL BOTÓN DE ELIMINAR ---
					confirmButton.disabled = true;
					confirmButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
					try {
						await deletePlant(plantId);
						closeModal();
						loadAdminData();
						openModal(
							createAlertModalContent(
								'¡Eliminado!',
								`La planta "${plant.nombre}" ha sido eliminada.`,
							),
							'sm',
						);
					} catch (error) {
						openModal(
							createAlertModalContent(
								'Error',
								error.message,
								'error',
							),
							'sm',
						);
					}
					// Limpiar el listener para evitar ejecuciones múltiples
					modalContainer.removeEventListener('click', confirmHandler);
				}
			};
			modalContainer.addEventListener('click', confirmHandler);
		}
	});

	// Carga inicial de datos al entrar en la página
	loadAdminData();
};
