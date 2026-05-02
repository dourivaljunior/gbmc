const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKqlf8mNNSIjAwXt5nC18BZC9nXFgCZOGH3XIq-TDtH9qW_-n2rpRF0gCUIfJOPZwJ/exec";

const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,
    currentBanda: null,
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
        this.parar('main');
        this.parar('bt');
        this.toggleUI('player');
        document.getElementById('musica-titulo').innerText = m.titulo;
        document.getElementById('link-cifra').href = `https://drive.google.com/file/d/${m.letra}/view?usp=sharing`;
        
        this.ids.main = m.musica;
        this.ids.bt = m.bt;
        
        // Reseta as fontes para forçar novo carregamento ao dar Play
        document.getElementById('audio-main-el').src = "";
        document.getElementById('audio-bt-el').src = "";
    },

    tocar(tipo) {
        const audio = document.getElementById(`audio-${tipo}-el`);
        const btn = document.getElementById(`play-${tipo}`);
        const id = this.ids[tipo];

        if (!audio.paused && audio.src !== "") {
            audio.pause();
            btn.innerText = "▶ PLAY";
            return;
        }

        // Se a fonte estiver vazia, define o link de download direto do Google Drive
        if (audio.src === "" || audio.src === window.location.href) {
            btn.innerText = "⏳ CARREGANDO...";
            // O parâmetro &confirm=no ajuda a pular telas de aviso de vírus em arquivos pequenos
            audio.src = `https://docs.google.com/uc?export=download&id=${id}&confirm=no`;
            audio.load();
        }

        audio.play().then(() => {
            btn.innerText = "⏸ PAUSE";
            // Para o outro áudio
            const outro = tipo === 'main' ? 'bt' : 'main';
            this.parar(outro);
        }).catch(err => {
            console.error("Erro ao tocar áudio:", err);
            // Tenta o fallback imediato para o link de imagem de mídia
            audio.src = `https://lh3.googleusercontent.com/d/${id}`;
            audio.play().then(() => btn.innerText = "⏸ PAUSE");
        });
    },

    parar(tipo) {
        const audio = document.getElementById(`audio-${tipo}-el`);
        const btn = document.getElementById(`play-${tipo}`);
        if(audio) {
            audio.pause();
            audio.currentTime = 0;
        }
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
