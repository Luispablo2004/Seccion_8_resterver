const {Router} = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login',[
    check('password', 'La contraseña es obliigatoria y debe de contener mas de 6 letras').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    validarCampos
], login);


module.exports = router; 