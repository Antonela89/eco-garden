import {
	getMyGarden,
	getPlants,
	deleteBatchFromGarden,
} from './api.js';
import {
	createCropBatchCard,
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
			// Obtener la huerta y el catálogo completo
			const [myGarden, plantCatalog] = await Promise.all([
				getMyGarden(),
				getPlants(),
			]);

			if (myGarden.length === 0) {
				gardenContainer.innerHTML = `
                    <div class="col-span-full text-center p-8 bg-white dark:bg-dark-surface rounded-lg">
                        <i class="fas fa-leaf text-4xl text-gray-400 mb-4"></i>
                        <h3 class="text-xl font-bold">Tu huerta está vacía</h3>
                        <p class="text-gray-500">¡Es un gran día para empezar a plantar!</p>
                    </div>
                `;
			} else {
				// "Enriquecer" los datos de la huerta
				const enrichedGarden = myGarden.map((batch) => ({
					...batch,
					plantInfo: plantCatalog.find((p) => p.id === batch.plantId),
				}));

				gardenContainer.innerHTML = ''; // Limpiar el loader
				enrichedGarden.forEach((batch) => {
					gardenContainer.innerHTML += createCropBatchCard(batch);
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
	gardenContainer.addEventListener('click', (e) => {
		e.preventDefault();

		const deleteButton = e.target.closest('[data-action="delete-batch"]');
		const manageButton = e.target.closest('[data-action="manage-batch"]');

		if (deleteButton) {
			const card = e.target.closest('article');
			const batchId = card.dataset.batchId;
			const plantName = card.querySelector('h3').textContent;
			openModal(
				createConfirmModalContent(
					`¿Eliminar el lote de "${plantName}"?`,
					'Sí, Eliminar',
					batchId
				),
				'md'
			);
		}

		if (manageButton) {
			alert('Funcionalidad de gestionar lote en construcción...');
		}
	});

	if (modalContainer) {
		modalContainer.addEventListener('click', async (e) => {
			const confirmButton = e.target.closest('#confirm-action-button');
			if (confirmButton) {
				const batchIdToDelete = confirmButton.dataset.entityId;
				if (!batchIdToDelete) return;
				try {
					await deleteBatchFromGarden(batchIdToDelete);
					closeModal();
					loadGarden();
					openModal(
						createAlertModalContent(
							'¡Eliminado!',
							'El lote ha sido eliminado.'
						),
						'sm'
					);
				} catch (error) {
					openModal(
						createAlertModalContent(
							'Error',
							'No se pudo eliminar el lote.',
							'error'
						),
						'sm'
					);
				}
			}
		});
	}

	// Carga inicial de datos
	loadGarden();
};
