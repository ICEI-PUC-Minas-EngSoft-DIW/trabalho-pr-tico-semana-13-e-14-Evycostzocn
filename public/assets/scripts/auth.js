/* ============================================================
   SISTEMA DE AUTENTICAÇÃO E GERENCIAMENTO DE USUÁRIOS
   ============================================================ */

const API_USUARIOS = "http://localhost:3001/usuarios";
const API_FAVORITOS = "http://localhost:3001/usuarios"; // Usaremos o mesmo endpoint

/* ============================================================
   FUNÇÕES DE GERENCIAMENTO DE SESSÃO (SESSIONSTORAGE)
   ============================================================ */

/**
 * Obtém o usuário logado do sessionStorage
 */
function getUsuarioLogado() {
    const usuarioStr = sessionStorage.getItem('usuarioLogado');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
}

/**
 * Salva o usuário logado no sessionStorage
 */
function setUsuarioLogado(usuario) {
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
}

/**
 * Remove o usuário logado do sessionStorage (logout)
 */
function logout() {
    sessionStorage.removeItem('usuarioLogado');
    // Se estiver na página index, atualiza o aside antes de recarregar
    if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
        atualizarAsideLogin();
    }
    window.location.href = 'index.html';
}

/**
 * Verifica se há um usuário logado
 */
function isUsuarioLogado() {
    return getUsuarioLogado() !== null;
}

/* ============================================================
   FUNÇÕES DE AUTENTICAÇÃO (LOGIN E CADASTRO)
   ============================================================ */

/**
 * Realiza o login do usuário
 */
async function fazerLogin(login, senha) {
    try {
        const response = await fetch(API_USUARIOS);
        if (!response.ok) {
            throw new Error('Erro ao conectar com o servidor. Verifique se o JSON Server está rodando.');
        }
        
        const usuarios = await response.json();
        const usuario = usuarios.find(u => u.login === login && u.senha === senha);
        
        if (usuario) {
            // Remove a senha antes de salvar no sessionStorage
            const usuarioSemSenha = { ...usuario };
            delete usuarioSemSenha.senha;
            setUsuarioLogado(usuarioSemSenha);
            return { success: true, usuario: usuarioSemSenha };
        } else {
            return { success: false, message: 'Usuário ou senha incorretos.' };
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return { success: false, message: error.message || 'Erro ao fazer login. Tente novamente.' };
    }
}

/**
 * Realiza o cadastro de um novo usuário
 */
async function fazerCadastro(nome, login, senha) {
    try {
        // Verifica se o usuário já existe
        const response = await fetch(API_USUARIOS);
        if (!response.ok) {
            throw new Error('Erro ao conectar com o servidor. Verifique se o JSON Server está rodando.');
        }
        
        const usuarios = await response.json();
        const usuarioExistente = usuarios.find(u => u.login === login);
        
        if (usuarioExistente) {
            return { success: false, message: 'Este nome de usuário já está em uso. Escolha outro.' };
        }
        
        // Busca o maior ID para gerar o próximo
        const maiorId = usuarios.length > 0
            ? Math.max(...usuarios.map(u => Number(u.id) || 0))
            : 0;
        
        // Cria o novo usuário
        const novoUsuario = {
            id: (maiorId + 1).toString(),
            nome: nome,
            login: login,
            senha: senha,
            favoritos: []
        };
        
        // Faz o POST para criar o usuário
        const postResponse = await fetch(API_USUARIOS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoUsuario)
        });
        
        if (!postResponse.ok) {
            throw new Error('Erro ao cadastrar usuário.');
        }
        
        // Remove a senha antes de salvar no sessionStorage
        const usuarioSemSenha = { ...novoUsuario };
        delete usuarioSemSenha.senha;
        setUsuarioLogado(usuarioSemSenha);
        
        return { success: true, usuario: usuarioSemSenha };
    } catch (error) {
        console.error('Erro ao fazer cadastro:', error);
        return { success: false, message: error.message || 'Erro ao fazer cadastro. Tente novamente.' };
    }
}

