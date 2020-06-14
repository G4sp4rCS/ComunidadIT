const express = require("express");
const persons = require("../persons");

const personRouter = express.Router();

// Vista de Home
personRouter.get("/home", (req, res) => {
  if (req.session.loggedUser) {
    // Renderizado de home con datos de personas
    persons.getAll(req.query.nameFilter, (list) => res.render("home", {
      layout: "logged",
      persons: list,
      user: req.session.loggedUser
    }));
  } else {
    res.redirect("/pages/login");
  }
});

personRouter.get("/older", (req, res) => {
  if (req.session.loggedUser) {
    // Renderizado de home con datos de personas
    persons.getOlder(olderPerson => res.render("older", {
      layout: "logged",
      olderPerson,
      user: req.session.loggedUser
    }));
  } else {
    res.redirect("/pages/login");
  }
});

// Vista "profile" con datos de una persona
personRouter.get("/:id", (req, res) => {

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
    res.redirect("/pages/login");
  }

});


personRouter.post("/:id/message", (req, res) => {

  if (req.session.loggedUser) {

    // Se guarda el mensaje para la persona
    persons.saveMessage(req.params.id, req.body.message, result => {
        // Si se guardó ok, redirigimos a ese profile para que recargue (y de paso
        // que nos cambie la url), que es elendpoint GET /person/:id con el mismo
        // id recibido por este request. No estamos chequeando si pudo o no guardar el
        // mensaje (no evaluamos "result") porque guarde o no quiero hacer lo mismo
        res.redirect(`/person/${req.params.id}`);
    });

  } else {
    res.redirect("/pages/login");
  }

});

module.exports = personRouter;