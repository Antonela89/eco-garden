import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import { GardenerModel } from '../models/gardener-model.js';
import { Role } from '../types/gardener.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();

        // Verificar si el admin ya existe
        const adminExists = await GardenerModel.findOne({ email: 'admin@eco-garden.com' });

        if (!adminExists) {
            // Crear el usuario admin con credenciales predefinidas
            await GardenerModel.create({
                username: 'Admin',
                email: 'admin@eco-garden.com',
                password: 'Password123', // La contraseña se hasheará automáticamente por el pre-save hook
                role: Role.ADMIN,
                myPlants: []
            });
            console.log('✅ Usuario Administrador creado exitosamente.');
            console.log('Email: admin@eco-garden.com');
            console.log('Password: Password123');
        } else {
            console.log('ℹ️ El usuario Administrador ya existe en la base de datos.');
        }

    } catch (error) {
        console.error('❌ Error al crear el usuario admin:', error);
    } finally {
        await mongoose.connection.close();
    }
};

seedAdmin();