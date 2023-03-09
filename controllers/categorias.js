const { response } = require("express");
const bcryptjs = require('bcryptjs');

const { Categoria } = require('../models');   


//obtenerCategorias -paginado- total - objeto(populate:Cuando lo imprimamos hacemmos la relacion para indicar quien fue quien lo manod)

const obtenerCategorias = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query

    const query = {estado: true}

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ]);

    res.json({
        total,
        categorias
    });
}

//obtenerCategoria . populate {}
const obtenerCategoria = async(req, res = response) => {
    const {id} = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json({categoria});
}


const crearCategoria = async (req, res = response) => {
    /*para este proyecto grabaremos las categorias en mayusculas, 
      pero esto es a discreción de nuestro modelo, no tiene que ser así
    */
    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({nombre});

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }
    //los datos a grabar
    //original curso: data
    const toSaveData = {
        nombre,
        usuario: req.usuario._id,
    };
    const categoria = new Categoria(toSaveData);
    //guardar en la bd
    await categoria.save();
    //categoria creada
    res.status(201).json(categoria);
};

// actualizarCategoria -solo se debe de recibir el nombre y se tiene que cambiar
const actualizarCategoria = async(req, res = response) => {
    const {id} = req.params;

    /* Metodo mio */
    const {_id, nombre, usuario, ...resto} =req.body;

    const uppnombre = nombre.toUpperCase();

    const categoria = await Categoria.findByIdAndUpdate(id, {nombre: uppnombre, usuario: req.usuario}).populate('usuario');

    res.json(categoria);

}

//borrarCategoria - cambiar estado a false
const borrarCategoria = async(req, res) => {

    const {id} = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false})

    const categoriaAutenticado = req.categoria;

    res.json({categoria, categoriaAutenticado});
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}