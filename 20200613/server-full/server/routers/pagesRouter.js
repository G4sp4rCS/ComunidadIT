const express = require("express");

const pagesRouter = express.Router()

// Vista de Login
pagesRouter.get("/login", (req, res) => {
  res.render("index", {
    message: req.session.message
  });
});

// Vista de registro
pagesRouter.get("/signup", (req, res) => {
  res.render("signup", {
    message: req.session.message
  });
});

// Vista de cambio de pass
pagesRouter.get("/changepass", (req, res) => {

  if (req.session.loggedUser) {
    res.render("changepass", {
      message: req.session.message
    });
  } else {
    res.redirect("/pages/login");
  }

});

module.exports = pagesRouter;