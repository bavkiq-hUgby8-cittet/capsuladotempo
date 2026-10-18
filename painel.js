/*
 * Painel do guardião.
 * Lista os eventos já gravados (inclusive os de 2025, sem operadorId).
 * Liberar ou lacrar só muda uma trava. Cartas, fotos e áudios não são reescritos.
 */
var SENHA_GUARDIAO = 'otacilia';

var firebaseConfig = {
    apiKey: 'AIzaSyB2cNiBL1SU_QfjH_S_QGv_KSiFoocfqd4',
    authDomain: 'capsuladotempo-f86bf.firebaseapp.com',
    databaseURL: 'https://capsuladotempo-f86bf-default-rtdb.firebaseio.com',
    projectId: 'capsuladotempo-f86bf',
    storageBucket: 'capsuladotempo-f86bf.firebasestorage.app',
    messagingSenderId: '43014678980',
    appId: '1:43014678980:web:0c84f48037ee6924afdc91'
};

var database = null;
var eventsData = {};
var capsulesData = {};
var previousCapsules = {};
var firstLoad = true;
var dadosProntos = false;
var currentEventLink = '';
var capsuleToRelease = null;
var currentManagerEvent = null;
var cerimoniaTimer = null;
var avisoStorageMostrado = false;
var escutasIniciadas = false;

function ensaioAtivo() {
    return CapsulaLogica.ehEnsaio();
}

function agora() {
    return CapsulaLogica.obterAgora();
}

function paramsEnsaio(extra) {
    var params = Object.assign({}, extra || {});
    if (ensaioAtivo()) params.ensaio = '1';
    return params;
}

function createAtmosphere() {
    var container = document.getElementById('atmosphere');
    if (!container || container.childElementCount) return;
    for (var i = 0; i < 40; i++) {
        var star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        var size = 1 + Math.random() * 2;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.animationDelay = Math.random() * 4 + 's';
        star.style.animationDuration = (3 + Math.random() * 2) + 's';
        container.appendChild(star);
    }
}

function showToast(message, type) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show' + (type === 'error' ? ' error' : '');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () { toast.className = 'toast'; }, 3600);
}

function createConfetti() {
    var container = document.getElementById('confetti');
    container.replaceChildren();
    var colors = ['#d4af37', '#f4d03f', '#e67e22', '#27ae60', '#fff', '#ff6b6b'];
    for (var i = 0; i < 80; i++) {
        var confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 1.2 + 's';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        container.appendChild(confetti);
    }
    setTimeout(function () { container.replaceChildren(); }, 4500);
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    if (id === 'managerModal') currentManagerEvent = null;
}

function handleLogin(event) {
    event.preventDefault();
    var senha = document.getElementById('guardiaoSenha').value;
    var error = document.getElementById('loginError');
    error.classList.remove('show');
    if (senha.trim().toLowerCase() === SENHA_GUARDIAO) {
        sessionStorage.setItem('capsulaGuardiaoOk', '1');
        entrar();
        return;
    }
    error.textContent = 'Senha incorreta.';
    error.classList.add('show');
}

function handleLogout() {
    sessionStorage.removeItem('capsulaGuardiaoOk');
    location.reload();
}

function entrar() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('app').classList.add('active');
    document.getElementById('userName').textContent = 'Guardião';
    document.getElementById('userAvatar').textContent = 'G';
    var sugerida = sugerirDiaAbertura();
    var campoData = document.getElementById('eventDate');
    if (campoData && !campoData.value) campoData.value = sugerida;
    iniciarDados();
}

function sugerirDiaAbertura() {
    var natal = new Date('2026-12-25T15:00:00.000Z');
    if (new Date() < natal) return '2026-12-25';
    return (new Date().getFullYear() + 1) + '-12-25';
}

