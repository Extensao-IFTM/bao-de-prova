// Verificar se usuário está logado
function estaLogado() {
    return localStorage.getItem('idUsuario') !== null;
}

// Pegar ID do usuário logado
function obterIdUsuarioAtual() {
    return localStorage.getItem('idUsuario');
}

// Pegar dados do usuário logado
function obterUsuarioAtual() {
    const dadosUsuario = localStorage.getItem('dadosUsuario');
    return dadosUsuario ? JSON.parse(dadosUsuario) : null;
}

// Fazer login/cadastro
async function fazerLogin(nome, email) {
    try {
        const usuario = await criarUsuario(nome, email);
        
        // Salvar dados no localStorage
        localStorage.setItem('idUsuario', usuario.id);
        localStorage.setItem('dadosUsuario', JSON.stringify(usuario));
        
        return usuario;
    } catch (erro) {
        throw erro;
    }
}

// Fazer logout
function fazerLogout() {
    localStorage.removeItem('idUsuario');
    localStorage.removeItem('dadosUsuario');
    window.location.href = '../index.html';
}

// Atualizar informações do usuário na página
function atualizarInfoUsuario() {
    const usuario = obterUsuarioAtual();
    
    if (!usuario) return;
    
    const elementosNomeUsuario = document.querySelectorAll('.nome-usuario');
    elementosNomeUsuario.forEach(el => {
        el.textContent = usuario.name;
    });
}

// Verificar login ao carregar página
function verificarAutenticacao(redirecionarSeNaoLogado = false) {
    if (!estaLogado() && redirecionarSeNaoLogado) {
        window.location.href = 'pages/login.html';
        return false;
    }
    
    if (estaLogado()) {
        atualizarInfoUsuario();
    }
    
    return estaLogado();
}