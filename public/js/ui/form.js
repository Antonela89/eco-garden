/**
 * Crear el HTML para el formulario de "Crear/Editar Planta" para el Admin.
 * @param {object} [plant=null] - Si se provee una planta, rellena el formulario para edición.
 * @returns {string} El string HTML del formulario.
 */
export const createAdminPlantForm = (plant = null) => {
	const isEditing = plant !== null;
	const title = isEditing ? 'Editar Especie' : 'Añadir Nueva Especie';

	return `
        <header class="p-6 border-b dark:border-gray-700 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${title}</h2>
            <button class="js-close-modal text-3xl text-gray-400 hover:text-red-500 transition transform hover:rotate-90">
                <i class="fas fa-times"></i>
            </button>
        </header>
        
        <form id="admin-plant-form" class="p-6 max-h-[70vh] overflow-y-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <!-- Columna Izquierda -->
                <div class="flex flex-col gap-4">
                    <div>
                        <label for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">ID (slug)</label>
                        <input type="text" id="id" name="id" value="${
							plant?.id || ''
						}" 
                            ${isEditing ? 'readonly' : 'required'} 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2 ${
								isEditing
									? 'bg-gray-100 cursor-not-allowed'
									: ''
							}">
                    </div>
                    <div>
                        <label for="nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
                        <input type="text" id="nombre" name="nombre" value="${
							plant?.nombre || ''
						}" required 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
                    </div>
                    <div>
                        <label for="familia" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Familia</label>
                        <input type="text" id="familia" name="familia" value="${
							plant?.familia || ''
						}" required 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
                    </div>
                    <div>
                        <label for="clima" class="block text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2">Clima</label>
                        <input type="text" id="clima" name="clima" value="${
							plant?.clima || ''
						}" required 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
                    </div>
                    <div>
                        <label for="imagen" class="block text-sm font-medium text-gray-700 dark:text-gray-300 px-3 py-2">URL de Imagen</label>
                        <input type="url" id="imagen" name="imagen" value="${
							plant?.imagen || ''
						}" required 
                            class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
                    </div>
                </div>

                <!-- Columna Derecha -->
                <div class="flex flex-col gap-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="diasCosechaMin" class="block text-sm font-medium">Cosecha (Mín)</label>
                            <input type="number" id="diasCosechaMin" name="diasCosechaMin" value="${
								plant?.diasCosecha.min || ''
							}" required 
                                class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
                        </div>
                        <div>
                            <label for="diasCosechaMax" class="block text-sm font-medium">Cosecha (Máx)</label>
                            <input type="number" id="diasCosechaMax" name="diasCosechaMax" value="${
								plant?.diasCosecha.max || ''
							}" required 
                                class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="distanciaEntre" class="block text-sm font-medium">Dist. Plantas (cm)</label>
                            <input type="number" id="distanciaEntre" name="distanciaEntre" value="${
								plant?.distancia.entrePlantas || ''
							}" required 
                                class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
                        </div>
                        <div>
                            <label for="distanciaLineas" class="block text-sm font-medium">Dist. Líneas (cm)</label>
                            <input type="number" id="distanciaLineas" name="distanciaLineas" value="${
								plant?.distancia.entreLineas || ''
							}" required 
                                class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
                        </div>
                    </div>
                    <div>
                        <label for="dificultad" class="block text-sm font-medium">Dificultad</label>
                        <select id="dificultad" name="dificultad" required class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
                            <option value="Fácil" ${
								plant?.dificultad === 'Fácil' ? 'selected' : ''
							}>Fácil</option>
                            <option value="Media" ${
								plant?.dificultad === 'Media' ? 'selected' : ''
							}>Media</option>
                            <option value="Difícil" ${
								plant?.dificultad === 'Difícil'
									? 'selected'
									: ''
							}>Difícil</option>
                        </select>
                    </div>
                    <div class="flex items-center space-x-8 mt-2">
                        <label class="flex items-center gap-2">
                            <input type="checkbox" id="aptoMaceta" name="aptoMaceta" ${
								plant?.aptoMaceta ? 'checked' : ''
							} class="rounded">
                            <span>Apto Maceta</span>
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="checkbox" id="toleranciaSombra" name="toleranciaSombra" ${
								plant?.toleranciaSombra ? 'checked' : ''
							} class="rounded">
                            <span>Tolera Sombra</span>
                        </label>
                    </div>
                </div>
            </div>

            <!-- Campos de texto largos (Arrays) -->
            <div class="mt-4">
                <label for="siembra" class="block text-sm font-medium">Meses de Siembra (separados por coma)</label>
                <input type="text" id="siembra" name="siembra" value="${
					plant ? plant.siembra.flat().join(', ') : ''
				}" required 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
            </div>
            <div class="mt-4">
                <label for="asociacion" class="block text-sm font-medium">Asociaciones (separadas por coma)</label>
                <input type="text" id="asociacion" name="asociacion" value="${
					plant?.asociacion.join(', ') || ''
				}" 
                class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
            </div>
            <div class="mt-4">
                <label for="rotacion" class="block text-sm font-medium">Rotación Recomendada (separada por coma)</label>
                <input type="text" id="rotacion" name="rotacion" value="${
					plant?.rotacion.join(', ') || ''
				}" 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
            </div>

            <footer class="mt-8 pt-4 border-t dark:border-gray-700 flex justify-end gap-4">
                <button type="button" class="js-close-modal" class="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300">Cancelar</button>
                <button type="submit" class="bg-eco-green-dark text-white font-bold px-6 py-2 rounded-md hover:bg-opacity-80 transition active:scale-95">
                    ${isEditing ? 'Guardar Cambios' : 'Crear Planta'}
                </button>
            </footer>
        </form>
    `;
};

