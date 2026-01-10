/**
 * @file Módulo para la gestión de la página de perfil del usuario.
 */

import { openModal, closeModal } from './modal.js';
import { createAlertModalContent, createProfileFormModalContent } from './ui.js';
import { updateProfile } from './api.js';

/**
 * Inicializar la lógica de la página de perfil.
 * Asigna los listeners y puebla el DOM con la información del usuario.
 */

export const initProfile = () => {
	const logoutButton = document.getElementById('logout-button');
	// Asignar el evento de clic para el botón de cierre de sesión.
	if (logoutButton) {
		logoutButton.addEventListener('click', () => {
			// Limpiar completamente el almacenamiento local de las credenciales de sesión.
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			// Redirigir al usuario a la página de inicio.
			window.location.href = '/index.html';
		});
	}

	/**
	 * Leer los datos del usuario directamente desde localStorage para una carga rápida.
	 * Esto evita una llamada innecesaria a la API si los datos ya están disponibles.
	 */
    const user = JSON.parse(localStorage.getItem('user'));

	// Referencias a elementos del DOM
    const editProfileButton = document.getElementById('edit-profile-button');

    // Si no hay usuario, no hacer nada (main.js ya debería haber redirigido)
    if (!user) return;

    // Poblar los datos iniciales del perfil
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-role').textContent = user.role;

    // --- MANEJO DE EVENTOS ---

    // Asignar el evento para abrir el modal de edición
    if (editProfileButton) {
        editProfileButton.addEventListener('click', () => {
            // Abrir un modal con el formulario de edición, pasando el usuario actual
            openModal(createProfileFormModalContent(user), 'md');

            // Añadir el listener de submit
            const form = document.getElementById('profile-form');
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const dataToSend = {};
                    const newUsername = form.username.value.trim();

                    // Solo añadir el username si cambió y no está vacío
                    if (newUsername && newUsername !== user.username) {
                        dataToSend.username = newUsername;
                    }

                    if (Object.keys(dataToSend).length === 0) {
                        closeModal(); // Si no hay cambios, solo cerrar el modal
                        return;
                    }

                    try {
                        // Llamar a la API para actualizar
                        const result = await updateProfile(dataToSend);
                        
                        // Actualizar el localStorage con los nuevos datos
                        localStorage.setItem('user', JSON.stringify(result.user));

                        // Cerrar el modal de edición y mostrar éxito
                        closeModal();
                        openModal(createAlertModalContent('¡Éxito!', 'Tu perfil ha sido actualizado.'), 'sm');
                        
                        // Recargar la página para que la Navbar y el perfil muestren el nuevo nombre
                        setTimeout(() => window.location.reload(), 2000);

                    } catch (error) {
                        openModal(createAlertModalContent('Error', error.message, 'error'), 'sm');
                    }
                });
            }
        });
    }
};