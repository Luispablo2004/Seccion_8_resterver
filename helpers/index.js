const dbValidators = require('./db-validators')
const generarJWT = require('./generar-jwt')
const googleVerefy = require('./google-verefy')
const subirArchivo = require('./subir-archivo')

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerefy,
    ...subirArchivo
}