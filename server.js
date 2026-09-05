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

    console.log(`Nueva inscripción recibida de: ${alumno}`);

    // Mensaje armado que te va a llegar a TU celular
    const textoMensaje = encodeURIComponent(`¡Nueva Inscripción!\nAlumno: ${alumno}\nTutor: ${tutor}\nCurso: ${curso}\nTurno: ${turno}`);

    // Enlace directo a tu WhatsApp personal a través de CallMeBot (No se vence NUNCA)
    const url = `https://callmebot.com{textoMensaje}&apikey=1043912`;

    try {
        await axios.get(url);
        console.log('Mensaje enviado con éxito a tu celular.');
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error al enviar:', error.message);
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => console.log(`Servidor activo permanente`));
