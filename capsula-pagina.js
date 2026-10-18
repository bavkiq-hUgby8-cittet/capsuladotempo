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
var capsulaId = null;
var capsulaData = null;
var eventoData = null;
var countdownInterval = null;
var abrindo = false;

function agora() {
    return CapsulaLogica.obterAgora();
}

function criarEstrelas() {
    var c = document.getElementById('atmosphere');
    if (!c || c.childElementCount) return;
    for (var i = 0; i < 40; i++) {
        var s = document.createElement('div');
        s.className = 'star';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        var sz = 1 + Math.random() * 2;
        s.style.width = sz + 'px';
        s.style.height = sz + 'px';
        s.style.animationDelay = Math.random() * 4 + 's';
        c.appendChild(s);
    }
}

function criarConfetes() {
    var c = document.getElementById('confetes');
    c.replaceChildren();
    var cores = ['#d4af37', '#f4d03f', '#e67e22', '#27ae60', '#fff', '#ff6b6b'];
    for (var i = 0; i < 80; i++) {
        var cf = document.createElement('div');
        cf.className = 'confete';
        cf.style.left = Math.random() * 100 + 'vw';
        cf.style.background = cores[Math.floor(Math.random() * cores.length)];
        cf.style.animationDelay = Math.random() * 1.2 + 's';
        var sz = 5 + Math.random() * 10;
        cf.style.width = sz + 'px';
        cf.style.height = sz + 'px';
        cf.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        c.appendChild(cf);
    }
}

function mostrarTela(id) {
    document.querySelectorAll('.tela').forEach(function (t) { t.classList.remove('active'); });
    document.getElementById(id).classList.add('active');
}

function mostrarToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show';
    setTimeout(function () { t.className = 'toast'; }, 3200);
}

function mostrarErro(titulo, texto, podeTentar) {
    document.getElementById('erroTitulo').textContent = titulo;
    document.getElementById('erroTexto').textContent = texto;
    document.getElementById('btnTentar').hidden = !podeTentar;
    mostrarTela('telaErro');
}

function nomeCompleto() {
    return ((capsulaData.nome || '') + ' ' + (capsulaData.sobrenome || '')).trim() || 'Cápsula';
}

function preencherTelaLacrada() {
    var foto = document.getElementById('fotoLacrada');
    foto.innerHTML = CapsulaLogica.htmlFoto(capsulaData.foto, nomeCompleto());
    document.getElementById('nomeLacrada').textContent = nomeCompleto();
    document.getElementById('eventoLacrada').textContent = (eventoData && eventoData.nome) || 'Cápsula do Tempo';
}

function verificarStatus() {
    var status = CapsulaLogica.statusAbertura(capsulaData, eventoData, agora());
    if (capsulaData.aberta) {
        mostrarConteudo();
        return;
    }
    document.getElementById('quandoAbre').textContent = status.detalhe;
    document.getElementById('msgAguarde').textContent = status.detalhe;
    var botao = document.getElementById('btnAbrir');
    var badge = document.getElementById('statusBadge');
    if (status.podeAbrir) {
        badge.textContent = '✨ ' + status.titulo;
        badge.className = 'status-badge status-liberada';
        document.getElementById('capsulaLacre').textContent = '✨';
        botao.disabled = false;
        botao.textContent = '🎉 ABRIR CÁPSULA';
        document.getElementById('countdown').style.display = 'none';
    } else {
        badge.textContent = '🔒 ' + status.titulo.toUpperCase();
        badge.className = 'status-badge status-lacrada';
        document.getElementById('capsulaLacre').textContent = '🔒';
        botao.disabled = true;
        botao.textContent = '🔒 AGUARDE A DATA';
        document.getElementById('countdown').style.display = '';
        var data = CapsulaLogica.parseDataAbertura(capsulaData.dataAbertura || (eventoData && eventoData.dataAbertura));
        if (data) iniciarCountdown(data);
    }
}

function iniciarCountdown(dataAlvo) {
    clearInterval(countdownInterval);
    function atualizar() {
        var diff = dataAlvo.getTime() - agora().getTime();
        if (diff <= 0) {
            clearInterval(countdownInterval);
            verificarStatus();
            return;
        }
        var dias = Math.floor(diff / (1000 * 60 * 60 * 24));
        var horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        var segs = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById('dias').textContent = String(dias).padStart(2, '0');
        document.getElementById('horas').textContent = String(horas).padStart(2, '0');
        document.getElementById('mins').textContent = String(mins).padStart(2, '0');
        document.getElementById('segs').textContent = String(segs).padStart(2, '0');
    }
    atualizar();
    countdownInterval = setInterval(atualizar, 1000);
}

