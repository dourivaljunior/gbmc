const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKqlf8mNNSIjAwXt5nC18BZC9nXFgCZOGH3XIq-TDtH9qW_-n2rpRF0gCUIfJOPZwJ/exec";
const DRIVE_RAW = "https://lh3.googleusercontent.com/d/";

const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,
    currentBanda: null,

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
        nav.innerHTML = `<h3 style="color:var(--neon-blue)">${estilo}</h3>`;
        Object.keys(this.data[estilo]).forEach(banda => {
            nav.appendChild(this.createNavItem(banda, () => this.carregarMusicas(banda)));
        });
    },

    carregarMusicas(banda) {
        this.view = 'musicas';
        this.currentBanda = banda;
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h3 style="color:var(--neon-blue)">${banda}</h3>`;
        this.data[this.currentStyle][banda].forEach(m => {
            nav.appendChild(this.createNavItem(m.titulo, () => this.abrirPlayer(m)));
        });
    },

    abrirPlayer(m) {
        this.toggleUI('player');
        document.getElementById('musica-titulo').innerText = m.titulo;
        
        // Link Cifra (Abre em nova aba)
        document.getElementById('link-cifra').href = "https://drive.google.com/file/d/1lK1CSqkQBj5FcUFMac24HqfCtw4OkFKY/view?usp=drive_link";
        
        // Áudios (Carrega ID para execução direta via DRIVE_RAW)
        document.getElementById('audio-main').src = "https://drive.google.com/uc?export=download&id=1P0s4L_Dikx6M5-YeQokr91jJV1yGzdlt";
        document.getElementById('audio-bt').src = "https://drive.google.com/uc?export=download&id=1ElNBgH5smow5lo7oYxfxUPYQOTzpQA5O";
    },

    playAudio(id) { 
        const a = document.getElementById(id);
        a.play(); 
    },
    
    stopAudio(id) { 
        const a = document.getElementById(id);
        a.pause();
        a.currentTime = 0;
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

    irParaInicio() { this.renderEstilos(); },

    voltar() {
        if (this.view === 'musicas') this.carregarBandas(this.currentStyle);
        else if (this.view === 'bandas') this.renderEstilos();
        else if (document.getElementById('player').style.display === 'block') {
            this.carregarMusicas(this.currentBanda);
            document.getElementById('player').style.display = 'none';
        }
    }
};

app.init();
