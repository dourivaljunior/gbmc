const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbywSHZf36zGAywDEnCq6Y7tkt7aqUNdnP0ltHBAOH4sjtDFRHjQzoj0RhbsK4GJVJhNzw/exec";

const app = {
    async iniciar() {
        try {
            const resposta = await fetch(URL_SCRIPT);
            const dados = await resposta.json();
            this.carregarEstilosNoQuadro(dados);
        } catch (erro) {
            console.error("Falha na conexão profissional:", erro);
        }
    },

    carregarEstilosNoQuadro(dados) {
        const quadro = document.getElementById('quadro-estilos');
        if (!quadro) return;

        Object.keys(dados).forEach(estilo => {
            const item = document.createElement('div');
            item.className = 'item-estilo';
            item.innerText = estilo;
            
            // Lógica de abertura da pag1.html conforme solicitado
            item.onclick = () => {
                window.location.href = `pag1.html?estilo=${encodeURIComponent(estilo)}`;
            };
            
            quadro.appendChild(item);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => app.iniciar());
