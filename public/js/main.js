// Importación de manejadores
import { handleRegister, handleLogin } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Obtener el nombre del archivo (index.html, register.html)
	const page = window.location.pathname.split('/').pop(); 

	if (page === 'index.html' || page === '') {
		// Lógica para la página de Login
		if (document.getElementById('login-form')) {
			handleLogin();
		}
	} else if (page === 'register.html') {
		// Lógica para la página de registro
		handleRegister();
	}
});
