const express = require('express');
const fetch = require('node-fetch'); // Importa la biblioteca 'node-fetch'
const app = express();
const port = 5894;

app.get('/', (req, res) => {
    res.json({
        ok: 200,
        message: 'Servidor en funcionamiento!'
    });
});




// ------------------------------------------------------------------------------------------------------------
// PETICIONES API ROMOS
//--------------------------------------------------------------------------------


app.get('/categorias', async (req, res) => {
    const apiUrl = 'http://api.cataprom.com/rest/categorias';

    try {
        const response = await fetch(apiUrl);
        console.log(response);
        if (response.status >= 200 && response.status < 300) {
            const data = await response.json();
            const statusCode = data.status || 200; // Usar 200 si no se proporciona un código de estado

            res.status(statusCode).json({
                data: data,
                status: statusCode,
            });
        } else {
            res.status(response.status).json({
                error: 'Error en la solicitud a la API externa',
                status: response.status,
            });
        }

    } catch (error) {
        console.error(error);
        res.json({
            msg: error.message,
            response
        });
    }
});










// Definición de la función handleExternalApiRequest
async function handleExternalApiRequest(apiUrl) {
    try {
        // Realiza la solicitud GET a la API externa
        const response = await fetch(apiUrl);
        console.log(response.status)
        // Verifica si la respuesta no es exitosa (código de estado diferente de 200 OK)
        if (!response.ok) {
            // Puedes personalizar el mensaje de error en función de la respuesta recibida
            const errorMessage = `La API externa respondió con un código de estado ${response.status}`;
            throw new Error(errorMessage);
        }

        // Parsea la respuesta JSON de la API externa
        const data = await response.json();

        // Retorna los datos recibidos
        return data;
    } catch (error) {
        // Maneja los errores que puedan ocurrir durante la solicitud
        console.error(error);

        // Puedes personalizar el mensaje de error en función del error
        throw new Error('Error interno del servidor');
    }
}





// PETICION PRODUCTOS POR ID
app.get('/promos/:id_producto', async (req, res) => {
    const { id_producto } = req.params; // Obtén el valor del parámetro id_producto de la URL

    // Utiliza id_producto en tu solicitud a la API externa
    const apiUrl = `http://api.cataprom.com/rest/productos/${id_producto}`;

    try {
        const response = await fetch(apiUrl);

        if (response.status >= 200 && response.status < 300) {
            const data = await response.json();
            const statusCode = data.status || 200;

            res.status(statusCode).json({
                data: data,
                status: statusCode,
            });
        } else {
            res.status(response.status).json({
                error: 'Error en la solicitud a la API externa',
                status: response.status,
            });
        }
    } catch (error) {
        console.error(error);
        res.json({
            msg: error.message,
        });
    }
});







// PETICION PRODUCTOS POR CATEGORIA
app.get('/productos/categorias/:id/productos', async (req, res) => {
    const id = req.params.id; // Obtener el valor de 'id' desde los parámetros de la ruta
    const apiUrl = `http://api.cataprom.com/rest/categorias/${id}/productos`;

    try {
        const response = await fetch(apiUrl);
        if (response.status >= 200 && response.status < 300) {
            const data = await response.json();
            const statusCode = data.status || 200; // Usar 200 si no se proporciona un código de estado

            res.status(statusCode).json({
                data: data,
                status: statusCode,
            });
        } else {
            res.status(response.status).json({
                error: 'Error en la solicitud a la API externa',
                status: response.status,
            });
        }
    } catch (error) {
        console.error(error);
        res.json({
            msg: error.message,
        });
    }
});












