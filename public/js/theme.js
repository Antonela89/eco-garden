/**
 * @file Módulo para la gestión del tema visual de la aplicación (Modo Claro / Modo Oscuro).
 * @description Se encarga de leer, aplicar y persistir la preferencia de tema del usuario.
 */

/**
 * Inicializar el sistema de cambio de tema.
 * Configura los listeners y aplica el tema guardado o el preferido por el sistema.
 */
export const initThemeSwitcher = () => {
	// Obtener la etiqueta <html> para manipular sus clases.
	const htmlElement = document.documentElement;

	/**
	 * Aplicar un tema específico a la aplicación.
	 * Modifica la clase del elemento <html>, guarda la preferencia en localStorage y actualiza los íconos.
	 * @param {string} theme - 'dark' o 'light'.
	 * @private
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
	 * Actualizar el ícono (sol/luna) en todos los botones de cambio de tema.
	 * @param {string} theme - 'dark' o 'light'.
	 * @private
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
	 * Alternar entre el modo claro y oscuro.
	 * Lee el tema actual y llama a `applyTheme` con la opción contraria.
	 * @private
	 */
	const toggleTheme = () => {
		const currentTheme = localStorage.getItem('theme') || 'light';
		applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
	};

	/**
	 * Re-inicializar los listeners para todos los botones de cambio de tema.
	 * Útil para elementos que se añaden dinámicamente al DOM (como la navbar de logout).
	 * También sincroniza el ícono del botón con el tema actual.
	 */
	const reInitThemeButton = () => {
		document.querySelectorAll('#theme-toggle').forEach((button) => {
			// Limpiar listeners antiguos para evitar duplicados.
			button.removeEventListener('click', toggleTheme);
			// Asignar el nuevo listener.
			button.addEventListener('click', toggleTheme);
		});
		// Sincronizar el ícono inmediatamente
		updateThemeIcons(localStorage.getItem('theme') || 'light');
	};

	// --- LÓGICA DE INICIALIZACIÓN ---
	// Exponer la función de re-inicialización globalmente para que otros módulos puedan llamarla.
	window.reInitThemeButton = reInitThemeButton;

	// Determinar el tema inicial a aplicar.
	const savedTheme =
		// Buscar la preferencia del usuario
		localStorage.getItem('theme') ||
		// Si no hay, respetar al sistema operativo
		(window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light');

	applyTheme(savedTheme); // Aplica el tema guardado
	reInitThemeButton(); // Asigna los listeners a los botones iniciales
};

/**
 * Generar el HTML para el botón de cambio de tema.
 * @returns {string} El string HTML del botón.
 */
export const getThemeButtonHTML = () => {
	return `
        <button id="theme-toggle" class="text-xl text-gray-600 hover:text-eco-green-dark transition dark:text-gray-300 dark:hover:text-green-300"><i class="fas fa-moon"></i></button>
    `;
};
