# 🎄 Cápsula do Tempo - Sistema Completo

Sistema interativo de cápsulas do tempo para eventos de Natal/Ano Novo. Perfeito para famílias, empresas, grupos de amigos e comunidades.

## 🌟 Funcionalidades

### Para o Guardião (Operador)
- ✅ Criar eventos com QR Code automático
- ✅ Monitoramento em tempo real de novas cápsulas
- ✅ **Notificações visuais** quando participantes lacram (foto + confetes)
- ✅ **Cerimônia de Fechamento** com avatares em círculo e nuvem de palavras
- ✅ **Cerimônia de Abertura** estilo Mario Party (20 segundos de animação)
- ✅ Liberação individual ou em massa com senha
- ✅ Busca de participantes por nome
- ✅ Lista completa de participantes por evento

### Para os Participantes
- ✅ Interface mobile-first otimizada
- ✅ Captura de foto como avatar
- ✅ 24 tags de desejos em 4 categorias
- ✅ Mensagem pessoal de até 3000 caracteres
- ✅ Link único para acessar a cápsula
- ✅ Contador regressivo até abertura
- ✅ Animação de abertura com shake + explosão
- ✅ Campo de reflexão após abertura

## 📁 Estrutura de Arquivos

```
capsula-do-tempo/
├── index.html      # Painel do Guardião
├── jogador.html    # Interface do Participante
├── capsula.html    # Visualização da Cápsula
└── README.md       # Este arquivo
```

## 🚀 Como Usar

### 1. Deploy no GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos 4 arquivos
3. Vá em Settings > Pages
4. Selecione "main" branch e pasta "/ (root)"
5. Aguarde alguns minutos e acesse seu site!

### 2. Fluxo do Evento

```
1. CRIAÇÃO
   Guardião acessa index.html → Cria evento → Gera QR Code

2. PARTICIPAÇÃO
   Participantes escaneiam QR → Tiram foto → Selecionam desejos → Escrevem mensagem → Lacram

3. FECHAMENTO
   Guardião clica "🔒 Lacrar" → Cerimônia com avatares em círculo

4. ABERTURA (1 ano depois)
   Guardião clica "🎊 Abrir!" → Animação 20s → Libera cápsulas → Participantes abrem
```

## 🔐 Senha do Guardião

A senha padrão é: **otacilia**

Para alterar, edite a variável `SENHA` no arquivo `index.html`:
```javascript
const SENHA = 'suanovasenha';
```

## 🎨 Animações

### Notificação de Nova Cápsula
- Foto com zoom animado
- Nome com glow dourado
- Tags dos desejos
- 150 confetes coloridos
- Auto-fecha em 6 segundos

### Cerimônia de Fechamento
- Avatares posicionados em círculo
- Nuvem de palavras (top 10 desejos)
- Contador animado
- Confetes durante toda animação

### Cerimônia de Abertura
- Avatares voando (estilo Mario Party)
- Palavras flutuando da tela
- Stats finais (cápsulas, desejos, caracteres)
- 20 segundos de duração
- Redireciona automaticamente para gerenciamento

### Abertura da Cápsula
- Cápsula 3D com shake progressivo
- Explosão com flash branco
- Confetes na revelação

## ⚙️ Configuração Firebase

O projeto usa Firebase Realtime Database. A configuração atual aponta para um projeto de demonstração.

Para usar seu próprio Firebase:

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Ative Realtime Database e Storage
3. Configure as regras:

**Realtime Database Rules:**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Storage Rules:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

4. Substitua a configuração nos 3 arquivos HTML:
```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    databaseURL: "https://SEU_PROJETO-default-rtdb.firebaseio.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_ID",
    appId: "SEU_APP_ID"
};
```

## 📱 Responsivo

- **Desktop**: Grid de cards, cerimônia 500px
- **Tablet**: Layout em coluna única
- **Mobile**: Interface touch-friendly, elementos reduzidos

## 🎯 Tags de Desejos Disponíveis

### ❤️ Vida Pessoal
Saúde, Família, Romance, Amizades, Paz, Felicidade

### 🎯 Conquistas
Viagens, Carreira, Estudos, Promoção, Negócio, Casa própria

### 💰 Financeiro
Economizar, Investir, Quitar dívidas, Carro, Renda extra

### 🌈 Bem-estar
Exercícios, Meditação, Terapia, Hobby novo, Menos stress, Ler mais, Dormir melhor

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase Realtime Database
- **Storage**: Firebase Storage (fotos)
- **QR Code**: QRCode.js
- **Fonts**: Pacifico, Poppins, Orbitron (Google Fonts)
- **Animações**: CSS Keyframes puras

## 📊 Estrutura de Dados

### Eventos
```json
{
  "evt_123": {
    "nome": "Natal 2024",
    "dataCriacao": "2024-12-01T12:00:00Z",
    "dataAbertura": "2025-12-25T12:00:00Z",
    "arquivado": false
  }
}
```

### Cápsulas
```json
{
  "cap_456": {
    "eventoId": "evt_123",
    "nome": "João",
    "sobrenome": "Silva",
    "foto": "https://...",
    "desejos": ["Saúde", "Viagens", "Paz"],
    "mensagemPessoal": "Querido eu do futuro...",
    "dataCriacao": "2024-12-15T18:30:00Z",
    "dataAbertura": "2025-12-25T12:00:00Z",
    "liberada": false,
    "aberta": false,
    "reflexao": null
  }
}
```

## 🎉 Dicas de Uso

1. **Teste antes do evento**: Crie um evento de teste para familiarizar-se
2. **Projete na cerimônia**: Use uma TV/projetor para mostrar as animações
3. **Backup dos dados**: Exporte os dados do Firebase periodicamente
4. **Personalize a senha**: Mude "otacilia" para algo significativo
5. **Salve os links**: Envie os links das cápsulas por email/WhatsApp

## 📝 Licença

Projeto livre para uso pessoal e comercial. Créditos são apreciados mas não obrigatórios.

---

Feito com ❤️ para momentos especiais

🎄 Feliz Natal e Próspero Ano Novo! 🎊
