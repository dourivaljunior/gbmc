const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbywSHZf36zGAywDEnCq6Y7tkt7aqUNdnP0ltHBAOH4sjtDFRHjQzoj0RhbsK4GJVJhNzw/exec";
const DRIVE_URL = "https://lh3.googleusercontent.com/d/";

const app = {
    dados: null,
    historico: ['inicio'],

    async init() {
        const res = await fetch(SCRIPT_URL);
        this.dados = await res.json();
        this.renderMenu();
    },

    renderMenu() {
        const menu = document.getElementById('menu-estilos');
        Object.keys(this.dados).forEach(estilo => {
            const div = document.createElement('div');
            div.className = 'nav-item';
            div.innerText = estilo;
            div.onclick = () => this.navegarParaBandas(estilo);
            menu.appendChild(div);
        });
    },

    navegarParaBandas(estilo) {
        this.showView('view-bandas');
        this.historico.push('bandas');
        document.getElementById('titulo-estilo').innerText = estilo;
        
        const grid = document.getElementById('grid-bandas');
        grid.innerHTML = '';
        
        Object.keys(this.dados[estilo]).forEach(banda => {
            const btn = document.createElement('div');
            btn.className = 'nav-item';
            btn.innerText = banda;
            btn.onclick = () => this.navegarParaMusicas(estilo, banda);
            grid.appendChild(btn);
        });
    },

    navegarParaMusicas(estilo, banda) {
        this.showView('view-player');
        this.historico.push('player');
        // Pega a primeira música da lista (exemplo: Raul Seixas -> Gita)
        const musica = this.dados[estilo][banda][0]; 
        
        document.getElementById('titulo-musica').innerText = `${banda} - ${musica.titulo}`;
        document.getElementById('pdf-frame').src = `https://docs.google.com/viewer?srcid=${musica.letra}&pid=explorer&efp=true&a=v&chrome=false&embedded=true`;
        document.getElementById('audio-orig').src = DRIVE_URL + musica.musica;
        document.getElementById('audio-bt').src = DRIVE_URL + musica.bt;
    },

    showView(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(viewId).classList.remove('hidden');
    },

    irParaInicio() {
        this.historico = ['inicio'];
        this.showView('view-inicio');
    },

    voltar() {
        if (this.historico.length > 1) {
            this.historico.pop();
            const anterior = this.historico[this.historico.length - 1];
            if (anterior === 'inicio') this.irParaInicio();
            else if (anterior === 'bandas') this.showView('view-bandas');
        }
    }
};

app.init();
