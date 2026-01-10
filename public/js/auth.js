// Importación de fetch
import { loginUser, registerUser } from './api.js';
import { openModal, closeModal } from './modal.js';
import { createAlertModalContent } from './ui.js';

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
			openModal(createAlertModalContent('Error de Acceso', 'Email o contraseña incorrectos.', 'error'), 'sm');

			// --- RESTAURAR BOTÓN EN CASO DE ERROR ---
			submitButton.disabled = false;
			submitButton.textContent = 'Ingresar';
		}
	});
};

/**
 * Actualizar la barra de navegación para mostrar el estado de "Usuario Autenticado".
 * @param {object} user - El objeto de usuario decodificado del token.
 */
export const updateNavOnLogin = (user) => {
	const navMenu = document.getElementById('nav-menu');
	if (!navMenu) return;

	const themeButtonHTML =
		document.getElementById('theme-toggle')?.outerHTML ||
		'<button id="theme-toggle" class="text-xl text-gray-600 hover:text-eco-green-dark transition dark:text-gray-300 dark:hover:text-green-300"><i class="fas fa-moon"></i></button>';

	// --- HTML CON DROPDOWN ---
	navMenu.innerHTML = `
        <!-- Botón principal a la Huerta -->
        <a href="/html/dashboard.html" class="bg-eco-green-dark text-white px-4 py-2 rounded-md font-bold hover:bg-opacity-80 transition active:scale-95 flex items-center gap-2">
            <i class="fas fa-leaf"></i>
            <span>Mi Huerta</span>
        </a>

        ${themeButtonHTML}

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
                <button id="logout-button" class="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">Cerrar Sesión</button>
            </div>
        </div>
    `;

	// --- LÓGICA PARA EL DROPDOWN ---
	const menuContainer = document.getElementById('profile-menu-container');
	const menuButton = document.getElementById('profile-menu-button');
	const dropdown = document.getElementById('profile-dropdown');

	if (menuButton && dropdown) {
		menuButton.addEventListener('click', (e) => {
			e.stopPropagation(); // Evita que el clic se propague al 'document'
			dropdown.classList.toggle('hidden');
		});
	}

	// Cerrar el dropdown si se hace clic fuera
	document.addEventListener('click', (e) => {
		if (
			dropdown &&
			!dropdown.classList.contains('hidden') &&
			!menuContainer.contains(e.target)
		) {
			dropdown.classList.add('hidden');
		}
	});

	// Listener de Logout
	document.getElementById('logout-button').addEventListener('click', () => {
		// Limpiar completamente el almacenamiento local de las credenciales de sesión.
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		// Redirigir al usuario a la página de inicio.
		window.location.href = '/index.html';
	});

	if (window.reInitThemeButton) window.reInitThemeButton();
};
/**
 * Restaurar la barra de navegación al estado "Visitante".
 */
export const updateNavOnLogout = () => {
	const navMenu = document.getElementById('nav-menu');
	if (!navMenu) return;

	navMenu.innerHTML = `
        <button id="theme-toggle" class="text-xl text-gray-600 hover:text-eco-green-dark transition dark:text-gray-300 dark:hover:text-green-300">
            <i class="fas fa-moon"></i>
        </button>
        <button id="login-button" class="bg-eco-green-dark text-white px-4 py-2 rounded-md font-bold hover:bg-opacity-80 transition active:scale-95">
            Ingresar
        </button>
    `;

	// La lógica de abrir el modal de login ahora vivirá en main.js
	if (window.reInitThemeButton) window.reInitThemeButton();
};
