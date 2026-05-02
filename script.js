const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKqlf8mNNSIjAwXt5nC18BZC9nXFgCZOGH3XIq-TDtH9qW_-n2rpRF0gCUIfJOPZwJ/exec";

// IMPORTANTE: Se os arquivos estiverem em uma pasta chamada 'media', use 'media/' no caminho.
const BASE_URL = "./"; 

const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,
    currentBanda: null,
    links: { pdf: "", main: "", bt: "" },

    async init() {
        const response = await fetch(SCRIPT_URL);
        this.data = await response.json();
        this.renderEstilos();
    },

    renderEstilos() {
        this.view = 'estilos';
        this.toggleUI('welcome');
        const nav = document.getElementById('nav-content');
        nav.innerHTML = '';
        Object.keys(this.data).forEach(estilo => {
            nav.appendChild(this.createNavItem(estilo, () => this.carregarBandas(estilo)));
        });
    },

    carregarBandas(estilo) {
        this.view = 'bandas';
        this.currentStyle = estilo;
        this.toggleUI('nav-btns');
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h3 style="color:var(--neon-blue);">${estilo}</h3>`;
        Object.keys(this.data[estilo]).forEach(banda => {
            nav.appendChild(this.createNavItem(banda, () => this.carregarMusicas(banda)));
        });
    },

    carregarMusicas(banda) {
        this.view = 'musicas';
        this.currentBanda = banda;
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h3 style="color:var(--neon-blue);">${banda}</h3>`;
        this.data[this.currentStyle][banda].forEach(m => {
            nav.appendChild(this.createNavItem(m.titulo, () => this.abrirPlayer(m)));
        });
    },

    abrirPlayer(m) {
        this.parar('main');
        this.parar('bt');
        this.toggleUI('player');
        document.getElementById('musica-titulo').innerText = m.titulo;

        // Aqui o script busca os arquivos no seu GitHub usando o nome do arquivo que vem do seu JSON
        // Certifique-se de que o seu JSON no Apps Script agora retorne o NOME DO ARQUIVO (ex: gita.mp3) em vez do ID do Drive.
        document.getElementById('link-pdf').href = BASE_URL + m.letra;
        this.links.main = BASE_URL + m.musica;
        this.links.bt = BASE_URL + m.bt;

        document.getElementById('audio-main-el').src = "";
        document.getElementById('audio-bt-el').src = "";
    },

    tocar(tipo) {
        const audio = document.getElementById(`audio-${tipo}-el`);
        const btn = document.getElementById(`play-${tipo}`);

        if (!audio.paused && audio.src !== "") {
            audio.pause();
            btn.innerText = "▶ PLAY";
            return;
        }

        if (audio.src === "" || audio.src.includes(window.location.pathname)) {
            audio.src = this.links[tipo];
            audio.load();
        }

        audio.play().then(() => {
            btn.innerText = "⏸ PAUSE";
            const outro = tipo === 'main' ? 'bt' : 'main';
            this.parar(outro);
        }).catch(err => console.error("Erro ao tocar arquivo do GitHub:", err));
    },

    parar(tipo) {
        const audio = document.getElementById(`audio-${tipo}-el`);
        const btn = document.getElementById(`play-${tipo}`);
        if(audio) { audio.pause(); audio.currentTime = 0; }
        if(btn) btn.innerText = "▶ PLAY";
    },

    createNavItem(text, action) {
        const div = document.createElement('div');
        div.className = 'nav-item';
        div.innerText = text;
        div.onclick = action;
        return div;
    },

    toggleUI(mode) {
        const welcome = document.getElementById('welcome-screen');
        const player = document.getElementById('player');
        const btns = [document.getElementById('btn-voltar'), document.getElementById('btn-inicio')];
        
        if(mode === 'welcome') {
            welcome.style.display = 'block';
            player.style.display = 'none';
            btns.forEach(b => b.style.display = 'none');
        } else {
            btns.forEach(b => b.style.display = 'block');
            if(mode === 'player') {
                welcome.style.display = 'none';
                player.style.display = 'block';
            }
        }
    },

    irParaInicio() { location.reload(); },

    voltar() {
        if (this.view === 'musicas') this.carregarBandas(this.currentStyle);
        else if (this.view === 'bandas') this.renderEstilos();
    }
};

app.init();
