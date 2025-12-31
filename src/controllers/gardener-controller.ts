// Importación de módulos
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Importación de modelos
import { GardenerModel } from '../models/gardener-model';
import { PlantModel } from '../models/plant-model';
// Importación de función auxiliar
import { formatInputData, slugify } from '../utils/formatters';

/**
 * Clave secreta para la firma de los tokens JWT.
 * Se intenta obtener de las variables de entorno para mayor seguridad.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'Mi_Semilla';

/**
 * Clase GardenerController
 * Se encarga de gestionar las peticiones HTTP relacionadas con los usuarios (jardineros),
 * incluyendo autenticación, perfil y el manejo de sus huertas personales.
 */
export class GardenerController {
	// ----------------------------------------
	// GESTIÓN DE AUTENTICACIÓN (AUTH)
	// ----------------------------------------

	/**
	 * Registra un nuevo jardinero en el sistema.
	 * Procesa la contraseña para guardarla de forma segura (Hash).
	 */
	static register = (req: Request, res: Response) => {
		// Formatear datos (esto ignorará el campo 'password' gracias a la lista protegida)
		const formattedBody = formatInputData(req.body);

		// Desestructuración para separar la contraseña del resto de los datos
		const { password, ...rest } = formattedBody;

		// Encriptar
		const hashedPassword = bcrypt.hashSync(password, 10);

		// Crear usuario -> datos + contraseña encriptada
		const newUser = GardenerModel.create({
			...rest,
			password: hashedPassword,
		});

		// SEGURIDAD: Quitar la contraseña del objeto antes de responder
		const { password: _, ...userResponse } = newUser;

		res.status(201).json({ message: 'Usuario registrado', userResponse });
	};

	/**
	 * Valida las credenciales de un usuario y genera un Token de acceso (JWT).
	 */
	static login = (req: Request, res: Response) => {
		// Desestructuracion
		const { email, password } = req.body;
		// Buscar usuario por email
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

	// -----------------------------
	// GESTIÓN DE PERFIL
	// -----------------------------

	/**
	 * Obtiene los datos del perfil del usuario logueado.
	 * Utiliza el ID extraído del token por el middleware de autenticación.
	 */
	static getProfile = (req: Request, res: Response) => {
		// Obtener jardinero por id
		const user = GardenerModel.getById(req.user!.id);
		// Validación
		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		// Limpiar la contraseña antes de enviar la info del perfil
		const { password, ...userData } = user;
		res.json(userData);
	};

	// ---------------------------------------------
	//   GESTIÓN DE LA HUERTA (LÓGICA RELACIONAL)
	// ---------------------------------------------

	/**
	 * Obtiene la huerta del usuario enriqueciendo la información.
	 * Cruza los IDs de las plantas del usuario con los datos completos del catálogo.
	 */
	static getMyGarden = (req: Request, res: Response) => {
		// Obtener jardinero por id
		const user = GardenerModel.getById(req.user!.id);
		// Validación
		if (!user) return res.status(404).json({ message: 'Error' });

		// Proceso de mapeo para obtener datos
		// Cruzar los datos de myPlants con el catálogo de PlantModel
		const detailedGarden = user.myPlants.map((myPlant) => {
			const infoBase = PlantModel.getById(myPlant.plantId);
			return {
				...myPlant,
				nombre: infoBase?.nombre,
				imagen: infoBase?.imagen,
				diasRestantes: infoBase?.diasCosecha.min, // Calcular la fecha real
			};
		});
		// Devolver detalles
		res.json(detailedGarden);
	};

	/**
	 * Agrega una planta del catálogo general (.json) a la huerta personal del jardinero.
	 */
	static addToGarden = (req: Request, res: Response) => {
		// Normalizar el ID de la planta antes de intentar agregarla
		const plantId = slugify(req.body.plantId as string);

		// usar metodo del modelo para agregar
		const success = GardenerModel.addPlantToGarden(req.user!.id, plantId);

		// Validación
		success
			? res.json({ message: 'Planta agregada con éxito a tu huerta' })
			: res.status(400).json({
					message: 'No se pudo agregar la planta (posible duplicado)',
			  });
	};

	/**
	 * Actualiza el estado de evolución de un cultivo (ej: de 'creciendo' a 'listo').
	 */
	static updatePlantStatus = (req: Request, res: Response) => {
		// Desestrucutrar
		const { plantId, status } = req.body;

		// Usar el modelo
		const success = GardenerModel.updateGardenStatus(
			req.user!.id,
			plantId,
			status
		);

		// Validación
		success
			? res.json({ message: 'Estado de cultivo actualizado' })
			: res
					.status(400)
					.json({ message: 'Error al actualizar el estado' });
	};

	/**
	 * Elimina permanentemente una planta de la huerta del usuario.
	 */
	static removeFromGarden = (req: Request, res: Response) => {
		// Desestructurar
		const { plantId } = req.params;

		// Usar el modelo
		const success = GardenerModel.removePlantFromGarden(
			req.user!.id,
			plantId as string
		);

		// Validación
		success
			? res.json({ message: 'Planta eliminada de tu huerta' })
			: res.status(400).json({ message: 'Error al eliminar la planta' });
	};
}
