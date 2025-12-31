import { Router, Request, Response } from 'express';
import authRoutes from './auth-routes';
import plantRoutes from './plant-routes';
import gardenerRoutes from './gardener-routes';

const router = Router();

// RUTA DE BIENVENIDA
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

router.use('/auth', authRoutes);
router.use('/plants', plantRoutes);
router.use('/gardener', gardenerRoutes);

export default router;