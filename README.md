# 🎄 Cápsula do Tempo 🎊

Sistema interativo de cápsulas do tempo para Natal e Ano Novo. Perfeito para reuniões de família, festas de empresa ou qualquer celebração especial!

## ✨ Como Funciona

1. **Operador** cria um evento e exibe o QR Code no telão/TV
2. **Participantes** escaneiam o QR Code com o celular
3. Cada pessoa escreve seus **sonhos, planos e metas** para o próximo ano
4. As cápsulas ficam **lacradas por 365 dias**
5. No próximo ano, todos abrem suas cápsulas e veem o que escreveram!

---

## 🚀 Deploy no GitHub Pages (5 minutos)

### Passo 1: Criar Repositório

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Configure:
   - **Repository name:** `capsula-do-tempo`
   - **Description:** `Sistema de cápsulas do tempo para Natal`
   - Marque **"Public"**
   - ❌ NÃO marque "Add a README file"
5. Clique em **"Create repository"**

### Passo 2: Upload dos Arquivos

1. Na página do repositório vazio, clique em **"uploading an existing file"**
2. Arraste os 4 arquivos para a área de upload:
   - `index.html`
   - `jogador.html`
   - `capsula.html`
   - `README.md`
3. Em "Commit changes", escreva: `Adicionar arquivos do sistema`
4. Clique em **"Commit changes"**

### Passo 3: Ativar GitHub Pages

1. No repositório, clique em **"Settings"** (aba superior)
2. No menu lateral esquerdo, clique em **"Pages"**
3. Em "Source", selecione:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Clique em **"Save"**

### Passo 4: Acessar seu Site

⏳ Aguarde 2-5 minutos para o deploy completar.

Seu site estará disponível em:
```
https://SEU-USUARIO.github.io/capsula-do-tempo/
```

---

## 🎮 Guia de Uso

### Para o Operador (TV/Telão)

1. Abra `index.html` no navegador (ou acesse seu site GitHub Pages)
2. Crie um novo evento:
   - Digite o nome do evento (ex: "Natal da Família Silva 2024")
   - Escolha a data de abertura (padrão: +365 dias)
   - Clique em **"CRIAR EVENTO"**
3. O QR Code será gerado automaticamente
4. **Exiba o QR Code na TV/telão** para os participantes escanearem
5. Acompanhe quantas cápsulas foram criadas em tempo real

### Para os Participantes (Celular)

1. **Escaneie o QR Code** com a câmera do celular
2. Toque no link que aparecer
3. Na tela de boas-vindas, toque em **"CRIAR MINHA CÁPSULA"**
4. Digite seu nome e sobrenome
5. Escreva sua mensagem:
   - Seus sonhos para o próximo ano
   - Metas profissionais e pessoais
   - Gratidões pelo ano atual
   - Mensagem para seu "eu do futuro"
6. (Opcional) Adicione até 5 fotos
7. Toque em **"LACRAR CÁPSULA"**
8. **⚠️ IMPORTANTE: SALVE O LINK!** Você precisará dele para abrir a cápsula

### Para Abrir a Cápsula (após 365 dias)

1. Acesse o link que você salvou
2. Se o tempo já passou, a cápsula abrirá automaticamente com uma animação especial
3. Leia sua mensagem do passado
4. Veja as fotos que você guardou
5. Escreva uma reflexão sobre o ano que passou
6. Compartilhe com amigos e família!

---

## 📱 Funcionalidades

### Painel do Operador
- ✅ Criar múltiplos eventos
- ✅ QR Code gerado automaticamente
- ✅ Contador de cápsulas em tempo real
- ✅ Visualizar todas as cápsulas
- ✅ Copiar links individuais
- ✅ Encerrar eventos
- ✅ Reset total (com confirmação)

### Interface do Jogador
- ✅ Design mobile-first otimizado
- ✅ Exemplos de inspiração expansíveis
- ✅ Upload de até 5 fotos
- ✅ Redimensionamento automático de imagens
- ✅ Animações e efeitos visuais
- ✅ Compartilhamento via Web Share API

### Visualização da Cápsula
- ✅ Countdown em tempo real
- ✅ Cápsula 3D animada
- ✅ Animação épica de abertura
- ✅ Galeria de fotos com lightbox
- ✅ Seção de reflexão salvável
- ✅ Confetes na abertura!

---

## 🔧 Especificações Técnicas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Firebase Realtime Database
- **Storage:** Firebase Storage (para fotos)
- **Hospedagem:** GitHub Pages (gratuito)
- **Bibliotecas:** 
  - Firebase SDK 10.7.1
  - QRCode.js 1.0.0
  - Google Fonts (Pacifico, Poppins, Orbitron)

### Limites do Firebase Gratuito
- 1GB de armazenamento
- 10GB de transferência/mês
- 100 conexões simultâneas

**Isso é suficiente para centenas de cápsulas!**

---

## ⚠️ Avisos Importantes

1. **Os participantes DEVEM salvar o link da cápsula**
   - Não há sistema de recuperação por email
   - Se perderem o link, apenas o operador pode recuperar

2. **Os dados ficam no Firebase por tempo indeterminado**
   - Enquanto o projeto existir, as cápsulas estarão lá

3. **Use em rede com internet**
   - O sistema precisa de conexão para funcionar

---

## 🆘 Solução de Problemas

### QR Code não funciona
- Verifique se o celular está conectado à internet
- Tente abrir o link manualmente digitando no navegador

### Fotos não aparecem
- Verifique a conexão com internet
- Aguarde alguns segundos para o upload completar
- Tente com fotos menores

### Página não carrega
- Aguarde 5 minutos após ativar o GitHub Pages
- Verifique se o nome do repositório está correto
- Limpe o cache do navegador (Ctrl+Shift+R)

### Erro no Firebase
- Verifique o console do navegador (F12)
- As credenciais do Firebase já estão configuradas

---

## 📄 Estrutura dos Arquivos

```
capsula-do-tempo/
├── index.html      # Painel do operador
├── jogador.html    # Interface mobile para criar cápsula
├── capsula.html    # Visualização da cápsula
└── README.md       # Este arquivo
```

---

## 🎉 Dicas para uma Experiência Incrível

1. **Prepare o ambiente**: TV grande, som ambiente natalino
2. **Explique as regras**: Todos devem salvar o link!
3. **Dê tempo**: Reserve 10-15 minutos para todos escreverem
4. **Fotografe o momento**: Tire foto de todos criando suas cápsulas
5. **Agende um lembrete**: Marque no calendário para abrir no ano que vem!

---

## 📜 Licença

Este projeto é de uso livre para fins pessoais e educacionais.

---

Feito com ❤️ para celebrar momentos especiais em família!

🎄 Feliz Natal e Próspero Ano Novo! 🎊
