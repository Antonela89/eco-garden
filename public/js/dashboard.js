import {
	getMyGarden,
	deletePlantFromGarden,
	updatePlantStatusInGarden,
} from './api.js';
import {
	createMyGardenCard,
	createConfirmModalContent,
	createAlertModalContent,
} from './ui.js';
import { openModal, closeModal } from './modal.js';
import { getLoaderHTML } from './loader.js';

/**
 * Inicializar la lógica específica del Dashboard: cargar y renderizar la huerta del usuario.
 * @param {object} user - El objeto de usuario (actualmente no se usa, pero es bueno tenerlo para el futuro).
 */
export const initDashboard = async (user) => {
	const gardenContainer = document.getElementById('garden-container');
	if (!gardenContainer) return;

	const modalContainer = document.getElementById('modal-container');

	/**
	 * Cargar los datos de la huerta desde la API y renderizarlos en el DOM.
	 * Esta función se puede llamar para la carga inicial o para recargar la vista.
	 */
	const loadGarden = async () => {
		// Mostrar el loader mientras se cargan los datos
		const loaderWrapper = `
        	<div id="loader-wrapper" class="col-span-full py-16 flex justify-center">
        	    ${getLoaderHTML('Cargando tu huerta...')}
        	</div>
    	`;

		gardenContainer.innerHTML = loaderWrapper;

		try {
			const myGarden = await getMyGarden();

			if (myGarden.length === 0) {
				gardenContainer.innerHTML = `
                    <div class="col-span-full text-center p-8 bg-white dark:bg-dark-surface rounded-lg">
                        <i class="fas fa-leaf text-4xl text-gray-400 mb-4"></i>
                        <h3 class="text-xl font-bold">Tu huerta está vacía</h3>
                        <p class="text-gray-500">¡Es un gran día para empezar a plantar!</p>
                        <a href="/index.html" class="mt-4 inline-block bg-eco-green-dark text-white px-6 py-2 rounded-md font-bold">Ir al Catálogo</a>
                    </div>
                `;
			} else {
				gardenContainer.innerHTML = ''; // Limpiar el loader
				myGarden.forEach((plant) => {
					gardenContainer.innerHTML += createMyGardenCard(plant);
				});
			}
		} catch (error) {
			openModal(
				createAlertModalContent(
					'Error de Carga',
					'No se pudo conectar con el servidor para cargar tu huerta. Por favor, intenta recargar la página.',
					'error'
				),
				'md'
			);
		}
	};

	// --- MANEJO DE EVENTOS (DELEGACIÓN) ---
	gardenContainer.addEventListener('click', async (e) => {
		e.preventDefault(); // Prevenir comportamiento por defecto de enlaces

		const deleteButton = e.target.closest('[data-action="delete"]');
		const statusButton = e.target.closest(
			'[data-action="toggle-status-menu"]'
		);
		const statusLink = e.target.closest('[data-status]');

		// --- Lógica para ELIMINAR planta ---
		if (deleteButton) {
			const card = e.target.closest('article');
			const plantId = card.dataset.plantId;
			const plantName = card.querySelector('h3').textContent;

			openModal(
				createConfirmModalContent(
					`¿Quitar "${plantName}"?`,
					'Sí, Quitar',
					plantId
				),
				'md'
			);
		}

		// --- Lógica para CAMBIAR ESTADO ---
		if (statusButton) {
			const menu = statusButton.nextElementSibling;
			// Ocultar otros menús abiertos para evitar superposición
			document.querySelectorAll('.status-menu').forEach((m) => {
				if (m !== menu) m.classList.add('hidden');
			});
			menu.classList.toggle('hidden');
		}

		if (statusLink) {
			const newStatus = statusLink.dataset.status;
			const card = e.target.closest('article');
			const plantId = card.dataset.plantId;

			// --- AÑADIR FEEDBACK DE CARGA ---
			const statusMenu = statusLink.closest('.status-menu');
			if (statusMenu) statusMenu.classList.add('hidden'); // Ocultar el menú

			const statusDisplay = card.querySelector(
				'[data-action="toggle-status-menu"]'
			);
			if (statusDisplay) {
				statusDisplay.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Actualizando...`;
				statusDisplay.disabled = true;
			}

			try {
				await updatePlantStatusInGarden(plantId, newStatus);
				loadGarden(); // Recargar la huerta para ver el cambio
			} catch (err) {
				openModal(
					createAlertModalContent(
						'Error',
						'No se pudo actualizar el estado.',
						'error'
					),
					'sm'
				);
				loadGarden(); // Recargar para restaurar el estado visual
			}
		}
	});

	if (modalContainer) {
		modalContainer.addEventListener('click', async (e) => {
			const confirmButton = e.target.closest('#confirm-action-button');

			if (confirmButton) {
				// Obtener el ID de la planta que guardamos en algún lugar
				const plantIdToDelete = confirmButton.dataset.plantId;

				if (!plantIdToDelete) return;

				confirmButton.disabled = true;
				confirmButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;

				try {
					await deletePlantFromGarden(plantIdToDelete);
					closeModal();
					loadGarden();
					openModal(
						createAlertModalContent(
							'¡Eliminado!',
							'La planta ha sido quitada de tu huerta.'
						),
						'sm'
					);
				} catch (error) {
					openModal(
						createAlertModalContent(
							'Error',
							'No se pudo eliminar la planta.',
							'error'
						),
						'sm'
					);
				} finally {
					// Restaurar el botón en caso de error para que el modal no se quede bloqueado
					confirmButton.disabled = false;
					confirmButton.textContent = 'Sí, Quitar';
				}
			}
		});
	}

	// Carga inicial de datos al entrar en la página del dashboard
	loadGarden();
};
