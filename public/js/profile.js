/**
 * @file Módulo para la gestión de la página de perfil del usuario.
 * @description Se encarga de mostrar los datos del usuario autenticado y de manejar el cierre de sesión.
 */

/**
 * Inicializar la lógica de la página de perfil.
 * Asigna los listeners y puebla el DOM con la información del usuario.
 */

export const initProfile = () => {
	const logoutButton = document.getElementById('logout-button');
	// Asignar el evento de clic para el botón de cierre de sesión.
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Limpiar completamente el almacenamiento local de las credenciales de sesión.
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirigir al usuario a la página de inicio.
            window.location.href = '/index.html';
        });
    }

    /**
     * Leer los datos del usuario directamente desde localStorage para una carga rápida.
     * Esto evita una llamada innecesaria a la API si los datos ya están disponibles.
     */
    const user = JSON.parse(localStorage.getItem('user'));

    // Verificar que los datos del usuario existan antes de intentar mostrarlos en el DOM.
    if (user) {
        // Poblar los elementos HTML con la información del usuario.
        document.getElementById('profile-username').textContent = user.username;
        document.getElementById('profile-email').textContent = user.email;
        document.getElementById('profile-role').textContent = user.role;
    }
};