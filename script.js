const app = {
    data: null,
    view: 'estilos',
    currentStyle: null,
    currentBanda: null,
    files: { main: "", bt: "" },
    // Detecta a pasta atual para não errar o caminho no GitHub
    basePath: window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1),

    async init() {
        try {
            // Tenta carregar o JSON com cache bypass para garantir que pegou o novo
            const resp = await fetch(`./musicas.json?v=${new Date().getTime()}`);
            if (!resp.ok) throw new Error("Não achou o musicas.json");
            this.data = await resp.json();
            this.renderEstilos();
        } catch (error) {
            console.error("Erro no init:", error);
            alert("Erro crítico: musicas.json não encontrado na raiz.");
        }
    },

    renderEstilos() {
        this.view = 'estilos';
        this.toggleUI('welcome');
        const nav = document.getElementById('nav-content');
        nav.innerHTML = '<h2 style="color:#00f2ff; text-align:center;">ESTILOS</h2>';
        Object.keys(this.data).forEach(estilo => {
            nav.appendChild(this.createNavItem(estilo, () => this.carregarBandas(estilo)));
        });
    },

    carregarBandas(estilo) {
        this.view = 'bandas';
        this.currentStyle = estilo;
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h2 style="color:#00f2ff; text-align:center;">${estilo}</h2>`;
        Object.keys(this.data[estilo]).forEach(banda => {
            nav.appendChild(this.createNavItem(banda, () => this.carregarMusicas(banda)));
        });
    },

    carregarMusicas(banda) {
        this.view = 'musicas';
        this.currentBanda = banda;
        const nav = document.getElementById('nav-content');
        nav.innerHTML = `<h2 style="color:#00f2ff; text-align:center;">${banda}</h2>`;
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
        
        // Armazena os nomes dos arquivos
        this.files.main = m.musica;
        this.files.bt = m.bt;

        // Reseta os players
        const a1 = document.getElementById('audio-main-el');
        const a2 = document.getElementById('audio-bt-el');
        a1.src = "";
        a2.src = "";
        a1.load();
        a2.load();
    },

    async tocar(tipo) {
        const audio = document.getElementById(`audio-${tipo}-el`);
        const btn = document.getElementById(`play-${tipo}`);
        const fileName = this.files[tipo];

        // Se já tem o SRC correto e está pausado, apenas dá play
        if (audio.src.endsWith(fileName) && audio.src !== "") {
            if (audio.paused) {
                this.executarAudio(audio, btn, tipo);
            } else {
                audio.pause();
                btn.innerText = "▶ PLAY";
            }
            return;
        }

        // Se é um arquivo novo, monta a URL completa
        // window.location.origin + this.basePath garante o caminho correto no GitHub
        const urlCompleta = window.location.origin + this.basePath + fileName;
        
        console.log("Tentando carregar:", urlCompleta);
        btn.innerText = "⏳...";
        
        audio.src = urlCompleta;
        audio.load();

        audio.oncanplaythrough = () => {
            this.executarAudio(audio, btn, tipo);
            audio.oncanplaythrough = null;
        };

        audio.onerror = () => {
            console.error("Erro ao carregar:", audio.src);
            alert(`Erro: Arquivo ${fileName} não encontrado no GitHub.\nVerifique se o nome está idêntico (maiusculismo conta!)`);
            btn.innerText = "▶ PLAY";
        };
    },

    async executarAudio(audio, btn, tipo) {
        try {
            await audio.play();
            btn.innerText = "⏸ PAUSE";
            this.parar(tipo === 'main' ? 'bt' : 'main');
        } catch (e) {
            console.error("Bloqueio de Autoplay:", e);
        }
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
