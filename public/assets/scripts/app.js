/* ============================================================
   ARRAY DE DADOS DOS JOGOS
   Contém todas as informações dos jogos disponíveis no site
   ============================================================ */
const dados = [
    // ============================================================
    // AÇÃO / AVENTURA
    // ============================================================
    {
        id: 1,
        titulo: "The Last of Us Part II",
        descricao: "Ellie parte em uma jornada marcada por perda, vingança e dilemas morais em um mundo devastado.",
        plataforma: "PlayStation 4 / PlayStation 5",
        lancamento: "2020",
        genero: "Ação/Aventura",
        imagem_principal: "img/tlou5.jpg"
    },
    {
        id: 2,
        titulo: "Uncharted 4: A Thief's End",
        descricao: "Nathan Drake sai em sua última aventura cheia de mistérios, piratas e ação frenética.",
        plataforma: "PlayStation 4",
        lancamento: "2016",
        genero: "Ação/Aventura",
        imagem_principal: "img/u4.jpg"
    },
    {
        id: 3,
        titulo: "God of War (2018)",
        descricao: "Kratos vive uma nova jornada ao lado de seu filho Atreus em meio à mitologia nórdica.",
        plataforma: "PlayStation 4 / PlayStation 5",
        lancamento: "2018",
        genero: "Ação/Aventura",
        imagem_principal: "img/gow2.jpg"
    },

    // ============================================================
    // TERROR
    // ============================================================
    {
        id: 4,
        titulo: "Outlast",
        descricao: "Um jornalista investiga um hospital psiquiátrico onde algo terrível está acontecendo.",
        plataforma: "PC / PlayStation / Xbox / Switch",
        lancamento: "2013",
        genero: "Terror",
        imagem_principal: "img/outlast.jpg"
    },
    {
        id: 5,
        titulo: "Resident Evil 7",
        descricao: "Ethan Winters precisa sobreviver a uma família macabra em uma casa abandonada.",
        plataforma: "PC / PlayStation / Xbox",
        lancamento: "2017",
        genero: "Terror",
        imagem_principal: "img/re7-2.jpg"
    },
    {
        id: 6,
        titulo: "Silent Hill 2",
        descricao: "James recebe uma carta da esposa já falecida e parte para a misteriosa Silent Hill.",
        plataforma: "PlayStation 2 / PC",
        lancamento: "2001",
        genero: "Terror",
        imagem_principal: "img/sh.jpg"
    },

    // ============================================================
    // FICÇÃO CIENTÍFICA
    // ============================================================
    {
        id: 7,
        titulo: "Cyberpunk 2077",
        descricao: "Em uma sociedade tecnológica decadente, V precisa sobreviver em meio à corrupção e megacorporações.",
        plataforma: "PC / PlayStation / Xbox",
        lancamento: "2020",
        genero: "Ficção Científica",
        imagem_principal: "img/cyberpunk2077.png"
    },
    {
        id: 8,
        titulo: "Mass Effect 2",
        descricao: "Shepard precisa recrutar uma equipe lendária para impedir uma ameaça galáctica.",
        plataforma: "PC / PlayStation / Xbox",
        lancamento: "2010",
        genero: "Ficção Científica",
        imagem_principal: "img/massefect2.jpg"
    },
    {
        id: 9,
        titulo: "Dead Space (Remake)",
        descricao: "Isaac Clarke luta pela sobrevivência em uma nave infestada por criaturas grotescas.",
        plataforma: "PC / PlayStation 5 / Xbox Series",
        lancamento: "2023",
        genero: "Ficção Científica",
        imagem_principal: "img/deadspace.webp"
    },

    // ============================================================
    // SUSPENSE
    // ============================================================
    {
        id: 10,
        titulo: "Alan Wake",
        descricao: "Um escritor enfrenta eventos sobrenaturais enquanto busca sua esposa desaparecida.",
        plataforma: "PC / Xbox / PlayStation",
        lancamento: "2010",
        genero: "Suspense",
        imagem_principal: "img/alanwake.jpg"
    },
    {
        id: 11,
        titulo: "Control",
        descricao: "Jesse Faden investiga eventos paranormais em uma agência secreta do governo.",
        plataforma: "PC / PlayStation / Xbox",
        lancamento: "2019",
        genero: "Suspense",
        imagem_principal: "img/control.jpg"
    }
];

