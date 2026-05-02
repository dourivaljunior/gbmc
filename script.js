const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKqlf8mNNSIjAwXt5nC18BZC9nXFgCZOGH3XIq-TDtH9qW_-n2rpRF0gCUIfJOPZwJ/exec";

const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,
    currentBanda: null,
    audioNodes: { main: new Audio(), bt: new Audio() },
    ids: { main: null, bt: null },

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
        this.stopAudio('main');
        this.stopAudio('bt');
        this.toggleUI('player');
        document.getElementById('musica-titulo').innerText = m.titulo;
        document.getElementById('link-cifra').href = `https://drive.google.com/file/d/${m.letra}/view`;
        
        // Armazena IDs para carregamento sob demanda
        this.ids.main = m.musica;
        this.ids.bt = m.bt;
        
        // Reseta labels
        document.getElementById('btn-play-main').innerText = "▶ PLAY";
        document.getElementById('btn-play-bt').innerText = "▶ PLAY";
        
        // Limpa fontes anteriores para evitar bugs
        this.audioNodes.main.src = "";
        this.audioNodes.bt.src = "";
    },

    async handleAudio(type) {
        const audio = this.audioNodes[type];
        const btn = document.getElementById(`btn-play-${type}`);
        const fileId = this.ids[type];

        if (!audio.paused) {
            audio.pause();
            btn.innerText = "▶ PLAY";
            return;
        }

        // Se não houver fonte carregada, aplica o link de download direto do Google Drive
        if (!audio.src || audio.src === window.location.href) {
            btn.innerText = "⏳ CARREGANDO...";
            // O link lh3 é o mais resiliente para streaming direto do Drive
            audio.src = `https://lh3.googleusercontent.com/d/${fileId}`;
            audio.load();
        }

        try {
            await audio.play();
            btn.innerText = "⏸ PAUSE";
            
            // Pausa o outro canal automaticamente
            const outro = type === 'main' ? 'bt' : 'main';
            this.stopAudio(outro);
        } catch (e) {
            btn.innerText = "❌ ERRO";
            console.error("Erro ao tocar:", e);
        }
    },

    stopAudio(type) {
        const a = this.audioNodes[type];
        const btn = document.getElementById(`btn-play-${type}`);
        a.pause();
        a.currentTime = 0;
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
        else if (document.getElementById('player').style.display === 'block') {
            this.carregarMusicas(this.currentBanda);
            document.getElementById('player').style.display = 'none';
        }
    }
};

app.init();
