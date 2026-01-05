/**
 * Inicializar la lógica para el cambio de tema (claro/oscuro).
 * Lee la preferencia del usuario desde localStorage y añade los listeners a los botones.
 */
export const initThemeSwitcher = () => {
	const themeToggleButtons = document.querySelectorAll('#theme-toggle'); // Seleccionar todos los botones de tema
	const htmlElement = document.documentElement; // La etiqueta <html> es la que guarda el tema

	/**
	 * Función para aplicar el tema.
	 * @param {string} theme - 'dark' o 'light'.
	 */
	const applyTheme = (theme) => {
		if (theme === 'dark') {
			htmlElement.classList.add('dark');
			themeToggleButtons.forEach((button) => {
				button.innerHTML = '<i class="fas fa-sun"></i>'; // Mostrar ícono de sol
			});
			localStorage.setItem('theme', 'dark');
		} else {
			htmlElement.classList.remove('dark');
			themeToggleButtons.forEach((button) => {
				button.innerHTML = '<i class="fas fa-moon"></i>'; // Mostrar ícono de luna
			});
			localStorage.setItem('theme', 'light');
		}
	};

	/**
	 * Función para alternar el tema actual.
	 */
	const toggleTheme = () => {
		const currentTheme = localStorage.getItem('theme') || 'light';
		applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
	};

	// Añadir el listener de clic a cada botón de cambio de tema
	themeToggleButtons.forEach((button) => {
		button.addEventListener('click', toggleTheme);
	});

	// Cargar el tema guardado al iniciar la página
	const savedTheme =
		localStorage.getItem('theme') ||
		(window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light');

	applyTheme(savedTheme);
};
