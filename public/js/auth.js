// Importación de función de logueo
import { loginUser } from './api.js';

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