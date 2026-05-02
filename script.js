const app = {
    // ... (restante do código anterior mantido)

    abrirPlayer(m) {
        this.toggleUI('player');
        document.getElementById('musica-titulo').innerText = m.titulo;
        
        // Link para a Cifra (PDF)
        const linkCifra = document.getElementById('link-cifra');
        linkCifra.href = `https://docs.google.com/viewer?srcid=${m.letra}&pid=explorer&efp=true&a=v&chrome=false&embedded=true`;

        // Configuração dos Audios
        document.getElementById('audio-main').src = DRIVE_RAW + m.musica;
        document.getElementById('audio-bt').src = DRIVE_RAW + m.bt;
    },

    // Funções de Controle Profissional
    playAudio(id) {
        const audio = document.getElementById(id);
        // Para todas as outras músicas antes de tocar a nova (opcional)
        document.querySelectorAll('audio').forEach(a => {
            a.pause();
            a.currentTime = 0;
        });
        audio.play();
    },

    stopAudio(id) {
        const audio = document.getElementById(id);
        audio.pause();
        audio.currentTime = 0;
    },

    // ... (voltar e irParaInicio mantidos)
};
