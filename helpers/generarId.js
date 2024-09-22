


const generarId = () => {
    return Date.now().toString(32) + Math.random().toString(32).substring(2);
}


export default generarId;

//generarId, es un token que le vamos a enviar al usuario a su email para que pueda confirmar su cuenta
// para eso hay que crear un enpoint que envia token que lea esa url del usuario