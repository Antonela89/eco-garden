import { Schema, model } from 'mongoose';
import { Plant, DiasCosecha, Distancia } from '../types/plant.js';

// Schemas para los sub-objetos (aunque no son sub-documentos, es una buena práctica)
const DiasCosechaSchema = new Schema<DiasCosecha>(
	{
		min: { type: Number, required: true },
		max: { type: Number, required: true },
	},
	{ _id: false },
);

const DistanciaSchema = new Schema<Distancia>(
	{
		entrePlantas: { type: Number, required: true },
		entreLineas: { type: Number, required: true },
	},
	{ _id: false },
);

const PlantSchema = new Schema<Plant>(
	{
		id: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		nombre: { type: String, required: true, trim: true },
		familia: { type: String, required: true, trim: true },
		siembra: { type: Schema.Types.Mixed, required: true }, // no hay un esquema definido para este campo - caso repollo
		metodo: [{ type: String }],
		diasCosecha: { type: DiasCosechaSchema, required: true },
		distancia: { type: DistanciaSchema, required: true },
		asociacion: [{ type: String }],
		rotacion: [{ type: String }],
		toleranciaSombra: { type: Boolean, required: true },
		aptoMaceta: { type: Boolean, required: true },
		dificultad: {
			type: String,
			required: true,
			enum: ['Fácil', 'Media', 'Difícil'],
		},
		clima: { type: String, required: true },
		imagen: { type: String, required: true },
	},
	{
		timestamps: true,
		collection: 'plants',
		toJSON: {
			transform(doc, ret) {
				// Usar 'any' para decirle a TS que confíe
				const anyRet = ret as any;

				// Borrar las propiedades
				delete anyRet._id;
				delete anyRet.__v;
			},
		},
	},
);

export const PlantModel = model<Plant>('Plant', PlantSchema);
