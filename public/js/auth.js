// Importación de fetch
import { loginUser, registerUser } from './api.js';

/**
 * Manejar la lógica del formulario de registro.
 */
export const handleRegister = () => {
    const form = document.getElementById('register-form');
    const messageP = document.getElementById('message');

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
            messageP.textContent = '¡Registro exitoso! Redirigiendo al login...';
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
    const errorP = document.getElementById('error-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar que la página se recargue
        errorP.textContent = '';

        const email = form.email.value;
        const password = form.password.value;

        try {
            const data = await loginUser(email, password);
            
            // Guardar el token para futuras peticiones
            localStorage.setItem('token', data.token);
            
            // Redirigir al dashboard (o mostrar un mensaje de éxito)
            alert('¡Login exitoso!');
            // window.location.href = '/dashboard.html'; // Próximo paso

        } catch (error) {
            errorP.textContent = 'Email o contraseña incorrectos.';
        }
    });
};