async function abrirCapsula() {
    if (abrindo || !capsulaData || capsulaData.aberta) return;
    if (!CapsulaLogica.podeAbrirCapsula(capsulaData, eventoData, agora())) return;
    abrindo = true;
    document.getElementById('btnAbrir').disabled = true;
    var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var overlay = document.getElementById('aberturaOverlay');
    var capsula = document.getElementById('aberturaCapsula');
    var flash = document.getElementById('flash');
    overlay.classList.add('active');
    if (!reduzido) {
        await esperar(400);
        for (var i = 0; i < 3; i++) {
            capsula.classList.add('shake');
            await esperar(420);
            capsula.classList.remove('shake');
            await esperar(140);
        }
        capsula.classList.add('explode');
        flash.classList.add('active');
        await esperar(700);
    }
    try {
        if (!CapsulaLogica.ehEnsaio()) {
            await database.ref('capsulas/' + capsulaId).update({
                aberta: true,
                dataVisualizacao: new Date().toISOString()
            });
        } else {
            CapsulaLogica.marcarEnsaioCapsula(capsulaId, { aberta: true });
        }
        capsulaData.aberta = true;
    } catch (erro) {
        console.error(erro);
        mostrarToast('A carta vai aparecer, mas não conseguimos marcar como aberta. Ela continua guardada.');
    }
    overlay.classList.remove('active');
    flash.classList.remove('active');
    capsula.classList.remove('explode');
    clearInterval(countdownInterval);
    mostrarConteudo();
    if (!reduzido) criarConfetes();
    abrindo = false;
}

