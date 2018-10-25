const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

let index_routes = require('./routes/index_routes');
let usuario_route = require('./routes/usuario_routes');
let login_routes = require('./routes/login_routes');

app.use('/', index_routes);
app.use('/usuario', usuario_route);
app.use('/login', login_routes);

//Database connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res) =>{
    if(err) throw err;
    console.log('Base de datos -\x1b[32m%s\x1b[0m',' ONLINE');
});

app.listen(3000, ()=>{
    console.log('Server Corriendo -\x1b[32m%s\x1b[0m',' ONLINE');
});