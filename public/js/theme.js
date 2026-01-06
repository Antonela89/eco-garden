/**
 * Inicializar la lógica para el cambio de tema (claro/oscuro).
 * Lee la preferencia del usuario desde localStorage y añade los listeners a los botones.
 */
export const initThemeSwitcher = () => {
	const htmlElement = document.documentElement; // La etiqueta <html> es la que guarda el tema

	/**
	 * Función para aplicar el tema.
	 * @param {string} theme - 'dark' o 'light'.
	 */
	const applyTheme = (theme) => {
		// Limpiar clases
		htmlElement.classList.remove('dark', 'light');

		// Añadir clase según preferencia de usuario
		if (theme === 'dark') {
			htmlElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			htmlElement.classList.add('light');
			localStorage.setItem('theme', 'light');
		}

		// actualizar iconos
		updateThemeIcons(theme);
	};

	/**
	 * Función para actualizar los íconos de sol/luna en todos los botones de tema.
	 */
	const updateThemeIcons = (theme) => {
		const icon =
			theme === 'dark'
				? '<i class="fas fa-sun"></i>'
				: '<i class="fas fa-moon"></i>';
		document.querySelectorAll('#theme-toggle').forEach((button) => {
			button.innerHTML = icon;
		});
	};

	/**
	 * Función para alternar el tema actual.
	 */
	const toggleTheme = () => {
		const currentTheme = localStorage.getItem('theme') || 'light';
		applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
	};

	/**
	 * Re-asigna el listener de clic y ACTUALIZA el ícono del botón.
	 */
	const reInitThemeButton = () => {
		document.querySelectorAll('#theme-toggle').forEach((button) => {
			button.removeEventListener('click', toggleTheme);
			button.addEventListener('click', toggleTheme);
		});
		// Sincronizar el ícono inmediatamente
		updateThemeIcons(localStorage.getItem('theme') || 'light');
	};

	// --- LÓGICA DE INICIALIZACIÓN ---
	window.reInitThemeButton = reInitThemeButton;

	const savedTheme =
		localStorage.getItem('theme') ||
		(window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light');

	applyTheme(savedTheme); // Aplica el tema guardado
	reInitThemeButton(); // Asigna los listeners a los botones iniciales
};
