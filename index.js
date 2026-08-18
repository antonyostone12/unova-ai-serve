const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Remplacez les guillemets par votre clé API Google Gemini
const GEMINI_API_KEY = "VOTRE_CLE_API_GEMINI_ICI";

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ status: 'error', message: 'Message vide.' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Tu es Unova Assistance, l'IA officielle de Unova Social. Sois amicale, dynamique et concise.\n\nUser: " + message }]
                }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            res.json({ status: 'success', reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ status: 'error', message: 'Erreur de réponse API Google.' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Erreur serveur IA.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur Unova lancé sur le port ${PORT}`));