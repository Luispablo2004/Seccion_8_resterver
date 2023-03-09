const {Router} = require('express');
const { check, body, param } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenClaudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir, validarCampos } = require('../middlewares');



const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo)

router.get('/:coleccion/:id',[
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)


router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
] ,actualizarImagenClaudinary)

module.exports = router; 