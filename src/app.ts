// Importación de modulos
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
// Importación de Rutas
import router from './routes/index.js';
// Importación de middleware de error
import { errorHandler, notFound } from './middlewares/error-middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cargar las variables de entorno configuradas en el archivo .env.
 */
dotenv.config();

/**
 * Inicializar la instancia de la aplicación Express.
 */
const app = express();

// --- CONFIGURACIÓN DE SEGURIDAD (HELMET Y CSP) ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            // Permitir que, por defecto, todo se cargue desde dominio propio ('self')
            defaultSrc: ["'self'"],
            
            // Definir de dónde se pueden cargar los scripts
            scriptSrc: [
                "'self'",                           // Scripts de dominio propio (ej: /js/main.js)
                "'unsafe-inline'",                  // Permitir scripts inline (necesario para la configuración de Tailwind en el HTML)
                "https://cdn.tailwindcss.com"     // Permitir el script de la CDN de Tailwind
            ],

            // Definir de dónde se pueden cargar los estilos
            styleSrc: [
                "'self'",                           // Estilos dede dominio propio
                "'unsafe-inline'",                  // Permitir estilos inline (necesario para la animación del loader)
                "https://cdnjs.cloudflare.com",   // Permitir los CSS de Font Awesome
                "https://fonts.googleapis.com"    // Permitir los CSS de Google Fonts
            ],

            // Definir de dónde se pueden cargar las fuentes (tipografías)
            fontSrc: [
                "'self'",                           // Fuentes de de dominio propio
                "https://cdnjs.cloudflare.com",   // Permitir las fuentes de Font Awesome
                "https://fonts.gstatic.com"       // Permitir las fuentes de Google Fonts
            ],

            // Definir de dónde se pueden cargar las imágenes
            imgSrc: [
                "'self'",                           // Imágenes de de dominio propio
                "data:",                            // Permitir imágenes en base64 (a veces usadas por librerías)
                "https://res.cloudinary.com"      // Permitir imágenes desde de Cloudinary
            ]
        },
    },
}));

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

// --- DESHABILITAR CACHÉ PARA RUTAS DE LA API ---
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

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
