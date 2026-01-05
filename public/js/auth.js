// Importación de fetch
import { loginUser, registerUser } from './api.js';
import { openModal } from './modal.js';
import { createProfileModalContent, createLoginModalContent } from './ui.js';

/**
 * Manejar la lógica del formulario de registro.
 */
export const handleRegister = () => {
	const form = document.getElementById('register-form');
	const messageP = document.getElementById('register-message');

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		messageP.textContent = '';
		messageP.className = 'text-sm mt-4 text-center'; // Resetear clases

		const username = form.username.value;
		const email = form.email.value;
		const password = form.password.value;

		try {
			const data = await registerUser(username, email, password);

			// Mostramos mensaje de éxito
			messageP.textContent =
				'¡Registro exitoso! Redirigiendo al login...';
			messageP.classList.add('text-green-600');

			// Esperamos un par de segundos y lo llevamos a la página de login
			setTimeout(() => {
				window.location.href = '../index.html';
			}, 2000);
		} catch (error) {
			// Mostramos el mensaje de error que nos da la API (Zod)
			messageP.textContent = error.message;
			messageP.classList.add('text-red-500');
		}
	});
};

export const handleLogin = () => {
	const form = document.getElementById('login-form');
	if (!form) return;

	const errorP = document.getElementById('login-error-message');

	form.addEventListener('submit', async (e) => {
		e.preventDefault(); // Evitar que la página se recargue
		errorP.textContent = '';

		const email = form.email.value;
		const password = form.password.value;

		try {
			const data = await loginUser(email, password);

			// Guardar el token para futuras peticiones
			localStorage.setItem('token', data.token);

			// Redirigir al dashboard
			window.location.href = '/html/dashboard.html';
		} catch (error) {
			errorP.textContent = 'Email o contraseña incorrectos.';
		}
	});
};

/**
 * Actualizar la barra de navegación para mostrar el estado de "Usuario Autenticado".
 * @param {object} user - El objeto de usuario decodificado del token.
 */
export const updateNavOnLogin = (user) => {
	const navContainer = document.querySelector(
		'header nav .flex.items-center.gap-4'
	);
	if (!navContainer) return;

	// HTML para el menú de usuario logueado
	navContainer.innerHTML = `
        <span class="font-bold text-gray-700 dark:text-gray-300">¡Hola, ${
			user.username
		}!</span>
        <button id="profile-button" class="text-gray-600 dark:text-gray-300 hover:text-eco-green-dark">Mi Perfil</button>
        ${
			user.role === 'admin'
				? '<a href="/html/admin.html" class="text-yellow-500 font-bold hover:underline">Panel Admin</a>'
				: ''
		}
        <button id="logout-button" class="bg-red-500 text-white px-4 py-2 rounded-md font-bold">Cerrar Sesión</button>
    `;

	// Añadir listeners a los nuevos botones
	document.getElementById('logout-button').addEventListener('click', () => {
		localStorage.removeItem('token');
		window.location.reload(); // Recargar la página para actualizar el estado
	});

	document.getElementById('profile-button').addEventListener('click', () => {
		// Abrir un modal con la info del perfil
		openModal(createProfileModalContent(user));
	});
};

/**
 * Restaurar la barra de navegación al estado de "Visitante".
 */
export const updateNavOnLogout = () => {
	const navContainer = document.querySelector(
		'header nav .flex.items-center.gap-4'
	);
	if (!navContainer) return;

	// HTML para el menú de visitante
	navContainer.innerHTML = `
        <button id="theme-toggle" class="text-xl text-gray-600 dark:text-gray-300 hover:text-eco-green-dark transition">
            <i class="fas fa-moon"></i>
        </button>
        <button id="login-button" class="bg-eco-green-dark text-white px-4 py-2 rounded-md font-bold hover:bg-opacity-80 transition active:scale-95">
            Ingresar
        </button>
    `;

	// Re-añadir el listener para el botón de login
	const loginButton = document.getElementById('login-button');
	if (loginButton) {
		loginButton.addEventListener('click', () => {
			openModal(createLoginModalContent());
			handleLogin();
		});
	}
};
