import mongoose from 'mongoose';

// Conectar a MongoDB
const conexion_db = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);

        const url = ` ${db.connection.host}   ${db.connection.port} `;
        console.log(`Mongoose está conectado a la base de datos: ${url}`);
    } catch (error) {
        console.log(`Error al conectar a la base de datos: ${error}`);
    }
}

export default conexion_db;
