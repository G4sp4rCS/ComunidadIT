// Importo librerias
const express = require("express");
const app = express();
const path = require("path");
// defino que la carpeta Client se automaneje
app.use(express.static(path.join(__dirname, "../Client")))
// defino la ruta o endpoint
app.get("/person", function (req, res) {

    res.sendFile(path.join(__dirname, "../Client/index.html"));

})
app.get("/info", function (req, res) {
    let people = [
        {
            nombre: "Gaspar",
            Edad: 19
        },
        {
            nombre: "Sebastian",
            Edad: 24
        },
        {
            nombre: "Victoria",
            Edad: 19
        }
    ]
    if (req.query.nombre && req.query.Edad) {
        let resultados = people.filter(function(person) {
            let nombreRecibido = person.nombre.toUpperCase();
            let nombreFiltroEnMayuscula = req.query.nombre.toUpperCase();
            let edadFiltro = parseInt(req.query.Edad);
            let edadRecibida = person.Edad;
            console.log(edadFiltro,edadRecibida);
            return nombreRecibido.includes(nombreFiltroEnMayuscula) && edadRecibida >= edadFiltro;
          });
        res.json(resultados);
      } else {
        res.json(people);
      }
    
    });

//abro puerto
app.listen(8080, function () {

    console.log("Abriendo 8080");
})