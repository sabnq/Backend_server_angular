const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let Hospital = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es necesario'] 
    },
    img: { 
        type: String, 
        required: false 
    },
    usuario: { 
        type: Schema.Types.ObjectId, ref: 'Usuario'
    },
    status:{
        type: Boolean,
        default: true   
    }
},{collection: 'hospital' });

module.exports = mongoose.model('Hospital', Hospital);