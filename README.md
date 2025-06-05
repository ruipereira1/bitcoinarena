# 🎮 Bitcoin Monopoly - Deploy Guide

Deploy completo do Bitcoin Monopoly Arena usando **Netlify + Render**.

## 📁 Estrutura do Projeto

```
bitcoin-monopoly-deploy/
├── netlify-frontend/     # React App (Netlify)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
├── render-backend/       # Node.js Server (Render)
│   ├── server.js
│   ├── package.json
│   └── README.md
└── README.md            # Este arquivo
```

## 🚀 Passos para Deploy

### **1️⃣ Backend no Render**

1. **Criar conta no [Render](https://render.com)**
2. **Conectar repositório Git**
3. **Criar Web Service** com estas configurações:
   ```
   Name: bitcoin-monopoly-server
   Environment: Node
   Region: Oregon (US West) - mais próximo do Brasil
   Branch: main
   Root Directory: render-backend
   Build Command: npm install
   Start Command: npm start
   ```

4. **Variáveis de Ambiente**:
   ```
   NODE_ENV=production
   PORT=10000
   ```

5. **Deploy automático** - Render fará o build e deploy
6. **Copiar URL** - Exemplo: `https://bitcoin-monopoly-server.onrender.com`

### **2️⃣ Frontend no Netlify**

1. **Criar conta no [Netlify](https://netlify.com)**
2. **Conectar repositório Git**
3. **Configurar build** com estas configurações:
   ```
   Base directory: netlify-frontend
   Build command: npm run build
   Publish directory: netlify-frontend/build
   ```

4. **Variáveis de Ambiente**:
   ```
   REACT_APP_SERVER_URL=https://sua-url-do-render.onrender.com
   ```
   *Substitua pela URL do seu backend no Render*

5. **Deploy automático** - Netlify fará o build e deploy
6. **Configurar domínio customizado** (opcional)

## ⚙️ Configurações Avançadas

### **CORS e Segurança**
O backend já está configurado para aceitar conexões do frontend em produção.

### **WebSockets**
Render suporta WebSockets nativamente. Socket.io funcionará automaticamente.

### **Monitoramento**
- **Render**: Logs automáticos disponíveis no dashboard
- **Netlify**: Analytics e function logs

## 🔄 CI/CD Automático

Ambas as plataformas fazem deploy automático quando você faz push para o repositório:

1. **Push para Git** → 
2. **Render rebuilda backend** → 
3. **Netlify rebuilda frontend** → 
4. **Jogo atualizado automaticamente**

## 💰 Custos

### **Render (Backend)**
- ✅ **Free Tier**: 750 horas/mês (suficiente para testes)
- 💤 **Sleep após 15min** de inatividade (free tier)
- 🚀 **Paid Plans**: $7/mês (sempre ativo)

### **Netlify (Frontend)**
- ✅ **Free Tier**: 100GB bandwidth/mês
- ✅ **Deploy ilimitado**
- ✅ **HTTPS automático**
- 🚀 **Paid Plans**: $19/mês (recursos pro)

## 🌐 URLs de Exemplo

Após o deploy, seus URLs serão:
- **Frontend**: `https://bitcoin-monopoly.netlify.app`
- **Backend**: `https://bitcoin-monopoly-server.onrender.com`

## 🛠️ Troubleshooting

### **Erro de Conexão WebSocket**
- Verifique se `REACT_APP_SERVER_URL` está correto
- Certifique-se que o backend no Render está funcionando

### **Build Failure no Netlify**
- Verifique se todas as dependências estão no `package.json`
- Confirme que o caminho base está correto

### **Backend Sleep (Free Tier)**
- O Render coloca o serviço para "dormir" após 15min
- Primeira conexão pode demorar 30-60 segundos
- Considere upgrade para plano pago para produção

## 📱 Features Completas

Após o deploy, o jogo terá:
- ✅ **Multiplayer tempo real** (2-6 jogadores)
- ✅ **Sistema de compra por escolha**
- ✅ **Interface responsiva** (mobile + desktop)
- ✅ **Tema Bitcoin** completo
- ✅ **Persistência de estado** durante as partidas
- ✅ **Notificações em tempo real**
- ✅ **Animações fluidas**

## 🎯 Próximos Passos

1. **Deploy no Render** (backend primeiro)
2. **Deploy no Netlify** (frontend depois)
3. **Testar conexão** entre os serviços
4. **Customizar domínio** (opcional)
5. **Configurar analytics** (opcional)

Agora você tem um jogo Bitcoin Monopoly completamente funcional na nuvem! 🎉 