const { response } = require("express")

const validarArchivoSubir = async(req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'Mo hay archivos que subir - validarArchivoSubir'
        }); 
    }
    next()
}

module.exports = {
    validarArchivoSubir
}