/* ============================================================
   FUNÇÕES DE FAVORITOS (INTEGRADAS COM JSON SERVER)
   ============================================================ */

/**
 * Obtém os favoritos do usuário logado do JSON Server
 */
async function obterFavoritosUsuario() {
    const usuario = getUsuarioLogado();
    if (!usuario) {
        return [];
    }
    
    try {
        const response = await fetch(`${API_USUARIOS}/${usuario.id}`);
        if (!response.ok) {
            return [];
        }
        
        const usuarioCompleto = await response.json();
        return usuarioCompleto.favoritos || [];
    } catch (error) {
        console.error('Erro ao obter favoritos:', error);
        return [];
    }
}

/**
 * Adiciona ou remove um jogo dos favoritos do usuário
 */
async function toggleFavoritoUsuario(jogoId) {
    const usuario = getUsuarioLogado();
    if (!usuario) {
        return { success: false, message: 'Você precisa estar logado para favoritar jogos.' };
    }
    
    try {
        // Busca o usuário completo do servidor
        const response = await fetch(`${API_USUARIOS}/${usuario.id}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar dados do usuário.');
        }
        
        const usuarioCompleto = await response.json();
        let favoritos = usuarioCompleto.favoritos || [];
        
        // Verifica se o jogo já está nos favoritos
        const index = favoritos.indexOf(jogoId);
        let foiAdicionado = false;
        
        if (index > -1) {
            // Remove dos favoritos
            favoritos.splice(index, 1);
        } else {
            // Adiciona aos favoritos
            favoritos.push(jogoId);
            foiAdicionado = true;
        }
        
        // Atualiza o usuário no servidor
        const updateResponse = await fetch(`${API_USUARIOS}/${usuario.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...usuarioCompleto,
                favoritos: favoritos
            })
        });
        
        if (!updateResponse.ok) {
            throw new Error('Erro ao atualizar favoritos.');
        }
        
        // Atualiza o sessionStorage
        usuario.favoritos = favoritos;
        setUsuarioLogado(usuario);
        
        return { success: true, foiAdicionado: foiAdicionado, favoritos: favoritos };
    } catch (error) {
        console.error('Erro ao atualizar favoritos:', error);
        return { success: false, message: error.message || 'Erro ao atualizar favoritos.' };
    }
}

/**
 * Verifica se um jogo está nos favoritos do usuário logado
 */
async function isFavoritoUsuario(jogoId) {
    const usuario = getUsuarioLogado();
    if (!usuario) {
        return false;
    }
    
    // Primeiro tenta usar os favoritos do sessionStorage
    if (usuario.favoritos && Array.isArray(usuario.favoritos)) {
        return usuario.favoritos.includes(jogoId);
    }
    
    // Se não tiver no sessionStorage, busca do servidor
    const favoritos = await obterFavoritosUsuario();
    return favoritos.includes(jogoId);
}

/* ============================================================
   FUNÇÕES DE ATUALIZAÇÃO DO MENU
   ============================================================ */

/**
 * Atualiza o menu de navegação baseado no status de login
 */
function atualizarMenu() {
    const menu = document.querySelector('.menu');
    if (!menu) return;
    
    const usuario = getUsuarioLogado();
    
    // Remove itens de login/logout existentes
    const loginItem = menu.querySelector('li a[href="login.html"]');
    const logoutItem = menu.querySelector('li a[href="#logout"]');
    const favoritosItem = menu.querySelector('li a[href="favoritos.html"]');
    
    if (loginItem) loginItem.parentElement.remove();
    if (logoutItem) logoutItem.parentElement.remove();
    if (favoritosItem) favoritosItem.parentElement.remove();
    
    if (usuario) {
        // Usuário logado: mostra Favoritos e Logout
        const favoritosLi = document.createElement('li');
        favoritosLi.innerHTML = '<a href="favoritos.html">Favoritos</a>';
        menu.appendChild(favoritosLi);
        
        const logoutLi = document.createElement('li');
        logoutLi.innerHTML = `<a href="#logout" id="logoutLink">Logout (${usuario.nome})</a>`;
        menu.appendChild(logoutLi);
        
        // Adiciona evento de logout
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    } else {
        // Usuário não logado: mostra Login
        const loginLi = document.createElement('li');
        loginLi.innerHTML = '<a href="login.html">Login</a>';
        menu.appendChild(loginLi);
    }
}

