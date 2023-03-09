const {Router, response} = require('express');

const { check } = require('express-validator');
const { 
    crearProducto, 
    obtenerProductos, 
    obtenerProducto, 
    actualizarProducto, 
    borrarProducto} = require('../controllers/productos');
const { existesCategoria, existesProducto } = require('../helpers/db-validators');
 
const { validarCampos, validarJWT, tieneRol } = require('../middlewares');


const router = Router();

//obtener todos los Productos - publico
router.get('/', obtenerProductos);


//obtener un producto por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existesProducto),
    validarCampos
],obtenerProducto);


//Crear Productos -privado- cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de mongo').isMongoId(),
    check('categoria').custom(existesCategoria),
    validarCampos
] , crearProducto);


//Actualizar - privado- cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existesProducto),
    validarCampos
], actualizarProducto);




//Borrar una categoria -admin
router.delete('/:id',[
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existesProducto),
    validarCampos
], borrarProducto);




module.exports = router; 