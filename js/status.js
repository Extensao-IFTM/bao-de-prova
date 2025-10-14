const idUsuario = localStorage.getItem("idUsuario");

var email = "";
var emailUsuarioInput = document.getElementById("email-usuario");

async function carregarDadosUsuario() {
    try {
        // Buscar dados do usuário do localStorage
        const usuario = obterUsuarioAtual();
        
        if (usuario) {
            document.getElementById('nome-usuario').textContent += usuario.name;
            document.getElementById('email-usuario').textContent = usuario.email;
        }

        // Buscar estatísticas da API
        const stats = await buscarEstatisticasUsuario(parseInt(idUsuario));
        
        if (stats) {
            atualizarEstatisticas(stats);
        }

    } catch (erro) {
        console.error('Erro ao carregar dados:', erro);
        alert('Erro ao carregar estatísticas do usuário');
    }
}

// Atualizar estatísticas na tela
function atualizarEstatisticas(stats) {
    // Atualizar última pontuação (baseado em percentual)
    document.getElementById('pontuacao').textContent = stats.score;
    
    // Atualizar acertos
    document.getElementById('qtd-acertos').textContent = stats.correctAnswers || 0;
    
    // Atualizar quantida de questões respondidas
    document.getElementById('qtd-questoes').textContent = stats.totalQuestions || 0;
    
    // Atualizar erros
    const erros = (stats.totalQuestions || 0) - (stats.correctAnswers || 0);
    document.getElementById('qtd-erros').textContent = erros;
}

// Carregar dados ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao(true);
    carregarDadosUsuario();
});