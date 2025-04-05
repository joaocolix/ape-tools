const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();
const databasePath = path.join(__dirname, '..', 'data', 'database.json');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'colar', 'index.html'));
});

router.post('/save', async (req, res) => {
  const { text, title } = req.body;

  if (!text) return res.status(400).json({ error: 'Texto não pode estar vazio' });

  try {
    let data = fs.existsSync(databasePath)
      ? JSON.parse(await fs.promises.readFile(databasePath, 'utf8'))
      : {};

    const id = Date.now().toString();
    data[id] = { text, title: title || 'Inserir Título_', createdAt: Date.now() };

    await fs.promises.writeFile(databasePath, JSON.stringify(data, null, 2));

    const HOST_URL = process.env.HOST_URL || `http://localhost:${PORT}`;
    res.json({ link: `${HOST_URL}/colar/${id}` });

  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.post('/save-title', async (req, res) => {
  const { id, title } = req.body;

  if (!id || !title) return res.status(400).json({ error: 'ID e título obrigatórios' });

  try {
    let data = JSON.parse(await fs.promises.readFile(databasePath, 'utf8'));
    if (!data[id]) return res.status(404).json({ error: 'Texto não encontrado' });

    data[id].title = title;
    await fs.promises.writeFile(databasePath, JSON.stringify(data, null, 2));

    res.json({ message: 'Título atualizado!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

router.get('/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'colar', 'index.html'));
});

router.get('/text/:id', async (req, res) => {
  try {
    const data = JSON.parse(await fs.promises.readFile(databasePath, 'utf8'));
    const entry = data[req.params.id];
    if (!entry) return res.status(404).json({ error: 'Texto não encontrado' });

    res.json({ text: entry.text, title: entry.title });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;