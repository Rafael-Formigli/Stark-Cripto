// função que retorna um objeto com o simbolo das moedas que será vinculado com o select de moedas.
function obterSimboloMoeda(codigoMoeda) {
  const simbolos = {
    brl: 'R$',
    usd: 'US$',
    eur: '€',
    cny: '¥',
  };
  return simbolos[codigoMoeda] || '';
}

  // Objeto com as informações das criptomoedas
const criptoInfo = {
  bitcoin: { nome: "Bitcoin", descricao: "Bitcoin foi criado em 2009 por uma pessoa (ou grupo) usando o pseudônimo Satoshi Nakamoto. É a primeira e mais conhecida criptomoeda, sendo descentralizada e operando sem uma autoridade central ou governo.", logo: "./assets/bitcoin.webp", cotacoes: {} },
  ethereum: { nome: "Ethereum", descricao: "Ethereum é uma plataforma open source de blockchain que permite a criação de contratos inteligentes. Foi proposto por Vitalik Buterin em 2013 e desenvolvido a partir de 2014, com o lançamento em 2015.", logo: "./assets/ethereum.webp", cotacoes: {} },
  litecoin: { nome: "Litecoin", descricao: "Litecoin foi criado por Charlie Lee em outubro de 2011 como uma alternativa ao Bitcoin. Ele destinava-se a ser 'a prata digital' em comparação com o 'ouro digital' do Bitcoin.", logo: "./assets/litecoin.webp", cotacoes: {} },
  dogecoin: { nome: "Dogecoin", descricao: "Dogecoin foi lançado em dezembro de 2013 como uma criptomoeda baseada no meme 'Doge' da internet. Inicialmente criado como uma piada, o Dogecoin ganhou popularidade ao longo do tempo.", logo: "./assets/dogecoin.webp", cotacoes: {} },
  binancecoin: { nome: "Binance Coin", descricao: "Binancecoin é a criptomoeda nativa da plataforma Binance, uma das maiores exchanges de criptomoedas do mundo. Foi lançado em 2017 como parte da oferta inicial de moedas (ICO) da Binance.", logo: "./assets/Binancecoin.webp", cotacoes: {} },
  cardano: { nome: "Cardano", descricao: "Cardano é uma plataforma de contrato inteligente que visa fornecer uma abordagem mais segura e sustentável para a blockchain. Lançado em 2017, foi fundado por Charles Hoskinson, um dos co-fundadores do Ethereum.", logo: "./assets/cardano.webp", cotacoes: {} },
  polkadot: { nome: "Polkadot", descricao: "Polkadot é uma plataforma de blockchain multi-cadeia que permite que diferentes blockchains interoperem. Foi proposto por Gavin Wood, co-fundador do Ethereum, e lançado em 2020.", logo: "./assets/polkadot.png", cotacoes: {} },
  ripple: { nome: "Ripple", descricao: "Ripple é uma tecnologia de pagamento digital e criptomoeda que foi lançada em 2012. Diferentemente do Bitcoin, que é descentralizado, o Ripple opera em um sistema mais centralizado e é usado principalmente por instituições financeiras.", logo: "./assets/ripple.webp", cotacoes: {} },
  uniswap: { nome: "Uniswap", descricao: "Uniswap é um protocolo de finanças descentralizadas (DeFi) construído no blockchain Ethereum. Foi lançado em 2018 por Hayden Adams como uma plataforma para facilitar a troca de tokens ERC-20 sem a necessidade de uma exchange centralizada.", logo: "./assets/uniswap.webp", cotacoes: {} },
  chainlink: { nome: "Chainlink", descricao: "Chainlink é uma plataforma de contratos inteligentes que conecta contratos inteligentes com dados do mundo real. Foi proposto por Sergey Nazarov e lançado em 2017.", logo: "./assets/chainlink.webp", cotacoes: {} },
};

function limparInput() {
  document.getElementById('inputFiltro').value = '';
  document.getElementById('quantidadeInput').value = '';
  document.getElementById('moedaDestinoSelect').value = 'select';

  // Reseta o estado dos cards para ficarem visíveis.
  for (const cripto in criptoInfo) {
    document.getElementById(cripto).style.display = 'block';
  }

  // Limpa o valorConvertido
  document.getElementById('valorConvertido').innerText = 'Resultado:'
}

  // Função busca a cotação das crptomoedas na API coingecko com a biblioteca axios para fazer reuisição HTTP e retornar asinformações em um JSON totlmente manipulável.

