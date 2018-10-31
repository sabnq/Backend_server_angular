const express = require("express");
const mdAuth = require("../middlewares/autenticacion");
const app = express();

const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

//Get users
app.get("/", (req, res, next) => {
  let condition = { status: true };
  let desde = req.query.desde || 0;
  desde = Number(desde);
  Medico.find(condition)
    .skip(desde)
    .limit(5)
    .populate("usuario", "nombre email")
    .populate("hospital")
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Error cargando medicos",
          errors: err
        });
      }
      if (!medicos) {
        return res.status(400).json({
          status: 400,
          message: "medico no encontrado",
          errors: err
        });
      }
      Medico.count(condition, (err, conteo) => {
        res.status(200).json({
          status: 200,
          medicos: medicos,
          total: conteo
        });
      });
    });
});

app.put("/", mdAuth.verificaToken, (req, res) => {
  let id = req.query.id;
  let medico = {
    nombre: req.body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital._id
  };

  Medico.findOneAndUpdate({ _id: id }, { $set: medico }, { new: true }).exec(
    (err, actualizarmedico) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          err,
          message: "Query Error"
        });
      }
      if (!actualizarmedico) {
        return res.status(400).json({
          status: 400,
          message: "medico no encontrado",
          errors: err
        });
      }

      res.status(200).json({
        status: 200,
        medico: actualizarmedico,
        message: "medico actualizado"
      });
    }
  );
});

app.post("/", mdAuth.verificaToken, (req, res) => {
  let medico = new Medico({
    nombre: req.body.nombre,
    usuario: req.usuario._id,
    hospital: req.body.hospital
  });
  medico.save((err, nuevomedico) => {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: "Error al crear medico",
        errors: err
      });
    }
    res.status(201).json({
      status: 201,
      medico: nuevomedico,
      message: "medico creado"
    });
  });
});

app.delete("/", mdAuth.verificaToken, (req, res) => {
  let id = req.query.id;
  let changeStatus = {
    status: false
  };

  Medico.findOneAndUpdate(
    { _id: id },
    { $set: changeStatus },
    { new: true }
  ).exec((err, medico) => {
    if (err) {
      return res.status(500).json({
        status: 500,
        err,
        message: "Query Error"
      });
    }
    if (!medico) {
      return res.status(400).json({
        status: 400,
        message: "medico no encontrado",
        errors: err
      });
    }
    res.status(200).json({
      status: 200,
      message: "medico inactivado"
    });
  });
});

module.exports = app;
