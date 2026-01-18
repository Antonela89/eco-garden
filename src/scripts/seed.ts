import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from '../config/db.js';
import { PlantModel } from '../models/plant-model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
    try {
        await connectDB();
        
        // Limpiar la colección antes de sembrar
        await PlantModel.deleteMany();
        console.log('Colección de plantas limpiada.');
        
        // Leer los datos del archivo JSON
        const jsonPath = path.join(__dirname, '../data/plants.json');
        const plantsData = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
        
        // Insertar los datos en la base de datos
        await PlantModel.insertMany(plantsData);
        
        console.log('✅ Base de datos sembrada con el catálogo de plantas.');

    } catch (error) {
        console.error('❌ Error al sembrar la base de datos:', error);
    } finally {
        // Cerrar la conexión a la base de datos
        await mongoose.connection.close();
        console.log('Conexión a la base de datos cerrada.');
    }
};

seedDatabase();