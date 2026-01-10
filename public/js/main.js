/**
 * @file Punto de entrada principal para toda la lógica del Frontend.
 * @description Orquesta la inicialización de módulos, gestiona el estado de autenticación
 *              y enruta la ejecución de scripts según la página actual.
 */

// ---------------------------------
// IMPORTS
// ---------------------------------
import {
	handleRegister,
	handleLogin,
	updateNavOnLogin,
	updateNavOnLogout,
} from './auth.js';
import { getPlants, getPlantById, addCropBatch } from './api.js';
import { renderCatalog } from './ui/components.js';
import {
	createPlantDetailsContent,
	createLoginModalContent,
	createAlertModalContent,
	createAddBatchFormContent,
} from './ui/modal.js';
import { initDashboard } from './dashboard.js';
import { initProfile } from './profile.js';
import { initAdmin } from './admin.js';
import { initPasswordStrengthMeter } from './password-strength.js';
import { initModal, openModal, closeModal } from './handle-modal.js';
import { initThemeSwitcher } from './theme.js';
import { getLoaderHTML } from './loader.js';

// ---------------------------------
// SETUP GLOBAL
// ---------------------------------
/**
 * Exponer la función `closeModal` al objeto `window` para permitir su
 * llamado desde el HTML inyectado dinámicamente (ej. botones 'onclick').
 */
window.closeModal = closeModal;

// ---------------------------------
// PUNTO DE ENTRADA (MAIN)
// ---------------------------------
/**
 * Escuchar el evento 'DOMContentLoaded' para asegurar que el script se ejecute
 * solo después de que toda la estructura HTML haya sido cargada.
 */
document.addEventListener('DOMContentLoaded', () => {
	// Inicializaciones globales que ocurren en todas las páginas
	// Activar el sistema de modales y el de cambio de tema en todas las páginas.
	initModal();
	initThemeSwitcher();

	// --- LÓGICA DEL MENÚ HAMBURGUESA ---
	const hamburgerButton = document.getElementById('hamburger-button');
	const mobileMenu = document.getElementById('mobile-menu');

	if (hamburgerButton && mobileMenu) {
		hamburgerButton.addEventListener('click', () => {
			mobileMenu.classList.toggle('hidden');
			const icon = hamburgerButton.querySelector('i');
			// Cambiar entre ícono de hamburguesa y 'X'
			if (mobileMenu.classList.contains('hidden')) {
				icon.className = 'fas fa-bars';
			} else {
				icon.className = 'fas fa-times';
			}
		});
	}

	// Lógica de autenticación y actualización de UI

	// Leer el token y los datos de usuario desde el almacenamiento local.
	const token = localStorage.getItem('token');
	const user = token ? JSON.parse(localStorage.getItem('user')) : null;

	// Actualizar la barra de navegación para reflejar el estado (logueado o visitante).
	if (user) {
		updateNavOnLogin(user);
	} else {
		updateNavOnLogout();
	}

	// Enrutamiento:
	// Determinar la página actual y ejecutar su lógica de inicialización específica.
	const path = window.location.pathname;

	if (path.includes('dashboard.html')) {
		// Proteger la ruta y luego inicializar el dashboard.
		if (!user) {
			window.location.href = '/index.html';
			return;
		}
		initDashboard(user);
	} else if (path.includes('profile.html')) {
		if (!user) {
			window.location.href = '/index.html';
			return;
		}
		initProfile(user);
	} else if (path.includes('admin.html')) {
		// Proteger la ruta con doble validación (token y rol).
		if (!user || user.role !== 'admin') {
			window.location.href = '/html/dashboard.html';
			return;
		}
		initAdmin(user);
	} else if (path.includes('register.html')) {
		handleRegister();
		initPasswordStrengthMeter();
	} else {
		// Asumir que es la página de inicio (index.html).
		initializeIndexPage(user);
	}
});

// ---------------------------------
// LÓGICA ESPECÍFICA DE CADA PÁGINA
// ---------------------------------

/**
 * Inicializar todos los listeners y la carga de datos para la página principal (index.html).
 */
