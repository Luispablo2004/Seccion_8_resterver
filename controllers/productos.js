const { response } = require("express");
const bcryptjs = require('bcryptjs');

const { Producto, Categoria } = require('../models'); 



const obtenerProductos = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query

    const query = {estado: true}

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('nombre')
    ]);

    res.json({
        total,
        productos
    });
}

//obtenerProducto . populate {}
const obtenerProducto = async(req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findById(id)
                            .populate('nombre');

    res.json(producto);
}


const crearProducto = async (req, res = response) => {
    /*para este proyecto grabaremos las categorias en mayusculas, 
      pero esto es a discreción de nuestro modelo, no tiene que ser así
    */

    const { estado, usuario, ...body} = req.body;

    const productoDB = await Producto.findOne({nombre: body.nombre})
    
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El Producto ${ productoDB.nombre }, ya existe`
        });
    }
    //los datos a grabar
    //original curso: data
    const toSaveData = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id,
    };
    const producto = new Producto(toSaveData);
    //guardar en la bd
    await producto.save();
    //productod creada
    res.status(200).json(producto);
};

const actualizarProducto = async (req, res = response) => {
    const {id} = req.params;

    /* Metodo mio */
    const {estado, usuario, ...data} =req.body;
    
    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    res.json(producto);
}

const borrarProducto = async (req, res = response) => {
    const {id} = req.params;

    const producto = await Producto.findByIdAndUpdate(id, {estado:false})

    const productoAutenticado = req.producto;

    res.json({producto, productoAutenticado});

}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}