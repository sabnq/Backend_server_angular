const jwt = require("jsonwebtoken");
let SEED = require("../config/config").SEED;
//Verificar token
exports.verificaToken = (req, res, next) => {
  let token = req.query.token;
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: 401,
        err,
        message: "No autorizado"
      });
    }
    //
    req.usuario = decoded.usuarioDB;
    next();
  });
};

