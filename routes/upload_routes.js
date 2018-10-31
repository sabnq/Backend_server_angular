const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
// const fs = require("fs");
const fs = require("fs");
// default options
app.use(fileUpload());

const Medico = require("../models/medico");
const Hospital = require("../models/hospital");
const Usuario = require("../models/usuario");

app.put("/:tipo/:id", (req, res, next) => {
  let tipo = req.params.tipo;
  let id = req.params.id;
  // Tipos de coleccion
  let tiposValidos = ["hospitales", "medicos", "usuarios"];
  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      status: 400,
      message: "Tipo de coleccion no valido",
      errors: {
        message: "Las tipos validos son " + tiposValidos.join(", ")
      }
    });
  }

  if (!req.files) {
    return res.status(400).json({
      status: 400,
      message: "No subio foto",
      errors: { message: "Debe seleccionar una imagen " }
    });
  }

  //Obtener nombre del archivo
  let archivo = req.files.imagen;
  let nombreCortado = archivo.name.split(".");
  let extArchivo = nombreCortado[nombreCortado.length - 1];

  //Extensiones validas
  let extensionesValidas = ["png", "jpg", "gif", "jpeg"];
  if (extensionesValidas.indexOf(extArchivo) < 0) {
    return res.status(400).json({
      status: 400,
      message: "Extensión no valida",
      errors: {
        message: "Las extensiones válidas son " + extensionesValidas.join(", ")
      }
    });
  }

  //Nombre de archivo personalizado
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extArchivo}`;

  //Mover el archivo del temporal a un PATH
  let path = `./uploads/${tipo}/${nombreArchivo}`;
  archivo.mv(path, err => {
    if (err) {
      return res.status(500).json({
        status: 500,
        message: "Error al mover el archivo",
        errors: err
      });
    }

    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === "usuarios") {    
    Usuario.findById(id, (err, usuario) => {

      if(!usuario){
        return res.status(400).json({
          status: 200,
          message: "Usuario no existe",
          errors: {message: 'Usuario no existe'}
        });
      }
      let pathViejo = "./uploads/usuarios/" + usuario.img;

      if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo);
      }

      usuario.img = nombreArchivo;
      usuario.save((err, usuarioActualizado) => {
        usuarioActualizado.password ='';
        if (err) {
          return res.status(500).json({
            status: 500,
            message: "Error al actulizar el usuario",
            errors: err
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Imagen de usuario actualizada",
          usuario: usuarioActualizado
        });
      });
    });
  }

  if (tipo === "hopitales") {
    Hospital.findById(id, (err, hospital) => {
      if(!hospital){
        return res.status(400).json({
          status: 200,
          message: "Hospital no existe",
          errors: {message: 'Hospital no existe'}
        });
      }
      let pathViejo = "./uploads/hospitals/" + hospital.img;

      if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo);
      }

      hospital.img = nombreArchivo;
      hospital.save((err, hospitalActualizado) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: "Error al actulizar el hospital",
            errors: err
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Imagen de hospital actualizada",
          hospital: hospitalActualizado
        });
      });
    });s
  }

  if (tipo === "medicos") {
    Medico.findById(id, (err, medico) => {
      if(!medico){
        return res.status(400).json({
          status: 200,
          message: "Medico no existe",
          errors: {message: 'Medico no existe'}
        });
      }
      let pathViejo = "./uploads/medicos/" + medico.img;

      if (fs.existsSync(pathViejo)) {
        fs.unlinkSync(pathViejo);
      }

      medico.img = nombreArchivo;
      medico.save((err, medicoActualizado) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: "Error al actulizar el medico",
            errors: err
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Imagen de medico actualizada",
          medico: medicoActualizado
        });
      });
    });
  }
}

module.exports = app;
