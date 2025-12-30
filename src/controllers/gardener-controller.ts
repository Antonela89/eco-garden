import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GardenerModel } from '../models/gardener-model';
import { PlantModel } from '../models/plant-model';

// Clave
const SECRET = process.env.JWT_SECRET || 'mi_semilla'

export class GardenerController {
	// AUTH
    // Registro
	static register = (req: Request, res: Response) => {
		const { password, ...rest } = req.body;
		const hashedPassword = bcrypt.hashSync(password, 10);
		const newUser = GardenerModel.create({
			...rest,
			password: hashedPassword,
		});
		res.status(201).json(newUser);
	};

    // Login
	static login = (req: Request, res: Response) => {
		const { email, password } = req.body;
		const user = GardenerModel.getByEmail(email);
		if (!user || !bcrypt.compareSync(password, user.password)) {
			return res.status(401).json({ message: 'Error de credenciales' });
		}
		const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
		res.json({
			token,
			user: { username: user.username, role: user.role, id: user.id },
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
