const constDB = require("./const-db");

/**
 * Consulta todos los datos de personas
 * 
 * @param {function} cbResult callback function(personList: Array)
 */
const getAll = (nameFilter, cbResult) => {
  constDB.MongoClient.connect(constDB.url, constDB.config, (err, client) => {
    if (err) {
      // retornar array vacío
      cbResult([]);
      client.close();
    } else {
      const serverDB = client.db(constDB.server);
      const personsCollection = serverDB.collection("persons");

      // Objeto para filtrar la consulta (si no hay filtros, queda vacío, que
      // es lo mismo que no pasar filtro)
      const filter = {};

      // Si se indicó nombre para filtrar, lo agregamos en el objeto filter
      if (nameFilter) {
        filter.name = { $regex: `.*${nameFilter}.*` };
      }

      // Hacemos la consulta y pasamos el filter (vacío o con el filtro por name)
      personsCollection.find(filter).sort({ name: 1 }).toArray((err, personList) => {
        if (err) {
          // retornar array vacío
          cbResult([]);
        } else {
          // retornar array con datos
          personList = personList.map(person => ({
            oid: person._id.toString(),
            name: person.name,
            surname: person.surname,
            profilePic: person.profilePic,
            age: person.age,
            messageList: person.messageList
          }));
          cbResult(personList)
        }
        client.close();
      });

    }
  });
}


/**
 * Consulta la persona de más edad
 * 
 * @param {function} cbResult callback function(person: object)
 */
const getOlder = (cbResult) => {
  constDB.MongoClient.connect(constDB.url, constDB.config, (err, client) => {
    if (err) {
      // retornar array vacío
      cbResult([]);
      client.close();
    } else {
      const serverDB = client.db(constDB.server);
      const personsCollection = serverDB.collection("persons");

      // "limit" indica cuántos documentos retornar. sort descendente + limit en este caso nos
      // sirve para obtener el documento con la edad máxima (le estamos pidiendo que, ordenados
      // de mayor a menor, nos traiga el primer documento: ese es el máximo).
      personsCollection.find().sort({ age: -1 }).limit(1).toArray((err, personList) => {
        if (err) {
          // retornar array vacío
          cbResult({});
        } else {
          if (personList.length > 0) {
            cbResult(personList[0]);
          } else {
            cbResult({});
          }
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

  // Conexión a la DB
  constDB.MongoClient.connect(constDB.url, constDB.config, (err, client) => {

    if (err) {
      // retornar undefined
      cbResult(undefined);
      client.close();
    } else {
      const serverDB = client.db(constDB.server);
      const personsCollection = serverDB.collection("persons");

      personsCollection.findOne({ _id: new constDB.ObjectID(filterId) }, (err, person) => {

        // retornar array con datos
        if (err) {
          cbResult(undefined);
        } else {
          // Retornamos el array con datos transformando el _id en un string (oid)
          cbResult({
            oid: person._id.toString(),
            name: person.name,
            surname: person.surname,
            profilePic: person.profilePic,
            age: person.age,
            messageList: person.messageList
          });
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
 * @param {function} cbResult Callback: function(boolean) indicando si se pudo hacer
 */
const saveMessage = (personId, message, cbResult) => {

  // Conexión a la DB
  constDB.MongoClient.connect(constDB.url, constDB.config, (err, client) => {

    if (err) {
      // Si no hubo resultados
      cbResult(undefined);
      client.close();
    } else {
      const serverDB = client.db(constDB.server);
      const personsCollection = serverDB.collection("persons");

      // Objeto con el filtro para encontrar el elemento a modificar
      const query = { _id: new constDB.ObjectID(personId) };

      // Objeto con la operación de modificación (agregado del string recibido en un array)
      const update = {
        $push: {
          messageList: message
        }
      };

      // Ejecución del update en MongoDB
      personsCollection.updateOne(query, update, (err, result) => {

        if (err) {
          // Si no se pudo hacer, llamo al callback con false
          cbResult(false);
        } else {
          // Si funcionó, vuelve con true
          cbResult(true);
        }

        client.close();
      });

    }
  });


}

// Exportación de las 3 funciones
module.exports = {
  getAll,
  getById,
  saveMessage,
  getOlder
};