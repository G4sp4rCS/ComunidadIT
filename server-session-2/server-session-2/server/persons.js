const db = require("./const-db");

/**
 * Consulta todos los datos de personas
 * 
 * @param {function} cbResult callback function(personList: Array)
 */
const getAll = (cbResult) => {
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    if (err) {
      // retornar array vacío
      cbResult([]);
      client.close();
    } else {
      const serveriiDB = client.db("serverii");
      const personsCollection = serveriiDB.collection("persons");

      personsCollection.find().toArray((err, personList) => {
        if (err) {
          // retornar array vacío
          cbResult([]);
        } else {
          // retornar array con datos
          cbResult(personList)
        }
        client.close();
      });

    }
  });
}

/**
 * Retorna la persona del id recibido
 * 
 * @param {string} filterId Id de la persona buscada
 * @param {function} cbResult callback function(persona: object)
 * 
 * @returns {object | undefined} Objeto con datos de la persona encontrada o undefined si no se encuentra
 */
const getById = (filterId, cbResult) => {
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    if (err) {
      // retornar array vacío
      cbResult(undefined);
      client.close();
    } else {
      const serveriiDB = client.db("serverii");
      const personsCollection = serveriiDB.collection("persons");

      personsCollection.findOne({ id: filterId }, (err, person) => {

        // retornar array con datos
        if (err) {
          cbResult(undefined);
        } else {
          cbResult(person);
        }

        client.close();
      });

    }
  });
}

/**
 * Función que agrega mensaje para una persona
 * 
 * @param {string} personId 
 * @param {string} message 
 * @param {function} cbResult Callback: function({
 *   success: boolean,
 *   updatedPerson: objeto de persona
 * })
 */
const saveMessage = (personId, message, cbResult) => {

  // Esta función es fake, debería insertar en la DB y devolver
  // los datos de la persona actualizados para refrescar la vista "profile"

  getById(personId, person => {

    const fakeUpdatedPerson = person;

    fakeUpdatedPerson.messageList.push(message);

    cbResult({
      success: true,
      updatedPerson: fakeUpdatedPerson
    })

  })

}

// Exportación de las 3 funciones
module.exports = {
  getAll,
  getById,
  saveMessage
};