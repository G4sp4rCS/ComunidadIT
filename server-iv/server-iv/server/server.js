const HTTP_PORT = 4444;

const express = require("express");
const path = require("path");
const expHbs = require("express-handlebars");
const bodyParser = require("body-parser");

const persons = require("./persons");
const auth = require("./auth");

const app = express();

app.set("view engine", "handlebars");

app.engine("handlebars", expHbs({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts")
}));

app.set("views", path.join(__dirname, "views"));

// Ruta base de recursos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Body Parser para Content-Type "application/x-www-form-urlencoded"
app.use(bodyParser.urlencoded({ extended: true }));

// Landing page
app.get("/", (req, res) => {
  res.render("index", { layout: "landing" });
});

// Página de registro
app.get("/signup", (req, res) => {
  res.render("signup", { layout: "landing" });
});

// Endpoint que registra user nuevx
app.post("/register", (req, res) => {

  // 1. Validar datos de registro
  auth.getUser(req.body.user, result => {

    // Si no se pudo consultar a la DB renderizo signup con mensaje de error
    if (!result.success) {
      res.render("signup", {
        layout: "landing",
        message: {
          class: "failure",
          text: "Sorry, can't register now, retry later."
        }
      });
      return;
    }

    // Si el usuario ya existe renderizo signup con mensaje de error
    if (result.user) {
      res.render("signup", {
        layout: "landing",
        message: {
          class: "failure",
          text: "Sorry, username already in use."
        }
      });
      return;
    }

    // Si el password está mal ingresado renderizo signup con mensaje de error
    if (!req.body.pass || req.body.pass !== req.body.passRepeat) {
      res.render("signup", {
        layout: "landing",
        message: {
          class: "failure",
          text: "Passwords must be equal"
        }
      });
      return;
    }

    // Procesamos alta de usuarix
    auth.registerUser(req.body.user, req.body.pass, result => {

      if (result) {

        // Si se pudo registrar renderizo index con mensaje de éxito
        res.render("index", {
          layout: "landing", message: {
            class: "success",
            text: "User registered, please sign in."
          }
        });

      } else {

        // Si no se pudo registrar renderizo signup con mensaje de error
        res.render("signup", {
          layout: "landing",
          message: {
            class: "failure",
            text: "Sorry, could't register user, please try again later."
          }
        });

      }

    });


  });

});

// Endpoint que valida user/pass (form)
app.post("/login", (req, res) => {

  auth.login(req.body.user, req.body.pass, result => {

    if (result.valid) {
      // Renderizado de home con datos de personas
      persons.getAll(list => res.render("home", { persons: list }));
    } else {
      // Se retorna el index con el error
      res.render("index", { layout: "landing", message: result.msg });
    }

  });

});

// Vista "profile" con datos de una persona
app.get("/person/:id", (req, res) => {

  // Consulta una persona que tenga ese id (si no está, retorna undefined)
  persons.getById(req.params.id, personItem => {
    // Con ese dato renderizo "profile"
    res.render("profile", { person: personItem })
  })
});

app.post("/person/:id/message", (req, res) => {

  console.log(req.body);

  persons.saveMessage(req.params.id, req.body.message, result => {
    if (result.success) {
      res.render("profile", { person: result.updatedPerson });
    }
  });

})

// Inicio del servidor
app.listen(HTTP_PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${HTTP_PORT}/ ...`)
});
