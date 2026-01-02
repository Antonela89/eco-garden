// Importación de manejadores
import { handleRegister, handleLogin } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
	// Obtener el nombre del archivo (index.html, register.html)
	const page = window.location.pathname;

	if (page === 'index.html' || page === '') {
		if (path.includes('register.html')) {
			// Lógica para la página de registro
			handleRegister();
		} else {
			// Lógica para la página principal (index.html)
			if (document.getElementById('login-form')) {
				handleLogin();
			}
		}
	}
});