function iniciarDados() {
    if (escutasIniciadas) return;
    escutasIniciadas = true;
    if (ensaioAtivo()) {
        var dados = CapsulaLogica.dadosEnsaio();
        eventsData = dados.eventos;
        capsulesData = dados.capsulas;
        dadosProntos = true;
        firstLoad = false;
        renderEvents();
        return;
    }
    if (typeof firebase === 'undefined') {
        showToast('Não foi possível carregar o Firebase. Verifique a internet.', 'error');
        return;
    }
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    database.ref('eventos').on('value', function (snapshot) {
        eventsData = snapshot.val() || {};
        dadosProntos = true;
        renderEvents();
        if (currentManagerEvent) renderCapsuleManager(currentManagerEvent);
    }, function () {
        showToast('Não foi possível ler os eventos. Nada foi alterado.', 'error');
    });
    database.ref('capsulas').on('value', function (snapshot) {
        var novas = snapshot.val() || {};
        var enxutas = {};
        Object.keys(novas).forEach(function (id) {
            var cap = novas[id];
            if (!cap || typeof cap !== 'object') return;
            var copia = Object.assign({}, cap);
            copia.temAudio = Boolean(copia.audioBase64 || copia.audioUrl || copia.audio);
            delete copia.audioBase64;
            enxutas[id] = copia;
        });
        if (!firstLoad) {
            Object.keys(enxutas).forEach(function (id) {
                var cap = enxutas[id];
                if (!previousCapsules[id] && cap.nome) showNotification(cap, 'lacrou');
                else if (previousCapsules[id] && !previousCapsules[id].aberta && cap.aberta) showNotification(cap, 'abriu');
            });
        }
        previousCapsules = enxutas;
        capsulesData = enxutas;
        firstLoad = false;
        dadosProntos = true;
        renderEvents();
        if (currentManagerEvent) renderCapsuleManager(currentManagerEvent);
    }, function () {
        showToast('Não foi possível ler as cápsulas. Nada foi alterado.', 'error');
    });
}

function capsulasDoEvento(eventoId) {
    return Object.keys(capsulesData).filter(function (id) {
        return capsulesData[id] && capsulesData[id].eventoId === eventoId;
    }).map(function (id) {
        return Object.assign({ id: id }, capsulesData[id]);
    });
}

function eventoDestaque() {
    var melhor = null;
    var pontuacao = -1;
    Object.keys(eventsData).forEach(function (id) {
        var evento = eventsData[id] || {};
        var quantidade = capsulasDoEvento(id).length;
        var natal = /natal/i.test(evento.nome || '');
        var pontos = quantidade + (natal ? 100 : 0);
        if (pontos > pontuacao) {
            pontuacao = pontos;
            melhor = id;
        }
    });
    return melhor;
}

function renderEvents() {
    var grid = document.getElementById('eventsGrid');
    if (!dadosProntos) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-icon">⏳</div><h3 class="empty-title">Carregando eventos…</h3></div>';
        return;
    }
    var ids = Object.keys(eventsData);
    if (!ids.length) {
        grid.innerHTML = '<div class="empty-state"><div class="empty-icon">📦</div><h3 class="empty-title">Nenhum evento ainda</h3><p class="empty-text">Crie um evento para começar. Os eventos já guardados aparecem aqui.</p></div>';
        return;
    }
    var destaque = eventoDestaque();
    ids.sort(function (a, b) {
        var ea = eventsData[a] || {};
        var eb = eventsData[b] || {};
        if (a === destaque) return -1;
        if (b === destaque) return 1;
        if (!!ea.arquivado !== !!eb.arquivado) return ea.arquivado ? 1 : -1;
        return (CapsulaLogica.parseDataAbertura(eb.dataCriacao || eb.criadoEm) || 0) - (CapsulaLogica.parseDataAbertura(ea.dataCriacao || ea.criadoEm) || 0);
    });
    grid.innerHTML = ids.map(function (id) {
        return htmlEvento(id, eventsData[id] || {}, id === destaque);
    }).join('');
}

