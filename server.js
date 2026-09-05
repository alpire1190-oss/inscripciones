const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/enviar-whatsapp', async (req, res) => {
    const { tutor, alumno, telefono, turno, curso } = req.body;

    // Limpieza automática del número
    let numeroLimpio = telefono.replace(/\D/g, ''); 

    if (numeroLimpio.startsWith('0')) {
        numeroLimpio = numeroLimpio.substring(1);
    }
    if (numeroLimpio.includes('15')) {
        numeroLimpio = numeroLimpio.replace('15', '');
    }

    if (numeroLimpio.length === 10) {
        numeroLimpio = '549' + numeroLimpio;
    } else if (!numeroLimpio.startsWith('54')) {
        numeroLimpio = '54' + numeroLimpio;
    }

    // ID de teléfono directo y token definitivo incrustado
    const url = `https://facebook.com`;

    const data = {
        messaging_product: 'whatsapp',
        to: '3878623883', 
        type: 'template',
        template: {
            name: 'hello_world', 
            language: { code: 'en_US' }
        }
    };

    const config = {
        headers: {
            Authorization: `Bearer EAANGN9bFzo8BO106g93tZBZC6n14fA2lGgZCbep1P8o2gU5gT1W9e6Y4g7LZA0u6ZB4Y7R8v9E8D7C6B5A4t3s2r1qPzOyNxMwLvKuJtIsHrGqFpEoDnCmBlAkAj`,
            'Content-Type': 'application/json'
        }
    };

    try {
        await axios.post(url, data, config);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => console.log(`Servidor activo`));
