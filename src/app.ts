// Importación de modulos
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
// Importación de Rutas
import router from './routes/index';
// Importación de middleware de error
import { errorHandler, notFound } from './middlewares/error-middleware';

/**
 * Cargar las variables de entorno configuradas en el archivo .env.
 */
dotenv.config();

/**
 * Inicializar la instancia de la aplicación Express.
 */
const app = express();

/** Habilitar la busqueda de recursos en la carpeta public (Frontend). */
const publicPath = path.join(__dirname, '../public');
console.log(`Sirviendo archivos estáticos desde: ${publicPath}`);
app.use(express.static(publicPath));

// --- CONFIGURACIÓN DE SEGURIDAD (CSP) ---
// Para los errores 'Content-Security-Policy'.
// Permite scripts inline (el de Tailwind CDN) y scripts de self y la CDN de Tailwind.
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				// Permitir scripts de nuestro propio dominio, de Tailwind CDN y los scripts 'inline'
				scriptSrc: [
					"'self'",
					'https://cdn.tailwindcss.com',
					"'unsafe-inline'",
				],
				// Permitir estilos de nuestro propio dominio y los estilos 'inline'
				styleSrc: [
					"'self'",
					'https://cdn.tailwindcss.com',
					"'unsafe-inline'",
				],
				imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'], // Permite Cloudinary y base64
				defaultSrc: ["'self'"], // Por defecto, todo lo demás es de nuestro propio dominio
			},
		},
	})
);

// --------------------------------------------
// MIDDLEWARES GLOBALES
// --------------------------------------------

/** Permitir el intercambio de recursos entre diferentes dominios (CORS). */
app.use(cors());

/**  Registrar las peticiones HTTP en la consola durante el desarrollo. */
app.use(morgan('dev'));

/** Habilitar el procesamiento de datos en formato JSON en el cuerpo de las peticiones. */
app.use(express.json());

/**
 * Permitir que el servidor procese datos enviados a través de formularios HTML.
 * La opción 'extended: true' permite manejar objetos complejos y arrays.
 */
app.use(express.urlencoded({ extended: true }));

// --------------------------------------------
// RUTAS
// --------------------------------------------

/** Montar el enrutador central de la API bajo el prefijo jerárquico /api. */
app.use('/api', router);

// --- RUTA CATCH-ALL PARA EL FRONTEND (SPA fallback) ---
// Si ninguna ruta de la API coincide, siempre servimos el index.html
// Esto es ideal para SPAs donde todas las rutas del frontend se manejan client-side
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// --------------------------------------------
// MANEJO DE ERRORES
// --------------------------------------------

/**
 * Gestionar intentos de acceso a rutas no definidas mediante una respuesta 404.
 * Este middleware debe situarse siempre después de la definición de todas las rutas.
 */
app.use(notFound);

/**
 * Centralizar el manejo de excepciones y errores internos del servidor.
 * Este middleware debe ser el último en la cadena de ejecución de la aplicación.
 */
app.use(errorHandler);

export default app;
