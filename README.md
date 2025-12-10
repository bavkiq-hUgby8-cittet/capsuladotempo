# 🎁 Cápsula do Tempo - Sistema Completo

Sistema interativo para criar cápsulas do tempo em eventos como Natal e Ano Novo. Os participantes guardam memórias, desejos, áudios e mensagens para abrir no futuro!

## ✨ Novas Funcionalidades

### 🎤 Gravação de Áudio
- Grave uma mensagem de voz para seu eu do futuro
- Limite de 60 segundos
- Preview antes de confirmar
- Pode pular se preferir

### 💭 Perguntas Reflexivas
- **O que você acha que vai conquistar?** - Ex: "Falar inglês fluente"
- **Momento mais marcante do ano** - Memórias importantes
- **Uma palavra que define seu momento** - Para nuvem de palavras
- **Nota de felicidade (1-10)** - Comparar com o futuro
- **Uma previsão para o ano que vem** - Ver se acertou!

### 👥 Pessoas Importantes
Escolha quem você quer se dedicar mais:
- 👨‍👩‍👧‍👦 Família
- 👯 Amigos
- 💑 Parceiro(a)
- 👶 Filhos
- 💼 Colegas
- 🪞 Eu mesmo

### 🌟 Desejos (24 opções)
**Vida Pessoal:** Saúde, Família, Romance, Amizades, Paz interior, Felicidade

**Conquistas:** Viajar, Carreira, Estudos, Promoção, Negócio próprio, Casa própria

**Financeiro:** Economizar, Investir, Quitar dívidas, Carro novo, Renda extra

**Bem-estar:** Exercícios, Meditação, Terapia, Hobby novo, Menos stress, Ler mais, Dormir melhor

---

## 📁 Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Painel do Guardião/Operador |
| `jogador.html` | Interface do Participante (6 passos) |
| `capsula.html` | Visualização da Cápsula |

---

## 🚀 Como Usar

### Deploy no GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos 3 arquivos HTML
3. Vá em **Settings** → **Pages**
4. Selecione **Branch: main** → **Save**
5. Aguarde 2 minutos e acesse: `seu-usuario.github.io/nome-do-repo`

### Fluxo do Evento

1. **Operador** cria evento no painel → QR Code gerado
2. **Participantes** escaneiam QR → Criam cápsula em 6 passos
3. Cada lacramento aparece **animado com confetes** no painel
4. **Operador** clica "🔒 Lacrar" → Cerimônia de Fechamento
5. Quando chegar a data, **Operador** clica "🎊 Abrir!" → Cerimônia de Abertura (20s)
6. **Operador** libera cápsulas (senha: `otacilia`)
7. **Participantes** abrem suas cápsulas pelo link

---

## 🎬 Animações

### Notificação de Nova Cápsula
- Foto circular 200px com zoom + rotação
- Nome em dourado com glow
- Tags de desejos
- 150 confetes coloridos
- Auto-fecha em 6 segundos

### Cerimônia de Fechamento
- Avatares em círculo flutuando
- Nuvem de palavras (top 10 desejos)
- Contador animado
- Confetes

### Cerimônia de Abertura (20s)
- Avatares voando estilo Mario Party
- Palavras subindo na tela
- Stats finais (cápsulas, desejos, caracteres)

### Abertura da Cápsula
- Shake 3 vezes
- Explosão
- Flash branco
- Confetes

---

## 🔐 Configurações

### Senha do Guardião
A senha padrão é `otacilia`. Para alterar, edite no `index.html`:
```javascript
const SENHA_GUARDIAO = 'sua-nova-senha';
```

### Firebase
O projeto usa Firebase já configurado. Para usar seu próprio:

1. Crie projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Ative **Realtime Database** e **Storage**
3. Configure as regras:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
4. Substitua `firebaseConfig` nos 3 arquivos

---

## 📱 Experiência do Participante (6 Passos)

1. **📸 Quem é você?** - Foto e nome
2. **🌟 Seus desejos** - Selecionar até 10 tags
3. **👥 Pessoas importantes** - Quem se dedicar
4. **💭 Reflexões** - Perguntas sobre o momento atual
5. **🎤 Mensagem de voz** - Gravar áudio (opcional)
6. **💌 Carta para o futuro** - Mensagem escrita

---

## 📊 Dados Salvos

```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "foto": "https://...",
  "desejos": ["Saúde", "Viajar", "Paz interior"],
  "pessoas": ["Família", "Amigos"],
  "perguntas": {
    "conquista": "Falar inglês fluente",
    "momento": "Nascimento do filho",
    "palavra": "Gratidão",
    "felicidade": 8,
    "previsao": "Vou mudar de emprego"
  },
  "audio": "https://...",
  "mensagemPessoal": "Querido eu do futuro...",
  "dataCriacao": "2024-12-25T10:00:00Z",
  "dataAbertura": "2025-12-25T12:00:00Z",
  "liberada": false,
  "aberta": false,
  "reflexao": null
}
```

---

## 🎨 Tecnologias

- **Firebase** - Realtime Database + Storage
- **QRCode.js** - Geração de QR codes
- **Web Audio API** - Gravação de áudio
- **CSS Animations** - Todas as animações
- **Google Fonts** - Pacifico, Poppins, Orbitron

---

## 💡 Dicas de Uso

1. **Teste antes** - Crie um evento de teste para validar
2. **Conexão estável** - Garanta boa internet para upload de fotos/áudios
3. **Backup dos links** - Use a busca por nome para recuperar links perdidos
4. **Cerimônia coletiva** - Projete o painel em uma TV durante a abertura
5. **Liberação gradual** - Libere uma cápsula por vez para mais emoção!

---

## 📞 Suporte

Problemas comuns:
- **Página não atualiza**: Limpe o cache (Ctrl+Shift+R)
- **Erro no Firebase**: Verifique as regras do Realtime Database
- **Áudio não grava**: Permita acesso ao microfone no navegador

---

Feito com ❤️ para momentos especiais 🎄✨
