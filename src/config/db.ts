import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {

    const URI = process.env.MONGO_URI;

    // Debug preventivo:
    if (!URI) {
        console.error("❌ ERROR: La variable MONGODB_URI no está definida en el .env");
        process.exit(1);
    }
    try {
        await mongoose.connect(URI);
        console.log('✅ Conexión a MongoDB Atlas exitosa.');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1); // Detener la aplicación si no se puede conectar
    }
};

export default connectDB;