// PETICION DE GENERAR PRODUCTOS DE PROMOS SEGUN CATEGORIAS
app.get('/misproductos', async (req, res) => {
    try {
        // Consumir la primera API para obtener el listado de categorías
        const categoriasResponse = await fetch('http://api.cataprom.com/rest/categorias');

        if (!categoriasResponse.ok) {
            throw new Error('Error al obtener categorías');
        }

        const categoriasData = await categoriasResponse.json();

        // Verificar si categoriasData.resultado es un iterable (array)
        if (!Array.isArray(categoriasData.resultado)) {
            throw new Error('El resultado de las categorías no es una matriz');
        }

        // Inicializar una lista para almacenar las primeras dos categorías
        const selectedCategorias = [];
        const maxCategorias = 2; // Cambia esto al número deseado de categorías

        // Recorrer las categorías y consumir la segunda API para obtener productos
        for (const categoria of categoriasData.resultado) {
            if (selectedCategorias.length >= maxCategorias) {
                break; // Sal del bucle después de obtener el número deseado de categorías
            }

            const idCategoria = categoria.id;
            const productosResponse = await fetch(`http://api.cataprom.com/rest/categorias/${idCategoria}/productos`);

            if (productosResponse.ok) {
                const productosData = await productosResponse.json();

                // Verificar si productosData.resultado es un objeto
                if (typeof productosData.resultado === 'object') {
                    selectedCategorias.push(productosData.resultado);
                }
            } else {
                // Manejar errores específicos de la solicitud de productos
                console.error(`Error al obtener productos de categoría ${idCategoria}`);
            }
        }

        // Enviar la lista de las primeras dos categorías como respuesta
        res.json({
            categorias: selectedCategorias,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error interno del servidor',
        });
    }
});







// SEGUNDA PETICION DE PRUEBA DE PRODUCTOS
app.get('/productosfinales', async (req, res) => {
    try {
        // Consumir la primera API para obtener el listado de categorías
        const categoriasResponse = await fetch('http://api.cataprom.com/rest/categorias');

        if (!categoriasResponse.ok) {
            throw new Error('Error al obtener categorías');
        }

        const categoriasData = await categoriasResponse.json();

        // Verificar si categoriasData.resultado es un iterable (array)
        if (!Array.isArray(categoriasData.resultado)) {
            throw new Error('El resultado de las categorías no es una matriz');
        }

        // Inicializar una lista para almacenar las primeras dos categorías y sus stocks
        const selectedCategorias = [];
        const maxCategorias = 2; // Cambia esto al número deseado de categorías

        // Recorrer las categorías y consumir la segunda API para obtener productos
        for (const categoria of categoriasData.resultado) {
            if (selectedCategorias.length >= maxCategorias) {
                break; // Sal del bucle después de obtener el número deseado de categorías
            }

            const idCategoria = categoria.id;
            const productosResponse = await fetch(`http://api.cataprom.com/rest/categorias/${idCategoria}/productos`);

            if (productosResponse.ok) {
                const productosData = await productosResponse.json();

                // Verificar si productosData.resultado es un objeto
                if (typeof productosData.resultado === 'object') {
                    const productos = productosData.resultado;

                    // Arreglo para almacenar los productos con su stock
                    const productosConStock = [];

                    // Iterar sobre cada producto para obtener su stock
                    for (const producto of productos) {
                        const referencia = producto.referencia;

                        // Llamar a la API de stock usando la referencia del producto
                        const stockResponse = await fetch(`http://api.cataprom.com/rest/stock/${referencia}`);

                        if (stockResponse.ok) {
                            const stockData = await stockResponse.json();
                            
                            // Agregar el producto y su stock al arreglo
                            productosConStock.push({
                                ...producto,
                                stock: stockData // Agregar la información de stock al producto
                            });
                        } else {
                            console.error(`Error al obtener el stock para la referencia ${referencia}`);
                        }
                    }

                    // Añadir los productos con su stock a la lista de categorías seleccionadas
                    selectedCategorias.push({
                        categoria: categoria,
                        productos: productosConStock,
                    });
                }
            } else {
                // Manejar errores específicos de la solicitud de productos
                console.error(`Error al obtener productos de categoría ${idCategoria}`);
            }
        }

        // Enviar la lista de las primeras dos categorías y sus productos con stock como respuesta
        res.json({
            categorias: selectedCategorias,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error interno del servidor',
        });
    }
});







// PETICION DE STOCK DE PRODUCTOS POR REFERENCIA
app.get('/stock/:id', async (req, res) => {

    const id = req.params.id;
    const apiUrl = `http://api.cataprom.com/rest/stock/${id}`;

    try {
        const response = await fetch(apiUrl);

        if (response.status >= 200 && response.status < 300) {
            const data = await response.json();
            const statusCode = data.status || 200; // Usar 200 si no se proporciona un código de estado

            res.status(statusCode).json({
                data: data,
                status: statusCode,
            });
        } else {
            res.status(response.status).json({
                error: 'Error en la solicitud a la API externa',
                status: response.status,
            });
        }

    } catch (error) {
        console.error(error);
        res.json({
            msg: error.message,

        });
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
