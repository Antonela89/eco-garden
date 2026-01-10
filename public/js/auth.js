import { getThemeButtonHTML } from './theme.js';
import { loginUser, registerUser } from './api.js';
import { openModal, closeModal } from './modal.js';
import { createAlertModalContent, createLoginModalContent } from './ui.js';

// -----------------------------------
// MANEJADORES DE FORMULARIOS
// -----------------------------------

/**
 * Manejar la lógica del formulario de registro.
 * Incluye feedback visual (loader) y modales de alerta.
 */
export const handleRegister = () => {
	const form = document.getElementById('register-form');
	if (!form) return;

	const submitButton = form.querySelector('button[type="submit"]');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		// --- APLICAR LOADER ---
		submitButton.disabled = true;
		submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Creando cuenta...`;

		try {
			const { username, email, password } = form.elements;
			await registerUser(username.value, email.value, password.value);

			// --- MOSTRAR MODAL DE ÉXITO ---
			openModal(
				createAlertModalContent(
					'¡Registro Exitoso!',
					'Tu cuenta ha sido creada. Serás redirigido para iniciar sesión.'
				),
				'sm'
			);

			setTimeout(() => {
				closeModal();
				window.location.href = '/index.html';
			}, 3000);
		} catch (error) {
			openModal(
				createAlertModalContent(
					'Error en el Registro',
					error.message,
					'error'
				),
				'sm'
			);
			// --- RESTAURAR BOTÓN ---
			submitButton.disabled = false;
			submitButton.textContent = 'Crear mi Cuenta';
		}
	});
};

/**
 * Manejar el envío del formulario de login.
 * Incluye feedback visual (loader).
 */
export const handleLogin = () => {
	const form = document.getElementById('login-form');
	if (!form) return;

	const submitButton = form.querySelector('button[type="submit"]');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();

		// --- APLICAR LOADER ---
		submitButton.disabled = true;
		submitButton.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>Ingresando...`;

		try {
			const { email, password } = form.elements;
			const data = await loginUser(email.value, password.value);

			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));

			window.location.href = '/html/dashboard.html';
		} catch (error) {
			openModal(
				createAlertModalContent(
					'Error de Acceso',
					'Email o contraseña incorrectos.',
					'error'
				),
				'sm'
			);

			// --- RESTAURAR BOTÓN EN CASO DE ERROR ---
			submitButton.disabled = false;
			submitButton.textContent = 'Ingresar';
		}
	});
};

// --- FUNCIONES AUXILIARES DE NAVEGACIÓN ---

/**
 * Función auxiliar para cerrar sesión.
 * Centraliza la lógica para ser llamada desde Desktop y Mobile.
 */
const handleLogout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	window.location.href = '/index.html';
};

/**
 * Función auxiliar para abrir el modal de login.
 */
const openLoginModal = () => {
	openModal(createLoginModalContent(), 'sm');
	handleLogin();
};

// --- MANEJO DE UI DE NAVEGACIÓN ---

/**
 * Actualizar AMBAS navbars (Desktop y Mobile) para mostrar el estado de "Usuario Autenticado".
 * @param {object} user - El objeto de usuario decodificado del token.
 */
