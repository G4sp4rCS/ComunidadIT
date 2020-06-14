Como vimos, la API puede retornar cosas que no sean imágenes, así que agregamos validación del dato que, por lo visto, nos indica el tipo de respuesta (media_type).

Vimos que la URL puede recibir por query parameter la fecha:
`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2020-05-04`

Podemos usar eso para probar algunos retornos específicos que nos interese probar (si no le pasamos la fecha, mostrará el resultado del día).

Nota: el "modal" no es tal cosa, es solo un div que aparece sin estilar. Traten de estilarlo para que sea un modal. Una buena forma puede ser, entre otras cosas, con estos estilos CSS:

```css
position: fixed;
z-index: 1; /* para que quede adelante del resto */
```

Prueben ponerle también `width`, `height`, `top`, `left`, colores, hasta sombra si pueden.