const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const path = require('path');

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, "../client/index.html"));
    
});

app.listen(3000, () => {
console.log("Servidor iniciado en 3000");
});