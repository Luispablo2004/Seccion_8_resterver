const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require ('../models/usuario')


const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);        

        //leer el usuario que corresponde al uid 
        const usuario = await Usuario.findById(uid); //Tarer información del usuario validador

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en DB'
            });
        }

        //Vereficar si el uid tiene estado en true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado: false'
            });
        }

        req.usuario = usuario;

        next();//Permite que la aplicación continue despues de terminar de ejecutar los middleeare
    } catch (error) {
        console.log(error);

        res.status(401).json({
            msg: 'Token no valido'
        })
    }
 
}
module.exports = {
    validarJWT
}