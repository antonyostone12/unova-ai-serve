const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Message vide.' });

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            res.json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: data.error?.message || 'Réponse invalide de Gemini.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur réseau : ' + err.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
