// ---------------------------------
//              IMPORTS
// ---------------------------------
import {
	handleRegister,
	handleLogin,
	updateNavOnLogin,
	updateNavOnLogout,
} from './auth.js';
import { getPlants, getPlantById, addPlantToGarden } from './api.js';
import {
	renderCatalog,
	createPlantDetailsContent,
	createLoginModalContent,
} from './ui.js';
import { initDashboard } from './dashboard.js';
import { initProfile } from './profile.js';
import { initAdmin } from './admin.js';
import { initPasswordStrengthMeter } from './password-strength.js';
import { initModal, openModal, closeModal } from './modal.js';
import { initThemeSwitcher } from './theme.js';
import { getLoaderHTML } from './loader.js';

// ---------------------------------
//              SETUP GLOBAL
// ---------------------------------
window.closeModal = closeModal;

// ---------------------------------
//          PUNTO DE ENTRADA (MAIN)
// ---------------------------------
document.addEventListener('DOMContentLoaded', () => {
	// Inicializaciones globales que ocurren en todas las páginas
	initModal();
	initThemeSwitcher();

	// Lógica de autenticación y actualización de UI
	const token = localStorage.getItem('token');
	const user = token ? JSON.parse(localStorage.getItem('user')) : null;

	// Se actualiza la Navbar UNA SOLA VEZ, al principio de la carga.
	if (user) {
		updateNavOnLogin(user);
	} else {
		updateNavOnLogout();
	}

	// 3. Enrutamiento: ejecutar la lógica específica de la página actual
	const path = window.location.pathname;

	if (path.includes('dashboard.html')) {
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
		if (!user || user.role !== 'admin') {
			window.location.href = '/html/dashboard.html';
			return;
		}
		initAdmin(user);
	} else if (path.includes('register.html')) {
		handleRegister();
		initPasswordStrengthMeter();
	} else {
		// index.html
		initializeIndexPage(user);
	}
});

// ---------------------------------
//     LÓGICA ESPECÍFICA DE CADA PÁGINA
// ---------------------------------

/**
 * Inicializar todos los listeners y la carga de datos para la página principal (index.html).
 */
const initializeIndexPage = (user) => {
	// Este listener solo se añade en la página principal
	const loginButton = document.getElementById('login-button');
	if (loginButton) {
		loginButton.addEventListener('click', () => {
			openModal(createLoginModalContent(), 'sm');
			// handleLogin se encargará del 'submit' del formulario
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
				modalContentArea.innerHTML = `<p class="p-8 text-red-500">Error al cargar detalles.</p>`;
			}
		});
	}

	if (modalContainer) {
		modalContainer.addEventListener('click', async (e) => {
			const addToGardenBtn = e.target.closest('#add-to-garden-btn');
			const loginPromptBtn = e.target.closest('#login-prompt-btn');

			// Si se hizo clic en "Añadir a mi Huerta"
			if (addToGardenBtn) {
				const plantId = addToGardenBtn.dataset.plantId;

				// Feedback visual para el usuario
				addToGardenBtn.disabled = true;
				addToGardenBtn.innerHTML =
					'<i class="fas fa-spinner fa-spin mr-2"></i>Añadiendo...';

				try {
					await addPlantToGarden(plantId);
					addToGardenBtn.innerHTML =
						'<i class="fas fa-check mr-2"></i>¡Añadido!';
					addToGardenBtn.classList.remove('bg-eco-green-dark');
					addToGardenBtn.classList.add('bg-green-500');

					// Cerrar el modal después de un éxito
					setTimeout(() => closeModal(), 1500);
				} catch (error) {
					alert(error.message); // Mostrar error
					addToGardenBtn.disabled = false; // Reactivar el botón
					addToGardenBtn.innerHTML =
						'<i class="fas fa-plus-circle mr-2"></i>Añadir a mi Huerta';
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

	loadCatalog();
};

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
		catalogContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Error al cargar el catálogo.</p>`;
	}
};
