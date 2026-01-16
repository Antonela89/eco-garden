// -----------------------------------
// FUNCIONES AUXILIARES (HELPERS)
// -----------------------------------

/**
 * Formatear el rango de días de cosecha para mostrarlo al usuario.
 * @param {object} plant - La planta con el objeto diasCosecha.
 * @returns {string} - "90" o "90 - 120".
 */
export const formatHarvestDays = (plant) => {
	if (plant.diasCosecha.min === plant.diasCosecha.max) {
		return `${plant.diasCosecha.max}`;
	} else {
		return `${plant.diasCosecha.min} - ${plant.diasCosecha.max}`;
	}
};

/**
 * Crear un calendario visual de siembra para una planta.
 * @param {string[]} siembraMonths - Array de meses aptos para la siembra.
 * @returns {string} - El string HTML del calendario.
 */
export const createSowingCalendar = (siembraMonths) => {
	const allMonths = [
		'Ene',
		'Feb',
		'Mar',
		'Abr',
		'May',
		'Jun',
		'Jul',
		'Ago',
		'Sep',
		'Oct',
		'Nov',
		'Dic',
	];

	// flat() para manejar casos como el Repollo
	const aptMonths = siembraMonths.flat();

	let calendarHTML =
		'<div class="grid grid-cols-6 sm:grid-cols-12 gap-1 mt-2">';

	allMonths.forEach((month) => {
		const isSowable = aptMonths.some((aptMonth) =>
			aptMonth.startsWith(month)
		);

		// Colorear el mes si es apto
		const bgColor = isSowable
			? 'bg-eco-green-light'
			: 'bg-gray-200 dark:bg-gray-600';
		const textColor = isSowable
			? 'text-green-600'
			: 'text-gray-500 dark:text-gray-100';

		calendarHTML += `
            <div class="flex flex-col items-center">
                <span class="text-xs font-bold ${textColor}">${month}</span>
                <div class="w-full h-2 rounded-full ${bgColor}"></div>
            </div>
        `;
	});

	calendarHTML += '</div>';
	return calendarHTML;
};

/**
 * Verificar si una planta se puede sembrar en el mes actual.
 * @param {object} plant - El objeto de la planta.
 * @returns {boolean} - true si es temporada, false si no.
 */
export const isSowableNow = (plant) => {
	const meses = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	];
	const mesActual = meses[new Date().getMonth()];
	return plant.siembra.flat().includes(mesActual);
};











