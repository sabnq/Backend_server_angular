const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

let index_routes = require('./routes/index_routes');
let usuario_route = require('./routes/usuario_routes');
let login_routes = require('./routes/login_routes');
let hospital_routes = require('./routes/hospitales_routes');
let medicos_routes = require('./routes/medicos_routes');
let busqueda_routes = require('./routes/busqueda_routes');
let upload_routes = require('./routes/upload_routes');
let imagenes_routes = require('./routes/imagenes_routes');

//Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

app.use('/', index_routes);
app.use('/usuario', usuario_route);
app.use('/login', login_routes);
app.use('/hospital',hospital_routes);
app.use('/medico',medicos_routes);
app.use('/busqueda',busqueda_routes);
app.use('/upload', upload_routes);
app.use('/img', imagenes_routes);


//Database connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res) =>{
    if(err) throw err;
    console.log('Base de datos -\x1b[32m%s\x1b[0m',' ONLINE');
});

app.listen(3000, ()=>{
    console.log('Server Corriendo -\x1b[32m%s\x1b[0m',' ONLINE');
});