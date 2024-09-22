// importar el modelo de veterinario
import Veterinario from "../models/Veterinario.js";
import generarJwt from '../helpers/generarJWT.js';


//REGISTRAR USUARIO
const registrar = async (req, res) => {
    // recoger los datos del body, formulario
    const { email } = req.body;

    //si existe usuario con ese email
    const existeEmail = await Veterinario.findOne({ email });
    if (existeEmail) {
        const error = new Error('El email ya está registrado');
        return res.status(400).json({ error: error.message });
    }


    try {
        // crear un nuevo objeto con los datos del veterinario
        const veterinario = new Veterinario(req.body);
        // guardar el veterinario en la base de datos
        const veterinarioGuardado = await veterinario.save();
        res.json({ veterinarioGuardado });
    } catch (error) {
        console.log(error);
    }
}





//CONFIRMAR EMAIL
const confirmar = async (req, res) => {

    const { token } = req.params;
    // verificar el token
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if (!usuarioConfirmar) {
        const error = new Error('El token no es válido');
        return res.status(400).json({ error: error.message });
    }

    // cambiar el estado del usuario a confirmado y eliminar el token para que no se pueda volver a confirmar
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();
        res.json({
            message: 'El email ha sido confirmado correctamente',
        });
    } catch (error) {
        console.log(error);
    }
}



//AUTENTICAR
const autenticar = async (req, res) => {

    const { email, password } = req.body;

    // verificar que el email existe y que el usuario está confirmado
    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
        const error = new Error('El usuario no está registrado');
        return res.status(401).json({ error: error.message });
    }

    // comprobar si el usuario no esta confirmado
    if (!usuario.confirmado) {
        const error = new Error('tú cuenta no ha sido confirmado');
        return res.status(401).json({ error: error.message });
    }

    //autenticar el usuario comprobando su cuenta atravez del metodo compararPassword creada en mi modelo veterinario
    if (await usuario.compararPassword(password)) {
        //autenticar el usuario con un token para el login con JWT 
        res.json({ token: generarJwt(usuario.id) });

    } else {
        const error = new Error('Contraseña incorrecta');
        return res.status(401).json({ error: error.message });
    }

}








const perfil = (req, res) => {
    res.json({
        status: 200,
        message: 'API de veterinarios/perfil'
    });
}






export {
    registrar,
    confirmar,
    autenticar,
    perfil
}