let nivelAtual = 'estilos'; // estilos, bandas, musicas
let estiloSelecionado = '';
let bandaSelecionada = '';

function renderizarEstilos() {
    nivelAtual = 'estilos';
    document.getElementById('menu-title').innerText = "Estilos Musicais";
    document.getElementById('content-title').innerText = "Escolha o Gênero";
    document.getElementById('btn-voltar').classList.add('hidden');
    
    const lista = document.getElementById('lista-navegacao');
    lista.innerHTML = '';
    
    Object.keys(ACERVO_MUSICAL).forEach(estilo => {
        const li = document.createElement('li');
        li.innerText = estilo;
        li.onclick = () => carregarBandas(estilo);
        lista.appendChild(li);
    });
}

function carregarBandas(estilo) {
    nivelAtual = 'bandas';
    estiloSelecionado = estilo;
    document.getElementById('menu-title').innerText = "Bandas: " + estilo;
    document.getElementById('btn-voltar').classList.remove('hidden');
    
    const grid = document.getElementById('grid-cards');
    grid.innerHTML = '';
    
    const bandas = Object.keys(ACERVO_MUSICAL[estilo]);
    bandas.forEach(banda => {
        const div = document.createElement('div');
        div.className = 'card-musica';
        div.innerHTML = `<h3>${banda}</h3><button onclick="carregarMusicas('${banda}')">Ver Músicas</button>`;
        grid.appendChild(div);
    });
}

function carregarMusicas(banda) {
    nivelAtual = 'musicas';
    bandaSelecionada = banda;
    document.getElementById('content-title').innerText = banda;
    
    const grid = document.getElementById('grid-cards');
    grid.innerHTML = '';
    
    const musicas = ACERVO_MUSICAL[estiloSelecionado][banda];
    musicas.forEach(m => {
        const div = document.createElement('div');
        div.className = 'card-musica';
        div.innerHTML = `
            <h4>${m.titulo}</h4>
            <a class="btn-file" href="https://drive.google.com/uc?id=${m.letra_id}" target="_blank">📄 Letra (PDF)</a>
            <a class="btn-file" href="https://drive.google.com/uc?id=${m.musica_id}" target="_blank">🎵 Música (MP3)</a>
            <a class="btn-file" href="https://drive.google.com/uc?id=${m.bt_id}" target="_blank">🎸 Back Track</a>
        `;
        grid.appendChild(div);
    });
}

function voltar() {
    if (nivelAtual === 'musicas') carregarBandas(estiloSelecionado);
    else if (nivelAtual === 'bandas') renderizarEstilos();
}

// Inicializa
renderizarEstilos();
