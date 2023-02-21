const { response, json } = require("express");
const  bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verefy");
const { DefaultTransporter } = require("google-auth-library");

const login = async(req, res = response) => {

    const {correo, password} = req.body;

    try {

        //verificar si el emil existe
        const usuario = await Usuario.findOne({correo});

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            });
        }

        //verificar si el usuario esta activo 
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado: false'
            });
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password)

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            });
        }

        //generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            msg: 'Hable con un administrador'
        })
    }


}

const googleSingnInt = async(req, res = response) => {
    const {id_token} = req.body;

    try {

        const {correo, nombre, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo})

        if (!usuario) {
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                rol: 'USER_ROLE',
                password: ':p',
                img,
                google: true
            };
            
            usuario = new Usuario(data)

            await usuario.save();
        }

        //Si el usuario en DB es false
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //generar JWT
        const token = await generarJWT(usuario.id);

        
        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo vereficar'
        })
    }
    
}

module.exports = {
    login,
    googleSingnInt
}