function htmlEvento(id, evento, destaque) {
    var capsulas = capsulasDoEvento(id);
    var liberadas = capsulas.filter(function (c) { return c.liberada; }).length;
    var abertas = capsulas.filter(function (c) { return c.aberta; }).length;
    var status = CapsulaLogica.statusAbertura({ dataAbertura: evento.dataAbertura, liberada: false, aberta: false }, null, agora());
    var quando = CapsulaLogica.formatarDataHoraBR(evento.dataAbertura);
    var e = CapsulaLogica.escapeHtml;
    var fotos = capsulas.slice(0, 5).map(function (c) {
        var nome = ((c.nome || '') + ' ' + (c.sobrenome || '')).trim();
        return '<div class="participant-avatar">' + CapsulaLogica.htmlFoto(c.foto, nome) + '</div>';
    }).join('');
    if (capsulas.length > 5) {
        fotos += '<div class="participant-avatar participant-more">+' + (capsulas.length - 5) + '</div>';
    }
    var acoes = evento.arquivado
        ? botao('cerimonia', id, 'event-btn open', '🎊 Cerimônia de abertura') + botao('gerenciar', id, 'event-btn manage largo', '⚙️ Gerenciar')
        : botao('qr', id, 'event-btn qr', '📱 QR Code') + botao('gerenciar', id, 'event-btn manage', '⚙️ Gerenciar') + botao('lacrar', id, 'event-btn archive', '🔒 Lacrar evento');
    return '<article class="event-card' + (evento.arquivado ? ' archived' : '') + (destaque ? ' destaque' : '') + '">' +
        '<div class="event-header">' +
            '<div class="event-status ' + (evento.arquivado ? 'archived' : 'active') + '">' + (evento.arquivado ? '📁 Lacrado' : '✨ Recebendo cápsulas') + '</div>' +
            '<h3 class="event-name">' + e(evento.nome || 'Evento') + '</h3>' +
            '<div class="event-date">📅 ' + e(quando) + ' · Brasília</div>' +
            (status.estado === 'data' ? '<p class="event-note">A data de abertura já chegou. A cerimônia não apaga nenhuma carta.</p>' : '') +
            (destaque ? '<p class="event-note">Evento com as memórias já guardadas. Abrir só remove a trava.</p>' : '') +
        '</div>' +
        '<div class="event-body">' +
            '<div class="event-stats">' +
                stat(capsulas.length, 'Cápsulas') + stat(liberadas, 'Liberadas') + stat(abertas, 'Abertas') +
            '</div>' +
            (fotos ? '<div class="event-participants">' + fotos + '</div>' : '') +
            '<div class="event-actions">' + acoes + '</div>' +
        '</div></article>';
}

function stat(valor, rotulo) {
    return '<div class="stat-item"><div class="stat-value">' + valor + '</div><div class="stat-label">' + rotulo + '</div></div>';
}

function botao(acao, id, classe, rotulo) {
    return '<button type="button" class="' + classe + '" data-acao="' + acao + '" data-id="' + CapsulaLogica.escapeHtml(id) + '">' + rotulo + '</button>';
}

function onGridClick(event) {
    var botaoClicado = event.target.closest('[data-acao]');
    if (!botaoClicado || !document.getElementById('eventsGrid').contains(botaoClicado)) return;
    executarAcao(botaoClicado.dataset.acao, botaoClicado.dataset.id);
}

function executarAcao(acao, id) {
    if (acao === 'qr') showQR(id);
    else if (acao === 'gerenciar') openManager(id);
    else if (acao === 'lacrar') iniciarCerimoniaFechamento(id);
    else if (acao === 'cerimonia') iniciarCerimoniaAbertura(id);
    else if (acao === 'liberar') requestRelease(id);
    else if (acao === 'ver') viewCapsule(id);
    else if (acao === 'copiar') copiarTexto(CapsulaLogica.linkPagina('capsula.html', paramsEnsaio({ id: id })));
}

async function createEvent(event) {
    event.preventDefault();
    var nome = document.getElementById('eventName').value.trim();
    var dia = document.getElementById('eventDate').value;
    if (!nome || !dia) return;
    var dataAbertura = CapsulaLogica.dataAberturaDoDia(dia);
    if (!dataAbertura) {
        showToast('Data de abertura inválida.', 'error');
        return;
    }
    var eventId = 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 11);
    var novo = {
        nome: nome,
        dataAbertura: dataAbertura,
        dataCriacao: new Date().toISOString(),
        arquivado: false
    };
    try {
        if (ensaioAtivo()) {
            CapsulaLogica.marcarEnsaioEvento(eventId, novo);
            eventsData[eventId] = novo;
        } else {
            await database.ref('eventos/' + eventId).set(novo);
        }
        document.getElementById('eventName').value = '';
        showToast('Evento criado. As cápsulas antigas não foram modificadas.');
        createConfetti();
        if (ensaioAtivo()) renderEvents();
    } catch (erro) {
        console.error(erro);
        showToast('Erro ao criar evento. Nada foi apagado.', 'error');
    }
}

