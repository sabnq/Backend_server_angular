const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var Medico = new Schema({
nombre: { 
    type: String, 
    required: [true, 'El nombre es necesario']
},
img: { 
    type: String, 
    required: false 
},
usuario: { 
    type: Schema.Types.ObjectId, ref: 'Usuario', 
    required: true 
},
status:{
    type: Boolean,
    default: true
},
hospital: { 
    type: Schema.Types.ObjectId, ref: 'Hospital', 
    required: [true, 'El id hospital es un campo obligatorio'] }    
},{collection: 'medicos' });

module.exports = mongoose.model('Medico', Medico);