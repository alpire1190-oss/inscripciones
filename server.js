const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

app.post('/api/enviar-whatsapp', async (req, res) => {
    const { tutor, alumno, telefono, turno, curso } = req.body;

    // Limpia el formato del teléfono para Meta (deja solo números)
    let numeroLimpio = telefono.replace(/\D/g, ''); 
    if (!numeroLimpio.startsWith('54')) {
        numeroLimpio = '54' + numeroLimpio;
    }

    try {
        // Conexión directa y segura con la API de Meta
        const response = await fetch(`https://facebook.com{process.env.PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: numeroLimpio,
                type: "template",
                template: {
                    name: "hello_world", 
                    language: { code: "en_US" }
                }
            })
        });

        const data = await response.json();

        if (response.ok) {
            res.status(200).json({ success: true, data });
        } else {
            console.error("Error de Meta:", data);
            res.status(400).json({ success: false, error: data });
        }
    } catch (error) {
        console.error("Error del servidor:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
