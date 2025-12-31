import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GardenerModel } from '../models/gardener-model';
import { PlantModel } from '../models/plant-model';

// Clave
const JWT_SECRET = process.env.JWT_SECRET || 'Mi_Semilla';

export class GardenerController {
	// AUTH
	// Registro
	static register = (req: Request, res: Response) => {
		// Extraer los datos del body
		const { password, ...rest } = req.body;
		// Encriptar
		const hashedPassword = bcrypt.hashSync(password, 10);
		// Crear -> datos + contraseña encriptada
		const newUser = GardenerModel.create({
			...rest,
			password: hashedPassword,
		});

		// SEGURIDAD: Quitar la contraseña del objeto antes de responder
		const { password: _, ...userResponse } = newUser;

		res.status(201).json({ message: 'Usuario registrado', userResponse });
	};

	// Login
	static login = (req: Request, res: Response) => {
		// Desestructuracion
		const { email, password } = req.body;
		// Buscar usuario
		const user = GardenerModel.getByEmail(email);

		// Validación -> Si no existe o la contraseña no coincide
		if (!user || !bcrypt.compareSync(password, user.password)) {
			return res.status(401).json({ message: 'Error de credenciales' });
		}

		// Generar Token con datos no sensibles
		const token = jwt.sign(
			{
				id: user.id,
				role: user.role,
				email: user.email,
			},
			JWT_SECRET,
			{ expiresIn: '1h' }
		);

		// Respuesta
		res.json({
			message: '¡Bienvenido de nuevo!',
			token: token,
			user: {
				id: user.id,
				username: user.username,
				role: user.role,
			},
		});
	};

	// PERFIL
	static getProfile = (req: Request, res: Response) => {
		const user = GardenerModel.getById(req.user!.id);
		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });
		const { password, ...userData } = user;
		res.json(userData);
	};

	// GESTIÓN DE LA HUERTA (Logica relacional)

	// Ver huerta con detalles de las plantas
	static getMyGarden = (req: Request, res: Response) => {
		const user = GardenerModel.getById(req.user!.id);
		if (!user) return res.status(404).json({ message: 'Error' });

		// Cruzar los datos de misPlantas con el catálogo de PlantModel
		const detailedGarden = user.misPlantas.map((miPlanta) => {
			const infoBase = PlantModel.getById(miPlanta.plantId);
			return {
				...miPlanta,
				nombre: infoBase?.nombre,
				imagen: infoBase?.imagen,
				diasRestantes: infoBase?.diasCosecha.min, // Calcular la fecha real
			};
		});
		res.json(detailedGarden);
	};

	// Agregar a la huerta
	static addToGarden = (req: Request, res: Response) => {
		const { plantId } = req.body;
		const success = GardenerModel.addPlantToHuerta(req.user!.id, plantId);
		success
			? res.json({ message: 'Agregada' })
			: res.status(400).json({ message: 'Error' });
	};

	// Cambiar estado (creciendo -> listo -> cosechado)
	static updatePlantStatus = (req: Request, res: Response) => {
		const { plantId, status } = req.body;
		const success = GardenerModel.updateHuertaStatus(
			req.user!.id,
			plantId,
			status
		);
		success
			? res.json({ message: 'Estado actualizado' })
			: res.status(400).json({ message: 'Error' });
	};

	// Eliminar de la huerta
	static removeFromGarden = (req: Request, res: Response) => {
		const { plantId } = req.params;
		const success = GardenerModel.removePlantFromHuerta(
			req.user!.id,
			plantId as string
		);
		success
			? res.json({ message: 'Eliminada de tu huerta' })
			: res.status(400).json({ message: 'Error' });
	};
}
