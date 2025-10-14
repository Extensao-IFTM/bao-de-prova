const URL_BASE_API = 'https://localhost:7093/api';

// Função auxiliar para fazer requisições
async function buscarAPI(endpoint, opcoes = {}) {
    try {
        const resposta = await fetch(`${URL_BASE_API}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...opcoes.headers
            },
            ...opcoes
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.message || 'Erro na requisição');
        }

        return await resposta.json();
    } catch (erro) {
        console.error('Erro na API:', erro);
        throw erro;
    }
}

// Funções de Questões
// NÃO USADA
async function buscarQuestaoAleatoria(categoria = null) {
    const url = categoria 
        ? `/questions/random?category=${encodeURIComponent(categoria)}`
        : '/questions/random';
    return await buscarAPI(url);
}

// NÃO USADA
async function buscarQuestaoPorId(id) {
    return await buscarAPI(`/questions/${id}`);
}

// Funções de Usuários auth.js
async function criarUsuario(nome, email) {
    return await buscarAPI('/users', {
        method: 'POST',
        body: JSON.stringify({ name: nome, email: email })
    });
}

// NÃO USADA
async function buscarUsuarioPorId(id) {
    return await buscarAPI(`/users/${id}`);
}

// Funções de Respostas - simulado.js
async function enviarResposta(idUsuario, idQuestao, alternativaSelecionada, estaCorreto) {
    return await buscarAPI('/userdata', {
        method: 'POST',
        body: JSON.stringify({
            userId: idUsuario,
            questionId: idQuestao,
            selectedAlternative: alternativaSelecionada,
            isCorrect: estaCorreto
        })
    });
}

// NÃO USADA
async function buscarEstatisticasUsuario(idUsuario) {
    return await buscarAPI(`/userdata/user/${idUsuario}/stats`);
}

// NÃO USADA
async function buscarRanking() {
    return await buscarAPI('/userdata/ranking');
}