function showQR(eventId) {
    var evento = eventsData[eventId];
    if (!evento) return;
    currentEventLink = CapsulaLogica.linkPagina('jogador.html', paramsEnsaio({ evento: eventId }));
    var alvo = document.getElementById('qrCode');
    alvo.innerHTML = '';
    try {
        new QRCode(alvo, {
            text: currentEventLink,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    } catch (erro) {
        alvo.textContent = 'Não foi possível gerar o QR Code. Use o link abaixo.';
    }
    document.getElementById('qrLink').textContent = currentEventLink;
    document.getElementById('qrModal').classList.add('active');
}

function copyEventLink() {
    copiarTexto(currentEventLink);
}

function copiarTexto(texto) {
    if (!texto) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(function () {
            showToast('Link copiado.');
        }).catch(function () { copiarPorSelecao(texto); });
    } else {
        copiarPorSelecao(texto);
    }
}

function copiarPorSelecao(texto) {
    var input = document.createElement('textarea');
    input.value = texto;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast('Link copiado.');
}

function openManager(eventId) {
    currentManagerEvent = eventId;
    renderCapsuleManager(eventId);
    document.getElementById('managerModal').classList.add('active');
}

function renderCapsuleManager(eventId) {
    var container = document.getElementById('capsuleManager');
    var evento = eventsData[eventId];
    if (!evento) {
        container.innerHTML = '<p class="empty-text">Evento não encontrado.</p>';
        return;
    }
    var capsulas = capsulasDoEvento(eventId);
    var liberadas = capsulas.filter(function (c) { return c.liberada; }).length;
    var abertas = capsulas.filter(function (c) { return c.aberta; }).length;
    var e = CapsulaLogica.escapeHtml;
    var lista = capsulas.length ? '<div class="capsules-grid">' + capsulas.map(htmlCapsula).join('') + '</div>'
        : '<div class="empty-state" style="padding:32px 0"><div class="empty-icon">📭</div><p class="empty-text">Nenhuma cápsula ainda.</p></div>';
    container.innerHTML =
        '<div class="manager-header">' +
            '<h2 class="manager-title">' + e(evento.nome || 'Evento') + '</h2>' +
            '<p style="color: var(--text-secondary);">Abertura: ' + e(CapsulaLogica.formatarDataHoraBR(evento.dataAbertura)) + ' (Brasília)</p>' +
            '<p class="event-note">Liberar só muda a trava. A carta, a foto e o áudio permanecem como foram guardados.</p>' +
            '<div class="manager-stats">' + stat(capsulas.length, 'Total') + stat(liberadas, 'Liberadas') + stat(abertas, 'Abertas') + '</div>' +
            '<div class="manager-actions">' +
                '<button type="button" class="btn-primary" data-acao="liberar-todas" data-id="' + e(eventId) + '">🔓 Liberar todas</button>' +
                '<button type="button" class="btn-secondary" data-acao="cerimonia" data-id="' + e(eventId) + '">🎊 Ver cerimônia</button>' +
            '</div>' +
        '</div>' + lista;
}

function htmlCapsula(cap) {
    var e = CapsulaLogica.escapeHtml;
    var nome = ((cap.nome || '') + ' ' + (cap.sobrenome || '')).trim() || 'Sem nome';
    var classe = cap.aberta ? 'opened' : (cap.liberada ? 'released' : '');
    var status = cap.aberta ? 'Aberta' : (cap.liberada ? 'Liberada' : 'Aguardando');
    var desejos = (cap.desejos || []).slice(0, 3).map(function (d) {
        return '<span class="capsule-tag">' + e(d) + '</span>';
    }).join('');
    var acao = cap.aberta
        ? botao('ver', cap.id, 'capsule-btn view', '👁️ Ver')
        : '<button type="button" class="capsule-btn release" data-acao="liberar" data-id="' + e(cap.id) + '"' + (cap.liberada ? ' disabled' : '') + '>' + (cap.liberada ? 'Já liberada' : '🔓 Liberar') + '</button>';
    return '<div class="capsule-card ' + classe + '">' +
        '<div class="capsule-photo">' + CapsulaLogica.htmlFoto(cap.foto, nome) + '</div>' +
        '<div class="capsule-name">' + e(nome) + '</div>' +
        '<div class="capsule-status ' + classe + '">' + status + (cap.temAudio || cap.audioUrl || cap.audio ? ' · 🎤' : '') + '</div>' +
        (desejos ? '<div class="capsule-tags">' + desejos + '</div>' : '') +
        acao +
    '</div>';
}

function onManagerClick(event) {
    var botaoClicado = event.target.closest('[data-acao]');
    if (!botaoClicado) return;
    if (botaoClicado.dataset.acao === 'liberar-todas') {
        releaseAll(botaoClicado.dataset.id);
        return;
    }
    executarAcao(botaoClicado.dataset.acao, botaoClicado.dataset.id);
}

function requestRelease(capsuleId) {
    var cap = capsulesData[capsuleId];
    if (!cap || cap.liberada || cap.aberta) return;
    capsuleToRelease = capsuleId;
    document.getElementById('releasePassword').value = '';
    document.getElementById('passwordModal').classList.add('active');
    setTimeout(function () { document.getElementById('releasePassword').focus(); }, 50);
}

async function confirmRelease(event) {
    if (event && event.preventDefault) event.preventDefault();
    var senha = document.getElementById('releasePassword').value;
    if (senha.trim().toLowerCase() !== SENHA_GUARDIAO) {
        showToast('Senha incorreta.', 'error');
        return;
    }
    if (!capsuleToRelease) return;
    try {
        await definirLiberada(capsuleToRelease);
        closeModal('passwordModal');
        showToast('Cápsula liberada. O conteúdo continua intacto.');
        createConfetti();
        if (currentManagerEvent) renderCapsuleManager(currentManagerEvent);
        renderEvents();
    } catch (erro) {
        console.error(erro);
        showToast('Não foi possível liberar. A cápsula não foi alterada.', 'error');
    }
}

async function releaseAll(eventId) {
    var senha = prompt('Digite a senha do guardião para liberar todas as cápsulas deste evento:');
    if (senha == null) return;
    if (senha.trim().toLowerCase() !== SENHA_GUARDIAO) {
        showToast('Senha incorreta.', 'error');
        return;
    }
    var pendentes = capsulasDoEvento(eventId).filter(function (c) { return !c.liberada; });
    try {
        for (var i = 0; i < pendentes.length; i++) {
            await definirLiberada(pendentes[i].id);
        }
        showToast(pendentes.length + ' cápsula(s) liberada(s). Nenhuma carta foi reescrita.');
        createConfetti();
        renderCapsuleManager(eventId);
        renderEvents();
    } catch (erro) {
        console.error(erro);
        showToast('A liberação parou no meio. As que já tinham sido liberadas continuam liberadas; o resto não mudou.', 'error');
    }
}

async function definirLiberada(id) {
    if (!capsulesData[id]) return;
    if (ensaioAtivo()) {
        CapsulaLogica.marcarEnsaioCapsula(id, { liberada: true });
        capsulesData[id].liberada = true;
        return;
    }
    await database.ref('capsulas/' + id + '/liberada').set(true);
}

function viewCapsule(capsuleId) {
    window.open(CapsulaLogica.linkPagina('capsula.html', paramsEnsaio({ id: capsuleId })), '_blank', 'noopener');
}

async function iniciarCerimoniaFechamento(eventoId) {
    var evento = eventsData[eventoId];
    if (!evento || evento.arquivado) return;
    var capsulas = capsulasDoEvento(eventoId);
    var nome = evento.nome || 'este evento';
    if (!confirm('Lacrar "' + nome + '"?\n\nNovas cápsulas deixam de ser aceitas. As ' + capsulas.length + ' já guardadas permanecem, com carta, foto e áudio.')) return;
    abrirOverlay('cerimoniaFechamento');
    document.getElementById('fechamentoTitulo').textContent = 'Lacrando ' + nome;
    montarAvatares('avataresFechamento', capsulas);
    montarPalavras('nuvemFechamento', capsulas);
    animarContador('contadorFechamento', capsulas.length);
    try {
        if (ensaioAtivo()) {
            CapsulaLogica.marcarEnsaioEvento(eventoId, { arquivado: true });
            eventsData[eventoId].arquivado = true;
        } else {
            await database.ref('eventos/' + eventoId + '/arquivado').set(true);
        }
        showToast('Evento lacrado. As cápsulas continuam guardadas.');
        renderEvents();
    } catch (erro) {
        console.error(erro);
        showToast('Não foi possível lacrar. Nenhuma cápsula foi apagada.', 'error');
    }
}

function fecharCerimoniaFechamento() {
    document.getElementById('cerimoniaFechamento').classList.remove('active');
}

function iniciarCerimoniaAbertura(eventoId) {
    var evento = eventsData[eventoId];
    var capsulas = capsulasDoEvento(eventoId);
    if (!evento) return;
    if (!capsulas.length) {
        showToast('Este evento ainda não tem cápsulas.', 'error');
        return;
    }
    clearTimeout(cerimoniaTimer);
    document.getElementById('aberturaTitulo').textContent = evento.nome || 'Hora de abrir';
    document.getElementById('aberturaQuando').textContent = CapsulaLogica.formatarDataHoraBR(evento.dataAbertura) + ' · horário de Brasília';
    document.getElementById('statCapsulas').textContent = String(capsulas.length);
    var desejos = capsulas.reduce(function (soma, c) { return soma + ((c.desejos && c.desejos.length) || 0); }, 0);
    var letras = capsulas.reduce(function (soma, c) { return soma + CapsulaLogica.mensagemDaCapsula(c).length; }, 0);
    document.getElementById('statDesejos').textContent = String(desejos);
    document.getElementById('statChars').textContent = letras.toLocaleString('pt-BR');
    montarAvatares('avataresVoando', capsulas);
    montarPalavras('palavrasVoando', capsulas);
    abrirOverlay('cerimoniaAbertura');
    createConfetti();
    var seguir = document.getElementById('btnSeguirAbertura');
    seguir.onclick = function () { encerrarCerimoniaAbertura(eventoId); };
    cerimoniaTimer = setTimeout(function () { encerrarCerimoniaAbertura(eventoId); }, 20000);
}

function encerrarCerimoniaAbertura(eventoId) {
    clearTimeout(cerimoniaTimer);
    fecharCerimoniaAbertura();
    if (eventoId) openManager(eventoId);
}

function fecharCerimoniaAbertura() {
    clearTimeout(cerimoniaTimer);
    document.getElementById('cerimoniaAbertura').classList.remove('active');
}

function abrirOverlay(id) {
    document.getElementById(id).classList.add('active');
}

function montarAvatares(containerId, capsulas) {
    var container = document.getElementById(containerId);
    container.replaceChildren();
    capsulas.forEach(function (cap, indice) {
        var item = document.createElement('div');
        item.className = 'avatar-voador';
        item.style.animationDelay = (indice * 0.15) + 's';
        var nome = ((cap.nome || '') + ' ' + (cap.sobrenome || '')).trim();
        item.innerHTML = CapsulaLogica.htmlFoto(cap.foto, nome) + '<span>' + CapsulaLogica.escapeHtml(cap.nome || '') + '</span>';
        container.appendChild(item);
    });
}

function montarPalavras(containerId, capsulas) {
    var container = document.getElementById(containerId);
    container.replaceChildren();
    var contagem = {};
    capsulas.forEach(function (cap) {
        (cap.desejos || []).forEach(function (desejo) {
            contagem[desejo] = (contagem[desejo] || 0) + 1;
        });
        if (cap.perguntas && cap.perguntas.palavra) {
            contagem[cap.perguntas.palavra] = (contagem[cap.perguntas.palavra] || 0) + 1;
        }
    });
    Object.keys(contagem).sort(function (a, b) { return contagem[b] - contagem[a]; }).slice(0, 12).forEach(function (palavra, indice) {
        var el = document.createElement('span');
        el.className = 'palavra-voando';
        el.textContent = palavra;
        el.style.animationDelay = (indice * 0.35) + 's';
        el.style.fontSize = (1 + Math.min(contagem[palavra], 4) * 0.18) + 'rem';
        container.appendChild(el);
    });
}

function animarContador(id, total) {
    var el = document.getElementById(id);
    var atual = 0;
    el.textContent = '0';
    var timer = setInterval(function () {
        atual += 1;
        el.textContent = String(Math.min(atual, total));
        if (atual >= total) clearInterval(timer);
    }, 160);
}

function openSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '<p class="empty-text">Digite pelo menos 2 letras.</p>';
    document.getElementById('searchModal').classList.add('active');
    setTimeout(function () { document.getElementById('searchInput').focus(); }, 50);
}

