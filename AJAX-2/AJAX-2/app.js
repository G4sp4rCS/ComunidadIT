// Callback del botón. Oculta el modal de error y consulta a la API.
function getPhoto() {
    document.getElementById("errorModal").hidden = true;
    processNasaAPI();
}

// Función para mostrar el modal de error
function showError(message) {
    const errorModal = document.getElementById("errorModal");

    errorModal.textContent = message;
    errorModal.hidden = false;
}

// Función que llama a la API y procesa el retorno
function processNasaAPI() {

    const xmlhttp = new XMLHttpRequest();

    xmlhttp.addEventListener("load", function () {

        // Cuando volvió la respuesta, si está ok se muestran los resultados
        if (this.status == 200) {

            try {

                // Parseo la información de respuesta
                let data = JSON.parse(this.responseText);

                // Chequeo datos o asumo defaults para los que falten
                if (!data.date) data.date = "-";
                if (!data.title) data.title = "-";
                if (!data.explanation) data.explanation = "";

                // Asigno los datos para mostrar
                document.getElementById('textDate').textContent += data.date;
                document.getElementById('textTitle').textContent += data.title;
                document.getElementById('textExplanation').textContent += data.explanation;

                // Como vi que no siempre vuelve imagen, me fijo que sea de ese tipo
                if (data.media_type === "image") {
                    document.getElementById('picture').src = data.hdurl;
                } else {
                    // Si no es imagen, no muestro nada, pero me dejo en la consola el tipo para
                    // poder saber por qué no se mostró.
                    console.log(`No se mostró (se recibió contenido de tipo ${data.media_type})`);
                }

                // Oculto el botón de consulta
                document.getElementById('getItContainer').hidden = true;

            } catch (ex) {
                // Si tengo algún error no previsto en el procesamiento del response...
                showError(`Disculpe, hubo un problema procesando la información recibida de la NASA (${ex.message})`);
            }

        } else {
            // Si el código de retorno no fue 200...
            showError("Disculpe, no se pudo consultar la información. Reintente luego.");
        }

    });

    // Llamo a la API
    xmlhttp.open('GET', 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
    // Esta url por ejemplo retorna un video:
    //  xmlhttp.open('GET', 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2020-05-04');
    xmlhttp.send();
}
