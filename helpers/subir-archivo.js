const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas= ['png', 'jpg', 'jpeg', 'gif'], carpeta= '' ) => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;
        
        //Quita los puntos y lo convierte en un array
        const nombreCortado = archivo.name.split('.')

        
        //Para sacar el tipo de archivo que es
        const extension = nombreCortado[nombreCortado.length - 1]

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es permitida, solamente son permitidas las extensiones ${extensionesValidas}`)
        }

        const nombreTemp = uuidv4() + '.' + extension;

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, (err) => {
            if (err)
                reject(err)

            resolve(nombreTemp)
        });
    });
}

module.exports = {
    subirArchivo
}