const express = require("express");
const mdAuth = require("../middlewares/autenticacion");
const app = express();

const Hospital = require("../models/hospital");

//Get users
app.get("/", (req, res, next) => {
  let condition = { status: true };
  let desde = req.query.desde || 0;
  desde = Number(desde);
  Hospital.find(condition)
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Error cargando hospitales",
          errors: err
        });
      }
      if (!hospitales) {
        return res.status(400).json({
          status: 400,
          message: "hospitales no encontrado",
          errors: err
        });
      }
      Hospital.count(condition, (err, conteo) => {
        res.status(200).json({
          status: 200,
          hospitales: hospitales,
          total: conteo
        });
      });
    });
});

app.put("/", mdAuth.verificaToken, (req, res) => {
  let id = req.query.id;
  let hospital = {
    nombre: req.body.nombre,
    usuario: req.usuario._id
  };

  Hospital.findOneAndUpdate(
    { _id: id },
    { $set: hospital },
    { new: true }
  ).exec((err, actualizarhospital) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        err,
        message: "Query Error"
      });
    }
    if (!actualizarhospital) {
      return res.status(400).json({
        status: 400,
        message: "hospital no encontrado",
        errors: err
      });
    }

    res.status(200).json({
      status: 200,
      hospital: actualizarhospital,
      message: "hospital actualizado"
    });
  });
});

app.post("/", mdAuth.verificaToken, (req, res) => {
  let hospital = new Hospital({
    nombre: req.body.nombre,
    usuario: req.usuario._id
  });
  hospital.save((err, nuevohospital) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Error al crear hospital",
        errors: err
      });
    }
    res.status(201).json({
      status: 201,
      hospital: nuevohospital,
      message: "hospital creado"
    });
  });
});

app.delete("/", mdAuth.verificaToken, (req, res) => {
  let id = req.query.id;
  let changeStatus = {
    status: false
  };

  Hospital.findOneAndUpdate(
    { _id: id },
    { $set: changeStatus },
    { new: true }
  ).exec((err, hospital) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        err,
        message: "Query Error"
      });
    }
    if (!hospital) {
      return res.status(400).json({
        status: 400,
        message: "hospitales no encontrado",
        errors: err
      });
    }
    res.status(200).json({
      status: 200,
      message: "hospital inactivado"
    });
  });
});

module.exports = app;
