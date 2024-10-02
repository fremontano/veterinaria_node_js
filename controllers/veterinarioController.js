// importar el modelo de veterinario
import Veterinario from "../models/Veterinario.js";
import generarJwt from '../helpers/generarJWT.js';
import generarId from "../helpers/generarId.js";
import { error } from "console";


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

//PASSWORD MODIFICAR
const olvidePassword = async (req, res) => {
    // recoger los datos del body, formulario
    const { email } = req.body;


    const existeEmailVeterinario = await Veterinario.findOne({ email });
    if (!existeEmailVeterinario) {
        const error = new Error('El usuario no  esta regiatrado');
        return res.status(400).json({ error: error.message });
    }

    try {
        existeEmailVeterinario = generarId();
        await existeEmailVeterinario.save();
        res.json({
            message: 'Se ha enviado un correo con un link para cambiar tu contraseña'
        });

    } catch (error) {
        console.log(error);
    }
}


//COMPROBAR TOKEN A MODIFICAR
const comprobarToken = async (req, res) => {
    // recoger los datos del body, formulario
    const { token } = req.params;
    // verificar el token
    const tokenValido = await Veterinario.findOne({ token });

    if (tokenValido) {
        res.json({
            message: 'El token es válido'
        });
    } else {
        const error = new Error('El token no es válido');
        return res.status(401).json({ error: error.message });
    }

};


//CAMBIAR CONTRASEÑA
const nuevoPassword = async (req, res) => {
    //recoger los datos del boody
    const { token } = req.params;
    //recoger los datos del formulario
    const { password } = req.body;

    //conprobar el token
    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error('El token no es valido');
        return res.status(400).json({ error: error.message });
    }


    //eliminar token y cambiar contraseña
    try {

        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();

        res.json({ message: 'El Password se ha modificado Correctamente' });

    } catch (error) {
        console.log(error);

    }
}


//PERFIL
const perfil = (req, res) => {

    const { veterinario } = req;

    res.json({ perfil: veterinario });
}






export {
    registrar,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}