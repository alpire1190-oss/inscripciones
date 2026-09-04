const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

app.post('/api/enviar-whatsapp', async (req, res) => {
    const { tutor, alumno, telefono, turno, curso } = req.body;

    // 1. Limpiar el texto: Dejar solo los números sueltos
    let numeroLimpio = telefono.replace(/\D/g, ''); 

    // 2. Si empieza con 0 (ej: 03878...), se lo quitamos
    if (numeroLimpio.startsWith('0')) {
        numeroLimpio = numeroLimpio.substring(1);
    }

    // 3. Si tiene el 15 (ej: 387815...), se lo removemos
    if (numeroLimpio.includes('15')) {
        numeroLimpio = numeroLimpio.replace('15', '');
    }

    // 4. Si el usuario ingresó el formato local de 10 dígitos (ej: 3878623883)
    // Armamos el formato internacional directo con el 54 pero SIN el 9 intermedio
    if (numeroLimpio.length === 10 && !numeroLimpio.startsWith('54')) {
        numeroLimpio = '54' + numeroLimpio;
    } else if (!numeroLimpio.startsWith('54')) {
        // En cualquier otro caso, aseguramos el prefijo de Argentina
        numeroLimpio = '54' + numeroLimpio;
    }

    console.log("Número final enviado a Meta:", numeroLimpio);

    try {
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
