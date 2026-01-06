// import { getProfile } from './api.js';

export const initProfile = async () => {
	const logoutButton = document.getElementById('logout-button');
	logoutButton.addEventListener('click', () => {
		localStorage.removeItem('token');
		window.location.href = '/index.html';
	});

	// Leer los datos del usuario guardados en el login
	const user = JSON.parse(localStorage.getItem('user'));

	if (user) {
		document.getElementById('profile-username').textContent = user.username;
		document.getElementById('profile-email').textContent = user.email; 
		document.getElementById('profile-role').textContent = user.role;
	}
};
