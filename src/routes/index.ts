// Importación de Router y tipos específicos de express
import { Router, Request, Response } from 'express';
// Importación de Rutas
import authRoutes from './auth-routes.js';
import plantRoutes from './plant-routes.js';
import gardenerRoutes from './gardener-routes.js';

// Instancia de Router
const router = Router();

/**
 * RUTA DE BIENVENIDA (Home de la API)
 * Proporciona metadatos básicos y un mapa de endpoints para facilitar el testeo.
 */
router.get('/', (req: Request, res: Response) => {
    res.json({
        app: "Eco-Garden API 🌱",
        version: "1.0.0",
        author: "Antonela Borgogno", 
        message: "¡Bienvenido a la gestión de tu huerta urbana basada en datos del INTA!",
        status: "Online",
        endpoints_principales: {
            auth: "/api/auth (Registro y Login)",
            catalogo: "/api/plants (Catálogo de cultivos)",
            huerta: "/api/gardener/garden (Tu parcela personal)"
        },
        fecha_servidor: new Date().toLocaleDateString(),
        ayuda: "Usa el catálogo para saber qué plantar hoy según la temporada."
    });
});

/**
 * MONTAJE DE SUB-RUTAS
 * Organización de los prefijos para mantener las URLs limpias y semánticas.
 */
router.use('/auth', authRoutes); // Maneja identidad
router.use('/plants', plantRoutes); // Maneja catálogo maestro
router.use('/gardener', gardenerRoutes); // Maneja usuario y su huerta

export default router;