// Referencias a los elementos del DOM
const modalContainer = document.getElementById('modal-container'); // Un contenedor genérico
const modalContent = document.getElementById('modal-content-area'); // El área donde irá el contenido

let isOpen = false;

/**
 * Abrir el modal e inyectar contenido HTML.
 * @param {string} contentHTML - El HTML que se mostrará dentro del modal.
 */
export const openModal = (contentHTML) => {
	if (!modalContainer || !modalContent) return;

	modalContent.innerHTML = contentHTML;
	modalContainer.classList.remove('hidden');
	isOpen = true;
};

/**
 * Cerrar el modal.
 */
export const closeModal = () => {
	if (!modalContainer) return;

	console.log('Cerrando el modal...');

	modalContainer.classList.add('hidden');
	modalContent.innerHTML = ''; // Limpiar contenido al cerrar
	isOpen = false;
};

/**
 * Inicializar los listeners globales para el modal.
 * Se encarga de cerrar el modal al hacer clic fuera o presionar 'Escape'.
 */
export const initModal = () => {
	if (!modalContainer) return;

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
