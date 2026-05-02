const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKqlf8mNNSIjAwXt5nC18BZC9nXFgCZOGH3XIq-TDtH9qW_-n2rpRF0gCUIfJOPZwJ/exec";

const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,
    currentBanda: null,
    audioObj: { main: new Audio(), bt: new Audio() },
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
        this.pararAudio('main');
        this.pararAudio('bt');
        this.toggleUI('player');
        document.getElementById('musica-titulo').innerText = m.titulo;
        document.getElementById('link-cifra').href = `https://drive.google.com/file/d/${m.letra}/view?usp=sharing`;
        
        this.ids.main = m.musica;
        this.ids.bt = m.bt;
        
        // Limpa fontes para carregar novos arquivos
        this.audioObj.main.src = "";
        this.audioObj.bt.src = "";
        document.getElementById('play-main').innerText = "▶ PLAY";
        document.getElementById('play-bt').innerText = "▶ PLAY";
    },

    async tocarAudio(tipo) {
        const audio = this.audioObj[tipo];
        const btn = document.getElementById(`play-${tipo}`);
        const id = this.ids[tipo];

        if (!audio.paused) {
            audio.pause();
            btn.innerText = "▶ PLAY";
            return;
        }

        if (!audio.src || audio.src === "") {
            btn.innerText = "⏳ CARREGANDO...";
            // Link de download forçado que funciona com a tag Audio
            audio.src = `https://docs.google.com/uc?export=download&id=${id}`;
        }

        try {
            await audio.play();
            btn.innerText = "⏸ PAUSE";
            // Para o outro áudio para não sobrepor
            const outro = tipo === 'main' ? 'bt' : 'main';
            this.pararAudio(outro);
        } catch (e) {
            console.error("Erro ao tocar áudio:", e);
            // Fallback imediato para link de mídia direta se o uc falhar
            audio.src = `https://lh3.googleusercontent.com/d/${id}`;
            audio.play();
        }
    },

    pararAudio(tipo) {
        const a = this.audioObj[tipo];
        a.pause();
        a.currentTime = 0;
        const btn = document.getElementById(`play-${tipo}`);
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

    irParaInicio() { this.renderEstilos(); },

    voltar() {
        if (this.view === 'musicas') this.carregarBandas(this.currentStyle);
        else if (this.view === 'bandas') this.renderEstilos();
    }
};

app.init();
