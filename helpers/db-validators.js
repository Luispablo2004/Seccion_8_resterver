const Role = require('../models/role');
const Usuario = require('../models/usuario');

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

module.exports = {
    esRolValido,
    existeEmail,
    existeUsuarioPorId
};