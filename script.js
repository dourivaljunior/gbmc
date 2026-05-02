const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,
    currentBanda: null,
    currentFiles: { main: "", bt: "" },

    async init() {
        // Carrega o arquivo JSON que está na mesma pasta do GitHub
        try {
            const response = await fetch('./musicas.json');
            this.data = await response.json();
            this.renderEstilos();
        } catch (error) {
            console.error("Erro ao carregar o arquivo musicas.json:", error);
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
        this.parar('main');
        this.parar('bt');
        this.toggleUI('player');
        
        document.getElementById('musica-titulo').innerText = m.titulo;
        document.getElementById('link-cifra').href = m.letra;
        
        // Armazena os nomes dos arquivos para carregar no Play
        this.currentFiles.main = m.musica;
        this.currentFiles.bt = m.bt;

        // Limpa os elementos de áudio
        document.getElementById('audio-main-el').src = "";
        document.getElementById('audio-bt-el').src = "";
    },

    tocar(tipo) {
        const audio = document.getElementById(`audio-${tipo}-el`);
        const btn = document.getElementById(`play-${tipo}`);
        const fileName = this.currentFiles[tipo];

        if (!audio.paused && audio.src !== "") {
            audio.pause();
            btn.innerText = "▶ PLAY";
            return;
        }

        // Se a fonte estiver vazia, carrega o arquivo do GitHub (caminho relativo)
        if (audio.src === "" || !audio.src.includes(fileName)) {
            btn.innerText = "⏳...";
            audio.src = fileName;
            audio.load();
        }

        audio.play().then(() => {
            btn.innerText = "⏸ PAUSE";
            // Para o outro áudio
            const outro = tipo === 'main' ? 'bt' : 'main';
            this.parar(outro);
        }).catch(err => {
            console.error("Erro na reprodução:", err);
            btn.innerText = "▶ PLAY";
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
