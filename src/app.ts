import express from 'express';
import cors from 'cors';
// import morgan from 'morgan';
import dotenv from 'dotenv';
import router from './routes/index';
import { errorHandler, notFound } from './middlewares/error-middleware';

// Cargar variables de entorno (.env)
dotenv.config();

const app = express();

// --- MIDDLEWARES GLOBALES ---
app.use(cors());               // Permite que el frontend se conecte
// app.use(morgan('dev'));        // Muestra las peticiones en la consola (logger)
app.use(express.json());       // Permite recibir cuerpos de mensaje en formato JSON
app.use(express.urlencoded({ extended: true })); // Para que servidor entienda los datos enviados a través de un formulario HTML común.

// --- RUTAS ---
app.use('/api', router);

// --- MANEJO DE ERRORES ---
// El 404 siempre va después de las rutas
app.use(notFound);
// El errorHandler siempre va al final de todo
app.use(errorHandler);

export default app;