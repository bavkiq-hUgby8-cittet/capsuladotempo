import test from 'node:test';
import assert from 'node:assert/strict';
import logica from '../capsula-logica.js';

const {
    parseDataAbertura,
    dataAberturaDoDia,
    formatarDataBR,
    formatarDataHoraBR,
    mensagemDaCapsula,
    audioDaCapsula,
    podeAbrirCapsula,
    statusAbertura,
    diasAte,
    escapeHtml,
    mesclarEnsaio,
    ENSAIO
} = logica;

const ABERTURA = '2026-12-25T15:00:00.000Z';
const ANTES = new Date('2026-10-18T21:00:00.000Z');
const NO_INSTANTE = new Date(ABERTURA);
const DEPOIS = new Date('2026-12-25T15:00:01.000Z');

test('a abertura de 2025 continua sendo meio-dia de Brasília em 25/12/2026', () => {
    const data = parseDataAbertura(ABERTURA);
    assert.equal(data.toISOString(), ABERTURA);
    assert.equal(formatarDataBR(ABERTURA), '25/12/2026');
    assert.equal(formatarDataHoraBR(ABERTURA), '25/12/2026 às 12:00');
});

test('um dia sem horário também abre ao meio-dia de Brasília', () => {
    assert.equal(dataAberturaDoDia('2026-12-25'), ABERTURA);
    assert.equal(formatarDataHoraBR('2026-12-25'), '25/12/2026 às 12:00');
});

test('não trata data ISO como se fosse só o dia, o que gerava Invalid Date', () => {
    assert.equal(parseDataAbertura(ABERTURA + 'T00:00:00'), null);
    assert.equal(formatarDataBR(ABERTURA + 'T00:00:00'), '--/--/----');
});

test('antes da data a cápsula fica lacrada; na hora ela pode abrir', () => {
    const capsula = { liberada: false, aberta: false, dataAbertura: ABERTURA, mensagemPessoal: 'carta' };
    assert.equal(podeAbrirCapsula(capsula, null, ANTES), false);
    assert.equal(statusAbertura(capsula, null, ANTES).estado, 'espera');
    assert.equal(podeAbrirCapsula(capsula, null, NO_INSTANTE), true);
    assert.equal(podeAbrirCapsula(capsula, null, DEPOIS), true);
    assert.equal(statusAbertura(capsula, null, DEPOIS).estado, 'data');
});

test('o guardião pode liberar antes da data, e uma cápsula já aberta continua visível', () => {
    const base = { aberta: false, dataAbertura: ABERTURA, mensagemPessoal: 'carta' };
    assert.equal(podeAbrirCapsula({ ...base, liberada: true }, null, ANTES), true);
    assert.equal(statusAbertura({ ...base, aberta: true, liberada: false }, null, ANTES).estado, 'aberta');
});

test('a carta e o áudio de 2025 são lidos pelos campos originais', () => {
    const antiga = {
        mensagemPessoal: 'carta guardada',
        mensagem: 'nao usar este',
        audioBase64: 'data:audio/mp4;base64,AAAA',
        audioUrl: 'https://firebasestorage.googleapis.com/audio'
    };
    assert.equal(mensagemDaCapsula(antiga), 'carta guardada');
    assert.equal(audioDaCapsula(antiga).startsWith('data:audio/'), true);
    assert.equal(mensagemDaCapsula({ mensagem: 'formato novo' }), 'formato novo');
    assert.equal(mensagemDaCapsula({}), '');
    assert.equal(audioDaCapsula({ audio: 'https://exemplo/audio.webm' }), 'https://exemplo/audio.webm');
});

test('a data do evento serve quando a cápsula não tem a sua', () => {
    const capsula = { liberada: false, aberta: false };
    const evento = { dataAbertura: ABERTURA };
    assert.equal(podeAbrirCapsula(capsula, evento, DEPOIS), true);
    assert.equal(podeAbrirCapsula(capsula, evento, ANTES), false);
});

test('o ensaio só acrescenta campos e preserva a carta fictícia', () => {
    const mesclado = mesclarEnsaio(ENSAIO, {
        capsulas: { cap_ensaio_ana: { liberada: true } }
    });
    assert.equal(mesclado.capsulas.cap_ensaio_ana.liberada, true);
    assert.match(mesclado.capsulas.cap_ensaio_ana.mensagemPessoal, /ensaio/i);
    assert.equal(ENSAIO.capsulas.cap_ensaio_ana.liberada, false);
});

test('contador de dias usa o instante absoluto', () => {
    assert.ok(diasAte(ABERTURA, ANTES) > 60);
    assert.equal(diasAte(ABERTURA, DEPOIS), 0);
});

test('textos da família não viram HTML', () => {
    assert.equal(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
});
