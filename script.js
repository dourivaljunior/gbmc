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
        nav.innerHTML = '<h2 style="color:#00f2ff">ESTILOS</h2>';
        Object.keys(this.data).forEach(estilo => {
            nav.appendChild(this.createNavItem(estilo, () => this.carregarBandas(estilo)));
        });
    },

    carregarBandas(estilo) {
        this.view = 'bandas';
        this.currentStyle = estilo;
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h2 style="color:#00f2ff">${estilo}</h2>`;
        Object.keys(this.data[estilo]).forEach(banda => {
            nav.appendChild(this.createNavItem(banda, () => this.carregarMusicas(banda)));
        });
    },

    carregarMusicas(banda) {
        this.view = 'musicas';
        this.currentBanda = banda;
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h2 style="color:#00f2ff">${banda}</h2>`;
        this.data[this.currentStyle][banda].forEach(m => {
            nav.appendChild(this.createNavItem(m.titulo, () => this.abrirPlayer(m)));
        });
    },

    abrirPlayer(m) {
        this.parar('main');
        this.parar('bt');
        this.toggleUI('player');
        document.getElementById('musica-titulo').innerText = m.titulo;
        document.getElementById('link-cifra').href = m.letra;
        
        // Apenas guarda os nomes, NÃO carrega ainda
        this.files.main = m.musica;
        this.files.bt = m.bt;

        // Reseta as tags de áudio
        document.getElementById('audio-main-el').src = "";
        document.getElementById('audio-bt-el').src = "";
    },

    tocar(tipo) {
        const audio = document.getElementById(`audio-${tipo}-el`);
        const btn = document.getElementById(`play-${tipo}`);
        const fileName = this.files[tipo];

        // Se já estiver tocando o arquivo correto, faz o pause/play simples
        if (audio.src.includes(fileName) && audio.readyState >= 2) {
            if (audio.paused) {
                audio.play();
                btn.innerText = "⏸ PAUSE";
                this.parar(tipo === 'main' ? 'bt' : 'main');
            } else {
                audio.pause();
                btn.innerText = "▶ PLAY";
            }
            return;
        }

        // Se for a primeira vez ou troca de arquivo, força o carregamento
        btn.innerText = "⏳...";
        audio.src = fileName;
        audio.load();

        // Evento que dispara assim que o navegador consegue tocar
        audio.oncanplaythrough = () => {
            audio.play();
            btn.innerText = "⏸ PAUSE";
            this.parar(tipo === 'main' ? 'bt' : 'main');
            audio.oncanplaythrough = null; // Limpa o evento
        };

        audio.onerror = () => {
            alert("Erro: Arquivo " + fileName + " não encontrado no GitHub.");
            btn.innerText = "▶ PLAY";
        };
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