function searchCapsules() {
    var query = document.getElementById('searchInput').value.toLowerCase().trim();
    var results = document.getElementById('searchResults');
    if (query.length < 2) {
        results.innerHTML = '<p class="empty-text">Digite pelo menos 2 letras.</p>';
        return;
    }
    var found = Object.keys(capsulesData).filter(function (id) {
        var cap = capsulesData[id];
        return ((cap.nome || '') + ' ' + (cap.sobrenome || '')).toLowerCase().indexOf(query) !== -1;
    }).slice(0, 12);
    if (!found.length) {
        results.innerHTML = '<p class="empty-text">Nenhuma cápsula encontrada.</p>';
        return;
    }
    results.innerHTML = found.map(function (id) {
        var cap = capsulesData[id];
        var nome = ((cap.nome || '') + ' ' + (cap.sobrenome || '')).trim();
        var evento = (eventsData[cap.eventoId] && eventsData[cap.eventoId].nome) || 'Evento';
        return '<div class="search-item">' +
            '<div class="participant-avatar">' + CapsulaLogica.htmlFoto(cap.foto, nome) + '</div>' +
            '<div style="flex:1"><strong>' + CapsulaLogica.escapeHtml(nome) + '</strong><div class="event-date">' + CapsulaLogica.escapeHtml(evento) + '</div></div>' +
            botao('copiar', id, 'btn-secondary', 'Copiar link') +
        '</div>';
    }).join('');
}

