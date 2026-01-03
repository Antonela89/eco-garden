// Importación de manejadores
import { handleRegister, handleLogin } from './auth.js';
import { getPlants } from './api.js';
import { renderCatalog } from './ui.js';
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
