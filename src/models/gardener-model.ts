import { Schema, model } from 'mongoose';
import { Gardener, CropBatch, PlantInstance } from '../types/gardener.js';

// ------------------------------------------
//          DEFINICIÓN DE SCHEMAS
// ------------------------------------------

/**
 * Schema para las instancias de plantas individuales (subdocumento).
 */
const PlantInstanceSchema = new Schema<PlantInstance>({
    instanceId: { type: String, required: true },
    status: { 
        type: String, 
        required: true, 
        enum: ['germinando', 'creciendo', 'lista', 'cosechada', 'fallida'] 
    },
}, { _id: false }); // Desactivar la creación de _id para subdocumentos

/**
 * Schema para los lotes de cultivo (subdocumento).
 */
const CropBatchSchema = new Schema<CropBatch>({
    batchId: { type: String, required: true },
    plantId: { type: String, required: true },
    plantedAt: { type: String, required: true },
    notes: { type: String, required: false }, // 'required: false' es la forma correcta de hacerlo opcional
    instances: [PlantInstanceSchema],
}, { _id: false });

/**
 * Schema principal para el modelo Gardener.
 */
const GardenerSchema = new Schema<Gardener>({
    // Mongoose crea el _id automáticamente, por lo que no necesitamos 'id' aquí.
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, required: true, enum: ['admin', 'gardener'] },
    password: { type: String, required: true },
    myPlants: [CropBatchSchema],
}, {
    timestamps: true, // Añade 'createdAt' y 'updatedAt' automáticamente
    collection: 'gardeners',
    // Opción para transformar el _id a id en las respuestas JSON
    toJSON: {
        transform(doc, ret) {
            // Convertir el ObjectId a string
            ret.id = ret._id.toString();

            // Usar 'any' para decirle a TS que confíe
            const anyRet = ret as any;

            // Borrar las propiedades
            delete anyRet._id;
            delete anyRet.__v;
            delete anyRet.password;
        }
    }
});


// ------------------------------------------
//          EXPORTACIÓN DEL MODELO
// ------------------------------------------

/**
 * Modelo de Mongoose para la colección 'gardeners'.
 * Este objeto contiene todos los métodos para interactuar con la base de datos
 * (find, findById, create, findByIdAndUpdate, etc.).
 */
export const GardenerModel = model<Gardener>('Gardener', GardenerSchema);