function onSearchClick(event) {
    var botaoClicado = event.target.closest('[data-acao]');
    if (!botaoClicado) return;
    executarAcao(botaoClicado.dataset.acao, botaoClicado.dataset.id);
}

function showNotification(capsule, action) {
    var notif = document.getElementById('notification');
    document.getElementById('notifPhoto').innerHTML = CapsulaLogica.htmlFoto(capsule.foto, capsule.nome || '');
    document.getElementById('notifName').textContent = ((capsule.nome || '') + ' ' + (capsule.sobrenome || '')).trim();
    document.getElementById('notifAction').textContent = action === 'lacrou' ? 'lacrou uma cápsula' : 'abriu a cápsula';
    var tags = document.getElementById('notifTags');
    tags.innerHTML = (capsule.desejos || []).slice(0, 5).map(function (d) {
        return '<span class="notif-tag">' + CapsulaLogica.escapeHtml(d) + '</span>';
    }).join('');
    notif.classList.add('active');
    createConfetti();
    setTimeout(function () { notif.classList.remove('active'); }, 6000);
}

function mostrarAvisoStorage() {
    if (avisoStorageMostrado || ensaioAtivo()) return;
    avisoStorageMostrado = true;
    var banner = document.getElementById('storageBanner');
    if (!banner) return;
    banner.hidden = false;
    banner.textContent = 'As fotos não carregaram. A cobrança do Firebase Storage do projeto capsuladotempo-f86bf está desativada, então os arquivos da nuvem não abrem. As cartas e os áudios guardados dentro da cápsula continuam. Reative a cobrança antes do Natal para as fotos voltarem. Nada foi apagado daqui.';
}