/* ============================================================
   FIM DO ARRAY DE DADOS
   ============================================================ */



/* ============================================================
   SISTEMA DE FAVORITOS - INTEGRADO COM AUTENTICAÇÃO
   ============================================================ */
// As funções de favoritos agora estão em auth.js e usam o JSON Server
// Esta função é mantida para compatibilidade, mas agora usa o sistema de autenticação
async function isFavorito(jogoId) {
  // Se não houver usuário logado, retorna false
  if (!isUsuarioLogado()) {
    return false;
  }
  // Usa a função do auth.js que busca do JSON Server
  return await isFavoritoUsuario(jogoId);
}

/* ============================================================
   FUNÇÃO PARA RENDERIZAR JOGOS NA PÁGINA INICIAL
   Recebe um array de jogos e um título, e renderiza os cards
   ============================================================ */
async function renderizarJogos(jogos, titulo = "Destaques da Semana") {
  // Busca o container onde os jogos serão exibidos
  const homeContainer = document.querySelector(".destaques");
  if (!homeContainer) return; // Se não encontrar o container, encerra a função

  // Define o título da seção
  homeContainer.innerHTML = `<h3>${titulo}</h3>`;

  // Se não houver jogos, exibe mensagem
  if (jogos.length === 0) {
    homeContainer.innerHTML += "<p>Nenhum jogo encontrado.</p>";
    return;
  }

  // Itera sobre cada jogo e cria um card
  // Usa Promise.all para processar todos os jogos de forma assíncrona
  const promises = jogos.map(async (jogo) => {
    const article = document.createElement("article");
    
    // Verifica se o jogo está nos favoritos (assíncrono)
    // Só verifica se o usuário estiver logado
    const mostrarFavorito = isUsuarioLogado();
    let favorito = false;
    if (mostrarFavorito) {
      favorito = await isFavoritoUsuario(jogo.id);
    }
    
    const classeFavorito = favorito ? 'favorito-ativo' : '';
    // Font Awesome 6: fa-regular fa-heart (vazio) e fa-solid fa-heart (preenchido)
    const iconeFavorito = favorito ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    
    // Só mostra o botão de favorito se o usuário estiver logado
    const botaoFavoritoHTML = mostrarFavorito 
      ? `<button class="btn-favorito ${classeFavorito}" data-jogo-id="${jogo.id}" title="${favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          <i class="${iconeFavorito}"></i>
        </button>`
      : '';
    
    // Cria o HTML do card com link para a página de detalhes e botão de favorito
    article.innerHTML = `
      <div class="card-wrapper">
        <a href="detalhes.html?id=${jogo.id}" class="card-link">
          <img src="${jogo.imagem_principal}" alt="${jogo.titulo}">
          <h4>${jogo.titulo}</h4>
          <p>${jogo.descricao}</p>
        </a>
        ${botaoFavoritoHTML}
      </div>
    `;
    
    // Adiciona evento de clique no botão de favorito (se existir)
    if (mostrarFavorito) {
      const btnFavorito = article.querySelector('.btn-favorito');
      if (btnFavorito) {
        btnFavorito.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Verifica se o usuário está logado
          if (!isUsuarioLogado()) {
            alert('Você precisa estar logado para favoritar jogos.');
            window.location.href = 'login.html';
            return;
          }
          
          const jogoId = parseInt(btnFavorito.getAttribute('data-jogo-id'));
          const result = await toggleFavoritoUsuario(jogoId);
          
          if (result.success) {
            // Atualiza o visual do botão
            const novoEstado = await isFavoritoUsuario(jogoId);
            const icone = btnFavorito.querySelector('i');
            
            if (novoEstado) {
              btnFavorito.classList.add('favorito-ativo');
              btnFavorito.title = 'Remover dos favoritos';
              if (icone) {
                icone.className = 'fa-solid fa-heart';
              }
            } else {
              btnFavorito.classList.remove('favorito-ativo');
              btnFavorito.title = 'Adicionar aos favoritos';
              if (icone) {
                icone.className = 'fa-regular fa-heart';
              }
            }
            
            // Animação de feedback
            btnFavorito.style.transform = 'scale(1.2)';
            setTimeout(() => {
              btnFavorito.style.transform = 'scale(1)';
            }, 200);
          } else {
            alert(result.message || 'Erro ao atualizar favoritos.');
          }
        });
      }
    }
    
    // Adiciona o card ao container
    homeContainer.appendChild(article);
  });
  
  // Aguarda todos os cards serem criados
  await Promise.all(promises);
}

