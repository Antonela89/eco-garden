// Importación de manejadores
import { handleRegister, handleLogin } from './auth.js';
import { getPlants, getPlantById } from './api.js';
import { renderCatalog, createPlantDetailsContent } from './ui.js';
import { initDashboard } from './dashboard.js';
import { initProfile } from './profile.js';
import { initAdmin } from './admin.js';
import { initPasswordStrengthMeter } from './password-strength.js';
import { initThemeSwitcher } from './theme.js';

// Función para decodificar JWT (simple, sin librerías)
const decodeToken = (token) => {
	try {
		return JSON.parse(atob(token.split('.')[1]));
	} catch (e) {
		return null;
	}
};

document.addEventListener('DOMContentLoaded', async () => {
	// INICIALIZAR EL TEMA (Funcionalidad global)
	initThemeSwitcher();

	// LÓGICA DE ENRUTAMIENTO Y SEGURIDAD (Específica de cada página)
	// Obtener el nombre del archivo (index.html, register.html)
	const path = window.location.pathname;
	const token = localStorage.getItem('token');
	const user = token ? decodeToken(token) : null;

	// Elemento para mostrar mensajes de carga o error
	const catalogContainer = document.getElementById('plant-catalog');

	if (path.includes('dashboard.html')) {
		if (!token) {
			window.location.href = '/index.html';
			return;
		}
		initDashboard();
	} else if (path.includes('profile.html')) {
		if (!token) {
			window.location.href = '/index.html';
			return;
		}
		initProfile();
	} else if (path.includes('admin.html')) {
		// Doble seguridad: requiere token Y que el rol sea 'admin'
		if (!user || user.role !== 'admin') {
			window.location.href = '/html/dashboard.html'; // O a una página de "acceso denegado"
			return;
		}
		initAdmin();
	} else if (path.includes('register.html')) {
		handleRegister();
		initPasswordStrengthMeter();
	} else {
		// Página principal (index.html)
		handleLogin();
		// Lógica del catálogo

		try {
			// Mostrar un mensaje de carga mientras se esperan los datos
			catalogContainer.innerHTML =
				'<p class="text-center col-span-full">Cargando catálogo...</p>';

			// Llamar a la API para obtener todas las plantas
			const plants = await getPlants();

			// Renderizar las plantas en el HTML
			renderCatalog(plants);
		} catch (error) {
			// Mostrar un mensaje de error si la API falla
			catalogContainer.innerHTML =
				'<p class="text-center text-red-500 col-span-full">No se pudo cargar el catálogo. Inténtalo de nuevo más tarde.</p>';
			console.error('Error al cargar el catálogo:', error);
		}
	}

	const plantCatalog = document.getElementById('plant-catalog');
	const modal = document.getElementById('plant-details-modal');
	const modalContent = document.getElementById('modal-content');

	const openModal = () => modal.classList.remove('hidden');
	const closeModal = () => modal.classList.add('hidden');

	// Lógica para abrir el modal al hacer clic en una tarjeta
	if (plantCatalog) {
		plantCatalog.addEventListener('click', async (e) => {
			// Buscamos el ancestro más cercano que sea una tarjeta
			const card = e.target.closest('[data-plant-id]');
			if (!card) return;

			const plantId = card.dataset.plantId;
			openModal();
			// Loader
			modalContent.innerHTML = `
			<div class="p-8 text-center flex flex-col items-center justify-center gap-4">
        		<div class="seed-loader">
            		<div class="sprout"></div>
            		<div class="seed"></div>
            		<div class="ground"></div>
        		</div>
        		<p class="text-gray-500 dark:text-gray-400 font-semibold">Cargando detalles...</p>
    		</div>
				`;

			try {
				// Obtenemos los detalles de ESA planta
				const plant = await getPlantById(plantId);
				// Renderizamos los detalles en el modal
				modalContent.innerHTML = createPlantDetailsContent(plant);

				// Añadimos el listener para el botón de cierre DENTRO del modal
				document
					.getElementById('close-details-modal')
					.addEventListener('click', closeModal);
			} catch (error) {
				modalContent.innerHTML =
					'<p class="p-8 text-red-500">Error al cargar los detalles.</p>';
			}
		});
	}

	// Cerrar modal al hacer clic fuera del contenido
	if (modal) {
		modal.addEventListener('click', (e) => {
			if (e.target === modal) closeModal();
		});
	}

	// --- LÓGICA DE INTERFAZ COMÚN ---
	const loginModal = document.getElementById('login-modal');
	const loginButton = document.getElementById('login-button');
	const closeLoginModalButton = document.getElementById('close-login-modal');

	// Abrir modal
	if (loginButton) {
		loginButton.addEventListener('click', () => {
			loginModal.classList.remove('hidden');
		});
	}

	// Cerrar modal
	if (closeLoginModalButton) {
		closeLoginModalButton.addEventListener('click', () => {
			loginModal.classList.add('hidden');
		});
	}

	// Cerrar modal al hacer clic fuera
	if (loginModal) {
		loginModal.addEventListener('click', (e) => {
			if (e.target === loginModal) {
				loginModal.classList.add('hidden');
			}
		});
	}
});
