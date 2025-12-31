// Importación de instancia aplicación de express
import app from './app';

/**
 * Definir el puerto de escucha consultando las variables de entorno o asignando el valor 3000 por defecto.
 */
const PORT = process.env.PORT || 3000;

/**
 * Establecer la lógica principal para poner en funcionamiento el servidor.
 */
const startServer = () => {
	try {
		/**
		 * Iniciar la escucha de peticiones HTTP en el puerto configurado y mostrar el estado en consola.
		 */
		app.listen(PORT, () => {
			console.log('==============================================');
			console.log(`Eco-Garden API - Servidor iniciado`);
			console.log(`Puerto: ${PORT}`);
			console.log(`Fecha: ${new Date().toLocaleDateString()}`);
			console.log(`Localhost: http://localhost:${PORT}/api`);
			console.log('==============================================');
		});
	} catch (error) {
        /**
         * Capturar cualquier error crítico durante el arranque y finalizar la ejecución del proceso.
         */
		console.error('Error al iniciar el servidor:', error);
		process.exit(1); // Detener el proceso si falla
	}
};

/**
 * Ejecutar la función de arranque para poner la API en línea.
 */
startServer();
