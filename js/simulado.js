let todasQuestoes = []; // Array para armazenar todas as questões
let indiceQuestaoAtual = 0; // Índice da questão atual
let questoesRespondidas = 0;
let respostasCorretas = 0;
let questaoAtualRespondida = false; // Controle se a questão atual foi respondida

// Carregar todas as questões da API
async function carregarTodasQuestoes() {
    try {
        mostrarCarregador(true);
        
        const resposta = await fetch(`${URL_BASE_API}/questions`);
        
        if (!resposta.ok) {
            throw new Error('Erro ao carregar questões');
        }
        
        todasQuestoes = await resposta.json();
        
        if (todasQuestoes.length === 0) {
            alert('Nenhuma questão disponível no momento.');
            return;
        }
        
        // Carregar a primeira questão
        exibirQuestao(todasQuestoes[indiceQuestaoAtual]);
        
    } catch (erro) {
        alert('Erro ao carregar questões 123: ' + erro.message);
    } finally {
        mostrarCarregador(false);
    }
}

// Exibir questão na tela
function exibirQuestao(questao) {
    document.getElementById('enunciado').textContent = questao.statement;
    
    const containerAlternativas = document.getElementById('alternativas');
    containerAlternativas.innerHTML = '';
    
    const alternativas = [
        questao.alternatives[0],
        questao.alternatives[1],
        questao.alternatives[2],
        questao.alternatives[3],
        questao.alternatives[4]
    ];
    
    alternativas.forEach((texto, indice) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label>
                <input type="radio" name="alternativa" value="${indice + 1}">
                ${texto}
            </label>
        `;
        containerAlternativas.appendChild(li);
    });
    
    // Resetar flag de questão respondida ao mudar de questão
    questaoAtualRespondida = false;
    
    // Atualizar contador de questões
    atualizarContadorQuestoes();
    
    // Limpar feedback anterior
    limparFeedback();
    
    // Habilitar botões
    habilitarBotoes();
}

// Atualizar contador de questões
function atualizarContadorQuestoes() {
    const contador = document.getElementById('contador-questoes');
    if (contador) {
        contador.textContent = `Questão ${indiceQuestaoAtual + 1} de ${todasQuestoes.length}`;
    } else {
        // Criar contador se não existir
        const enunciado = document.getElementById('enunciado');
        const divContador = document.createElement('div');
        divContador.id = 'contador-questoes';
        divContador.style.cssText = 'text-align: center; font-weight: bold; margin-bottom: 10px; color: #666;';
        divContador.textContent = `Questão ${indiceQuestaoAtual + 1} de ${todasQuestoes.length}`;
        enunciado.parentNode.insertBefore(divContador, enunciado);
    }
}

// Verificar resposta
async function verificarResposta() {
    const selecionada = document.querySelector('input[name="alternativa"]:checked');
    
    if (!selecionada) {
        alert('Selecione uma alternativa!');
        return;
    }
    
    const questaoAtual = todasQuestoes[indiceQuestaoAtual];
    const valorSelecionado = parseInt(selecionada.value);
    const estaCorreto = valorSelecionado === questaoAtual.correctAlternative;
    
    // Salvar resposta na API
    try {
        const idUsuario = obterIdUsuarioAtual();
        await enviarResposta(
            parseInt(idUsuario),
            questaoAtual.id,
            valorSelecionado,
            estaCorreto
        );
        
        questoesRespondidas++;
        if (estaCorreto) respostasCorretas++;
        
        // Marcar questão atual como respondida
        questaoAtualRespondida = true;
        
        mostrarFeedback(estaCorreto);
        
        // Desabilitar botão verificar após responder
        document.getElementById('verificar').disabled = true;
        
        // Habilitar botão próxima/finalizar após responder
        const btnProxima = document.getElementById('proxima');
        btnProxima.disabled = false;
        
    } catch (erro) {
        console.error('Erro ao salvar resposta:', erro);
        alert('Erro ao salvar resposta, mas você pode continuar.');
    }
}

// Mostrar feedback
function mostrarFeedback(estaCorreto) {
    const questaoAtual = todasQuestoes[indiceQuestaoAtual];
    const alternativas = document.querySelectorAll('input[name="alternativa"]');
    
    alternativas.forEach((radio, indice) => {
        const li = radio.closest('li');
        radio.disabled = true;
        
        if (indice + 1 === questaoAtual.correctAlternative) {
            li.style.backgroundColor = '#d4edda';
            li.style.border = '2px solid #28a745';
        }
        
        if (radio.checked && !estaCorreto) {
            li.style.backgroundColor = '#f8d7da';
            li.style.border = '2px solid #dc3545';
        }
    });
}

// Limpar feedback
function limparFeedback() {
    const alternativas = document.querySelectorAll('#alternativas li');
    alternativas.forEach(li => {
        li.style.backgroundColor = '';
        li.style.border = '';
    });
    
    // Habilitar todos os radios
    const radios = document.querySelectorAll('input[name="alternativa"]');
    radios.forEach(radio => {
        radio.disabled = false;
    });
}

// Habilitar botões
function habilitarBotoes() {
    document.getElementById('verificar').disabled = false;
    
    // Atualizar estado do botão "Próxima"
    const btnProxima = document.getElementById('proxima');
    
    // Desabilitar botão próxima/finalizar até que a questão seja respondida
    btnProxima.disabled = !questaoAtualRespondida;
    
    if (indiceQuestaoAtual >= todasQuestoes.length - 1) {
        btnProxima.textContent = 'Finalizar';
        btnProxima.onclick = finalizarSimulado;
    } else {
        btnProxima.textContent = 'Próxima';
        btnProxima.onclick = proximaQuestao;
    }
}

// Próxima questão
function proximaQuestao() {
    if (indiceQuestaoAtual < todasQuestoes.length - 1) {
        indiceQuestaoAtual++;
        exibirQuestao(todasQuestoes[indiceQuestaoAtual]);
    } else {
        finalizarSimulado();
    }
}

// Mostrar/ocultar carregador
function mostrarCarregador(mostrar) {
    const carregador = document.getElementById('carregador');
    if (carregador) {
        carregador.style.display = mostrar ? 'block' : 'none';
    } else if (mostrar) {
        // Criar carregador se não existir
        const divCarregador = document.createElement('div');
        divCarregador.id = 'carregador';
        divCarregador.style.cssText = 'text-align: center; padding: 20px; font-size: 18px;';
        divCarregador.textContent = 'Carregando questões...';
        document.querySelector('#questão').prepend(divCarregador);
    }
}

// Finalizar simulado
function finalizarSimulado() {
    // Verificar se todas as questões foram respondidas
    if (questoesRespondidas < todasQuestoes.length) {
        alert(`Você precisa responder todas as questões antes de finalizar!\nQuestões respondidas: ${questoesRespondidas}/${todasQuestoes.length}`);
        return;
    }
    
    document.getElementById('questão').style.display = 'none';
    document.getElementById('resultado').style.display = 'block';
    
    document.getElementById('totalQuestoes').textContent = questoesRespondidas;
    document.getElementById('totalAcertos').textContent = respostasCorretas;
    
    const porcentagem = questoesRespondidas > 0 
        ? (respostasCorretas / questoesRespondidas * 100).toFixed(1) 
        : 0;
    
    document.getElementById('resumo').innerHTML = `
        <p>Você acertou ${porcentagem}% das questões respondidas!</p>
        <p>Total de questões visualizadas: ${todasQuestoes.length}</p>
    `;
}