// Importación de modulos
import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
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

// --------------------------------------------
// MIDDLEWARES GLOBALES
// --------------------------------------------

/** Permitir el intercambio de recursos entre diferentes dominios (CORS). */
app.use(cors());

// Registrar las peticiones HTTP en la consola durante el desarrollo.
app.use(morgan('dev'));

/** Habilitar el procesamiento de datos en formato JSON en el cuerpo de las peticiones. */
app.use(express.json());

/**
 * Permitir que el servidor procese datos enviados a través de formularios HTML.
 * La opción 'extended: true' permite manejar objetos complejos y arrays.
 */
app.use(express.urlencoded({ extended: true }));

// --- SERVIR ARCHIVOS ESTÁTICOS ---
// Servir la carpeta 'public' como la raíz principal del frontend
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Servir la carpeta 'shared' para que los archivos JS sean accesibles
const sharedPath = path.join(__dirname, '../shared');
app.use('/shared', express.static(sharedPath)); 

// --------------------------------------------
// RUTAS
// --------------------------------------------

/** Montar el enrutador central de la API bajo el prefijo jerárquico /api. */
app.use('/api', router);

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
