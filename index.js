const { fork } = require('child_process');
const path = require('path');

const serverMain = fork(path.join(__dirname, 'serverMain.js'));
const serverColar = fork(path.join(__dirname, 'web', 'colar', 'server.js'));

serverMain.on('exit', (code) => {
    console.log(`Servidor Tickets parou com código ${code}`);
});

serverColar.on('exit', (code) => {
    console.log(`Servidor Colar parou com código ${code}`);
});

console.log("[CARREGANDO] Iniciando carregamento páginas, APIs e Servidores");
