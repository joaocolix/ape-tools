const express = require('express');
const axios = require('axios');
const path = require('path');
const router = express.Router();

const TOKEN = process.env.IPINFO_TOKEN || 'SUA_CHAVE_IPINFO';

router.get('/:ip', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'ip', 'index.html'));
});

router.get('/ipinfo/:ip', async (req, res) => {
  try {
    const response = await axios.get(`https://ipinfo.io/${req.params.ip}?token=${TOKEN}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar IP' });
  }
});

module.exports = router;