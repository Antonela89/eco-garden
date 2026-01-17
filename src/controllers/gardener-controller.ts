// Importación de módulos
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
// Importación de modelos
import { GardenerModel } from '../models/gardener-model.js';
import { PlantModel } from '../models/plant-model.js';
// Importación de Role
import { Role } from '../types/gardener.js';
// Importación de función auxiliar
import { formatInputData, slugify } from '../../shared/formatters.js';

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
	static register = async (req: Request, res: Response) => {
		try {
			// Formatear datos (esto ignorará el campo 'password' gracias a la lista protegida)
			const formattedBody = formatInputData(req.body);

			// Desestructuración para separar la contraseña y email del resto de los datos
			const { email, password, ...rest } = formattedBody;

			// Verificar si el email ya existe ANTES de crear
			const existingUser = await GardenerModel.findOne({ email }); // El schema de Zod garantiza que email es string
			if (existingUser) {
				return res
					.status(400)
					.json({ message: 'El email ya está registrado' });
			}

			// Encriptar
			const hashedPassword = bcrypt.hashSync(password, 10);

			// Crear usuario -> datos + contraseña encriptada
			const newUser = await GardenerModel.create({
				email: email as string, // Asegurar que email se pase
				password: hashedPassword,
				myPlants: [], // Asegurar que siempre se inicialice como un array vacío
				role: (rest.role as Role) || Role.GARDENER, // Asegurar el rol, con un default si no viene
				...rest, // el resto de los datos (como username)
			});

			// La transformación toJSON del modelo ya limpia el password

			res.status(201).json({
				message: 'Usuario registrado con éxito',
				user: newUser,
			});
		} catch (error) {
			res.status(500).json({ message: 'Error en el servidor', error });
		}
	};

	/**
	 * Valida las credenciales de un usuario y genera un Token de acceso (JWT).
	 */
	static login = async (req: Request, res: Response) => {
		try {
			// Desestructuracion
			const { email, password } = req.body;
			// Buscar usuario por email
			const user = await GardenerModel.findOne({ email });

			// Validación -> Si no existe o la contraseña no coincide
			if (!user || !bcrypt.compareSync(password, user.password)) {
				return res
					.status(401)
					.json({ message: 'Error de credenciales' });
			}

			// Generar Token con datos no sensibles
			const token = jwt.sign(
				{
					id: user.id,
					role: user.role,
					email: user.email,
				},
				JWT_SECRET,
				{ expiresIn: '1h' },
			);

			// Respuesta
			res.json({
				message: '¡Bienvenido de nuevo!',
				token: token,
				user: {
					id: user.id,
					username: user.username,
					role: user.role,
					email: user.email,
				},
			});
		} catch (error) {
			res.status(500).json({ message: 'Error en el servidor', error });
		}
	};

	// -----------------------------
	// GESTIÓN DE PERFIL
	// -----------------------------

	/**
	 * Obtiene los datos del perfil del usuario logueado.
	 * Utiliza el ID extraído del token por el middleware de autenticación.
	 */
	static getProfile = async (req: Request, res: Response) => {
		try {
			// Obtener jardinero por id
			const user = await GardenerModel.findById(req.user!.id);
			// Validación
			if (!user)
				return res
					.status(404)
					.json({ message: 'Usuario no encontrado' });

			// Limpiar la contraseña antes de enviar la info del perfil
			const { password, ...userData } = user;
			res.json(userData);
		} catch (error) {
			res.status(500).json({ message: 'Error en el servidor', error });
		}
	};

	static updateProfile = async (req: Request, res: Response) => {
		try {
			// Obtener el id del usuario de la petición
			const userId = req.user!.id;
			// Desestructurar del cuerpo de la petición
			const { username, newPassword, currentPassword, email } = req.body;

			const user =
				await GardenerModel.findById(userId).select('+password');

			// Validación
			if (!user)
				return res
					.status(404)
					.json({ message: 'Usuario no encontrado' });

			const dataToUpdate: any = {};

			// Si se cambio el username, guardar
			if (username) dataToUpdate.username = username;

			// Lógica para cambios sensibles (email o contraseña)
			if (newPassword || email) {
				if (
					!currentPassword ||
					!(await bcrypt.compare(currentPassword, user.password))
				) {
					return res.status(401).json({
						message:
							'La contraseña actual es incorrecta para realizar cambios.',
					});
				}
				// Si se cambio password, guardar.
				if (newPassword)
					dataToUpdate.password = await bcrypt.hash(newPassword, 10);
				// Si se cambio el email, guardar
				if (email) dataToUpdate.email = email;
			}

			// Guardar los cambios en la base de datos
			const updatedUser = await GardenerModel.findByIdAndUpdate(
				userId,
				dataToUpdate,
				{ new: true },
			);
			// Respuesta al usuario
			res.json({ message: 'Perfil actualizado', user: updatedUser });
		} catch (error) {
			res.status(500).json({
				message: 'Error al actualizar el perfil',
				error,
			});
		}
	};

	// ---------------------------------------------
	//   GESTIÓN DE LA HUERTA (LÓGICA RELACIONAL)
	// ---------------------------------------------

	/**
	 * Obtiene la huerta del usuario enriqueciendo la información.
	 * Cruza los IDs de las plantas del usuario con los datos completos del catálogo.
	 */
	static getMyBatches = async (req: Request, res: Response) => {
		try {
			const user = await GardenerModel.findById(req.user!.id).lean();
			if (!user)
				return res
					.status(404)
					.json({ message: 'Usuario no encontrado' });

			const plantCatalog = await PlantModel.find().lean();

			// Cruzar los datos para añadir la información de cada planta a su lote correspondiente.
			const detailedGarden = user.myPlants.map((batch) => {
				const infoBase = plantCatalog.find(
					(p: any) => p.id === batch.plantId,
				);
				return { ...batch, plantInfo: infoBase };
			});

			res.json(detailedGarden);
		} catch (error) {
			res.status(500).json({
				message: 'Error al obtener la huerta',
				error,
			});
		}
	};

	/**
	 * Crea un nuevo lote en la huerta.
	 * Genera instancias de semillas para seguimiento
	 */
	static addBatchToGarden = async (req: Request, res: Response) => {
		try {
			const { plantId, quantity, notes } = req.body;
			const userId = req.user!.id;

			// Preparar las instancias individuales para el nuevo lote
			const instances = [];
			for (let i = 0; i < quantity; i++) {
				instances.push({
					instanceId: crypto.randomUUID(),
					status: 'germinando',
				});
			}

			const newBatch = {
				batchId: crypto.randomUUID(),
				plantId,
				plantedAt: new Date().toISOString(),
				instances,
				...(notes && { notes }),
			};

			// Añadir el nuevo lote al array 'myPlants' del usuario en la base de datos
			await GardenerModel.findByIdAndUpdate(userId, {
				$push: { myPlants: newBatch },
			});

			res.status(201).json({
				message: 'Lote añadido con éxito',
				batch: newBatch,
			});
		} catch (error) {
			res.status(500).json({ message: 'Error al añadir el lote', error });
		}
	};

	/**
	 * Actualiza las instancias de semillas de un lote
	 */
	static updateInstance = async (req: Request, res: Response) => {
		try {
			const { batchId, instanceId, status } = req.body;
			const userId = req.user!.id;

			// Validar la existencia del resultado de la consulta a la base de datos para manejar casos en los que no se encuentren coincidencias
			// Usar operadores posicionales de MongoDB para una actualización atómica y eficiente.
			const result = await GardenerModel.findOneAndUpdate(
				// Condición de búsqueda
				{
					_id: userId,
					'myPlants.batchId': batchId,
					'myPlants.instances.instanceId': instanceId,
				},
				// Actualización
				{
					$set: {
						'myPlants.$[batch].instances.$[instance].status':
							status,
					},
				},
				// Opciones
				{
					// Filtros para apuntar a los elementos correctos en los arrays anidados
					arrayFilters: [
						{ 'batch.batchId': batchId },
						{ 'instance.instanceId': instanceId },
					],
					new: true, // Para que devuelva el documento DESPUÉS de la actualización
				},
			);

			// Verificar si se encontró y actualizó un documento. Si no, 'result' será null.
			if (!result) {
				return res
					.status(404)
					.json({
						message:
							'No se encontró la instancia o el lote para actualizar.',
					});
			}

			// Respuesta al usuario
			res.json({ message: 'Estado de la instancia actualizado.' });
		} catch (error) {
			res.status(500).json({
				message: 'Error al actualizar la instancia',
				error,
			});
		}
	};

	/**
	 * Quita un lote de la huerta
	 */
	static removeBatchFromGarden = async (req: Request, res: Response) => {
		try {
			const { batchId } = req.params;
			const userId = req.user!.id;

			// Usar el operador $pull de MongoDB para eliminar el objeto del array.
			const result = await GardenerModel.findByIdAndUpdate(userId, {
				$pull: { myPlants: { batchId: batchId } },
			});

			if (!result) {
				return res
					.status(404)
					.json({ message: 'No se encontró el lote para eliminar.' });
			}

			res.json({ message: 'Lote eliminado de la huerta.' });
		} catch (error) {
			res.status(500).json({
				message: 'Error al eliminar el lote',
				error,
			});
		}
	};
}
