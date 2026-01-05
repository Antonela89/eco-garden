// Importación de fetch
import { loginUser, registerUser } from './api.js';

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

			// Guardar usuario
			localStorage.setItem('user', JSON.stringify(data.user)); // Convertir el objeto a string

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
    const navMenu = document.getElementById('nav-menu');
    if (!navMenu) {
		console.log(navMenu);
		
		return};

    const themeButtonHTML = document.getElementById('theme-toggle')?.outerHTML || '<button id="theme-toggle" class="text-xl text-gray-600 hover:text-eco-green-dark transition dark:text-gray-300 dark:hover:text-green-300"><i class="fas fa-moon"></i></button>';

    navMenu.innerHTML = `
        <span class="font-bold text-gray-700 dark:text-gray-300 hidden sm:block">¡Hola, ${user.username}!</span>
        <a href="/html/profile.html" class="text-gray-600 dark:text-gray-300 hover:text-eco-green-dark">Mi Perfil</a>
        ${user.role === 'admin' ? '<a href="/html/admin.html" class="font-bold text-yellow-400 hover:text-yellow-300">Admin</a>' : ''}
        ${themeButtonHTML}
        <button id="logout-button" class="bg-red-500 text-white px-4 py-2 rounded-md font-bold">Cerrar Sesión</button>
    `;

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
