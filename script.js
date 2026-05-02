/**
 * PORTAL GARAGE BAND CORE ENGINE
 */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKqlf8mNNSIjAwXt5nC18BZC9nXFgCZOGH3XIq-TDtH9qW_-n2rpRF0gCUIfJOPZwJ/exec";
const DRIVE_RAW = "https://lh3.googleusercontent.com/d/";

const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,

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
            const el = this.createNavItem(estilo, () => this.carregarBandas(estilo));
            nav.appendChild(el);
        });
    },

    carregarBandas(estilo) {
        this.view = 'bandas';
        this.currentStyle = estilo;
        this.toggleUI('back-btn');
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h3 style="color:var(--neon-pink)">${estilo}</h3>`;
        
        Object.keys(this.data[estilo]).forEach(banda => {
            const el = this.createNavItem(banda, () => this.carregarMusicas(banda));
            nav.appendChild(el);
        });
    },

    carregarMusicas(banda) {
        this.view = 'musicas';
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h3 style="color:var(--neon-pink)">${banda}</h3>`;
        
        this.data[this.currentStyle][banda].forEach(m => {
            const el = this.createNavItem(m.titulo, () => this.abrirPlayer(m));
            nav.appendChild(el);
        });
    },

    abrirPlayer(m) {
        this.toggleUI('player');
        document.getElementById('musica-titulo').innerText = m.titulo;
        document.getElementById('pdf-viewer').src = `https://docs.google.com/viewer?srcid=${m.letra}&pid=explorer&efp=true&a=v&chrome=false&embedded=true`;
        document.getElementById('audio-main').src = DRIVE_RAW + m.musica;
        document.getElementById('audio-bt').src = DRIVE_RAW + m.bt;
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
        const backBtn = document.getElementById('btn-voltar');

        if(mode === 'welcome') {
            welcome.style.display = 'block';
            player.style.display = 'none';
            backBtn.style.display = 'none';
        } else if(mode === 'player') {
            welcome.style.display = 'none';
            player.style.display = 'block';
        } else if(mode === 'back-btn') {
            backBtn.style.display = 'block';
        }
    },

    voltar() {
        if (this.view === 'musicas') this.carregarBandas(this.currentStyle);
        else if (this.view === 'bandas') this.renderEstilos();
    }
};

app.init();
