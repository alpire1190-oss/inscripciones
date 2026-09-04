const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para entender los datos que envías desde el formulario HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir tus archivos estáticos (HTML, CSS, JS del navegador) desde la raíz del proyecto
app.use(express.static(path.join(__dirname)));

// Ruta principal para cargar tu página web
app.get('/', (pathRequest, pathResponse) => {
    pathResponse.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta que procesa el formulario de inscripción y envía el WhatsApp
app.post('/inscribir', async (req, res) => {
    const { nombre, email } = req.body; // Cambia esto si tus campos del HTML se llaman diferente

    console.log(`Nueva inscripción recibida: ${nombre} (${email})`);

    // CONFIGURACIÓN CORRECTA PARA WHATSAPP CLOUD API
    const url = `https://facebook.com{process.env.PHONE_NUMBER_ID}/messages`;

    const data = {
        messaging_product: 'whatsapp',
        to: '543878538883', // Tu número de WhatsApp configurado
        type: 'template',
        template: {
            name: 'hello_world', // Plantilla oficial de prueba de Meta
            language: {
                code: 'en_US'
            }
        }
    };

    const config = {
        headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        // Enviar el mensaje a Meta
        await axios.post(url, data, config);
        console.log('Mensaje de WhatsApp enviado con éxito.');
        
        // Respuesta que recibe tu página web si todo sale bien
        res.status(200).json({ success: true, message: 'Inscripción exitosa y mensaje enviado.' });
    } catch (error) {
        console.error('Error al conectar con Meta:', error.response ? error.response.data : error.message);
        
        // Respuesta si falla WhatsApp pero los datos llegaron al servidor
        res.status(500).json({ success: false, message: 'La inscripción se hizo, pero falló el envío de WhatsApp.' });
    }
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
