const express = require('express');
const app = express();


app.get('/',(req,res,next) => {
    res.status(200).json({
        status: 200,
        message: 'Corriendo'
    });
});

module.exports = app;