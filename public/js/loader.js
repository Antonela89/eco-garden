/**
 * @file Módulo para la gestión del componente visual de carga (loader).
 * @description Centraliza la generación del HTML para la animación de germinación.
 *              Los estilos CSS asociados se definen globalmente en /css/styles.css.
 */

/**
 * Devolver el HTML completo del loader para ser inyectado en un contenedor.
 * @param {string} [message='Germinando información...'] - Mensaje opcional a mostrar.
 * @returns {string} - El string HTML del componente loader.
 */
export const getLoaderHTML = (message = 'Germinando información...') => {
    return `
        <div class="p-8 text-center flex flex-col items-center justify-center gap-4">
            <div class="seed-loader">
                <div class="ground"></div>
                <div class="sprout">
                    <div class="seed-casing"></div>
                    <div class="leaves"></div>
                </div>
                <div class="roots"></div>
            </div>
            <p class="text-gray-500 dark:text-gray-400 font-semibold animate-pulse">${message}</p>
        </div>
    `;
};