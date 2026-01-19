/**
 * @file Módulo para gestionar el botón de "subir" (Scroll to Top).
 */

/**
 * Inicializar la lógica del botón de "subir".
 * Muestra u oculta el botón según la posición del scroll y maneja el clic.
 */
export const initScrollToTopButton = () => {
    const scrollToTopButton = document.getElementById('scroll-to-top-button');
    if (!scrollToTopButton) return;

    // Mostrar u ocultar el botón al hacer scroll
    window.addEventListener('scroll', () => {
        // Mostrar el botón después de scrollear 300px hacia abajo
        if (window.scrollY > 300) {
            scrollToTopButton.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            scrollToTopButton.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    // Hacer scroll suave hacia arriba al hacer clic
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    });
};