const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const mdAuth = require('../middlewares/autenticacion');
const app = express();

const Usuario = require("../models/usuario");

//Get users
app.get("/", (req, res, next) => {
  let condition = { status: true };
  Usuario.find(condition, "nombre email img role").exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Error cargando usuarios",
        errors: err
      });
    }
    if (!usuarios) {
      return res.status(400).json({
        status: 400,
        message: "Usuarios no encontrado",
        errors: err
      });
    }

    res.status(200).json({
      status: 200,
      usuarios: usuarios
    });
  });
});

app.put("/", mdAuth.verificaToken, (req, res) => {
  let usuario = req.body;
  usuario.password = bcrypt.hashSync(usuario.password, 10);
  Usuario.findOneAndUpdate({ email: usuario.email }, { new: true }).exec(
    (err, actualizarUsuario) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          err,
          message: "Query Error"
        });
      }
      if (!actualizarUsuario) {
        return res.status(400).json({
          status: 400,
          message: "Usuarios no encontrado",
          errors: err
        });
      }
      actualizarUsuario.password = "";
      res.status(200).json({
        status: 200,
        usuario: actualizarUsuario,
        message: "Usuario actualizado"
      });
    }
  );
});

app.post("/", mdAuth.verificaToken, (req, res) => {
  let usuario = new Usuario(req.body);
  usuario.password = bcrypt.hashSync(usuario.password, 10);
  usuario.save((err, nuevoUsuario) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Error al crear usuario",
        errors: err
      });
    }
    res.status(201).json({
      status: 201,
      usuario: nuevoUsuario,
      message: "Usuario creado"
    });
  });
});

app.delete("/",mdAuth.verificaToken, (req, res) => {
  let usuario = req.body;
  let changeStatus = {
    status: false
  };

  Usuario.findOneAndUpdate({ email: usuario.email }, { $set: changeStatus }, { new: true }).exec(
    (err, usuario) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          err,
          message: "Query Error"
        });
      }
      if (!usuario) {
        return res.status(400).json({
          status: 400,
          message: "Usuarios no encontrado",
          errors: err
        });
      }
      res.status(200).json({
        status: 200,
        message: "Usuario inactivado"
      });
    }
  );
});

module.exports = app;
