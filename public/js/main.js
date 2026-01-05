import { handleRegister, handleLogin, updateNavOnLogin, updateNavOnLogout } from './auth.js';
import { getPlants, getPlantById } from './api.js';
import { renderCatalog, createPlantDetailsContent, createLoginModalContent, createAdminPlantForm } from './ui.js';
import { initDashboard } from './dashboard.js';
import { initProfile } from './profile.js';
import { initAdmin } from './admin.js';
import { initPasswordStrengthMeter } from './password-strength.js';
import { initModal, openModal, closeModal } from './modal.js';
import { initThemeSwitcher } from './theme.js';

// ==========================================
//              SETUP GLOBAL
// ==========================================

// Exponer closeModal para que los botones dentro del HTML puedan usarla
window.closeModal = closeModal;

// Función para decodificar JWT
const decodeToken = (token) => {
    try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
};


// ==========================================
//          PUNTO DE ENTRADA (MAIN)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // --- INICIALIZACIONES GLOBALES ---
    initModal();        // Prepara el sistema de modales
    initThemeSwitcher(); // Activa el cambio de tema claro/oscuro

    const path = window.location.pathname;
    const token = localStorage.getItem('token');
    const user = token ? decodeToken(token) : null;

    // --- LÓGICA DE INTERFAZ DINÁMICA ---
    // Actualizar la barra de navegación según si el usuario está logueado o no
    if (user) {
        updateNavOnLogin(user);
    } else {
        updateNavOnLogout();
    }
    
    // --- ENRUTAMIENTO Y EJECUCIÓN POR PÁGINA ---
    if (path.includes('dashboard.html')) {
        if (!user) { window.location.href = '/index.html'; return; }
        initDashboard();
    } else if (path.includes('profile.html')) {
        if (!user) { window.location.href = '/index.html'; return; }
        initProfile();
    } else if (path.includes('admin.html')) {
        if (!user || user.role !== 'admin') { window.location.href = '/html/dashboard.html'; return; }
        initAdmin();
    } else if (path.includes('register.html')) {
        handleRegister();
        initPasswordStrengthMeter();
    } else {
        // Lógica de la página principal (index.html)
        initializeIndexPageListeners(user);
        loadCatalog();
    }
});


// ==========================================
//     INICIALIZACIÓN DE PÁGINA PRINCIPAL
// ==========================================

const initializeIndexPageListeners = (user) => {
    const plantCatalog = document.getElementById('plant-catalog');
    const modalContentArea = document.getElementById('modal-content-area');

    // Listener para abrir el modal de DETALLES DE PLANTA
    if (plantCatalog) {
        plantCatalog.addEventListener('click', async (e) => {
            const card = e.target.closest('[data-plant-id]');
            if (!card) return;

            // Ajustar el tamaño del modal para los detalles
            modalContentArea.className = modalContentArea.className.replace(/max-w-\w+/g, 'max-w-2xl');
            
            // Mostrar loader y abrir modal
            const loaderHTML = `<div class="p-8 text-center"><div class="seed-loader">...</div><p>Germinando...</p></div>`;
            openModal(loaderHTML);

            try {
                const plantId = card.dataset.plantId;
                const plant = await getPlantById(plantId);
                setTimeout(() => {
                    modalContentArea.innerHTML = createPlantDetailsContent(plant, user); // Pasamos el 'user' para saber si está logueado
                }, 1500); // Simular carga
            } catch (error) {
                modalContentArea.innerHTML = `<p class="p-8 text-red-500">Error al cargar detalles.</p>`;
            }
        });
    }
};

const loadCatalog = async () => {
    const catalogContainer = document.getElementById('plant-catalog');
    if (!catalogContainer) return;
    
    try {
        const plants = await getPlants();
        setTimeout(() => {
            renderCatalog(plants);
        }, 1000); // Simular carga
    } catch (error) {
        catalogContainer.innerHTML = `<p class="text-center text-red-500 col-span-full">Error al cargar el catálogo.</p>`;
    }
};