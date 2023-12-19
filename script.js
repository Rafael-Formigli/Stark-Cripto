

// função que retorna um objeto com o simbolo das moedas que será vinculado com o select de moedas.
function obterSimboloMoeda(codigoMoeda) {
  const simbolos = {
    brl: 'R$',
    usd: 'US$',
    eur: '€',
    cny: 'CN¥',
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

// Função para limpar os campos de entrada e exibir todos os cards
function limparInput() {
  const selectFiltro = document.getElementById('selectFiltro');
  const quantidadeCripto = document.getElementById('quantidadeInput');

  selectFiltro.value = 'select1';
  quantidadeCripto.value = '';
  document.getElementById('moedaDestinoSelect').value = 'select';

  for (const cripto in criptoInfo) {
    document.getElementById(cripto).style.display = 'block';
  }

  document.getElementById('valorConvertido').innerText = 'Resultado:';
}

// Função assíncrona para obter cotações das criptomoedas da API
async function obterCotacoes() {
  try {
    const moedas = Object.keys(criptoInfo).join(',');
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${moedas}&vs_currencies=brl,usd,eur,cny`);
    const data = response.data;

    // Preenchendo as informações de cotações nas criptomoedas
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

// Função para formatar valores monetários
function formatarValorMonetario(valor, moeda = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moeda }).format(valor);
}

// Função para exibir os cards das criptomoedas
function exibirCards() {
  const criptoContainer = document.getElementById('criptoContainer');
  const agora = new Date();
  const data = `${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')}/${agora.getFullYear()}`;
  const hora = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

  // Iterando sobre as criptomoedas
  for (const cripto in criptoInfo) {
    const criptoCard = document.createElement('div');
    criptoCard.id = cripto;

    const cotacoes = criptoInfo[cripto].cotacoes;

    // Função para formatar cotação de uma moeda específica e inserir dinamicamente no HTML
    const formatarCotacao = (valor, moeda) => formatarValorMonetario(parseFloat(valor).toFixed(2), moeda);

    criptoCard.innerHTML = `
      <h2>${criptoInfo[cripto].nome}</h2>
      <img src="${criptoInfo[cripto].logo}" aria-hidden=“true” alt="imagem da logo da CriptoMoeda${criptoInfo[cripto].nome}">
      <div class="container-cripto">
        <div id="descricao">
          <details >
            <summary>
              <span tabindex="7" aria-expanded="false" role="button" class="linha">História</span>
            </summary>
            <p aria-label="História da Criptomoeda">${criptoInfo[cripto].descricao}</p>
          </details>
        </div>
        <div id="cotacao">
          <p aria-details>Data: ${data}<br>Hora: ${hora} </p>
          <div id="details">
            <details>
              <summary><span aria-expanded="false" role="button" class="linha" tabindex="8">Cotação em Real</span></summary>
              <p aria-label="Cotação em Real">${formatarCotacao(cotacoes.brl, 'BRL')}</p>
            </details>
            <details>
              <summary><span aria-expanded="false" role="button" tabindex="9" class="linha">Cotação em Dólar</span></summary>
              <p aria-label="Cotação em Dólar" >${formatarCotacao(cotacoes.usd, 'USD')}</p>
            </details>
            <details>
              <summary><span aria-expanded="false" role="button" tabindex="10" class="linha">Cotação em Euro</span></summary>
              <p aria-label="Cotação em Euro">${formatarCotacao(cotacoes.eur, 'EUR')}</p>
            </details>
            <details>
              <summary><span aria-expanded="false" role="button" tabindex="11"class="linha">Cotação em Yuan</span></summary>
              <p aria-label="Cotação em Yuan Chinês">${formatarCotacao(cotacoes.cny, 'CNY')}</p>
            </details>
          </div>
        </div>                  
      </div>
    `;
    criptoContainer.appendChild(criptoCard);
  }
}

// Função para filtrar as informações
function filtrarInformacoes() {
  const selectFiltro = document.getElementById('selectFiltro');
  const quantidadeCripto = document.getElementById('quantidadeInput');
  const filtroValue = selectFiltro.value.trim().toLowerCase();

  if (filtroValue === 'select1') {
    alert('Pesquise a criptomoeda desejada!');
    return;
  }

  let criptoEncontrada = false;

  for (const cripto in criptoInfo) {
    const criptoNome = criptoInfo[cripto].nome.toLowerCase();
    const card = document.getElementById(cripto);

    if (criptoNome.includes(filtroValue)) {
      card.style.display = 'block';
      criptoEncontrada = true;
      quantidadeCripto.scrollIntoView({ behavior: 'smooth' });
    } else {
      card.style.display = 'none';
    }
  }

  // Mantém o nome da criptomoeda no campo de seleção se uma correspondência for encontrada
  if (criptoEncontrada) {
    selectFiltro.value = filtroValue;
  }
}

// Função para converter moeda e inserir o resultado dinamicamente no HTML
function converterMoeda() {
  const selectFiltro = document.getElementById('selectFiltro');
  const criptoOrigemSelect = selectFiltro.value.toLowerCase();
  const moedaDestinoSelect = document.getElementById('moedaDestinoSelect');
  const quantidadeInput = parseFloat(document.getElementById('quantidadeInput').value);
  const resultado = document.getElementById('valorConvertido');

  if (selectFiltro.value.trim() === 'select1') {
    alert('Primeiro pesquise a criptomoeda!');
    selectFiltro.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (isNaN(quantidadeInput) || quantidadeInput <= 0) {
    alert('Por favor, insira uma quantidade válida para calcular.');
    return;
  }

  if (moedaDestinoSelect.value.trim() === 'select') {
    alert('Por favor, escolha uma moeda para fazer o cálculo.');
    return;
  }

  const cotacaoOrigem = criptoInfo[criptoOrigemSelect].cotacoes[moedaDestinoSelect.value];
  const valorConvertido = quantidadeInput * cotacaoOrigem;
  const textoMoedaDestino = moedaDestinoSelect.options[moedaDestinoSelect.selectedIndex].text;

  resultado.innerHTML = `O Valor de ${quantidadeInput} ${criptoOrigemSelect} em ${textoMoedaDestino} é: ${formatarValorMonetario(valorConvertido, moedaDestinoSelect.value)}`;
}

// Chamando as funções iniciais
obterCotacoes().then(exibirCards);
