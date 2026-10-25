/**
 * Leitura somente. Confere a data e o formato das cápsulas de 2025
 * sem imprimir cartas, nomes ou mídias.
 */
import logica from '../capsula-logica.js';

const base = 'https://capsuladotempo-f86bf-default-rtdb.firebaseio.com';
const NATAL = 'evt_1766622258729_6n25ck4jk';
const ABERTURA = '2026-12-25T15:00:00.000Z';

const eventos = await (await fetch(base + '/eventos.json')).json();
const capsulas = await (await fetch(base + '/capsulas.json')).json();

if (!eventos || !capsulas) {
    console.error('Não foi possível ler o Firebase.');
    process.exit(1);
}

const natal = eventos[NATAL];
if (!natal) {
    console.error('Evento de Natal não encontrado.');
    process.exit(1);
}

const abertura = logica.parseDataAbertura(natal.dataAbertura);
if (!abertura || abertura.toISOString() !== ABERTURA) {
    console.error('Data de abertura inesperada:', natal.dataAbertura);
    process.exit(1);
}

const doNatal = Object.values(capsulas).filter((c) => c && c.eventoId === NATAL);
const comCarta = doNatal.filter((c) => logica.mensagemDaCapsula(c).trim().length > 0).length;
const comAudio = doNatal.filter((c) => logica.audioDaCapsula(c).startsWith('data:audio/')).length;
const comFoto = doNatal.filter((c) => typeof c.foto === 'string' && c.foto.startsWith('http')).length;
const abertas = doNatal.filter((c) => c.aberta).length;
const liberadas = doNatal.filter((c) => c.liberada).length;

let fotoStatus = 'sem amostra';
const amostra = doNatal.find((c) => typeof c.foto === 'string' && c.foto.startsWith('http'));
if (amostra) {
    const resposta = await fetch(amostra.foto, { method: 'GET', headers: { Range: 'bytes=0-32' } });
    fotoStatus = String(resposta.status);
}

const hoje = new Date('2026-10-18T21:00:00.000Z');
const naHora = new Date(ABERTURA);
const aindaLacradas = doNatal.filter((c) => !logica.podeAbrirCapsula(c, natal, hoje)).length;
const abremNaHora = doNatal.filter((c) => logica.podeAbrirCapsula(c, natal, naHora)).length;

console.log(JSON.stringify({
    eventoArquivado: Boolean(natal.arquivado),
    aberturaBrasilia: logica.formatarDataHoraBR(natal.dataAbertura),
    capsulasNatal: doNatal.length,
    comCarta,
    comAudioNaCapsula: comAudio,
    comFotoUrl: comFoto,
    fotoHttpStatus: fotoStatus,
    jaAbertas: abertas,
    jaLiberadas: liberadas,
    lacradasEmOutubro2026: aindaLacradas,
    podemAbrirNaHora: abremNaHora
}, null, 2));

if (logica.formatarDataHoraBR(natal.dataAbertura) !== '25/12/2026 às 12:00') process.exit(1);
if (doNatal.length < 1) process.exit(1);
if (abremNaHora !== doNatal.length) process.exit(1);
