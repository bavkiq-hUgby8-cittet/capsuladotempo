# 🎄 Cápsula do Tempo - Sistema Interativo

Sistema completo para criar cápsulas do tempo em eventos de Natal/Ano Novo com cerimônia de abertura interativa.

## ✨ Funcionalidades

### 📱 Para Participantes
- **Cadastro com foto** - Tire uma selfie que vira seu avatar
- **Seleção de desejos** - Tags clicáveis (viagens, saúde, família, carreira, etc.)
- **Mensagem pessoal** - Escreva para seu eu do futuro
- **Link único** - Acesso exclusivo à sua cápsula

### 🎭 Para o Guardião (Operador)
- **Criar eventos** - Com QR code automático para participantes
- **Recuperar links** - Busca por nome para usuários que perderam o link
- **Cerimônia interativa** - Painel com avatares de todos os participantes
- **Liberar cápsulas** - Senha "otacilia" para autorizar aberturas
- **Notificações em tempo real** - Explosão de confetes quando alguém abre
- **Arquivar eventos** - Sem perder dados (não deleta nada)

### 🎉 Cerimônia de Abertura
- Grid de avatares com fotos dos participantes
- Status visual: 🔒 Aguardando → 🔓 Liberada → ✅ Aberta
- Quando alguém abre, explode no painel:
  - Foto da pessoa
  - Nome completo
  - Quantidade de caracteres escritos
  - Tags de desejos selecionados
- Perfeito para exibir na TV durante a festa!

## 🚀 Deploy no GitHub Pages

### 1. Criar Repositório
1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"**
3. Nome: `capsula-do-tempo`
4. Marque **"Public"**
5. Clique **"Create repository"**

### 2. Upload dos Arquivos
1. Na página do repositório, clique em **"uploading an existing file"**
2. Arraste os 4 arquivos:
   - `index.html`
   - `jogador.html`
   - `capsula.html`
   - `README.md`
3. Clique **"Commit changes"**

### 3. Ativar GitHub Pages
1. Vá em **Settings** → **Pages**
2. Em "Source", selecione **"Deploy from a branch"**
3. Branch: **main** | Folder: **/ (root)**
4. Clique **Save**

### 4. Acessar o Site
Após 2-3 minutos, acesse:
```
https://SEU-USUARIO.github.io/capsula-do-tempo/
```

## 📋 Como Usar

### No Dia do Evento

1. **Operador abre `index.html`** no computador/TV
2. **Cria o evento** com nome e data de abertura
3. **Exibe o QR Code** na tela para os participantes

### Participantes

1. **Escaneiam o QR Code** com o celular
2. **Tiram uma foto** (selfie)
3. **Preenchem nome** e sobrenome
4. **Selecionam desejos** (tags clicáveis)
5. **Escrevem mensagem** para o futuro
6. **Lacram a cápsula** e salvam o link

### Cerimônia de Abertura (1 ano depois)

1. Operador abre o **Painel do Guardião**
2. Clica em **"Cerimônia"** no evento
3. Vê todos os avatares dos participantes
4. **Libera cápsulas** uma a uma (senha: `otacilia`)
5. Participantes abrem pelo celular
6. **Explosão de confetes** no painel quando abrem!
7. Pessoa pode falar sobre sua cápsula vendo:
   - Sua foto do ano passado
   - Quantidade de texto que escreveu
   - Seus desejos selecionados

## 🔐 Senha do Guardião

**Senha:** `otacilia`

Use para:
- Liberar cápsulas antes do prazo
- Permitir abertura durante a cerimônia
- Controlar o momento exato de cada abertura

## 📂 Estrutura de Arquivos

```
capsula-do-tempo/
├── index.html      # Painel do Guardião (criar eventos, cerimônia)
├── jogador.html    # Interface mobile (cadastro, foto, desejos)
├── capsula.html    # Visualização da cápsula (lacrada/aberta)
└── README.md       # Este arquivo
```

## 🔥 Firebase (Já Configurado)

O sistema usa Firebase Realtime Database + Storage.
As credenciais já estão nos arquivos:

- **Projeto:** capsuladotempo-f86bf
- **Database:** Realtime Database
- **Storage:** Para fotos dos participantes

### Estrutura do Banco

```
eventos/
  evt_xxx/
    nome: "Natal da Família"
    dataAbertura: "2025-12-25T12:00:00"
    arquivado: false

capsulas/
  cap_xxx/
    eventoId: "evt_xxx"
    nome: "João"
    sobrenome: "Silva"
    foto: "https://..."
    desejos: ["Viagens", "Saúde", "Família"]
    mensagemPessoal: "Querido eu do futuro..."
    liberada: false
    aberta: false
```

## 🎨 Design

- **Tema:** Natal (vermelho, verde, dourado)
- **Animações:** Neve, estrelas, confetes
- **Mobile-first:** Otimizado para celular
- **Responsivo:** Funciona em qualquer tela

## ⚠️ Limites do Firebase Free

- **1GB** de armazenamento
- **10GB** de transferência/mês
- **100** conexões simultâneas

Suficiente para eventos com até ~200 participantes.

## 🆘 Problemas Comuns

### QR Code não funciona
- Verifique se o site está publicado no GitHub Pages
- Aguarde 2-3 minutos após o deploy

### Foto não carrega
- Verifique conexão com internet
- Permita acesso à câmera no navegador

### Cápsula não abre
- Verifique se foi **liberada** pelo guardião
- O guardião usa a senha `otacilia`

### Perdi meu link
- O guardião pode buscar por nome em **"Recuperar Link"**

## 📞 Suporte

Sistema desenvolvido para eventos familiares de Natal/Ano Novo.
Divirta-se criando memórias para o futuro! 🎄✨
