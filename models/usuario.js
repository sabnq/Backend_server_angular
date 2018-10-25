const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
}

let Usuario = new Schema({
    nombre:{
        type: String,
        required: [true, 'Nombre es requerido']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'Correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'Password es requerido']
    },
    img:{
        type: String,
        default: null
    },
    role:{
        type: String,
        required: [true, 'Role es requerido'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    status:{
        type: Boolean,
        default: true
    }
});

Usuario.plugin(uniqueValidator, {message:'{PATH} debe ser único'})
module.exports = mongoose.model('Usuario', Usuario);