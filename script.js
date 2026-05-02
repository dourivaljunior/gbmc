const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,
    currentBanda: null,
    files: { main: "", bt: "" },

    async init() {
        const resp = await fetch('./musicas.json');
        this.data = await resp.json();
        this.renderEstilos();
    },

    renderEstilos() {
        this.view = 'estilos';
        this.toggleUI('welcome');
        const nav = document.getElementById('nav-content');
        nav.innerHTML = '<h2 class="menu-label">ESTILOS</h2>';
        Object.keys(this.data).forEach(estilo => {
            nav.appendChild(this.createNavItem(estilo, () => this.carregarBandas(estilo)));
        });
    },

    carregarBandas(estilo) {
        this.view = 'bandas';
        this.currentStyle = estilo;
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h2 class="menu-label">${estilo}</h2>`;
        Object.keys(this.data[estilo]).forEach(banda => {
            nav.appendChild(this.createNavItem(banda, () => this.carregarMusicas(banda)));
        });
    },

    carregarMusicas(banda) {
        this.view = 'musicas';
        this.currentBanda = banda;
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h2 class="menu-label">${banda}</h2>`;
        this.data[this.currentStyle][banda].forEach(m => {
            nav.appendChild(this.createNavItem(m.titulo, () => this.abrirPlayer(m)));
        });
    },

    abrirPlayer(m) {
        this.parar('main');
        this.parar('bt');
        document.getElementById('player').style.display = 'block';
        document.getElementById('welcome-screen').style.display = 'none';
        document.getElementById('musica-titulo').innerText = m.titulo;
        document.getElementById('link-cifra').href = m.letra;
        
        this.files.main = m.musica;
        this.files.bt = m.bt;

        // Limpa fontes anteriores para evitar lixo na memória
        document.getElementById('audio-main-el').removeAttribute('src');
        document.getElementById('audio-bt-el').removeAttribute('src');
    },

    async tocar(tipo) {
        const audio = document.getElementById(`audio-${tipo}-el`);
        const btn = document.getElementById(`play-${tipo}`);
        const src = this.files[tipo];

        if (!audio.paused && audio.src.includes(src)) {
            audio.pause();
            btn.innerText = "▶ PLAY";
            return;
        }

        // Força a carga do arquivo se o src estiver vazio ou for diferente
        if (!audio.src || !audio.src.includes(src)) {
            audio.src = src;
            audio.load();
        }

        try {
            await audio.play();
            btn.innerText = "⏸ PAUSE";
            this.parar(tipo === 'main' ? 'bt' : 'main');
        } catch (e) {
            alert("Erro ao tocar: Verifique se o arquivo " + src + " está na pasta.");
        }
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
        document.getElementById('welcome-screen').style.display = mode === 'welcome' ? 'block' : 'none';
        document.getElementById('player').style.display = mode === 'player' ? 'block' : 'none';
    },

    irParaInicio() { this.renderEstilos(); },
    voltar() {
        if (this.view === 'musicas') this.carregarBandas(this.currentStyle);
        else if (this.view === 'bandas') this.renderEstilos();
    }
};

app.init();
