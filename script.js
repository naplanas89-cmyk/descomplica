let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("#campo-busca");
let influencerContainer = document.querySelector(".influencer-container");
let dados = [];
let debounceTimer;

async function carregarDados() {
    try {
        let resposta = await fetch("data.json");
        if (!resposta.ok) {
            throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        dados = await resposta.json();
        renderizarListaDeNomes(dados); // Exibe a lista de nomes ao carregar
    } catch (error) {
        console.error("Falha ao carregar os dados:", error);
        cardContainer.innerHTML = "<p>Erro ao carregar as informações. Tente novamente mais tarde.</p>";
    }
}

// Adiciona o event listener para o campo de busca
campoBusca.addEventListener("input", () => {
    // Limpa o timer anterior a cada nova digitação
    clearTimeout(debounceTimer);
    // Configura um novo timer para iniciar a busca após 300ms
    debounceTimer = setTimeout(iniciarBusca, 300);
});

function iniciarBusca() {
    let termoBusca = campoBusca.value.toLowerCase();

    if (termoBusca.trim() === "") {
        renderizarListaDeNomes(dados); // Mostra a lista de nomes se a busca estiver vazia
        return;
    }

    // Filtra os dados com base no nome
    let resultados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca)
    );

    renderizarCards(resultados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards anteriores

    if (dados.length === 0) {
        cardContainer.innerHTML = "<p>Nenhuma marca encontrada</p>";
        return;
    }

    // Se estivermos mostrando apenas um resultado (seja por clique ou busca), adiciona um botão "Voltar"
    if (dados.length === 1) {
        const backButton = document.createElement("button");
        backButton.textContent = "‹ Voltar";
        backButton.onclick = () => carregarDados(); // Acessa a variável global `dados` com todas as marcas
        cardContainer.appendChild(backButton);
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p>${dado.descricao}</p>
        <a href="${dado.link}" target="_blank">Site Oficial</a>
        `
        cardContainer.appendChild(article);
    }
}

// Nova função para renderizar a lista de nomes
function renderizarListaDeNomes(dados) {
    cardContainer.innerHTML = ""; // Limpa o container
 
    const listaContainer = document.createElement("div");
    listaContainer.classList.add("lista-marcas");
 
    const h3 = document.createElement("h3");
    h3.textContent = "Marcas disponíveis:";
    listaContainer.appendChild(h3);
 
    const ul = document.createElement("ul");
    for (let dado of dados) {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.textContent = dado.nome;
        button.onclick = () => renderizarCards([dado]); // Ao clicar, renderiza o card específico
        li.appendChild(button);
        ul.appendChild(li);
    }
    listaContainer.appendChild(ul);
    cardContainer.appendChild(listaContainer);
}

// Inicia o processo carregando os dados
carregarDados();

async function carregarInfluencers() {
    try {
        let resposta = await fetch("influencer.json");
        if (!resposta.ok) {
            throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        let influencers = await resposta.json();
        renderizarInfluencers(influencers);
    } catch (error) {
        console.error("Falha ao carregar os dados dos influencers:", error);
        influencerContainer.innerHTML = "<p>Erro ao carregar as informações.</p>";
    }
}

function renderizarInfluencers(influencers) {
    const ul = document.createElement("ul");
    for (let influencer of influencers) {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${influencer.link.trim()}" target="_blank">${influencer.nome}</a>`;
        ul.appendChild(li);
    }
    influencerContainer.appendChild(ul);
}

carregarInfluencers();