/* ============================================================
   EVENTOS DE FORMULÁRIO (LOGIN E CADASTRO)
   ============================================================ */

// Formulário de Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const errorMessage = document.getElementById('errorMessage');
        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;
        
        const result = await fazerLogin(login, senha);
        
        if (result.success) {
            window.location.href = 'index.html';
        } else {
            if (errorMessage) {
                errorMessage.textContent = result.message;
                errorMessage.classList.add('show');
            } else {
                alert(result.message);
            }
        }
    });
}

// Formulário de Cadastro
const cadastroForm = document.getElementById('cadastroForm');
if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        const nome = document.getElementById('nome').value;
        const login = document.getElementById('login').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        
        // Validação de senhas
        if (senha !== confirmarSenha) {
            if (errorMessage) {
                errorMessage.textContent = 'As senhas não coincidem.';
                errorMessage.classList.add('show');
            } else {
                alert('As senhas não coincidem.');
            }
            return;
        }
        
        if (errorMessage) errorMessage.classList.remove('show');
        if (successMessage) successMessage.classList.remove('show');
        
        const result = await fazerCadastro(nome, login, senha);
        
        if (result.success) {
            if (successMessage) {
                successMessage.textContent = 'Cadastro realizado com sucesso! Redirecionando...';
                successMessage.classList.add('show');
            }
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            if (errorMessage) {
                errorMessage.textContent = result.message;
                errorMessage.classList.add('show');
            } else {
                alert(result.message);
            }
        }
    });
}

/* ============================================================
   FUNÇÕES DE ATUALIZAÇÃO DO ASIDE (FORMULÁRIO DE LOGIN)
   ============================================================ */

/**
 * Atualiza o formulário de login no aside baseado no status de login
 */
function atualizarAsideLogin() {
    const loginAsideForm = document.getElementById('loginAsideForm');
    if (!loginAsideForm) return;
    
    const usuario = getUsuarioLogado();
    
    if (usuario) {
        // Usuário logado: esconde o formulário
        loginAsideForm.classList.add('hidden');
    } else {
        // Usuário não logado: mostra o formulário
        loginAsideForm.classList.remove('hidden');
    }
}

/**
 * Processa o login do formulário no aside
 */
function processarLoginAside(login, senha) {
    return fazerLogin(login, senha);
}

/* ============================================================
   INICIALIZAÇÃO
   ============================================================ */

// Atualiza o menu quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    atualizarMenu();
    atualizarAsideLogin();
    
    // Adiciona evento ao formulário de login do aside
    const loginAsideForm = document.getElementById('loginAsideForm');
    if (loginAsideForm) {
        loginAsideForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const errorMessage = document.getElementById('errorMessageAside');
            const login = document.getElementById('loginAside').value;
            const senha = document.getElementById('senhaAside').value;
            
            const result = await processarLoginAside(login, senha);
            
            if (result.success) {
                // Limpa o formulário
                loginAsideForm.reset();
                if (errorMessage) {
                    errorMessage.classList.remove('show');
                }
                
                // Atualiza o menu e o aside
                atualizarMenu();
                atualizarAsideLogin();
                
                // Recarrega a página para atualizar os favoritos nos cards e o aside
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            } else {
                if (errorMessage) {
                    errorMessage.textContent = result.message;
                    errorMessage.classList.add('show');
                } else {
                    alert(result.message);
                }
            }
        });
    }
});