/* ============================================================
   FUNÇÃO DE FILTRO DE PESQUISA
   ============================================================ */
function filtrarJogos(textoPesquisa) {
  if (!textoPesquisa || textoPesquisa.trim() === '') {
    return dados; // Retorna todos os jogos se não houver pesquisa
  }
  
  const textoLower = textoPesquisa.toLowerCase().trim();
  
  return dados.filter(jogo => {
    const tituloMatch = jogo.titulo.toLowerCase().includes(textoLower);
    const descricaoMatch = jogo.descricao.toLowerCase().includes(textoLower);
    return tituloMatch || descricaoMatch;
  });
}

/* ============================================================
   INICIALIZAÇÃO - RENDERIZA TODOS OS JOGOS NA PÁGINA INICIAL
   ============================================================ */
const homeContainer = document.querySelector(".destaques");
if (homeContainer) {
  // Renderiza todos os jogos quando a página carrega
  renderizarJogos(dados, "Todos os Jogos");
  
  // Campo de pesquisa
  const campoPesquisa = document.getElementById('campoPesquisa');
  const btnLimparPesquisa = document.getElementById('btnLimparPesquisa');
  
  if (campoPesquisa) {
    // Evento de input para pesquisa em tempo real
    campoPesquisa.addEventListener('input', async (e) => {
      const textoPesquisa = e.target.value;
      const jogosFiltrados = filtrarJogos(textoPesquisa);
      
      if (textoPesquisa.trim() === '') {
        await renderizarJogos(dados, "Todos os Jogos");
        btnLimparPesquisa.style.display = 'none';
      } else {
        await renderizarJogos(jogosFiltrados, `Resultados da pesquisa: "${textoPesquisa}"`);
        btnLimparPesquisa.style.display = 'flex';
      }
    });
    
    // Evento de Enter para pesquisa
    campoPesquisa.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const textoPesquisa = e.target.value;
        const jogosFiltrados = filtrarJogos(textoPesquisa);
        await renderizarJogos(jogosFiltrados, `Resultados da pesquisa: "${textoPesquisa}"`);
      }
    });
  }
  
  if (btnLimparPesquisa) {
    // Inicialmente esconde o botão de limpar
    btnLimparPesquisa.style.display = 'none';
    
    // Evento de clique para limpar pesquisa
    btnLimparPesquisa.addEventListener('click', async () => {
      campoPesquisa.value = '';
      await renderizarJogos(dados, "Todos os Jogos");
      btnLimparPesquisa.style.display = 'none';
      campoPesquisa.focus();
    });
  }
}

/* ============================================================
   FILTRO POR GÊNERO - EVENTO DE CLIQUE NOS LINKS DO ASIDE
   ============================================================ */
const generoLinks = document.querySelectorAll("aside ul li a");

// Adiciona evento de clique em cada link de gênero
generoLinks.forEach(link => {
  link.addEventListener("click", async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do link
    
    // Limpa o campo de pesquisa quando filtra por gênero
    const campoPesquisa = document.getElementById('campoPesquisa');
    const btnLimparPesquisa = document.getElementById('btnLimparPesquisa');
    if (campoPesquisa) {
      campoPesquisa.value = '';
      if (btnLimparPesquisa) {
        btnLimparPesquisa.style.display = 'none';
      }
    }
    
    // Obtém o texto do gênero clicado
    const generoEscolhido = e.target.textContent.trim();

    // Filtra os jogos que correspondem ao gênero selecionado
    const jogosFiltrados = dados.filter(
      jogo => jogo.genero.toLowerCase() === generoEscolhido.toLowerCase()
    );

    // Renderiza apenas os jogos do gênero selecionado
    await renderizarJogos(jogosFiltrados, generoEscolhido);
  });
});

/* ============================================================
   RENDERIZAÇÃO DA PÁGINA DE DETALHES DO JOGO
   Busca o ID na URL e exibe todas as informações do jogo
   ============================================================ */