document.addEventListener('DOMContentLoaded', function () {
    CapsulaLogica.injetarEstiloBase();
    createAtmosphere();
    if (ensaioAtivo()) {
        CapsulaLogica.montarBannerEnsaio({
            onSimular: function () {
                CapsulaLogica.definirAgoraSimulado('2026-12-25T15:00:01.000Z');
                location.reload();
            },
            onLimpar: function () {
                CapsulaLogica.limparEnsaio();
                location.reload();
            }
        });
    }
    document.getElementById('eventsGrid').addEventListener('click', onGridClick);
    document.getElementById('capsuleManager').addEventListener('click', onManagerClick);
    document.getElementById('searchResults').addEventListener('click', onSearchClick);
    document.addEventListener('capsula-foto-falhou', mostrarAvisoStorage);
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(function (modal) { modal.classList.remove('active'); });
            fecharCerimoniaFechamento();
            fecharCerimoniaAbertura();
            currentManagerEvent = null;
        }
    });
    document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) overlay.classList.remove('active');
        });
    });
    var status = document.getElementById('authStatus');
    status.className = 'auth-status ok';
    status.textContent = ensaioAtivo()
        ? 'Modo ensaio. A senha não grava nada.'
        : 'As cápsulas de 2025 continuam guardadas.';
    document.getElementById('releasePassword').addEventListener('keydown', function (event) {
        if (event.key === 'Enter') confirmRelease();
    });
    if (sessionStorage.getItem('capsulaGuardiaoOk') === '1') entrar();
    else document.getElementById('guardiaoSenha').focus();
});
