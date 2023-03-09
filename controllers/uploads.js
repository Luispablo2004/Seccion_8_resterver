
const path = require('path')
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const { response } = require("express");
const { json } = require('body-parser');
const { subirArchivo } = require("../helpers");
const { Usuarios, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {

    try {
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos')
        const nombre = await subirArchivo(req.files, undefined, 'imgs')

        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }
}

const mostrarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuarios.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }

    //Pone la imagen en postman del id que especificamos si es que esta lla imagen en la base
    if (modelo.img) {
        // Ponerlo en postman 
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen)
        }
    }

    //cuando no este alguna imgen guardada en la base pone esta imagen por defecto
    // Ponerlo en postman 
    const pathImagen = path.join(__dirname, '../assets', 'no-image.jpg');
    res.sendFile(pathImagen)
}

const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuarios.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }

    // Limpiar imagenes previas
    if (modelo.img) {
        // borrar la imagen del serrvidor 
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }


    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    })
}

const actualizarImagenClaudinary = async (req, res = response) => {

    const { id, coleccion } = req.params

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuarios.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }

    // para borrar en cloudinary
    const public_id = modelo.img.split("/").pop().split(".").shift();
    
    await cloudinary.uploader.destroy(public_id);

    
    // Para guardar en cloudinary
    const {tempFilePath} = req.files.archivo;
    
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

    modelo.img = secure_url;

    await modelo.save();

    res.json({
        modelo
    })
}

module.exports = {
    cargarArchivo,
    mostrarImagen,
    actualizarImagen,
    actualizarImagenClaudinary
}