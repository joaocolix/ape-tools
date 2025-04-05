const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const ticketsRoutes = require('./routes/tickets');
const colarRoutes = require('./routes/colar');
const ipRoutes = require('./routes/ip');

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
app.use(express.json());

app.use('/files', express.static(path.join(__dirname, '..', 'files')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/error', express.static(path.join(__dirname, '..', 'public', 'error')));
app.use('/sucess', express.static(path.join(__dirname, '..', 'public', 'sucess')));
app.use('/protocolo', express.static(path.join(__dirname, '..', 'public', 'protocolo')));
app.use('/api', ticketsRoutes);
app.use('/colar', colarRoutes);
app.use('/ip', ipRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[OK] Servidor rodando na porta ${PORT}`);
});