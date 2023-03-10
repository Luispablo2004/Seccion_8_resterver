const {Router} = require('express');

const { check } = require('express-validator');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios');

const { esRolValido, existeEmail, existeUsuarioPorId } = require('../helpers/db-validators');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();



router.get('/', usuariosGet);

router.post('/', [//Validacion para correo
        check('nombre', 'El nombre es obliigatorio').not().isEmpty(),
        check('password', 'La contraseña es obliigatoria y debe de contener mas de 6 letras').isLength({min: 6}),
        check('correo', 'El correo no es válido').isEmail(),
        check('correo').custom((correo) => existeEmail(correo)),
        // check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom(esRolValido),     
        validarCampos
],usuariosPost);

router.put('/:id', [
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        check('rol').custom(esRolValido), 
        validarCampos
] , usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id',[
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
], usuariosDelete)




module.exports = router;