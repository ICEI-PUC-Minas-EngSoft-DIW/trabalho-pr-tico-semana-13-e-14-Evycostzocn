/* ============================================================
   SISTEMA DE EXIBIÇÃO DE FAVORITOS
   ============================================================ */

// Dados dos jogos (mesmo array do app.js)
const dados = [
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
   FUNÇÃO PARA CARREGAR E EXIBIR FAVORITOS
   ============================================================ */

async function carregarFavoritos() {
    const favoritosGrid = document.getElementById('favoritosGrid');
    if (!favoritosGrid) return;
    
    // Verifica se o usuário está logado
    const usuario = getUsuarioLogado();
    if (!usuario) {
        favoritosGrid.innerHTML = `
            <div class="mensagem-vazia" style="width: 100%;">
                <i class="fa fa-lock"></i>
                <p>Você precisa estar logado para ver seus favoritos.</p>
                <a href="login.html" style="color: #9ccae3; text-decoration: none; font-weight: 600; margin-top: 20px; display: inline-block;">Fazer Login</a>
            </div>
        `;
        return;
    }
    
    // Busca os favoritos do usuário
    const favoritos = await obterFavoritosUsuario();
    
    if (favoritos.length === 0) {
        favoritosGrid.innerHTML = `
            <div class="mensagem-vazia" style="width: 100%;">
                <i class="fa fa-heart"></i>
                <p>Você ainda não tem jogos favoritos.</p>
                <a href="index.html" style="color: #9ccae3; text-decoration: none; font-weight: 600; margin-top: 20px; display: inline-block;">Explorar Jogos</a>
            </div>
        `;
        return;
    }
    
    // Filtra os jogos que estão nos favoritos
    const jogosFavoritos = dados.filter(jogo => favoritos.includes(jogo.id));
    
    // Limpa o grid
    favoritosGrid.innerHTML = '';
    
    // Renderiza cada jogo favorito
    jogosFavoritos.forEach(jogo => {
        const card = document.createElement('div');
        card.classList.add('favorito-card');
        card.innerHTML = `
            <a href="detalhes.html?id=${jogo.id}" class="card-link">
                <img src="${jogo.imagem_principal}" alt="${jogo.titulo}">
                <h4>${jogo.titulo}</h4>
                <p>${jogo.descricao}</p>
            </a>
            <button class="btn-remover-favorito" data-jogo-id="${jogo.id}" title="Remover dos favoritos">
                <i class="fa fa-heart"></i>
            </button>
        `;
        
        // Adiciona evento de clique no botão de remover
        const btnRemover = card.querySelector('.btn-remover-favorito');
        btnRemover.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const jogoId = parseInt(btnRemover.getAttribute('data-jogo-id'));
            const result = await toggleFavoritoUsuario(jogoId);
            
            if (result.success) {
                // Recarrega a lista de favoritos
                carregarFavoritos();
            } else {
                alert(result.message || 'Erro ao remover dos favoritos.');
            }
        });
        
        favoritosGrid.appendChild(card);
    });
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    carregarFavoritos();
});