/**
 * Crear el HTML para el formulario de edición de perfil.
 * @param {object} user - El usuario actual para pre-rellenar el campo.
 * @returns {string}
 */
export const createProfileFormContent = (user) => {
	return `
        <header class="p-6 flex justify-between items-center border-b dark:border-gray-700">
            <h2 class="text-2xl font-bold">Editar Perfil</h2>
            <button class="js-close-modal text-3xl">&times;</button>
        </header>
        <form id="profile-form" class="p-8">
            <div>
                <label for="username" class="block text-sm font-medium">Nombre de Usuario</label>
                <input type="text" id="username" name="username" value="${user.username}" 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
            </div>
            <!-- NOTA: La edición de email y password es más compleja (requiere confirmación)
                por lo que se deja fuera por ahora para simplificar. -->

            <footer class="mt-8 flex justify-end gap-4">
                <button type="button" class="js-close-modal px-6 py-2 rounded-md">Cancelar</button>
                <button type="submit" class="bg-eco-green-dark text-white font-bold px-6 py-2 rounded-md">Guardar Cambios</button>
            </footer>
        </form>
    `;
};

/**
 * Crear el HTML para el formulario de "Añadir Lote a la Huerta".
 * @param {object} plant - La planta que se va a añadir.
 * @returns {string}
 */
export const createAddBatchFormContent = (plant) => {
	return `
        <header class="p-6 flex justify-between items-center border-b dark:border-gray-700" px-3 py-2>
            <h2 class="text-2xl font-bold">Añadir "${plant.nombre}"</h2>
            <button class="js-close-modal text-3xl">&times;</button>
        </header>
        <form id="add-batch-form" data-plant-id="${plant.id}" class="p-8 flex flex-col gap-4">
            <div>
                <label for="quantity" class="block text-sm font-medium">Cantidad de Semillas/Plantines</label>
                <input type="number" id="quantity" name="quantity" value="1" min="1" required 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2">
            </div>
            <div>
                <label for="notes" class="block text-sm font-medium">Notas (opcional)</label>
                <textarea id="notes" name="notes" placeholder="Ej: maceta de la esquina, lado sur..." 
                    class="mt-1 block w-full rounded-md border-gray-300 dark:bg-gray-700 px-3 py-2"></textarea>
            </div>
            <footer class="mt-6 flex justify-end gap-4">
                <button type="button" class="js-close-modal px-6 py-2 rounded-md">Cancelar</button>
                <button type="submit" class="bg-eco-green-dark text-white font-bold px-6 py-2 rounded-md">Confirmar Siembra</button>
            </footer>
        </form>
    `;
};