async function obterCotacoes() {
  try {
    const moedas = Object.keys(criptoInfo).join(',');
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${moedas}&vs_currencies=brl,usd,eur,cny`);
    const data = response.data;

    for (const cripto in criptoInfo) {
      criptoInfo[cripto].cotacoes = {};
      for (const moeda in data[cripto]) {
        criptoInfo[cripto].cotacoes[moeda] = data[cripto][moeda];
      }
    }
  } catch (error) {
    console.error('Erro ao obter cotações:', error.message);
  }
}

function exibirCards() {
  const criptoContainer = document.getElementById('criptoContainer');

  // Obtém a data e hora atual
  const agora = new Date();
  
  // Formata a data e hora no formato brasileiro
  const formatoBrasileiro = agora.toLocaleString('pt-BR');

  // For buscando as cotaçõesem real, dólar, euro e yuan
  for (const cripto in criptoInfo) {
    const criptoCard = document.createElement('div');
    criptoCard.id = cripto;

    // Valores da cotação buscados na API
    const cotacoes = criptoInfo[cripto].cotacoes;
    const brl = parseFloat(cotacoes.brl).toFixed(2);
    const usd = parseFloat(cotacoes.usd).toFixed(2);
    const eur = parseFloat(cotacoes.eur).toFixed(2);
    const cny = parseFloat(cotacoes.cny).toFixed(2);

    
    // Inserção das cotações dinamicamente no HTML
    criptoCard.innerHTML = `
      <h2>${criptoInfo[cripto].nome}</h2>
      <img src="${criptoInfo[cripto].logo}" alt="${criptoInfo[cripto].nome} Logo">
      <div class="container-cripto">
        <div id="descricao">
          <p>${criptoInfo[cripto].descricao}</p>
        </div>                 
        <div id="cotacao">
          <p>Cotação do dia: ${formatoBrasileiro}</p>
          <p>BRL:  R$${brl}</p>
          <p>USD:  US$${usd}</p>
          <p>EUR:  €${eur}</p>
          <p>CNY:  ¥${cny}</p>
        </div>
      </div>
    `;
    criptoContainer.appendChild(criptoCard);
  }
}

  // Função para filtrar o que o usuário digitou no input, deixando somente o card filtrado na tela
function filtrarInformacoes() {
  const inputFiltro = document.getElementById('inputFiltro');
  const filtroValue = inputFiltro.value.trim().toLowerCase();

  // Adiciona a verificação para texto vazio
  if (filtroValue === '') {
    alert('Pesquise a criptomoeda desejada!');
    return;
  }

  // for que percorre os cards e deixa somente o filtrado na tela
  for (const cripto in criptoInfo) {
    const criptoNome = criptoInfo[cripto].nome.toLowerCase();
    const card = document.getElementById(cripto);

    if (criptoNome.includes(filtroValue)) {
      card.style.display = 'block';

      // Preenche automaticamente o campo de filtro com o nome da criptomoedaque foi digitada parcialmente
      inputFiltro.value = criptoInfo[cripto].nome;
    } else {
      card.style.display = 'none';
    }
  }
}

// Função para converter moeda, na verdade ela pega a cotação da moeda e multiplica para saber o total na respectiva meda escolhida

function converterMoeda() {
  const inputFiltro = document.getElementById('inputFiltro');
  const criptoOrigemSelect = inputFiltro.value.toLowerCase();
  const moedaDestinoSelect = document.getElementById('moedaDestinoSelect');
  const quantidadeInput = parseFloat(document.getElementById('quantidadeInput').value);
  const resultado = document.getElementById('valorConvertido');
  const simboloMoedaDestino = obterSimboloMoeda(moedaDestinoSelect.value);

  // Verifica se o campo de buscar criptomoeda está vazio
  if (inputFiltro.value.trim() === '') {
    alert('Primeiro pesquise a criptomoeda!');
    
    // Rola até o campo buscar criptomoeda
    inputFiltro.scrollIntoView({ behavior: 'smooth' });

    return;
  }

  // Verifica se o campo quantidade de moedas está vazio
  if (isNaN(quantidadeInput) || quantidadeInput <= 0) {
    alert('Por favor, insira uma quantidade válida para calcular.');
    return;
  }

  // Verifica se o usuário escolheu em qual moeda quer saber o valor das suas criptomoedas

  if (moedaDestinoSelect.value.trim() === 'select') {
    alert('Por favor, escolha uma moeda para fazer o cálculo.');
    return;
  }

  const cotacaoOrigem = criptoInfo[criptoOrigemSelect].cotacoes[moedaDestinoSelect.value];
  const valorConvertido = quantidadeInput * cotacaoOrigem;
  const textoMoedaDestino = moedaDestinoSelect.options[moedaDestinoSelect.selectedIndex].text;

  // Inserção do resultado da coversão da quantidade de criptomoedas para a moeda escolhida dinamicamente no HTML.
  resultado.innerHTML = `O Valor de ${quantidadeInput} ${criptoOrigemSelect} em ${textoMoedaDestino} é: ${simboloMoedaDestino} ${valorConvertido.toFixed(2)}`;
}

// Chama as funções iniciais
obterCotacoes().then(exibirCards);