/**
 * Analizar la fortaleza de una contraseña y devolver un nivel y un color.
 * @param {string} password - La contraseña a analizar.
 * @returns {{level: number, text: string, color: string}}
 */
const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++; // Símbolos

    if (score <= 1) return { level: 25, text: "Débil", color: "bg-red-500" };
    if (score === 2) return { level: 50, text: "Media", color: "bg-yellow-500" };
    if (score === 3) return { level: 75, text: "Fuerte", color: "bg-blue-500" };
    return { level: 100, text: "Excelente", color: "bg-green-500" };
};

/**
 * Inicializar el medidor de fortaleza de contraseña en un formulario.
 */
export const initPasswordStrengthMeter = () => {
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('strength-indicator');
    const strengthText = document.getElementById('strength-text');

    if (!passwordInput || !strengthIndicator || !strengthText) return;

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        if (password.length === 0) {
            strengthIndicator.style.width = '0%';
            strengthText.textContent = '';
            return;
        }

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