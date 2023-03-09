const {Router, response} = require('express');
const { check } = require('express-validator');
const { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoria, 
    actualizarCategoria, 
    borrarCategoria
} = require('../controllers/categorias');
const { existesCategoria,esRolValido } = require('../helpers/db-validators');

const { validarCampos, validarJWT, tieneRol } = require('../middlewares');

const router = Router();
 

/* HACER VALIDACIONES PARA ID EN LAS DIFERENTES RUTAS */


/* {{url}}/api/categorias */

//obtener todas las categorias - publico
router.get('/', obtenerCategorias);


//obtener una categoria por id - publico
router.get('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existesCategoria),
    validarCampos
],obtenerCategoria);


//Crear categoria -privado- cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
] , crearCategoria);


//Actualizar - privado- cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existesCategoria),
    validarCampos
], actualizarCategoria);


//Borrar una categoria -admin
router.delete('/:id',[
    validarJWT,
    tieneRol('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existesCategoria),
    validarCampos
], borrarCategoria);



module.exports = router; 