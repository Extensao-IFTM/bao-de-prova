# 📚 Documentação do Sistema - Bom de Prova

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [API - Funções de Requisição](#api---funções-de-requisição)
4. [Autenticação - Funções de Usuário](#autenticação---funções-de-usuário)
5. [Simulado - Funções do Simulado](#simulado---funções-do-simulado)
6. [Fluxo de Funcionamento](#fluxo-de-funcionamento)
7. [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 Visão Geral

O **Bom de Prova** é uma plataforma web para estudantes se prepararem para o ENEM através de simulados interativos. O sistema permite:

- ✅ Cadastro e login de usuários
- ✅ Resolução de questões do ENEM
- ✅ Navegação sequencial entre questões
- ✅ Feedback imediato de respostas
- ✅ Salvamento de respostas na API
- ✅ Visualização de estatísticas

---

## 📁 Estrutura de Arquivos

```
bao-de-prova/
├── index.html              # Página principal
├── loginTeste.html         # Página de login/cadastro
├── simulado.html           # Página do simulado
├── js/
│   ├── api.js             # Funções de chamada à API
│   ├── auth.js            # Funções de autenticação
│   └── simulado.js        # Lógica do simulado
├── css/
│   ├── style.css          # Estilos gerais
│   ├── style_login.css    # Estilos do login
│   └── style_simulado.css # Estilos do simulado
└── imagens/
    ├── Logo_Rev_001.png
    └── banner.jpg
```

---

## 🔌 API - Funções de Requisição

**Arquivo:** `js/api.js`

### 🔧 Configuração Base

```javascript
const URL_BASE_API = 'https://localhost:7093/api';
```

- Define a URL base da API
- Todas as requisições usam esta URL como prefixo

---

### 📡 `buscarAPI(endpoint, opcoes)`

**Descrição:** Função auxiliar que faz requisições HTTP para a API.

**Parâmetros:**
- `endpoint` (string): Rota da API (ex: `/questions`, `/users`)
- `opcoes` (objeto, opcional): Configurações da requisição (method, body, headers)

**Retorno:** Promise com os dados JSON da resposta

**Exemplo:**
```javascript
const dados = await buscarAPI('/questions', {
    method: 'GET'
});
```

**Como funciona:**
1. Faz um `fetch` para `URL_BASE_API + endpoint`
2. Adiciona headers padrão (`Content-Type: application/json`)
3. Verifica se a resposta foi bem-sucedida (`response.ok`)
4. Converte a resposta para JSON
5. Trata erros e lança exceções se necessário

**Tratamento de Erros:**
- Se `response.ok === false`: Lança erro com mensagem da API
- Se houver erro de rede: Captura e loga no console

---

### 📝 Funções de Questões

#### `buscarQuestaoAleatoria(categoria)`

**Descrição:** Busca uma questão aleatória da API.

**Parâmetros:**
- `categoria` (string, opcional): Filtrar por categoria (ex: "Matemática")

**Retorno:** Objeto com dados da questão

**Endpoint da API:** `GET /questions/random` ou `GET /questions/random?category=Matemática`

**Exemplo:**
```javascript
// Buscar qualquer questão
const questao = await buscarQuestaoAleatoria();

// Buscar questão de Matemática
const questaoMat = await buscarQuestaoAleatoria('Matemática');
```

**Estrutura do retorno:**
```json
{
  "id": 1,
  "statement": "Qual é a capital do Brasil?",
  "alternatives": [
    "São Paulo",
    "Rio de Janeiro", 
    "Brasília",
    "Salvador",
    "Belo Horizonte"
  ],
  "correctAlternative": 3,
  "category": "Geografia"
}
```

---

#### `buscarQuestaoPorId(id)`

**Descrição:** Busca uma questão específica pelo ID.

**Parâmetros:**
- `id` (number): ID da questão

**Retorno:** Objeto com dados da questão

**Endpoint da API:** `GET /questions/{id}`

**Exemplo:**
```javascript
const questao = await buscarQuestaoPorId(5);
```

---

### 👤 Funções de Usuários

#### `criarUsuario(nome, email)`

**Descrição:** Cria um novo usuário na API.

**Parâmetros:**
- `nome` (string): Nome completo do usuário
- `email` (string): Email do usuário

**Retorno:** Objeto com dados do usuário criado

**Endpoint da API:** `POST /users`

**Body da requisição:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com"
}
```

**Exemplo:**
```javascript
const usuario = await criarUsuario('João Silva', 'joao@email.com');
console.log(usuario);
// { id: 1, name: "João Silva", email: "joao@email.com" }
```

**⚠️ Importante:** 
- O email deve ser único no sistema
- Se o email já existir, a API retorna erro

---

#### `buscarUsuarioPorId(id)`

**Descrição:** Busca um usuário específico pelo ID.

**Parâmetros:**
- `id` (number): ID do usuário

**Retorno:** Objeto com dados do usuário

**Endpoint da API:** `GET /users/{id}`

**Exemplo:**
```javascript
const usuario = await buscarUsuarioPorId(1);
```

---

### 📊 Funções de Respostas

#### `enviarResposta(idUsuario, idQuestao, alternativaSelecionada, estaCorreto)`

**Descrição:** Salva a resposta do usuário na API.

**Parâmetros:**
- `idUsuario` (number): ID do usuário logado
- `idQuestao` (number): ID da questão respondida
- `alternativaSelecionada` (number): Alternativa escolhida (1-5)
- `estaCorreto` (boolean): Se a resposta está correta

**Retorno:** Objeto com dados da resposta salva

**Endpoint da API:** `POST /userdata`

**Body da requisição:**
```json
{
  "userId": 1,
  "questionId": 5,
  "selectedAlternative": 3,
  "isCorrect": true
}
```

**Exemplo:**
```javascript
await enviarResposta(1, 5, 3, true);
```

**Como calcular `estaCorreto`:**
```javascript
const estaCorreto = alternativaSelecionada === questao.correctAlternative;
```

---

#### `buscarEstatisticasUsuario(idUsuario)`

**Descrição:** Busca as estatísticas de um usuário.

**Parâmetros:**
- `idUsuario` (number): ID do usuário

**Retorno:** Objeto com estatísticas

**Endpoint da API:** `GET /userdata/user/{userId}/stats`

**Exemplo:**
```javascript
const stats = await buscarEstatisticasUsuario(1);
```

**Estrutura do retorno:**
```json
{
  "totalAnswered": 50,
  "totalCorrect": 35,
  "totalIncorrect": 15,
  "totalPoints": 350,
  "ranking": 5
}
```

---

#### `buscarRanking()`

**Descrição:** Busca o ranking geral de todos os usuários.

**Retorno:** Array com usuários ordenados por pontos

**Endpoint da API:** `GET /userdata/ranking`

**Exemplo:**
```javascript
const ranking = await buscarRanking();
```

**Estrutura do retorno:**
```json
[
  {
    "userId": 1,
    "userName": "João Silva",
    "totalAnswered": 50,
    "totalCorrect": 35,
    "totalPoints": 350
  },
  {
    "userId": 2,
    "userName": "Maria Santos",
    "totalAnswered": 45,
    "totalCorrect": 30,
    "totalPoints": 300
  }
]
```

---

## 🔐 Autenticação - Funções de Usuário

**Arquivo:** `js/auth.js`

### 📦 Armazenamento Local (localStorage)

O sistema usa `localStorage` para manter o usuário logado:

- **`idUsuario`**: ID do usuário logado
- **`dadosUsuario`**: JSON com dados completos do usuário

---

### ✅ `estaLogado()`

**Descrição:** Verifica se há um usuário logado.

**Retorno:** `true` se logado, `false` se não

**Exemplo:**
```javascript
if (estaLogado()) {
    console.log('Usuário logado!');
} else {
    console.log('Usuário não logado');
}
```

**Como funciona:**
- Verifica se existe a chave `idUsuario` no localStorage
- Retorna `true` se existir, `false` caso contrário

---

### 🆔 `obterIdUsuarioAtual()`

**Descrição:** Retorna o ID do usuário logado.

**Retorno:** String com o ID ou `null`

**Exemplo:**
```javascript
const id = obterIdUsuarioAtual();
console.log(id); // "1"
```

---

### 👤 `obterUsuarioAtual()`

**Descrição:** Retorna os dados completos do usuário logado.

**Retorno:** Objeto com dados do usuário ou `null`

**Exemplo:**
```javascript
const usuario = obterUsuarioAtual();
console.log(usuario);
// { id: 1, name: "João Silva", email: "joao@email.com" }
```

---

### 🔑 `fazerLogin(nome, email)`

**Descrição:** Realiza login/cadastro do usuário.

**Parâmetros:**
- `nome` (string): Nome do usuário
- `email` (string): Email do usuário

**Retorno:** Promise com dados do usuário

**Exemplo:**
```javascript
try {
    const usuario = await fazerLogin('João Silva', 'joao@email.com');
    console.log('Login realizado!', usuario);
} catch (erro) {
    console.error('Erro no login:', erro.message);
}
```

**Como funciona:**
1. Chama `criarUsuario()` da API
2. Salva o ID no localStorage (`idUsuario`)
3. Salva os dados completos no localStorage (`dadosUsuario`)
4. Retorna o objeto do usuário

**⚠️ Importante:**
- Se o email já existir, a API pode retornar erro
- Sempre use try-catch para tratar erros

---

### 🚪 `fazerLogout()`

**Descrição:** Faz logout do usuário.

**Exemplo:**
```javascript
fazerLogout();
```

**Como funciona:**
1. Remove `idUsuario` do localStorage
2. Remove `dadosUsuario` do localStorage
3. Redireciona para `index.html`

---

### 🔄 `atualizarInfoUsuario()`

**Descrição:** Atualiza as informações do usuário na página.

**Exemplo:**
```javascript
atualizarInfoUsuario();
```

**Como funciona:**
1. Busca os dados do usuário com `obterUsuarioAtual()`
2. Procura elementos com classe `.nome-usuario`
3. Atualiza o texto com o nome do usuário

**HTML necessário:**
```html
<span class="nome-usuario"></span>
```

---

### 🛡️ `verificarAutenticacao(redirecionarSeNaoLogado)`

**Descrição:** Verifica se o usuário está logado ao carregar a página.

**Parâmetros:**
- `redirecionarSeNaoLogado` (boolean): Se `true`, redireciona para login

**Retorno:** `true` se logado, `false` se não

**Exemplo:**
```javascript
// Em páginas públicas (index.html)
verificarAutenticacao();

// Em páginas protegidas (simulado.html)
verificarAutenticacao(true);
```

**Como funciona:**
1. Verifica se está logado com `estaLogado()`
2. Se não logado E `redirecionarSeNaoLogado === true`:
   - Redireciona para `loginTeste.html`
3. Se logado:
   - Chama `atualizarInfoUsuario()`

---

## 📝 Simulado - Funções do Simulado

**Arquivo:** `js/simulado.js`

### 📊 Variáveis Globais

```javascript
let todasQuestoes = [];        // Array com todas as questões carregadas
let indiceQuestaoAtual = 0;    // Índice da questão sendo exibida (0, 1, 2...)
let questoesRespondidas = 0;   // Quantidade de questões respondidas
let respostasCorretas = 0;     // Quantidade de acertos
```

---

### 📥 `carregarTodasQuestoes()`

**Descrição:** Carrega todas as questões da API e exibe a primeira.

**Exemplo:**
```javascript
await carregarTodasQuestoes();
```

**Como funciona:**
1. Exibe o carregador com `mostrarCarregador(true)`
2. Faz requisição para `GET /questions`
3. Armazena questões em `todasQuestoes`
4. Verifica se há questões disponíveis
5. Exibe a primeira questão com `exibirQuestao()`
6. Oculta o carregador

**⚠️ Tratamento de Erros:**
- Se não houver questões: Exibe alerta
- Se houver erro de rede: Exibe alerta com mensagem

---

### 🖥️ `exibirQuestao(questao)`

**Descrição:** Exibe uma questão na tela.

**Parâmetros:**
- `questao` (object): Objeto com dados da questão

**Exemplo:**
```javascript
exibirQuestao(todasQuestoes[0]);
```

**Como funciona:**
1. Atualiza o enunciado no elemento `#enunciado`
2. Limpa o container de alternativas
3. Cria elementos `<li>` para cada alternativa
4. Adiciona radio buttons com valor (1-5)
5. Atualiza o contador de questões
6. Limpa feedback anterior
7. Habilita os botões

**Estrutura HTML gerada:**
```html
<ul id="alternativas">
  <li>
    <label>
      <input type="radio" name="alternativa" value="1">
      Texto da alternativa 1
    </label>
  </li>
  <!-- ... mais 4 alternativas -->
</ul>
```

---

### 🔢 `atualizarContadorQuestoes()`

**Descrição:** Atualiza ou cria o contador "Questão X de Y".

**Exemplo:**
```javascript
atualizarContadorQuestoes();
```

**Como funciona:**
1. Busca elemento com id `contador-questoes`
2. Se existir: Atualiza o texto
3. Se não existir: Cria novo elemento antes do enunciado
4. Texto: "Questão X de Y"
   - X = `indiceQuestaoAtual + 1`
   - Y = `todasQuestoes.length`

---

### ✔️ `verificarResposta()`

**Descrição:** Verifica se a resposta está correta e salva na API.

**Exemplo:**
```javascript
// Chamada pelo botão "Verificar"
await verificarResposta();
```

**Como funciona:**
1. Busca o radio button selecionado
2. Se nada selecionado: Exibe alerta
3. Pega a questão atual: `todasQuestoes[indiceQuestaoAtual]`
4. Compara alternativa selecionada com `correctAlternative`
5. Calcula se está correto
6. Chama `enviarResposta()` para salvar na API
7. Incrementa contadores (`questoesRespondidas`, `respostasCorretas`)
8. Exibe feedback visual
9. Desabilita botão "Verificar"

**Valores das alternativas:**
- Radio button `value="1"` → Primeira alternativa
- Radio button `value="2"` → Segunda alternativa
- ...e assim por diante

**Cálculo de correção:**
```javascript
const estaCorreto = valorSelecionado === questaoAtual.correctAlternative;
```

---

### 💡 `mostrarFeedback(estaCorreto)`

**Descrição:** Mostra feedback visual da resposta (verde/vermelho).

**Parâmetros:**
- `estaCorreto` (boolean): Se a resposta está correta

**Exemplo:**
```javascript
mostrarFeedback(true);  // Mostra alternativa correta em verde
mostrarFeedback(false); // Mostra erro em vermelho e correta em verde
```

**Como funciona:**
1. Percorre todos os radio buttons
2. Desabilita todos (não permite mais alterar)
3. **Alternativa correta:**
   - Pinta fundo verde (`#d4edda`)
   - Adiciona borda verde (`2px solid #28a745`)
4. **Alternativa errada selecionada:**
   - Pinta fundo vermelho (`#f8d7da`)
   - Adiciona borda vermelha (`2px solid #dc3545`)

**Resultado visual:**
- ✅ Verde = Resposta correta
- ❌ Vermelho = Resposta errada (se errou)

---

### 🧹 `limparFeedback()`

**Descrição:** Remove o feedback visual (cores) das alternativas.

**Exemplo:**
```javascript
limparFeedback();
```

**Como funciona:**
1. Remove `backgroundColor` de todos os `<li>`
2. Remove `border` de todos os `<li>`
3. Habilita todos os radio buttons novamente

---

### 🎮 `habilitarBotoes()`

**Descrição:** Configura o estado dos botões de navegação.

**Exemplo:**
```javascript
habilitarBotoes();
```

**Como funciona:**
1. Habilita botão "Verificar"
2. Verifica se é a última questão:
   - **Última questão:**
     - Botão "Próxima" → "Finalizar"
     - onclick → `finalizarSimulado()`
   - **Não é a última:**
     - Botão "Próxima" → "Próxima"
     - onclick → `proximaQuestao()`

---

### ➡️ `proximaQuestao()`

**Descrição:** Avança para a próxima questão.

**Exemplo:**
```javascript
proximaQuestao();
```

**Como funciona:**
1. Verifica se não é a última questão
2. Incrementa `indiceQuestaoAtual++`
3. Chama `exibirQuestao()` com nova questão
4. Se for a última: Chama `finalizarSimulado()`

---

### ⬅️ `questaoAnterior()`

**Descrição:** Volta para a questão anterior.

**Exemplo:**
```javascript
questaoAnterior();
```

**Como funciona:**
1. Verifica se não é a primeira questão
2. Decrementa `indiceQuestaoAtual--`
3. Chama `exibirQuestao()` com questão anterior

---

### ⏳ `mostrarCarregador(mostrar)`

**Descrição:** Exibe ou oculta indicador de carregamento.

**Parâmetros:**
- `mostrar` (boolean): `true` para mostrar, `false` para ocultar

**Exemplo:**
```javascript
mostrarCarregador(true);  // Exibe "Carregando questões..."
mostrarCarregador(false); // Oculta
```

**Como funciona:**
1. Busca elemento com id `carregador`
2. Se existir: Altera `display` (block/none)
3. Se não existir E `mostrar === true`:
   - Cria novo `<div>` com id `carregador`
   - Adiciona texto "Carregando questões..."
   - Insere no início do `#questão`

---

### 🏁 `finalizarSimulado()`

**Descrição:** Finaliza o simulado e exibe resultados.

**Exemplo:**
```javascript
finalizarSimulado();
```

**Como funciona:**
1. Oculta área de questões (`#questão`)
2. Exibe área de resultados (`#resultado`)
3. Preenche dados:
   - Total de questões respondidas
   - Total de acertos
   - Porcentagem de acerto
   - Total de questões visualizadas
4. Calcula porcentagem:
   ```javascript
   (respostasCorretas / questoesRespondidas * 100).toFixed(1)
   ```

**HTML de resultado:**
```html
<div id="resultado">
  <h2>Resultado do Simulado</h2>
  <div id="resumo">
    <p>Você acertou 70.0% das questões respondidas!</p>
    <p>Total de questões visualizadas: 10</p>
  </div>
  <p><strong>Acertos:</strong> 7 de 10</p>
</div>
```

---

## 🔄 Fluxo de Funcionamento

### 1️⃣ Login/Cadastro (`loginTeste.html`)

```mermaid
1. Usuário acessa loginTeste.html
2. Preenche nome e email
3. Clica em "Entrar"
4. JavaScript chama fazerLogin(nome, email)
5. fazerLogin() chama criarUsuario() da API
6. API cria usuário e retorna dados
7. Dados salvos no localStorage
8. Redireciona para simulado.html
```

**Código:**
```javascript
await fazerLogin('João Silva', 'joao@email.com');
// localStorage agora tem: idUsuario e dadosUsuario
window.location.href = 'simulado.html';
```

---

### 2️⃣ Carregamento do Simulado (`simulado.html`)

```mermaid
1. Página carrega simulado.html
2. JavaScript verifica autenticação
   - verificarAutenticacao(true)
   - Se não logado: Redireciona para login
3. Se logado: Chama carregarTodasQuestoes()
4. API retorna array de questões
5. Primeira questão é exibida
6. Usuário pode navegar e responder
```

**Código:**
```javascript
// No <script> do simulado.html
verificarAutenticacao(true); // Protege a página
carregarTodasQuestoes();     // Carrega questões
```

---

### 3️⃣ Respondendo uma Questão

```mermaid
1. Usuário seleciona alternativa (radio button)
2. Clica em "Verificar"
3. verificarResposta() é chamada
4. Verifica se alternativa está correta
5. Salva resposta na API
   - enviarResposta(userId, questionId, alternative, isCorrect)
6. Exibe feedback visual (verde/vermelho)
7. Desabilita botão "Verificar"
8. Usuário clica em "Próxima"
9. proximaQuestao() carrega próxima questão
```

**Fluxo de dados:**
```javascript
// 1. Usuário seleciona alternativa 3
const selecionada = document.querySelector('input[name="alternativa"]:checked');
const valorSelecionado = 3;

// 2. Verifica se está correto
const questaoAtual = todasQuestoes[indiceQuestaoAtual];
const estaCorreto = valorSelecionado === questaoAtual.correctAlternative;

// 3. Salva na API
await enviarResposta(1, questaoAtual.id, 3, true);

// 4. Feedback visual
mostrarFeedback(true); // Verde
```

---

### 4️⃣ Finalizando o Simulado

```mermaid
1. Usuário está na última questão
2. Responde a questão
3. Clica em "Finalizar" (botão muda automaticamente)
4. finalizarSimulado() é chamada
5. Calcula estatísticas:
   - Total respondido
   - Total de acertos
   - Porcentagem
6. Exibe tela de resultado
7. Botão "Voltar ao Início" leva para index.html
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Criar e logar usuário

```javascript
// Criar novo usuário
try {
    const usuario = await fazerLogin('Maria Santos', 'maria@email.com');
    console.log('Usuário criado:', usuario);
    // { id: 2, name: "Maria Santos", email: "maria@email.com" }
} catch (erro) {
    console.error('Erro:', erro.message);
}
```

---

### Exemplo 2: Verificar se usuário está logado

```javascript
if (estaLogado()) {
    const id = obterIdUsuarioAtual();
    const usuario = obterUsuarioAtual();
    console.log(`Logado como: ${usuario.name} (ID: ${id})`);
} else {
    console.log('Nenhum usuário logado');
}
```

---

### Exemplo 3: Buscar e exibir questão

```javascript
// Carregar questões
const resposta = await fetch(`${URL_BASE_API}/questions`);
const questoes = await resposta.json();

// Exibir primeira questão
const questao = questoes[0];
console.log('Enunciado:', questao.statement);
console.log('Alternativas:', questao.alternatives);
console.log('Resposta correta:', questao.correctAlternative);
```

---

### Exemplo 4: Salvar resposta do usuário

```javascript
const idUsuario = obterIdUsuarioAtual();
const questao = todasQuestoes[0];
const alternativaSelecionada = 3;
const estaCorreto = alternativaSelecionada === questao.correctAlternative;

await enviarResposta(
    parseInt(idUsuario),
    questao.id,
    alternativaSelecionada,
    estaCorreto
);

console.log('Resposta salva com sucesso!');
```

---

### Exemplo 5: Buscar estatísticas

```javascript
const idUsuario = obterIdUsuarioAtual();
const stats = await buscarEstatisticasUsuario(idUsuario);

console.log(`Você respondeu ${stats.totalAnswered} questões`);
console.log(`Acertou ${stats.totalCorrect} questões`);
console.log(`Taxa de acerto: ${(stats.totalCorrect / stats.totalAnswered * 100).toFixed(1)}%`);
console.log(`Posição no ranking: ${stats.ranking}º`);
```

---

### Exemplo 6: Buscar ranking geral

```javascript
const ranking = await buscarRanking();

console.log('🏆 Top 3:');
ranking.slice(0, 3).forEach((user, index) => {
    console.log(`${index + 1}º - ${user.userName}: ${user.totalPoints} pontos`);
});
```

---

## 🔍 Referência Rápida

### Funções da API (api.js)

| Função | Parâmetros | Retorno | Descrição |
|--------|-----------|---------|-----------|
| `buscarAPI` | endpoint, opcoes | Promise | Faz requisição HTTP |
| `buscarQuestaoAleatoria` | categoria | Promise | Busca questão aleatória |
| `buscarQuestaoPorId` | id | Promise | Busca questão por ID |
| `criarUsuario` | nome, email | Promise | Cria novo usuário |
| `buscarUsuarioPorId` | id | Promise | Busca usuário por ID |
| `enviarResposta` | idUsuario, idQuestao, alternativa, correto | Promise | Salva resposta |
| `buscarEstatisticasUsuario` | idUsuario | Promise | Busca estatísticas |
| `buscarRanking` | - | Promise | Busca ranking geral |

### Funções de Autenticação (auth.js)

| Função | Parâmetros | Retorno | Descrição |
|--------|-----------|---------|-----------|
| `estaLogado` | - | boolean | Verifica se está logado |
| `obterIdUsuarioAtual` | - | string/null | Retorna ID do usuário |
| `obterUsuarioAtual` | - | object/null | Retorna dados do usuário |
| `fazerLogin` | nome, email | Promise | Faz login/cadastro |
| `fazerLogout` | - | void | Faz logout |
| `atualizarInfoUsuario` | - | void | Atualiza info na página |
| `verificarAutenticacao` | redirecionar | boolean | Verifica autenticação |

### Funções do Simulado (simulado.js)

| Função | Parâmetros | Retorno | Descrição |
|--------|-----------|---------|-----------|
| `carregarTodasQuestoes` | - | Promise | Carrega questões da API |
| `exibirQuestao` | questao | void | Exibe questão na tela |
| `atualizarContadorQuestoes` | - | void | Atualiza contador |
| `verificarResposta` | - | Promise | Verifica e salva resposta |
| `mostrarFeedback` | estaCorreto | void | Mostra feedback visual |
| `limparFeedback` | - | void | Remove feedback |
| `habilitarBotoes` | - | void | Configura botões |
| `proximaQuestao` | - | void | Avança para próxima |
| `questaoAnterior` | - | void | Volta para anterior |
| `mostrarCarregador` | mostrar | void | Exibe/oculta loader |
| `finalizarSimulado` | - | void | Finaliza e mostra resultado |

---

## 📝 Notas Importantes

### ⚠️ Segurança

- ⚠️ Dados salvos no localStorage são acessíveis via JavaScript
- ⚠️ Não armazene senhas ou dados sensíveis
- ⚠️ Use HTTPS em produção

### 🔧 Configuração

- 📌 URL da API: Altere em `js/api.js` → `URL_BASE_API`
- 📌 Página de login: Altere em `js/auth.js` → `verificarAutenticacao()`

### 🐛 Debug

Para debugar, abra o Console do navegador (F12) e veja:
- Logs de requisições
- Erros da API
- Estado das variáveis

```javascript
// Ver se está logado
console.log('Logado?', estaLogado());

// Ver questões carregadas
console.log('Questões:', todasQuestoes);

// Ver questão atual
console.log('Índice atual:', indiceQuestaoAtual);
```

---

**Desenvolvido com ❤️ pela equipe Extensao-IFTM**
