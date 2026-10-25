# Cápsula do Tempo

A família Veloso guardou cartas, prioridades e mensagens de voz no Natal de 2025. Cada pessoa abre a própria cápsula em **25/12/2026 às 12:00, horário de Brasília**.

O site publicado é o GitHub Pages: [bavkiq-hugby8-cittet.github.io/capsuladotempo](https://bavkiq-hugby8-cittet.github.io/capsuladotempo/).

## O que cada página faz

| Arquivo | Uso |
| --- | --- |
| `index.html` | Painel do guardião: cerimônia, liberação e links |
| `jogador.html` | Criar uma cápsula nova, em 6 passos |
| `capsula.html` | Abrir a cápsula de uma pessoa |

Os dados ficam no Firebase Realtime Database do projeto `capsuladotempo-f86bf`. Este site não apaga cartas, fotos nem áudios. Liberar uma cápsula só grava `liberada: true`. Abrir só grava `aberta: true` e o horário da visualização.

## Data de abertura

A data **não está fixa no código**. Ela foi gravada em dezembro de 2025 em cada evento e em cada cápsula:

- Evento da família: `Natal 2025 Veloso`
- Id: `evt_1766622258729_6n25ck4jk`
- Valor: `2026-12-25T15:00:00.000Z`
- Na tela: **25/12/2026 às 12:00 (Brasília)**

O nome continua "Natal 2025" porque foi o Natal em que as cápsulas foram lacradas. A abertura é no Natal de 2026.

Para mudar o horário, altere o campo `dataAbertura` do evento **e** o mesmo campo em cada cápsula, no [console do Realtime Database](https://console.firebase.google.com/). Não use só a data `2026-12-25` sem horário: o painel novo grava meio-dia de Brasília. Não apague os outros campos.

Há também eventos de teste (`tal`, `Acqua Bella 2025`, `teste`), com outras datas de dezembro de 2026. O da família é o que tem as cápsulas do dia 25/12/2025.

## Como abrir no Natal

1. O guardião entra no painel com a senha da família (a mesma de 2025, em `painel.js`).
2. No evento lacrado, toca em **Cerimônia de abertura**. A animação não muda os dados.
3. Em seguida pode **Liberar** cada cápsula, ou todas de uma vez. Isso só tira a trava.
4. Cada pessoa abre o próprio link (`capsula.html?id=...`).

Mesmo sem a liberação manual, o botão **Abrir cápsula** é habilitado sozinho quando o relógio passa de 25/12/2026 às 12:00 em Brasília. Antes disso, a cápsula mostra a contagem regressiva.

Uma cápsula que já foi aberta mostra o conteúdo de novo, sem gravar por cima.

## Formato guardado em 2025

O repositório irmão `capsuladotempo2` é a versão que a família usou para lacrar. Este repositório tinha sido reescrito depois e não lia mais esses campos. Agora os dois formatos funcionam:

- carta em `mensagemPessoal` (e também `mensagem`, se existir)
- áudio em `audioBase64`, com reserva em `audioUrl`
- foto na URL `foto`
- data em `dataAbertura` / `dataCriacao`

Cápsulas novas são salvas nesse mesmo formato. O áudio fica na cápsula mesmo se o Storage falhar.

## Ensaio, sem mexer na família

Abra `index.html?ensaio=1`. O banner laranja usa só dados fictícios, no navegador. Dá para simular 25/12/2026 às 12:00 e percorrer a cerimônia e a abertura. Nada disso é enviado ao Firebase.

## Segredos e pendências

- A chave `apiKey` do Firebase nos HTML é chave de site. Ela não é uma senha de administrador, mas o banco está aberto para leitura e escrita. Qualquer pessoa com o endereço consegue ler as cartas. Vale revisar as regras no console antes do Natal, sem bloquear a leitura da página.
- A senha do guardião está no código (`painel.js`). Ela só esconde o painel; não protege o banco.
- As **fotos** estão no Firebase Storage e, em outubro de 2026, a cobrança desse projeto estava desativada. As URLs respondem `402`. As cartas e os áudios gravados dentro da cápsula continuam no Realtime Database. Para as fotos voltarem, reative a cobrança do projeto `capsuladotempo-f86bf` no Google Cloud. Não é preciso reenviar os arquivos.
- Links antigos podem apontar para `/capsuladotempo2/`. O id da cápsula é o mesmo; se alguém guardar o link antigo, aquele site ainda é o de 2025. Os links novos deste site usam `/capsuladotempo/`.

## Teste automático

```bash
node --test test/logica.test.mjs
```

`test/verificar-dados.mjs` só lê o Firebase e imprime contagens e a data, sem o texto das cartas.
