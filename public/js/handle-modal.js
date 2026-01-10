/**
 * @file Módulo para la gestión centralizada de modales en la aplicación.
 * @description Proporciona funciones para abrir, cerrar e inyectar contenido HTML 
 * dinámico en un único contenedor de modal genérico.
 */

// Referencias a los elementos del DOM
const modalContainer = document.getElementById('modal-container'); // Un contenedor genérico
const modalContent = document.getElementById('modal-content-area'); // El área donde irá el contenido

 // Variable para controlar el estado actual del modal (abierto/cerrado)
let isOpen = false;

/**
 * Abrir el modal e inyectar contenido HTML.
 * @param {string} contentHTML - El HTML que se mostrará dentro del modal.
 * * @param {string} [size='lg'] - El tamaño del modal: 'sm', 'md', 'lg', 'xl', '2xl', etc.
 */
export const openModal = (contentHTML, size = 'lg') => {
	// Prevenir la ejecución si los elementos del DOM no existen (ej. la página no ha cargado)
	if (!modalContainer || !modalContent) return;

    // Definir las clases de tamaño de Tailwind
    const sizeClasses = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '4xl': 'sm:max-w-4xl' // Para formularios grandes como el de Admin
    };

    // Limpiar cualquier clase de tamaño anterior
    modalContent.classList.remove(...Object.values(sizeClasses));

    // Añadimos la nueva clase de tamaño
    modalContent.classList.add(sizeClasses[size] || sizeClasses['lg']);

	// Inyectar el HTML del contenido específico del modal.
	modalContent.innerHTML = contentHTML;
	// Mostrar el contenedor principal del modal (eliminar la clase 'hidden').
	modalContainer.classList.remove('hidden');
	// Actualizar el estado para indicar que el modal está abierto.
	isOpen = true;
};

/**
 * Cerrar el modal, ocultándolo y limpiando su contenido.
 */
export const closeModal = () => {
	// Prevenir la ejecución si el contenedor del modal no existe.
	if (!modalContainer) return;

	// Ocultar el contenedor principal del modal (añadir la clase 'hidden').
	modalContainer.classList.add('hidden');
	// Limpiar el contenido del área del modal para asegurar que el próximo modal cargue limpio
	modalContent.innerHTML = ''; 
	// Actualizar el estado para indicar que el modal está cerrado.
	isOpen = false;
};

/**
 * Inicializar los listeners globales para el modal.
 * Se encarga de cerrar el modal al hacer clic fuera o presionar 'Escape'.
 */
export const initModal = () => {
	// Prevenir la ejecución si el contenedor del modal no existe.
	if (!modalContainer) return;

	/**
	 * Delegación de eventos para el cierre del modal al hacer clic.
	 * Un único listener en el contenedor principal gestiona clics en el fondo
	 * y en cualquier botón con la clase 'js-close-modal' dentro del contenido dinámico.
	 */
	modalContainer.addEventListener('click', (e) => {
		// Cerrar al hacer clic en el fondo oscuro
		if (e.target === modalContainer) {
			closeModal();
			return;
		}

		// El clic fue en un botón de cierre (o su ícono)
		// .closest('.js-close-modal') busca si el elemento clickeado o uno de sus padres tiene esa clase
		if (e.target.closest('.js-close-modal')) {
			closeModal();
		}
	});

	// Cerrar al presionar la tecla 'Escape'
	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && isOpen) {
			closeModal();
		}
	});
};
