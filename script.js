// Função para gerar uma mensagem de motivação aleatória
function gerarMotivacao(){
    const elementoMensagem = document.getElementById('mensagem');

    const mensagens = [
        "A vida é uma montanha-russa... Pena que você esqueceu o cinto.",
        "O \"não\" está garantido, mas ainda dá pra correr atrás da humilhação.",
        "Se está difícil hoje, lembre-se: sempre dá pra piorar.",
        "Sempre há luz no fim do túnel, mas é o trem vindo na sua direção.",
        "Nunca é tarde para desistir dos seus planos."
        ];

    const indiceAleatorio = Math.floor(Math.random() * mensagens.length);
    elementoMensagem.textContent = mensagens[indiceAleatorio];
}