function esperar(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function mostrarConteudo() {
    mostrarTela('telaAberta');
    document.getElementById('fotoMini').innerHTML = CapsulaLogica.htmlFoto(capsulaData.foto, nomeCompleto());
    document.getElementById('nomeAberta').textContent = nomeCompleto();
    var criada = capsulaData.dataCriacao || capsulaData.criadaEm;
    var quando = criada ? 'Guardada em ' + CapsulaLogica.formatarDataBR(criada) : ((eventoData && eventoData.nome) || 'Cápsula do Tempo');
    document.getElementById('eventoAberta').textContent = ((eventoData && eventoData.nome) || 'Cápsula do Tempo') + ' · ' + quando;

    var desejosContainer = document.getElementById('desejosContainer');
    desejosContainer.replaceChildren();
    if (capsulaData.desejos && capsulaData.desejos.length) {
        capsulaData.desejos.forEach(function (desejo) {
            var tag = document.createElement('span');
            tag.className = 'tag-item';
            tag.textContent = desejo;
            desejosContainer.appendChild(tag);
        });
    } else {
        desejosContainer.textContent = 'Nenhuma prioridade selecionada';
    }

    var pessoas = capsulaData.pessoas || [];
    document.getElementById('pessoasContainer').textContent = pessoas.length ? pessoas.join(', ') : '—';
    configurarAudio();
    preencherPerguntas();
    var carta = CapsulaLogica.mensagemDaCapsula(capsulaData);
    document.getElementById('mensagemTexto').textContent = carta || 'Sem mensagem escrita.';
    mostrarReflexao();
}

function preencherPerguntas() {
    var container = document.getElementById('perguntasContainer');
    container.replaceChildren();
    var perguntas = capsulaData.perguntas || {};
    var itens = [
        ['🎯 O que achava que iria conquistar', perguntas.conquista],
        ['✨ Momento mais marcante', perguntas.momento],
        ['📝 Palavra que me definia', perguntas.palavra],
        ['🔮 Minha previsão', perguntas.previsao]
    ];
    var algum = false;
    itens.forEach(function (item) {
        if (!item[1]) return;
        algum = true;
        var bloco = document.createElement('div');
        bloco.className = 'pergunta-item';
        var rotulo = document.createElement('div');
        rotulo.className = 'pergunta-label';
        rotulo.textContent = item[0];
        var resposta = document.createElement('div');
        resposta.className = 'pergunta-resposta';
        resposta.textContent = item[1];
        bloco.appendChild(rotulo);
        bloco.appendChild(resposta);
        container.appendChild(bloco);
    });
    if (perguntas.felicidade) {
        algum = true;
        var blocoNota = document.createElement('div');
        blocoNota.className = 'pergunta-item';
        blocoNota.innerHTML = '<div class="pergunta-label">😊 Nível de felicidade</div>' +
            '<div class="felicidade-display"><span class="felicidade-nota">' + CapsulaLogica.escapeHtml(perguntas.felicidade) +
            '</span><div class="felicidade-barra"><div class="felicidade-fill" style="width:' +
            (Math.max(0, Math.min(10, Number(perguntas.felicidade) || 0)) * 10) + '%"></div></div></div>';
        container.appendChild(blocoNota);
    }
    if (!algum) container.textContent = 'Nenhuma reflexão registrada';
}

function configurarAudio() {
    var secao = document.getElementById('secaoAudio');
    var audio = document.getElementById('audioElement');
    var status = document.getElementById('audioStatus');
    var fonte = CapsulaLogica.audioDaCapsula(capsulaData);
    if (!fonte) {
        secao.hidden = true;
        return;
    }
    secao.hidden = false;
    var usouBase64 = Boolean(capsulaData.audioBase64);
    audio.src = fonte;
    status.textContent = 'Toque no player para ouvir a mensagem de 2025.';
    audio.onerror = function () {
        if (usouBase64 && capsulaData.audioUrl && audio.src !== capsulaData.audioUrl) {
            usouBase64 = false;
            audio.src = capsulaData.audioUrl;
            return;
        }
        status.textContent = 'Não foi possível reproduzir o áudio agora. A gravação continua salva na cápsula.';
    };
}

function mostrarReflexao() {
    if (capsulaData.reflexao) {
        document.getElementById('reflexaoForm').style.display = 'none';
        document.getElementById('reflexaoSalva').style.display = 'block';
        document.getElementById('reflexaoTexto').textContent = capsulaData.reflexao;
    }
}

async function salvarReflexao() {
    var texto = document.getElementById('reflexaoInput').value.trim();
    if (!texto) {
        mostrarToast('Escreva algo primeiro.');
        return;
    }
    try {
        if (CapsulaLogica.ehEnsaio()) {
            CapsulaLogica.marcarEnsaioCapsula(capsulaId, { reflexao: texto });
        } else {
            await database.ref('capsulas/' + capsulaId + '/reflexao').set(texto);
        }
        capsulaData.reflexao = texto;
        mostrarReflexao();
        mostrarToast('Reflexão salva. A carta de 2025 não foi alterada.');
    } catch (erro) {
        console.error(erro);
        mostrarToast('Erro ao salvar a reflexão.');
    }
}

function compartilhar() {
    var texto = 'Abri minha Cápsula do Tempo.\n\n' + ((eventoData && eventoData.nome) || 'Cápsula do Tempo');
    if (navigator.share) {
        navigator.share({ title: 'Cápsula do Tempo', text: texto, url: window.location.href }).catch(function () {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(function () {
            mostrarToast('Link copiado.');
        });
    }
}

async function carregarCapsula() {
    var params = new URLSearchParams(window.location.search);
    capsulaId = params.get('id');
    if (!capsulaId) {
        mostrarErro('Cápsula não encontrada', 'O link precisa do identificador da cápsula.', false);
        return;
    }
    try {
        if (CapsulaLogica.ehEnsaio()) {
            var dados = CapsulaLogica.dadosEnsaio();
            capsulaData = dados.capsulas[capsulaId];
            if (!capsulaData) {
                mostrarErro('Cápsula de ensaio não encontrada', 'Use um dos links do painel de ensaio.', false);
                return;
            }
            eventoData = dados.eventos[capsulaData.eventoId] || null;
        } else {
            if (typeof firebase === 'undefined') throw new Error('firebase');
            if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
            database = firebase.database();
            var snap = await database.ref('capsulas/' + capsulaId).once('value');
            capsulaData = snap.val();
            if (!capsulaData) {
                mostrarErro('Cápsula não encontrada', 'O link pode estar incorreto. A cápsula não foi apagada daqui.', false);
                return;
            }
            if (capsulaData.eventoId) {
                var evtSnap = await database.ref('eventos/' + capsulaData.eventoId).once('value');
                eventoData = evtSnap.val();
            }
        }
        preencherTelaLacrada();
        verificarStatus();
    } catch (erro) {
        console.error(erro);
        mostrarErro('Não foi possível carregar', 'Verifique a internet e tente de novo. Sua cápsula continua guardada.', true);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    CapsulaLogica.injetarEstiloBase();
    criarEstrelas();
    if (CapsulaLogica.ehEnsaio()) {
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
    carregarCapsula();
});
