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
    if (!navMenu) return;

    const themeButtonHTML = document.getElementById('theme-toggle')?.outerHTML || '<button id="theme-toggle" class="text-xl text-gray-600 hover:text-eco-green-dark transition dark:text-gray-300 dark:hover:text-green-300"><i class="fas fa-moon"></i></button>';

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
                ${user.role === 'admin' ? '<a href="/html/admin.html" class="block px-4 py-2 text-sm text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700">Panel Admin</a>' : ''}
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
        if (dropdown && !dropdown.classList.contains('hidden') && !menuContainer.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    // Listener de Logout
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
