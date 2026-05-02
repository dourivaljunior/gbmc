const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyKqlf8mNNSIjAwXt5nC18BZC9nXFgCZOGH3XIq-TDtH9qW_-n2rpRF0gCUIfJOPZwJ/exec";

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
        } catch (e) {
            console.error("Erro ao carregar API:", e);
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
        
        // Link Cifra
        document.getElementById('link-cifra').href = `https://drive.google.com/file/d/${m.letra}/view`;
        
        // Técnica de Iframe Stream: Isso usa o player próprio do Google dentro do seu site.
        // É a única forma que ignora bloqueios de CORS e cookies.
        document.getElementById('frame-main').src = `https://docs.google.com/file/d/${m.musica}/preview`;
        document.getElementById('frame-bt').src = `https://docs.google.com/file/d/${m.bt}/preview`;
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
