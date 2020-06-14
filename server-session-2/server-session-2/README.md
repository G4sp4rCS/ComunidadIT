# Clase Martes 09/06/2020

## Sesiones

Un objeto de sesión va a ser un objeto en el que podemos guardar datos y que se corresponde con una "sesión del navegador". Es decir, podemos agregar y quitar datos de ese objeto y siempre esos datos van a corresponder a un (y solo un) navegador en una computadora en algún lugar. Si tengo un Chrome, un Edge y un Firefox, van a ser tres sesiones diferentes. La navegación en modo incógnito también crea una sesión diferente a la del modo normal.

Entonces, en ese objeto podemos guardar información de esa sesión y cada vez que nos llegue un request de ese cliente, vamos a ver los datos que nosotrxs quisimos dejar ahí para esa sesión. Por ejemplo, cuando validamos bien sus credenciales (user/password) y lo "logueamos" a nuestro sitio, podemos guardar en el objeto de sesión sus datos, y entonces saber, cada vez que llega un request desde su sesión de navegador, que es ese user el que lo está disparando, o acceder a cualquier otro dato que hubiéramos dejado.

Usamos el módulo "express-session", que requiere configurar un middleware con una clave secreta (que se usa para hacer un [hash](https://es.wikipedia.org/wiki/Funci%C3%B3n_hash), una función de encriptación) que va a administrar esos datos de sesión. Cada vez que llegue un request nos va a facilitar un objeto con esa información, en `req.session`. Ese objeto va a poder contener lo que nos interese guardar.

En este ejemplo, cuando se hace un login efectivo, agregamos el objeto `loggeduser` (nombre completamente arbitrario que quisimos ponerle, no hay restricciones ni condiciones en el contenido del objeto de sesión) dentro del objeto `req.session` (como siempre en JavaScript, escribir el nombre de una propiedad inexistente en un objeto la crea):

```javascript
req.session.loggedUser = result.user; // result contiene un objeto con datos consultados a la DB
```

Luego, consultamos la existencia y contenido de ese objeto para validar si cuando llega un GET a una ruta que requiere estar logueadx, vamos a mostrar la información o vamos a mandar a loguearse. También la usamos para pasársela al layout "logged" que muestra en la cabecera una barra con datos de quien esté logueadx.

Para destruir la información de la sesión (lo hacemos cuando se navega a `/logout`) usamos la función destroy:

```javascript
req.session.destroy();
```

En este caso, también estamos usando el objeto de sesión para guardar un mensaje que queramos que se muestre (en las vistas que esperan un objeto con eso, `index` y `signup`).

#### Datos de usuarix adicionales

En ese objeto de usuario que creamos dentro del objeto de sesión, agregamos dos datos, `name` y `avatarImg`, para usarlos en la nav bar que creamos en el layout logged (y agregamos imágenes en una carpeta public/img/profile, cuyos nombres guardamos en ese campo avatarImg).


## Redirect

Otra cosa que agregamos es la redirección con Express. La función `redirect` de Express nos permite responder un request indicando al navegador (cliente) que tiene que dirigirse a otra url. Por ejemplo:

```javascript
res.redirect("/home");
```

le responde al navegador que tiene que dirigirse a `localhost:4444/home` (en este ejemplo).


## Constantes

Como herramienta para evitar repetición de constantes de configuración, vimos la posibilidad de usar un archivo donde guardamos esas constantes y las exportamos para accederlas desde varios lados (en este caso creamos const-db.js donde guardamos la configuración para acceder a nuestro servidor de MongoDB).
