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
                        '#3608daff',
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

