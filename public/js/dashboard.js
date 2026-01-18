import {
	getMyGarden,
	getPlants,
	deleteBatchFromGarden,
	updateInstanceStatus,
} from './api.js';
import { createCropBatchCard } from './ui/cards.js';
import {
	createConfirmModalContent,
	createAlertModalContent,
	createManageBatchModalContent,
} from './ui/modal.js';
import { openModal, closeModal } from './handle-modal.js';
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
				const enrichedGarden = myGarden.map((batch) => {
					const info = plantCatalog.find(
						(p) => p.id === batch.plantId,
					);
					return {
						...batch,
						plantInfo: info,
					};
				});

				gardenContainer.innerHTML = ''; // Limpiar el loader
				enrichedGarden.forEach((batch) => {
					// Otro punto crítico: ¿falla createCropBatchCard?
					gardenContainer.innerHTML += createCropBatchCard(batch);
				});

				// Seleccionar todas las tarjetas 
				const cards = gardenContainer.querySelectorAll('.crop-card');

				// Iterar sobre ellas y mostrar una por una con un pequeño retraso
				cards.forEach((card, index) => {
					setTimeout(() => {
						card.classList.remove('opacity-0', 'translate-y-4');
					}, index * 100); // 100ms de retraso entre cada tarjeta
				});
			}
		} catch (error) {
			// Verificar si el error es de autenticación
			if (error.name === 'AuthError') {
				// El handleResponse ya limpió el localStorage.
				// Mostrar el modal y redirigimos.
				openModal(
					createAlertModalContent(
						'Sesión Expirada',
						'Tu sesión ha terminado. Por favor, inicia sesión de nuevo.',
						'error',
					),
					'sm',
				);
				// Esperar un poco antes de redirigir para que el usuario vea el mensaje
				setTimeout(() => {
					window.location.href = '/index.html';
				}, 3000);
			} else {
				// Si es otro tipo de error (ej. de conexión), mostrar el error de carga normal
				openModal(
					createAlertModalContent(
						'Error de Carga',
						'No se pudo conectar con el servidor para cargar tu huerta.  Por favor, intenta recargar la página.',
						'error',
					),
					'md',
				);
			}
		}
	};

	// --- MANEJO DE EVENTOS (DELEGACIÓN) ---
	gardenContainer.addEventListener('click', async (e) => {
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
					batchId,
				),
				'md',
			);
		}

		if (manageButton) {
			e.preventDefault();
			const card = e.target.closest('article');
			const batchId = card.dataset.batchId;

			// Necesitamos los datos completos del lote para pasarlos al modal
			const myGarden = await getMyGarden();
			const plantCatalog = await getPlants();
			const batch = myGarden.find((b) => b.batchId === batchId);
			const enrichedBatch = {
				...batch,
				plantInfo: plantCatalog.find((p) => p.id === batch.plantId),
			};

			// Abrimos el modal con el contenido de gestión
			openModal(createManageBatchModalContent(enrichedBatch), 'lg');
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
							'El lote ha sido eliminado.',
						),
						'sm',
					);
				} catch (error) {
					openModal(
						createAlertModalContent(
							'Error',
							'No se pudo eliminar el lote.',
							'error',
						),
						'sm',
					);
				}
			}
		});

		modalContainer.addEventListener('change', async (e) => {
			const selectElement = e.target.closest('.instance-status-select');
			if (selectElement) {
				const instanceId = selectElement.dataset.instanceId;
				const newStatus = selectElement.value;

				const batchId = document.querySelector(
					'[data-batch-id-in-modal]',
				).dataset.batchIdInModal;

				try {
					await updateInstanceStatus(batchId, instanceId, newStatus);
				} catch (error) {
					openModal(
						createAlertModalContent(
							'Error',
							'No se pudo actualizar el estado.',
							'error',
						),
						'sm',
					);
				}

				// Recargar la vista del dashboard para ver los cambios en las estadísticas
				loadGarden();
			}
		});
	}

	// Carga inicial de datos
	loadGarden();
};
