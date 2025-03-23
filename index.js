const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();

const upload = multer({ dest: 'uploads/' });

const ticketDir = path.join(__dirname, 'ticket');
if (!fs.existsSync(ticketDir)) {
    fs.mkdirSync(ticketDir, { recursive: true });
}

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const tempPath = req.file.path;
    const targetPath = path.join(ticketDir, req.file.originalname);

    fs.rename(tempPath, targetPath, (err) => {
        if (err) {
            console.error('Erro ao mover o arquivo:', err);
            return res.status(500).json({ error: 'Erro ao mover o arquivo.' });
        }

        const fileUrl = `http://api.apestudio.dev/ticket/${req.file.originalname}`;
        return res.json({ fileUrl });
    });
});

app.use('/ticket', express.static(ticketDir));

app.use('/ticket/:filename', (req, res, next) => {
    const filePath = path.join(ticketDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).sendFile(path.join(__dirname, 'html/error.html'));
    }

    next();
});

app.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/error.html'));
});

app.get('/multiplier', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/multiplier.html'));
});

app.get('/eron', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/eron.html'));
});

app.listen(80, () => {
    console.log(`[CARREGADO] API de Upload de Tickets rodando na porta 80`);
});