export const updateNavOnLogin = (user) => {
	const navMenuDesktop = document.getElementById('nav-menu-desktop');
	const navMenuMobile = document.getElementById('nav-menu-mobile');
	if (!navMenuDesktop || !navMenuMobile) return;

	// --- RENDERIZAR MENÚ DESKTOP ---
	navMenuDesktop.innerHTML = `
        <!-- Botón principal a la Huerta -->
        <a href="/html/dashboard.html" class="bg-eco-green-dark text-white px-4 py-2 rounded-md font-bold hover:bg-opacity-80 transition active:scale-95 flex items-center gap-2">
            <i class="fas fa-leaf"></i>
            <span>Mi Huerta</span>
        </a>

        ${getThemeButtonHTML()}

        <!-- Contenedor del Menú Desplegable -->
        <div class="relative" id="profile-menu-container">
            <!-- Botón que abre el menú -->
            <button id="profile-menu-button" class="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300">
                <span>¡Hola, ${user.username}!</span>
                <i class="fas fa-chevron-down text-xs"></i>
            </button>
            
            <!-- El menú (oculto por defecto) -->
            <div id="profile-dropdown" class="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-md shadow-lg py-1 hidden">
                <a href="/html/profile.html" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Mi Perfil</a>
                ${
					user.role === 'admin'
						? '<a href="/html/admin.html" class="block px-4 py-2 text-sm text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700">Panel Admin</a>'
						: ''
				}
                <div class="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                <button id="logout-button-desktop" class="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">Cerrar Sesión</button>
            </div>
        </div>
    `;

	// --- RENDERIZAR MENÚ MOBILE ---
	// Clases comunes para los enlaces del menú móvil para mantener consistencia
	const mobileLinkClasses =
		'block p-4 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

	navMenuMobile.innerHTML = `
        <a href="/html/dashboard.html" class="${mobileLinkClasses}">Mi Huerta</a>
        <a href="/html/profile.html" class="${mobileLinkClasses}">Mi Perfil</a>
        ${
			user.role === 'admin'
				? `<a href="/html/admin.html" class="${mobileLinkClasses} text-yellow-500">Panel Admin</a>`
				: ''
		}
		
		<div class="border-t border-gray-200 dark:border-gray-600 my-1"></div>
		<div class="px-3 py-2 flex justify-between items-center">
            <span>Cambiar Tema</span>
            ${getThemeButtonHTML()}
        </div>
        <div class="border-t border-gray-200 dark:border-gray-600 my-1"></div>
        <button id="logout-button-mobile" class="${mobileLinkClasses} text-red-500">Cerrar Sesión</button>
    `;

	// --- ASIGNAR LISTENERS A LOS NUEVOS ELEMENTOS ---
	// Dropdown de perfil
	const menuContainer = document.getElementById('profile-menu-container');
	const menuButton = document.getElementById('profile-menu-button');
	const dropdown = document.getElementById('profile-dropdown');
	if (menuButton && dropdown) {
		menuButton.addEventListener('click', (e) => {
			e.stopPropagation();
			dropdown.classList.toggle('hidden');
		});
	}
	document.addEventListener('click', (e) => {
		if (
			dropdown &&
			!dropdown.classList.contains('hidden') &&
			!menuContainer.contains(e.target)
		) {
			dropdown.classList.add('hidden');
		}
	});

	// Botones de Logout
	document
		.getElementById('logout-button-desktop')
		.addEventListener('click', handleLogout);
	document
		.getElementById('logout-button-mobile')
		.addEventListener('click', handleLogout);

	// Reactivar el botón del tema
	if (window.reInitThemeButton) window.reInitThemeButton();
};

/**
 * Restaurar la barra de navegación al estado "Visitante".
 */
export const updateNavOnLogout = () => {
	const navMenuDesktop = document.getElementById('nav-menu-desktop');
	const navMenuMobile = document.getElementById('nav-menu-mobile');

	if (!navMenuDesktop || !navMenuMobile) return;

	// --- RENDERIZAR MENÚS DE VISITANTE ---

	navMenuDesktop.innerHTML = `
        ${getThemeButtonHTML()} 
		<div class="border-t border-gray-200 dark:border-gray-600 my-1"></div>
        <button id="login-button-desktop" class="bg-eco-green-dark text-white px-4 py-2 rounded-md font-bold hover:bg-opacity-80 transition active:scale-95">
            Ingresar
        </button>
    `;

	// Clases comunes para los enlaces del menú móvil para mantener consistencia
	const mobileLinkClasses =
		'block w-full text-base p-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex';
	navMenuMobile.innerHTML = `
        <button id="login-button-mobile" class="${mobileLinkClasses}">Ingresar</button>
		<div class="border-t border-gray-200 dark:border-gray-600 my-1"></div>
		<div id="mobile-theme-switcher" class="${mobileLinkClasses} flex justify-between items-center cursor-pointer">
            <span>Cambiar Tema</span>
            ${getThemeButtonHTML()}
        </div>
    `;

	// --- ASIGNAR LISTENERS ---
	document
		.getElementById('login-button-desktop')
		.addEventListener('click', openLoginModal);
	document
		.getElementById('login-button-mobile')
		.addEventListener('click', openLoginModal);

	// Reactivar el botón del tema
	if (window.reInitThemeButton) window.reInitThemeButton();
};
