
import jwt from 'jsonwebtoken';



const generarJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '4h' });
};

export default generarJWT;

// exportar a mi controlador veterinarioController.js para autenticar el usuario con un token para el login con JWT
// en el methodo autenticar o login