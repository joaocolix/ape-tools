const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

const ticketDir = path.join(__dirname, 'web', 'tickets');
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

        const fileUrl = `http://api.apestudio.dev/tickets/${req.file.originalname}`;
        return res.json({ fileUrl });
    });
});

app.use('/tickets', express.static(ticketDir));
app.use('/files', express.static(path.join(__dirname, 'files')));

app.use('/tickets/:filename', (req, res, next) => {
    const filePath = path.join(ticketDir, req.params.filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).sendFile(path.join(__dirname, 'web', 'protocolo', 'index.html'));
    }

    next();
});

app.use('/error', express.static(path.join(__dirname, 'web', 'error'), {
    index: 'index.html'
}));

app.use('/sucess', express.static(path.join(__dirname, 'web', 'sucess'), {
    index: 'index.html'
}));

app.use('/protocolo', express.static(path.join(__dirname, 'web', 'protocolo'), {
    index: 'index.html'
}));

app.listen(80, () => {
    console.log(`[CARREGADO] API de Upload de Tickets`);
});