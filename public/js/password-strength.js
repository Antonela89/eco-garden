/**
 * @file Módulo para la gestión del medidor de fortaleza de contraseñas.
 * @description Proporciona feedback visual e instantáneo al usuario mientras
 *              escribe su contraseña en el formulario de registro.
 */

/**
 * Analizar una contraseña y asignarle una puntuación de fortaleza.
 * Evalúa longitud, uso de mayúsculas, números y símbolos.
 * @param {string} password - La contraseña a analizar.
 * @returns {{level: number, text: string, color: string}} Un objeto con el nivel (%), 
 *          texto descriptivo y la clase de color de Tailwind correspondiente.
 * @private
 */
const checkPasswordStrength = (password) => {
    let score = 0;
    // Asignar puntos por cada regla de seguridad cumplida.
    if (password.length >= 8) score++; // Regla 1: Longitud mínima.
    if (/[A-Z]/.test(password)) score++; // Regla 2: Contiene al menos una mayúscula.
    if (/[0-9]/.test(password)) score++; // Regla 3: Contiene al menos un número.
    if (/[^A-Za-z0-9]/.test(password)) score++; // Regla 4: Contiene al menos un símbolo.

     // Devolver el nivel de fortaleza basado en la puntuación.
    if (score <= 1) return { level: 25, text: "Débil", color: "bg-red-500" };
    if (score === 2) return { level: 50, text: "Media", color: "bg-yellow-500" };
    if (score === 3) return { level: 75, text: "Fuerte", color: "bg-blue-500" };
    return { level: 100, text: "Excelente", color: "bg-green-500" };
};

/**
 * Inicializar el medidor de fortaleza de contraseña en el formulario de registro.
 * Asigna un listener al campo de contraseña para actualizar la barra de progreso en tiempo real.
 */
export const initPasswordStrengthMeter = () => {
    // Obtener referencias a los elementos del DOM necesarios.
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('strength-indicator');
    const strengthText = document.getElementById('strength-text');

    // Prevenir la ejecución si alguno de los elementos no se encuentra en la página.
    if (!passwordInput || !strengthIndicator || !strengthText) return;

    // Escuchar el evento 'input' que se dispara cada vez que el usuario teclea.
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        // Resetear la barra si el campo está vacío.
        if (password.length === 0) {
            strengthIndicator.style.width = '0%';
            strengthText.textContent = '';
            return;
        }

        // Obtener el análisis de la contraseña.
        const strength = checkPasswordStrength(password);

        // Actualizar la barra
        strengthIndicator.style.width = `${strength.level}%`;
        // Quitar clases de color viejas y poner la nueva
        strengthIndicator.className = 'h-full transition-all duration-300';
        strengthIndicator.classList.add(strength.color);

        // Actualizar el texto
        strengthText.textContent = strength.text;
    });
};