const detalhesContainer = document.querySelector(".detalhes-item");
if (detalhesContainer) {
  // Obtém o ID do jogo da URL (ex: detalhes.html?id=1)
  const params = new URLSearchParams(window.location.search);
  const idNum = Number(params.get("id"));

  // Verifica se o ID é válido
  if (!isNaN(idNum)) {
    // Busca o jogo no array de dados pelo ID
    const jogo = dados.find(it => it.id === idNum);

    if (jogo) {
      // Renderiza o conteúdo principal do jogo com todas as informações
      detalhesContainer.innerHTML = `
        <div class="card-detalhes">
          <h2>${jogo.titulo}</h2>
          <div class="detalhes-imagem">
            <img src="${jogo.imagem_principal}" alt="${jogo.titulo}">
          </div>
          <div class="detalhes-conteudo">
            <div class="detalhes-descricao">
              <h3>Sobre o Jogo</h3>
              <p>${jogo.descricao}</p>
            </div>
            <div class="detalhes-informacoes">
              <h3>Informações</h3>
              <ul class="detalhes-list">
                ${jogo.id ? `<li><strong>ID:</strong> ${jogo.id}</li>` : ''}
                ${jogo.genero ? `<li><strong>Gênero:</strong> ${jogo.genero}</li>` : ''}
                ${jogo.plataforma ? `<li><strong>Plataforma:</strong> ${jogo.plataforma}</li>` : ''}
                ${jogo.lancamento ? `<li><strong>Ano de Lançamento:</strong> ${jogo.lancamento}</li>` : ''}
              </ul>
            </div>
          </div>
          <div class="detalhes-acoes">
            <a class="btn-voltar" href="index.html">← Voltar para a home</a>
          </div>
        </div>
      `;

      // Galeria de imagens secundárias (se existir no objeto jogo)
      if (jogo.imagens && jogo.imagens.length > 0) {
        const galeria = document.createElement("div");
        galeria.classList.add("galeria-imagens");
        galeria.innerHTML = "<h3>Galeria de Imagens</h3>";

        const galeriaContainer = document.createElement("div");
        galeriaContainer.classList.add("galeria-container");

        // Cria uma miniatura para cada imagem da galeria
        jogo.imagens.forEach(imgObj => {
          const imgCard = document.createElement("img");
          imgCard.src = imgObj.imagem;
          imgCard.alt = imgObj.titulo || jogo.titulo;
          imgCard.classList.add("galeria-item");

          // Ao clicar na miniatura, troca a imagem principal
          imgCard.addEventListener("click", () => {
            const imgPrincipal = detalhesContainer.querySelector(".detalhes-imagem img");
            if (imgPrincipal) {
              imgPrincipal.src = imgObj.imagem;
              imgPrincipal.alt = imgObj.titulo || jogo.titulo;
            }
          });

          galeriaContainer.appendChild(imgCard);
        });

        galeria.appendChild(galeriaContainer);
        detalhesContainer.appendChild(galeria);
      }

    } else {
      // Mensagem de erro se o jogo não for encontrado
      detalhesContainer.innerHTML = `
        <div class="card-detalhes">
          <h2>Jogo não encontrado</h2>
          <p>O jogo que você está procurando não foi encontrado.</p>
          <a class="btn-voltar" href="index.html">← Voltar para a home</a>
        </div>
      `;
    }
  } else {
    // Mensagem de erro se o ID for inválido
    detalhesContainer.innerHTML = `
      <div class="card-detalhes">
        <h2>ID inválido</h2>
        <p>Por favor, selecione um jogo válido para ver os detalhes.</p>
        <a class="btn-voltar" href="index.html">← Voltar para a home</a>
      </div>
    `;
  }
}

/* ============================================================
   CARROSSEL DE DESTAQUES NA PÁGINA INICIAL
   Exibe os primeiros 3 jogos como destaques no carrossel
   ============================================================ */
const carrosselInner = document.querySelector("#carrosselDestaques .carousel-inner");
if (carrosselInner) {
  // Seleciona os primeiros 3 jogos como destaques
  const destaques = dados.slice(0, 3);

  // Cria um item do carrossel para cada jogo destacado
  destaques.forEach((item) => {
    const divItem = document.createElement("div");
    divItem.classList.add("carousel-item");

    // HTML do item do carrossel com link para detalhes
    divItem.innerHTML = `
      <a href="detalhes.html?id=${item.id}">
        <img src="${item.imagem_principal}" class="d-block w-100" alt="${item.titulo}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${item.titulo}</h5>
          <p>${item.descricao}</p>
        </div>
      </a>
    `;

    // Adiciona o item ao carrossel
    carrosselInner.appendChild(divItem);
  });
}