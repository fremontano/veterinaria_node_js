//dependencias
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
//mis archivos
import generarId from '../helpers/generarId.js';

const VeterinariaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false,
    }
});

//middleware para encriptar la contraseña antes de guardarla en la base de datos
VeterinariaSchema.pre('save', async function (next) {
    // si la contraseña no ha sido modificada, no se hace nada ejecuta la siguiente linea
    // y no se encripta la contraseña
    if (!this.isModified('password')) {
        next();
    }
    // generar salt y encriptar la contraseña con el salt generado anteriormente
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});



//comprobar si el password introducido por el usuario es correcto
VeterinariaSchema.methods.compararPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
    //si el password coincide devuelve true, si no false
    //en mi metodo autenticar del controlador veterinarioController.js 
    //se usa este metodo para comprobar si el password introducido por el usuario es correcto
};

const Veterinario = mongoose.model('Veterinario', VeterinariaSchema);
export default Veterinario;
