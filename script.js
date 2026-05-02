const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKqlf8mNNSIjAwXt5nC18BZC9nXFgCZOGH3XIq-TDtH9qW_-n2rpRF0gCUIfJOPZwJ/exec";
const DRIVE_DIRECT = "https://lh3.googleusercontent.com/d/";

const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,
    currentBanda: null,

    async init() {
        try {
            const response = await fetch(SCRIPT_URL);
            this.data = await response.json();
            this.renderEstilos();
        } catch (error) {
            console.error("Erro ao carregar dados da API:", error);
        }
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
        nav.innerHTML = `<h3 style="color:var(--neon-blue); text-align:center;">${estilo}</h3>`;
        Object.keys(this.data[estilo]).forEach(banda => {
            nav.appendChild(this.createNavItem(banda, () => this.carregarMusicas(banda)));
        });
    },

    carregarMusicas(banda) {
        this.view = 'musicas';
        this.currentBanda = banda;
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h3 style="color:var(--neon-blue); text-align:center;">${banda}</h3>`;
        this.data[this.currentStyle][banda].forEach(m => {
            nav.appendChild(this.createNavItem(m.titulo, () => this.abrirPlayer(m)));
        });
    },

    abrirPlayer(m) {
        this.toggleUI('player');
        document.getElementById('musica-titulo').innerText = m.titulo;
        
        // Link Cifra: Abre a visualização do Drive em nova aba
        document.getElementById('link-cifra').href = `https://drive.google.com/file/d/${m.letra}/view?usp=sharing`;
        
        // Configuração dos Áudios para execução interna
        const audioMain = document.getElementById('audio-main');
        const audioBt = document.getElementById('audio-bt');

        audioMain.src = DRIVE_DIRECT + m.musica;
        audioBt.src = DRIVE_DIRECT + m.bt;

        audioMain.load();
        audioBt.load();
    },

    playAudio(id) { 
        const audio = document.getElementById(id);
        
        // Pausa outros áudios para evitar sobreposição
        document.querySelectorAll('audio').forEach(a => {
            if(a.id !== id) { a.pause(); a.currentTime = 0; }
        });

        audio.play().catch(e => console.error("Erro ao tocar áudio. Verifique as permissões do link no Drive.", e));
    },

    stopAudio(id) { 
        const audio = document.getElementById(id);
        audio.pause();
        audio.currentTime = 0;
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
