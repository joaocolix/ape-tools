function getIPFromURL() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1] || '';
}

async function buscarIP(ip) {
    try {
        const response = await fetch(`/ip/ipinfo/${ip}`);
        const data = await response.json();

        const lat = data.loc.split(',')[0];
        const lng = data.loc.split(',')[1];

        const container = document.querySelector('.clientes-content');
        container.innerHTML = `<pre><code>code {
país: ${data.country}
região: ${data.region}
cidade: ${data.city}
CEP: ${data.postal}

latitude: ${lat}
longitude: ${lng}

ip: ${data.ip}
provedor: ${data.org}
dominio: ${data.hostname || 'N/A'}
horario: ${(new Date()).toLocaleDateString('pt-BR')}
}</code></pre>`;

        const mapa = document.querySelector('.mapa-container iframe');
        mapa.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

    } catch (err) {
        alert('Erro ao buscar IP');
        console.error(err);
    }
}

const ip = getIPFromURL();
if (ip) buscarIP(ip);
else alert("Nenhum IP informado na URL.");