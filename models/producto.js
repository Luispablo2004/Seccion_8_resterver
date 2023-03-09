const {Schema, model} = require('mongoose');

const ProductoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type:Boolean,
        default: true,
        required: true
    },
    usuario:{
        type:Schema.Types.ObjectId,//usuario es otro objeto tipo moongose
        ref:'Usuario',//la referencia del mismo objeto, en este caso el objeto usuario
        required: true
    },
    precio:{
        type: Number,
        default: 0
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type:String
    },
    disponible: {
        type: Boolean, 
        default: true
    },
    img: {
        type: String
    }
});

ProductoSchema.methods.toJSON = function() {
    const {__v,estado,categoria,...datos} = this.toObject();
    return datos;
}
module.exports = model('Producto',ProductoSchema); //'Categoria' es el nombre que va tener