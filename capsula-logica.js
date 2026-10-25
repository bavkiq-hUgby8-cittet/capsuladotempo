/*
 * Regras compartilhadas da Cápsula do Tempo.
 * Lê o formato gravado em 2025 e o formato mais novo, sem reescrever o que já existe.
 */
(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.CapsulaLogica = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    var FUSO = 'America/Sao_Paulo';
    var CHAVE_ENSAIO = 'capsulaEnsaioOverrides';

    var ENSAIO = {
        eventos: {
            evt_ensaio_natal: {
                nome: 'Natal da Família (ensaio)',
                dataAbertura: '2026-12-25T15:00:00.000Z',
                dataCriacao: '2025-12-25T21:00:00.000Z',
                arquivado: true
            },
            evt_ensaio_novo: {
                nome: 'Confraternização (ensaio)',
                dataAbertura: '2026-12-25T15:00:00.000Z',
                dataCriacao: '2026-10-01T15:00:00.000Z',
                arquivado: false
            }
        },
        capsulas: {
            cap_ensaio_ana: {
                eventoId: 'evt_ensaio_natal',
                nome: 'Ana',
                sobrenome: 'Ensaio',
                foto: null,
                desejos: ['Família', 'Saúde', 'Paz interior'],
                pessoas: ['Família', 'Amigos'],
                perguntas: {
                    conquista: 'Aprender um instrumento',
                    momento: 'O Natal reunido em casa',
                    palavra: 'Gratidão',
                    felicidade: 8,
                    previsao: 'Vamos viajar juntos no ano novo'
                },
                mensagemPessoal: 'Querido eu do futuro: este texto é só um ensaio. Nenhuma carta da família foi alterada.',
                audioBase64: null,
                audioUrl: null,
                dataCriacao: '2025-12-25T21:10:00.000Z',
                dataAbertura: '2026-12-25T15:00:00.000Z',
                liberada: false,
                aberta: false
            },
            cap_ensaio_bruno: {
                eventoId: 'evt_ensaio_natal',
                nome: 'Bruno',
                sobrenome: 'Ensaio',
                foto: null,
                desejos: ['Viajar', 'Estudos', 'Família'],
                pessoas: ['Família'],
                perguntas: {
                    conquista: 'Terminar a faculdade',
                    momento: 'A formatura da prima',
                    palavra: 'Esperança',
                    felicidade: 9,
                    previsao: 'Vou morar mais perto da família'
                },
                mensagemPessoal: 'Oi, eu do futuro. Se você está lendo isto, a cápsula abriu no Natal de 2026. (Texto fictício de ensaio.)',
                audioBase64: null,
                audioUrl: null,
                dataCriacao: '2025-12-25T21:20:00.000Z',
                dataAbertura: '2026-12-25T15:00:00.000Z',
                liberada: false,
                aberta: false
            }
        }
    };

    function parseDataAbertura(valor) {
        if (valor == null || valor === '') return null;
        if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;
        var texto = String(valor).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
            var meioDia = new Date(texto + 'T12:00:00-03:00');
            return Number.isNaN(meioDia.getTime()) ? null : meioDia;
        }
        var data = new Date(texto);
        return Number.isNaN(data.getTime()) ? null : data;
    }

    function dataAberturaDoDia(dia) {
        var data = parseDataAbertura(dia);
        return data ? data.toISOString() : null;
    }

    function formatarPeloFuso(valor, opcoes) {
        var data = parseDataAbertura(valor);
        if (!data) return '';
        return new Intl.DateTimeFormat('pt-BR', Object.assign({ timeZone: FUSO }, opcoes)).format(data);
    }

    function formatarDataBR(valor) {
        return formatarPeloFuso(valor, { day: '2-digit', month: '2-digit', year: 'numeric' }) || '--/--/----';
    }

    function formatarDataHoraBR(valor) {
        var data = parseDataAbertura(valor);
        if (!data) return '--/--/----';
        var dia = formatarDataBR(data);
        var hora = formatarPeloFuso(data, { hour: '2-digit', minute: '2-digit' });
        return dia + ' às ' + hora;
    }

    function mensagemDaCapsula(capsula) {
        if (!capsula) return '';
        var texto = capsula.mensagemPessoal != null ? capsula.mensagemPessoal : capsula.mensagem;
        return typeof texto === 'string' ? texto : '';
    }

    function audioDaCapsula(capsula) {
        if (!capsula) return '';
        return capsula.audioBase64 || capsula.audioUrl || capsula.audio || '';
    }

    function statusAbertura(capsula, evento, agora) {
        var data = parseDataAbertura((capsula && capsula.dataAbertura) || (evento && evento.dataAbertura));
        var quando = data ? formatarDataHoraBR(data) : '';
        if (capsula && capsula.aberta) {
            return {
                estado: 'aberta',
                podeAbrir: true,
                titulo: 'Já aberta',
                detalhe: quando ? 'A data combinada era ' + quando + ' (horário de Brasília).' : ''
            };
        }
        if (capsula && capsula.liberada) {
            return {
                estado: 'liberada',
                podeAbrir: true,
                titulo: 'Liberada pelo guardião',
                detalhe: quando ? 'Abertura combinada: ' + quando + ' (horário de Brasília).' : 'O guardião liberou esta cápsula.'
            };
        }
        if (data && agora instanceof Date && agora.getTime() >= data.getTime()) {
            return {
                estado: 'data',
                podeAbrir: true,
                titulo: 'A data chegou',
                detalhe: 'Abriu em ' + quando + ' (horário de Brasília).'
            };
        }
        if (data) {
            return {
                estado: 'espera',
                podeAbrir: false,
                titulo: 'Lacrada',
                detalhe: 'Abre em ' + quando + ' (horário de Brasília).'
            };
        }
        return {
            estado: 'sem-data',
            podeAbrir: false,
            titulo: 'Lacrada',
            detalhe: 'A data de abertura não está definida.'
        };
    }

    function podeAbrirCapsula(capsula, evento, agora) {
        return statusAbertura(capsula, evento, agora).podeAbrir;
    }

    function diasAte(valor, agora) {
        var data = parseDataAbertura(valor);
        if (!data || !(agora instanceof Date)) return null;
        var diff = data.getTime() - agora.getTime();
        if (diff <= 0) return 0;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    function escapeHtml(valor) {
        return String(valor == null ? '' : valor).replace(/[&<>"']/g, function (ch) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
        });
    }

    function linkPagina(arquivo, params) {
        var url = new URL(arquivo, window.location.href);
        Object.keys(params || {}).forEach(function (chave) {
            var valor = params[chave];
            if (valor != null && valor !== '') url.searchParams.set(chave, String(valor));
        });
        return url.toString();
    }

    function ehEnsaio() {
        if (typeof location === 'undefined') return false;
        return new URLSearchParams(location.search).get('ensaio') === '1';
    }

    function lerOverrides() {
        if (typeof sessionStorage === 'undefined') return {};
        try {
            return JSON.parse(sessionStorage.getItem(CHAVE_ENSAIO)) || {};
        } catch (erro) {
            return {};
        }
    }

    function salvarOverrides(overrides) {
        sessionStorage.setItem(CHAVE_ENSAIO, JSON.stringify(overrides));
    }

    function mesclarEnsaio(base, overrides) {
        var eventos = {};
        var capsulas = {};
        Object.keys(base.eventos || {}).forEach(function (id) {
            eventos[id] = Object.assign({}, base.eventos[id]);
        });
        Object.keys(base.capsulas || {}).forEach(function (id) {
            capsulas[id] = Object.assign({}, base.capsulas[id]);
        });
        Object.keys((overrides && overrides.eventos) || {}).forEach(function (id) {
            eventos[id] = Object.assign({}, eventos[id] || {}, overrides.eventos[id]);
        });
        Object.keys((overrides && overrides.capsulas) || {}).forEach(function (id) {
            capsulas[id] = Object.assign({}, capsulas[id] || {}, overrides.capsulas[id]);
        });
        return { eventos: eventos, capsulas: capsulas };
    }

    function dadosEnsaio() {
        return mesclarEnsaio(ENSAIO, lerOverrides());
    }

    function marcarEnsaioCapsula(id, patch) {
        var overrides = lerOverrides();
        overrides.capsulas = overrides.capsulas || {};
        overrides.capsulas[id] = Object.assign({}, overrides.capsulas[id] || {}, patch);
        salvarOverrides(overrides);
    }

    function marcarEnsaioEvento(id, patch) {
        var overrides = lerOverrides();
        overrides.eventos = overrides.eventos || {};
        overrides.eventos[id] = Object.assign({}, overrides.eventos[id] || {}, patch);
        salvarOverrides(overrides);
    }

    function definirAgoraSimulado(iso) {
        var overrides = lerOverrides();
        overrides.agora = iso;
        salvarOverrides(overrides);
    }

    function limparEnsaio() {
        sessionStorage.removeItem(CHAVE_ENSAIO);
    }

    function obterAgora() {
        if (!ehEnsaio()) return new Date();
        var quando = new URLSearchParams(location.search).get('quando');
        if (quando) {
            var pelaUrl = new Date(quando);
            if (!Number.isNaN(pelaUrl.getTime())) return pelaUrl;
        }
        var iso = lerOverrides().agora;
        if (iso) {
            var salva = new Date(iso);
            if (!Number.isNaN(salva.getTime())) return salva;
        }
        return new Date();
    }

    function injetarEstiloBase() {
        if (typeof document === 'undefined' || document.getElementById('estilo-capsula-base')) return;
        var estilo = document.createElement('style');
        estilo.id = 'estilo-capsula-base';
        estilo.textContent = [
            '@media (prefers-reduced-motion: reduce) {',
            '  *, *::before, *::after {',
            '    animation-duration: 0.01ms !important;',
            '    animation-iteration-count: 1 !important;',
            '    scroll-behavior: auto !important;',
            '    transition-duration: 0.01ms !important;',
            '  }',
            '}',
            '.foto-fallback {',
            '  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;',
            '  font-weight: 700; color: #0c0f14; background: linear-gradient(135deg, #d4af37, #e67e22);',
            '}',
            '.ensaio-banner {',
            '  position: sticky; top: 0; z-index: 12000; display: flex; flex-wrap: wrap; gap: 8px;',
            '  align-items: center; justify-content: center; padding: 10px 14px;',
            '  background: #7c4a00; color: #fff; text-align: center; font: 600 0.92rem/1.4 "DM Sans", sans-serif;',
            '}',
            '.ensaio-banner button {',
            '  border: 0; border-radius: 999px; padding: 8px 12px; font: inherit; font-weight: 700; cursor: pointer;',
            '  background: #fff; color: #5a3400;',
            '}'
        ].join('\n');
        document.head.appendChild(estilo);
    }

    function montarBannerEnsaio(opcoes) {
        injetarEstiloBase();
        if (!ehEnsaio() || document.getElementById('bannerEnsaio')) return null;
        var barra = document.createElement('div');
        barra.id = 'bannerEnsaio';
        barra.className = 'ensaio-banner';
        barra.setAttribute('role', 'status');
        var texto = document.createElement('span');
        texto.textContent = 'Modo ensaio: dados fictícios. Nenhuma cápsula de 2025 é lida ou alterada.';
        barra.appendChild(texto);
        if (opcoes && opcoes.onSimular) {
            var simular = document.createElement('button');
            simular.type = 'button';
            simular.textContent = 'Simular 25/12/2026 às 12:00';
            simular.addEventListener('click', opcoes.onSimular);
            barra.appendChild(simular);
        }
        if (opcoes && opcoes.onLimpar) {
            var limpar = document.createElement('button');
            limpar.type = 'button';
            limpar.textContent = 'Recomeçar ensaio';
            limpar.addEventListener('click', opcoes.onLimpar);
            barra.appendChild(limpar);
        }
        document.body.prepend(barra);
        return barra;
    }

    function fotoFalhou(img) {
        if (!img || !img.parentNode) return;
        var inicial = ((img.getAttribute('alt') || '?').trim().charAt(0) || '?').toUpperCase();
        var reserva = document.createElement('span');
        reserva.className = 'foto-fallback';
        reserva.setAttribute('role', 'img');
        reserva.setAttribute('aria-label', img.getAttribute('alt') || 'Sem foto');
        reserva.textContent = inicial;
        img.replaceWith(reserva);
        if (typeof document !== 'undefined') {
            document.dispatchEvent(new CustomEvent('capsula-foto-falhou'));
        }
    }

    function htmlFoto(url, nome) {
        var inicial = escapeHtml(((nome || '?').trim().charAt(0) || '?').toUpperCase());
        if (!url) return '<span class="foto-fallback" role="img" aria-label="' + escapeHtml(nome || 'Sem foto') + '">' + inicial + '</span>';
        return '<img src="' + escapeHtml(url) + '" alt="' + escapeHtml(nome || 'Participante') + '" onerror="CapsulaLogica.fotoFalhou(this)">';
    }

    return {
        FUSO: FUSO,
        ENSAIO: ENSAIO,
        parseDataAbertura: parseDataAbertura,
        dataAberturaDoDia: dataAberturaDoDia,
        formatarDataBR: formatarDataBR,
        formatarDataHoraBR: formatarDataHoraBR,
        mensagemDaCapsula: mensagemDaCapsula,
        audioDaCapsula: audioDaCapsula,
        statusAbertura: statusAbertura,
        podeAbrirCapsula: podeAbrirCapsula,
        diasAte: diasAte,
        escapeHtml: escapeHtml,
        linkPagina: linkPagina,
        ehEnsaio: ehEnsaio,
        lerOverrides: lerOverrides,
        mesclarEnsaio: mesclarEnsaio,
        dadosEnsaio: dadosEnsaio,
        marcarEnsaioCapsula: marcarEnsaioCapsula,
        marcarEnsaioEvento: marcarEnsaioEvento,
        definirAgoraSimulado: definirAgoraSimulado,
        limparEnsaio: limparEnsaio,
        obterAgora: obterAgora,
        injetarEstiloBase: injetarEstiloBase,
        montarBannerEnsaio: montarBannerEnsaio,
        fotoFalhou: fotoFalhou,
        htmlFoto: htmlFoto
    };
});
