const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const ticketDir = path.join(__dirname, '..', '..', 'uploads');
const upload = multer({ dest: ticketDir });

if (!fs.existsSync(ticketDir)) fs.mkdirSync(ticketDir, { recursive: true });

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });

  const targetPath = path.join(ticketDir, req.file.originalname);

  fs.rename(req.file.path, targetPath, (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao mover o arquivo.' });
    res.json({ fileUrl: `/uploads/${req.file.originalname}` });
  });
});

router.get('/:ip', async (req, res) => {
  let html = await fs.promises.readFile(path.join(__dirname, '..', '..', 'public', 'ip', 'index.html'), 'utf8');
  const hostUrl = process.env.HOST_URL || 'http://localhost';
  html = html.replace('__HOST_URL__', hostUrl);
  res.send(html);
});

module.exports = router;