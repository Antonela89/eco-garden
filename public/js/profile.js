import { getProfile } from './api.js';

export const initProfile = async () => {
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    });

    try {
        const profile = await getProfile();
        document.getElementById('profile-username').textContent = profile.username;
        document.getElementById('profile-email').textContent = profile.email;
        document.getElementById('profile-role').textContent = profile.role;
    } catch (error) {
        // Si falla, es probable que el token sea inválido
        localStorage.removeItem('token');
        window.location.href = '/index.html';
    }
};