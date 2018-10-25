const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

let SEED = require('../config/config').SEED;
const app = express();

const Usuario = require("../models/usuario");

app.post("/", (req, res) => {
  usuario = req.body;
  Usuario.findOne({ email: usuario.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Error al buscar usuarios",
        errors: err
      });
    }
    if (!usuarioDB) {
      return res.status(400).json({
        status: 400,
        message: "Credenciales incorrectass - email",
        errors: err
      });
    }

    if (!bcrypt.compareSync(usuario.password, usuarioDB.password)) {
      return res.status(400).json({
        status: 400,
        message: "Credenciales incorrectass - password",
        errors: err
      });
    }
    
    usuarioDB.password = '';
    token= jwt.sign({usuarioDB}, SEED, {expiresIn:'4d'})
    res.status(200).json({
      status: 200,
      usuario: usuarioDB,
      token,
      id: usuarioDB._id
    });
  });
});

module.exports = app;
