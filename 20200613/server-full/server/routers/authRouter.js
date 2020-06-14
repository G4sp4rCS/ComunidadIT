const express = require("express");
const auth = require("../auth");
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento de archivos recibidos
const uploadStorage = multer.diskStorage({
  // Esta es la función que ejecuta para saber dónde guardar un archivo recibido
  destination: (req, file, setFolderCallback) => {
    setFolderCallback(null, './server/public/img/profile');
  },
  // Esta es la función para determinar el nombre
  filename: (req, file, setFilenameCallback) => {
    setFilenameCallback(null, req.body.user + path.extname(file.originalname));
  }
});

// Se crea el middleware con ese storage.
const upload = multer({ storage: uploadStorage });

const authRouter = express.Router();

// Endpoint /auth/login que valida user/pass (form)
authRouter.post("/login", (req, res) => {

  auth.login(req.body.user, req.body.pass, result => {

    if (result.user) {
      // Guardar user logueadx en sesión
      req.session.loggedUser = result.user;

      res.redirect("/person/home");

    } else {

      req.session.message = {
        class: "failure",
        text: "Couldn't log in."
      };

      res.redirect("/pages/login");
    }

  });

});

// Endpoint para cambio de password
authRouter.post("/changepass", (req, res) => {

  if (req.session.loggedUser) {

    // Si el password está mal ingresado renderizo signup con mensaje de error
    if (!req.body.pass || req.body.pass !== req.body.passRepeat) {

      req.session.message = {
        class: "failure",
        text: "Passwords must be equal"
      }

      res.redirect("/pages/changepass");
      return;
    }

    auth.changePassword(req.session.loggedUser.user, req.body.pass, result => {
      if (result) {

        req.session.message = {
          class: "success",
          text: "Password successfully changed. Please log in again."
        }
        res.redirect("/pages/login");

      } else {
        req.session.message = {
          class: "failure",
          text: "Could not save new password."
        }
  
        res.redirect("/pages/changepass");
      }
    });


  } else {

    res.redirect("/pages/login");

  }

});

// Endpoint que registra user nuevx
authRouter.post("/register", upload.single('picture'), (req, res) => {

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

      res.redirect("/pages/signup");

      // Return para que no siga ejecutando el resto de la función
      return;
    };

    // Si el usuario ya existe renderizo signup con mensaje de error
    if (result.user) {

      req.session.message = {
        class: "failure",
        text: "Sorry, username already in use."
      }

      res.redirect("/pages/signup");

      return;
    }

    // Si el password está mal ingresado renderizo signup con mensaje de error
    if (!req.body.pass || req.body.pass !== req.body.passRepeat) {

      req.session.message = {
        class: "failure",
        text: "Passwords must be equal"
      }

      res.redirect("/pages/signup");
      return;
    }

    const userData = {
      user: req.body.user,
      password: req.body.pass,
      name: req.body.name,
      avatarImg: req.file.filename
    };

    // Procesamos alta de usuarix
    auth.registerUser(userData, result => {

      if (result) {

        req.session.message = {
          class: "success",
          text: "Successfully registered, please sign in."
        };
        res.redirect("/pages/login");

      } else {

        // Si no se pudo registrar renderizo signup con mensaje de error
        req.session.message = {
          class: "success",
          text: "Sorry, could't register user, please try again later."
        };
        res.redirect("/pages/signup");

      }
    });
  });
});

authRouter.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/pages/login");
});

module.exports = authRouter;