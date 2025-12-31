import app from './app';

// Definir el puerto 
const PORT = process.env.PORT || 3000;

const startServer = () => {
    try {
        app.listen(PORT, () => {
            console.log('==============================================');
            console.log(`Eco-Garden API - Servidor iniciado`);
            console.log(`Puerto: ${PORT}`);
            console.log(`Fecha: ${new Date().toLocaleDateString()}`);
            console.log(`Localhost: http://localhost:${PORT}/api`);
            console.log('==============================================');
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); // Detener el proceso si falla
    }
};

startServer();