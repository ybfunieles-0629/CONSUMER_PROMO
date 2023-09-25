const express = require('express');
const fetch = require('node-fetch'); // Importa la biblioteca 'node-fetch'
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Ruta para obtener todos los materiales
app.get('/marpico', async (req, res) => {
    // Realiza una solicitud GET a la API de Marpico
    const apiUrl = 'https://marpicoprod.azurewebsites.net/api/inventarios/materialesAPI';
    const apiKey = 'KZuMI3Fh5yfPSd7bJwqoIicdw2SNtDkhSZKmceR0PsKZzCm1gK81uiW59kL9n76z';

    const headers = {
        'Authorization': `Api-Key ${apiKey}`
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });

        const data = await response.json();

        // Devuelve la respuesta de la API
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
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
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

app.listen(port, () => {
    console.log(`Aplicación de ejemplo escuchando en el puerto ${port}`);
});
