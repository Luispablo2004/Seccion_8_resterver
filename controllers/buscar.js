const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuarios, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);//true

    if (esMongoID) {
        const usuario = await Usuarios.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const usuarios = await Usuarios.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    })
}

const buscarcategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);//true

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i')

    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    })
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);//true

    if (esMongoID) {
        const producto = await Producto.findById(termino)
        return res.json({
            results: (producto) ? [producto] : []
        })
    }
    
    const regex = new RegExp(termino, 'i')
    
    const productos = await Producto.find({ 
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
    }).populate('categoria', 'nombre');

    console.log(productos)

    res.json({
        results: productos
    })
}



const buscar = async (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `La coleccion ${coleccion} no esta permitida, solamente las colecciones ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res)
            break
        case 'categorias':
            buscarcategorias(termino, res)
            break
        case 'productos':
            buscarProductos(termino, res)
            break

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsqueda'
            })
    }

}

module.exports = {
    buscar
}