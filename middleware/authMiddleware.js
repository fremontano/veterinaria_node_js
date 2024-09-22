import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const check_auth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];//separar el token del bearer, con split y eligo mi posicion 1 que es el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //comparar mi usuario con el id del token
            //req.veterinario = crea una seccion con el veterinario
            req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado');
            next();

        } catch (error) {
            const e = new Error('token no valido');
            return res.status(403).json({ message: e.message });
        }
    }

    //si no hay token, devuelve error
    if (!token) {
        const error = new Error('No autenticado, no se encontro el token, o no existe');
        res.status(403).json({ error: error.message });
    }
    //next() = si todo sale bien, pasa al siguiente middleware para el perfil, y mi aplicacion no se quede en este archivo
    next();
}

export default check_auth;