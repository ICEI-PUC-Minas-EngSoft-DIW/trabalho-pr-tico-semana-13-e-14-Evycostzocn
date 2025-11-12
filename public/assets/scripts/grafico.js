// ====== FUNÇÃO PARA CARREGAR OS DADOS DO JSON ========
async function carregarJogos() {
    try {

        // URL do json-server ou caminho local do db.json
        const resposta = await fetch('http://localhost:3001/jogos');
        const jogos = await resposta.json();

        // ======= CONTAGEM DE GÊNEROS =======
        const contagemGeneros = {};
        jogos.forEach(jogo => {
            contagemGeneros[jogo.genero] = (contagemGeneros[jogo.genero] || 0) + 1;

        });

        const generos = Object.keys(contagemGeneros);
        const quantidades = Object.values(contagemGeneros);

        // ======= CRIAÇÃO DO GRÁFICO ========

        const ctx = document.getElementById('graficoGenero');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: generos,
                datasets: [{
                    label: 'Distribuição por gênero',
                    data: quantidades,
                    borderWidth: 1,
                    backgroundColor: [
                        '#024f83ff',
                        '#0e1de9ff',
                        '#991d1dff',
                        '#0a3002ff',
                        '#8f5af8ff'
                    ]
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: { color: 'white', font: { size: 14 } }
                    },
                    title: {
                        display: true,
                        text: 'Distribuição de Jogos por gênero',
                        color: 'white',
                        font: { size: 18 }
                    }
                }
            }
        });

    } catch (erro) {
        console.error("Erro ao carregar dados do JSON:", erro);
    }
}

carregarJogos();


// ======== MAPBOX =========
mapboxgl.accessToken = 'pk.eyJ1IjoiZXZ5Y29zdHpvY24iLCJhIjoiY21odmVoZjN5MGFtMDJscHFmN2NxeWR2MiJ9.Ctfp8NEnRIPRTGqKdGe_Kg';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [0, 20],
    zoom: 1.2
});

// FUNÇÃO PARA ADICIONAR MARCADORES NO MAPA

async function carregarMapa() {
    try {
        const resposta = await fetch('http://localhost:3001/jogos');
        const jogos = await resposta.json();

        // DICIONARIO BASICO DE PAISES COM COORDENADAS APROXIMADAS
        const coordenadas = {
            "Estados Unidos": [-98.35, 39.50],
            "Japão": [138.25, 36.20],
            "Canadá": [-106.35, 56.13],
            "Brasil": [-51.9253, -14.235],
            "Reino Unido": [-3.4360, 55.3781],
            "França": [2.2137, 46.2276],
            "Alemanha": [10.4515, 51.1657],
            "Polônia": [19.1451, 51.9194]
        };

        jogos.forEach(jogo => {
            const coords = coordenadas[jogo.pais];
            if (coords) {
                new mapboxgl.Marker()
                    .setLngLat(coords)
                    .setPopup(new mapboxgl.Popup().setHTML(`<strong>${jogo.nome}</strong><br>${jogo.pais}`))
                    .addTo(map);
            }
        });
    } catch (erro) {
        console.error("Erro ao carregar o mapa:", erro);
    }
}

carregarMapa();
