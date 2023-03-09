const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
            throw new Error(`El rol ${rol} no esta registrado en la base de datos`)
    }
}


const existeEmail = async(correo = '') => {
    const emailTrue = await Usuario.findOne({correo});
    if (emailTrue) {
            throw new Error(`El correo: ${correo} Ya esta registrado en la base de datos`)
    }
}

const existeUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
            throw new Error(`El ID no existe: ${id}`)
    }
}

/* Validacion personalizada de categorias */
const existesCategoria = async(id) => {
    const existeUsuario = await Categoria.findById(id);
    if (!existeUsuario) {
            throw new Error(`El ID no existe: ${id}`)
    }
}


const existesProducto = async(id) => {
    const existeUsuario = await Producto.findById(id);
    if (!existeUsuario) {
            throw new Error(`El ID no existe: ${id}`)
    }
}

//validar colecciones permitidas

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
}

module.exports = {
    esRolValido,
    existeEmail,
    existeUsuarioPorId,
    existesCategoria,
    existesProducto,
    coleccionesPermitidas
};