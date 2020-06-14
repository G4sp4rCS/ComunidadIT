const HTTP_PORT = 4444;

const express = require("express");
const path = require("path");
const expHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const expSession = require("express-session");

const persons = require("./persons");
const auth = require("./auth");

const app = express();

app.set("view engine", "handlebars");

app.engine("handlebars", expHbs({
  defaultLayout: "public",
  layoutsDir: path.join(__dirname, "views/layouts")
}));

app.set("views", path.join(__dirname, "views"));

// Ruta base de recursos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Body Parser para Content-Type "application/x-www-form-urlencoded"
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración del objeto de sesión
app.use(expSession({
  secret: "Este texto puede contener cualquier cosa",
  resave: false,
  saveUninitialized: false
}));


// Landing page
app.get("/", (req, res) => {
  // Si hay usuarix logueadx, redirecciona a /home
  console.log("asdasdasd "+ req.session.loggedUser);
  console.log("asdasdasd 2 "+typeof req.session.loggedUser);
  if (req.session.loggedUser) {
    res.redirect("/home");
  } else {
    // Si no, redirecciona a /login
    res.redirect("/login");
  }
});


// Vista de Login
app.get("/login", (req, res) => {
  res.render("index", {
    message: req.session.message
  });
});


// Vista de registro
app.get("/signup", (req, res) => {
  res.render("signup", {
    message: req.session.message
  });
});


// Endpoint que registra user nuevx
app.post("/register", (req, res) => {

  // 1. Validar datos de registro
  auth.getUser(req.body.user, result => {

    // Si no se pudo consultar a la DB renderizo signup con mensaje de error
    if (!result.success) {

      // Agrego el mensaje en el objeto de sesión antes de redireccionar
      // (para que cuando llegue el request a /signup podamos tener acceso
      // a ese dato)
      req.session.message = {
        class: "failure",
        text: "Sorry, can't register now, retry later."
      }

      res.redirect("/signup");

      // Return para que no siga ejecutando el resto de la función
      return;
    };

    // Si el usuario ya existe renderizo signup con mensaje de error
    if (result.user) {

      req.session.message = {
        class: "failure",
        text: "Sorry, username already in use."
      }

      res.redirect("/signup");

      return;
    }

    // Si el password está mal ingresado renderizo signup con mensaje de error
    if (!req.body.pass || req.body.pass !== req.body.passRepeat) {

      req.session.message = {
        class: "failure",
        text: "Passwords must be equal"
      }

      res.redirect("/signup");
      return;
    }

    // Procesamos alta de usuarix
    auth.registerUser(req.body.user, req.body.pass, result => {

      if (result) {

        req.session.message = {
          class: "success",
          text: "Successfully registered, please sign in."
        };
        res.redirect("/login");

      } else {

        // Si no se pudo registrar renderizo signup con mensaje de error
        req.session.message = {
          class: "success",
          text: "Sorry, could't register user, please try again later."
        };
        res.redirect("/signup");

      }
    });
  });
});


app.get("/home", (req, res) => {
  if (req.session.loggedUser) {
    // Renderizado de home con datos de personas
    persons.getAll(list => res.render("home", {
      layout: "logged",
      persons: list,
      user: req.session.loggedUser
    }));
  } else {
    res.redirect("/login");
  }
});


// Endpoint que valida user/pass (form)
app.post("/login", (req, res) => {

  auth.login(req.body.user, req.body.pass, result => {

    if (result.user) {
      // Guardar user logueadx en sesión
      req.session.loggedUser = result.user;

      res.redirect("/home");

    } else {

      req.session.message = {
        class: "failure",
        text: "Couldn't log in."
      };

      res.redirect("/login");
    }

  });

});


app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});


// Vista "profile" con datos de una persona
app.get("/person/:id", (req, res) => {

  if (req.session.loggedUser) {
    // Consulta una persona que tenga ese id (si no está, retorna undefined)
    persons.getById(req.params.id, personItem => {
      // Con ese dato renderizo "profile"
      res.render("profile", {
        layout: "logged",
        person: personItem,
        user: req.session.loggedUser
      });
    })
  } else {
    res.redirect("/login");
  }

});


app.post("/person/:id/message", (req, res) => {

  persons.saveMessage(req.params.id, req.body.message, result => {
    if (result.success) {
      res.render("profile", {
        layout: "logged",
        person: result.updatedPerson
      });
    }
  });

});


// Inicio del servidor
app.listen(HTTP_PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${HTTP_PORT}/ ...`)
});
