# Agregados al server-full

## Agrupación de constantes de DB

Esto ya estaba en la versión anterior, lo cambié un poquito nomás. El archivo const-db define y exporta un objeto (para ser importado en los módulos que usen MongoDB) que contiene ciertos parámetros generales (nombre del server, url, objeto de configuración de la conexión) y dos elementos que estamos usando: MongoClient y ObjectID. Ambos son "clases", que como les comenté no son clases en el sentido en que las define la programación orientada a objetos (POO), sino que es un _sintactic sugar_ (una sintaxis nueva para una funcionalidad previa) para manipular prototipos pero dándole un aspecto de clases como en POO. Nada para preocuparse, pero 

## Implementación de la función de postear mensaje

Implementé la función que publica los mensajes (era un fake antes), haciendo insert en la base de datos de un item nuevo en el array `messageList` de la colección `persons`. Ahí usé el $push de MongoDB que hablamos hoy, para que lo puedan ver implementado.

## Subida de archivos con multer

Implementamos también la subida de la foto de perfil en el registro de usuario. Para eso agregamos en el form un input tipo `file` y también especificamos el atributo `encrypt` del form que corresponde cuando enviamos archivos:

```html
    <form action="/auth/register" method="post" enctype="multipart/form-data">
    
    ...

        <input type="file" name="picture" id="picture" accept="image/*">
```

El `enctype` por default es `application/x-www-form-urlencoded`, por eso en formularios sin `file` no lo especificamos.

Este input `type="file"` nos genera un botón para seleccionar el archivo que queremos subir. Podemos usar el atributo `accept` para especificar qué tipo de archivos ofrecer al abrir la ventana para buscar (en este caso con `image/*` estamos indicando que muestre los archivos de imagen). También se le puede agregar un atributo `multiple` para que permita subir varios archivos a la vez (aunque eso requiere un uso ligeramente diferente de multer que en este README no explico, pero es casi igual).

Ahora tenemos que preparar el server para que pueda recibir ese archivo. Para eso vamos a usar el paquete multer de NPM (mejor documentado en https://github.com/expressjs/multer).

Multer nos da otro middleware para procesar subida de archivos y dejarlos en el servidor antes de ejecutar el callback del request. Lo primero es configurar ese middleware, del mismo modo que con los otros que fuimos viendo. Tenemos que decidir qué queremos hacer con esos archivos cuando suban, porque podemos guardarlos con distintos nombres y/o rutas, según nuestra estrategia. En este caso, queremos que las imágenes de avatar de usuario se guarden en la carpeta public/img/profile, y que el nombre sea el username (con la extensión que corresponda según el tipo de archivo). Así configuramos, entonces, multer:

```javascript
const multer = require("multer");
const path = require("path");

const uploadStorage = multer.diskStorage({
  destination: (req, file, setFolderCallback) => {
    setFolderCallback(null, './server/public/img/profile');
  },
  filename: (req, file, setFilenameCallback) => {
    setFilenameCallback(null, req.body.user + path.extname(file.originalname));
  }
});

const upload = multer({ storage: uploadStorage });
```

El storage es la configuración de almacenamiento de los archivos recibidos. Tenemos que declararle dos funciones: destination y filename. Son los callbacks que usa multer para determinar en qué carpeta y con qué nombre guardar el archivo recibido. Para que determinemos esos dos datos, nos provee tres elementos en cada una de esas funciones:

- req: el objeto request de Express, donde podemos ver los otros datos del body además del archivo, por ejemplo.
- file: un objeto con información del archivo recibido (nombre, tipo, etc.)
- el callback para devolver el dato

En este caso, la ruta la explicitamos relativa (desde la ubicación donde corre el proyecto, el package.json). También la podríamos especificar absoluta con path.join(__dirname, ...), y el archivo lo armamos con el nombre del usuario (que vino en el body del form de registro como "user") + la extensión original (".jpg", ".png", la que sea) que la obtenemos del nombre que tenía el archivo en la computadora desde donde se subió (file.originalname).

Lo último es implementar el middleware en el endpoint que nos interesa, en nuestro caso en el POST /register:

```javascript
// Endpoint que registra user nuevx
authRouter.post("/register", upload.single('picture'), (req, res) => {
```

En este caso implementamos el middleware para un archivo solo, `.single` (para muchos archivos la operación es muy similar pero usa `.array`), y le pasamos como parámetro el nombre que tenía en el formulario el input con el archivo (en este caso "picture").
