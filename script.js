const SCRIPT_URL = "SUA_URL_DO_APPS_SCRIPT";
const DRIVE_RAW = "https://lh3.googleusercontent.com/d/";

const app = {
    async fetchDados() {
        const res = await fetch(SCRIPT_URL);
        return await res.json();
    },

    async init() {
        const dados = await this.fetchDados();
        const container = document.getElementById('container-estilos');
        if (!container) return;

        Object.keys(dados).forEach(estilo => {
            const div = document.createElement('div');
            div.className = 'box-estilo';
            div.innerText = estilo;
            div.onclick = () => location.href = `pag1.html?estilo=${estilo}`;
            container.appendChild(div);
        });
    },

    async carregarBandasPag1(estilo) {
        const dados = await this.fetchDados();
        const grid = document.getElementById('grid-bandas');
        document.getElementById('titulo-estilo').innerText = estilo;

        Object.keys(dados[estilo]).forEach(banda => {
            const div = document.createElement('div');
            div.className = 'cintilante';
            div.innerText = banda;
            div.onclick = () => location.href = `pag2.html?estilo=${estilo}&banda=${banda}`;
            grid.appendChild(div);
        });
    },

    async carregarPlayerPag2() {
        const params = new URLSearchParams(window.location.search);
        const estilo = params.get('estilo');
        const banda = params.get('banda');
        const dados = await this.fetchDados();
        const musica = dados[estilo][banda][0];

        document.getElementById('nome-artista').innerText = banda + " - " + musica.titulo;
        document.getElementById('pdf-viewer').src = `https://docs.google.com/viewer?srcid=${musica.letra}&embedded=true`;
        document.getElementById('audio-orig').src = DRIVE_RAW + musica.musica;
        document.getElementById('audio-bt').src = DRIVE_RAW + musica.bt;
    }
};

app.init();