const initializeIndexPage = (user) => {
	// Asignar el evento para abrir el modal de login si el botón existe.
	const loginButton = document.getElementById('login-button');
	if (loginButton) {
		loginButton.addEventListener('click', () => {
			openModal(createLoginModalContent(), 'sm');
			// Preparar el formulario del modal para el evento 'submit'.
			handleLogin();
		});
	}

	const plantCatalog = document.getElementById('plant-catalog');
	const modalContainer = document.getElementById('modal-container');

	// Listener para abrir el modal de detalles
	if (plantCatalog) {
		plantCatalog.addEventListener('click', async (e) => {
			const card = e.target.closest('[data-plant-id]');
			if (!card) return;

			const modalContentArea =
				document.getElementById('modal-content-area');
			openModal(getLoaderHTML('Germinando detalles...'), '4xl');

			try {
				const plant = await getPlantById(card.dataset.plantId);
				setTimeout(() => {
					modalContentArea.innerHTML = createPlantDetailsContent(
						plant,
						user
					);
				}, 3000);
			} catch (error) {
				setTimeout(() => {
					openModal(
						createAlertModalContent(
							'Error al Cargar',
							'No se pudieron obtener los detalles de la planta. Por favor, intenta de nuevo.',
							'error'
						),
						'sm'
					);
				}, 500);
			}
		});
	}

	// Usar delegación de eventos para las acciones dentro del modal.
	if (modalContainer) {
		modalContainer.addEventListener('click', async (e) => {
			const addToGardenBtn = e.target.closest('#add-to-garden-btn');
			const loginPromptBtn = e.target.closest('#login-prompt-btn');

			// Si se hizo clic en "Añadir a mi Huerta"
			if (addToGardenBtn) {
				e.preventDefault();
				const plantId = addToGardenBtn.dataset.plantId;
				const plant = await getPlantById(plantId);

				openModal(createAddBatchFormContent(plant), 'md');

				// Añadimos el listener para el submit de este nuevo formulario
				const addBatchForm = document.getElementById('add-batch-form');
				if (addBatchForm) {
					addBatchForm.addEventListener(
						'submit',
						async (formEvent) => {
							formEvent.preventDefault();
							const submitButton = addBatchForm.querySelector(
								'button[type="submit"]'
							);
							submitButton.disabled = true;
							submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;

							try {
								const data = {
									plantId: addBatchForm.dataset.plantId,
									quantity: parseInt(
										addBatchForm.quantity.value
									),
									notes: addBatchForm.notes.value,
								};

								await addCropBatch(data);
								closeModal();
								openModal(
									createAlertModalContent(
										'¡Éxito!',
										'Tu nuevo lote ha sido añadido a la huerta.'
									),
									'sm'
								);
							} catch (error) {
								alert(error.message);
							}
						}
					);
				}
			}

			// Si se hizo clic en el botón "Ingresar" del prompt
			if (loginPromptBtn) {
				closeModal(); // Cierra el modal de detalles
				// Abre el modal de login
				openModal(createLoginModalContent(), 'sm');
				handleLogin();
			}
		});
	}

	// Iniciar la carga de datos del catálogo.
	loadCatalog();
};

/**
 * Cargar los datos del catálogo desde la API y renderizarlos en el DOM.
 */
const loadCatalog = async () => {
	const catalogContainer = document.getElementById('plant-catalog');
	if (!catalogContainer) return;

	// Mostrar el loader con un mensaje personalizado
	const loaderWrapper = `
        <div id="loader-wrapper" class="col-span-full py-16 flex justify-center">
            ${getLoaderHTML('Cargando catálogo de cultivos...')}
        </div>
    `;

	catalogContainer.innerHTML = loaderWrapper;

	try {
		const plants = await getPlants();
		setTimeout(() => {
			renderCatalog(plants);
		}, 3000); // Simular carga
	} catch (error) {
		catalogContainer.innerHTML = `
            <div class="col-span-full text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 class="text-xl font-bold text-red-700 dark:text-red-300">¡Ups! Algo salió mal</h3>
                <p class="text-red-600 dark:text-red-400">No se pudo cargar el catálogo de cultivos. Por favor, intenta recargar la página.</p>
            </div>
        `;
	}
};
