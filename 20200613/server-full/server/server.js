const HTTP_PORT = 4444;

const express = require("express");
const path = require("path");
const expHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const expSession = require("express-session");
const pagesRouter = require("./routers/pagesRouter");
const personRouter = require("./routers/personRouter");
const authRouter = require("./routers/authRouter");

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
  // Si hay usuarix logueadx, redirecciona a home
  if (req.session.loggedUser) {
    res.redirect("person/home");
  } else {
    // Si no, redirecciona a /login
    res.redirect("/pages/login");
  }
});

app.use("/pages", pagesRouter);
app.use("/person", personRouter);
app.use("/auth", authRouter);

// Inicio del servidor
app.listen(HTTP_PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${HTTP_PORT}/ ...`)
});
