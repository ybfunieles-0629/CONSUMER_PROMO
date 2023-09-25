const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})



// Ruta para obtener todos los materiales
app.get('/marpico', async (req, res) => {
    // Realiza una solicitud GET a la API de Marpico
    const apiUrl = 'https://marpicoprod.azurewebsites.net/api/inventarios/materialesAPI';
    const apiKey = 'KZuMI3Fh5yfPSd7bJwqoIicdw2SNtDkhSZKmceR0PsKZzCm1gK81uiW59kL9n76z';

    const headers = new Headers();
    headers.append('Authorization', `Api-Key ${apiKey}`);

    const request = new Request(apiUrl, {
        method: 'GET',
        headers
    });

    try {
        const response = await fetch(request);
        const data = await response.json();

        // Devuelve la respuesta de la API
        res.json(data);
    } catch (error) {
        throw error;
    }
});


// Ruta para obtener un producto por ID
app.get('/promos', async (req, res) => {
    // Realiza una solicitud GET a la API de Cataprom
    const apiUrl = `https://api.cataprom.com/rest/productos/CP-175`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
  
      // Devuelve la respuesta de la API
      res.json(data);
    } catch (error) {
      throw error;
    }
  });


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
