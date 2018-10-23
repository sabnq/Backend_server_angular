const express = require('express');
const mongoose = require('mongoose');

const app = express();

//Database connection
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res) =>{
    if(err) throw err;
    console.log('Base de datos -\x1b[32m%s\x1b[0m',' ONLINE');
});

app.get('/',(req,res,next) => {
    res.status(200).json({
        status: 200,
        message: 'Corriendo'
    });
});

app.listen(3000, ()=>{
    console.log('Server Corriendo -\x1b[32m%s\x1b[0m',' ONLINE');
});