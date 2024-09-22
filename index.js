import express from 'express'
import dotenv from 'dotenv'
import conexion_db from './config/db.js'
import veterinarioRoutes from './routes/veterinarioRoutes.js'


const app = express();
app.use(express.json()); //recoger  datos en formato json
dotenv.config();

conexion_db();




// mi ruta principal de veterinario
app.use('/api/veterinarios', veterinarioRoutes);

const PORT = process.env.PORT || 4000;




app.listen(PORT, () => {
    console.log(`Servidor corriendo en el  puerto ${PORT}`);
});