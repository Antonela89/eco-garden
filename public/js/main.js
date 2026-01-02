// Importación del manejador de logueo
import { handleLogin } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    // Si está en la página de login, activar el manejador
    if (document.getElementById('login-form')) {
        handleLogin();
    }
});