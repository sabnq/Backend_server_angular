const express = require("express");
const app = express();

const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario");

//Buscar por colección
app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
  let busqueda = req.params.busqueda;
  let tabla = req.params.tabla;
  let regex = new RegExp(busqueda, "i");
  let promesa;
  switch (tabla) {
    case "usuarios":
      promesa = buscarUsuario(busqueda, regex);
      break;
    case "medicos":
      promesa = buscarMedicos(busqueda, regex);
      break;
    case "hospitales":
      promesa = buscarHospitales(busqueda, regex);
      break;
    default:
      return res.status(400).json({
        status: 400,
        message:
          "Los tipos de bsuqeda son solo: usuarios, medicos y hospitales",
        error: { message: "Tipo de tabla/colección no valido" }
      });
  }
  promesa.then(data => {
    res.status(200).json({
      status: 200,
      [tabla]: data
    });
  });
});

//Buscar todo
app.get("/todo/:busqueda", (req, res, next) => {
  let busqueda = req.params.busqueda;
  let condition = { status: true };
  let regex = new RegExp(busqueda, "i");

  Promise.all([
    buscarHospitales(busqueda, regex),
    buscarMedicos(busqueda, regex),
    buscarUsuario(busqueda, regex)
  ]).then(respuestas => {
    res.status(200).json({
      status: 200,
      hospitales: respuestas[0],
      medicos: respuestas[1],
      usuarios: respuestas[2]
    });
  });
});

function buscarHospitales(busqueda, regex) {
  let condition = { status: true };
  return new Promise((resolve, reject) => {
    Hospital.find({
      $and: [{ $or: [{ nombre: regex }] }, { $or: [condition] }]
    })
      .populate("usuario", "nombre email")
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al cargar hospitales");
        } else resolve(hospitales);
      });
  });
}

function buscarMedicos(busqueda, regex) {
  let condition = { status: true };
  return new Promise((resolve, reject) => {
    Medico.find({
      $and: [{ $or: [{ nombre: regex }] }, { $or: [condition] }]
    })
      .populate("usuario", "nombre email")
      .populate("hospital")
      .exec((err, medico) => {
        if (err) {
          reject("Error al cargar medicos");
        } else resolve(medico);
      });
  });
}

function buscarUsuario(busqueda, regex) {
  let condition = { status: true };
  return new Promise((resolve, reject) => {
    Usuario.find(
      {
        $and: [
          { $or: [{ nombre: regex }, { email: regex }] },
          { $or: [condition] }
        ]
      },
      "nombre email role"
    ).exec((err, usuario) => {
      if (err) {
        reject("Error al cargar usuarios");
      } else resolve(usuario);
    });
  });
}

module.exports = app;
