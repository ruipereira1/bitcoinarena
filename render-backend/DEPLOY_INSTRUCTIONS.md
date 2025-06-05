# 🚀 Deploy Bitcoin Monopoly Backend - Render

## ✅ Configurações CORS Atualizadas

O servidor foi configurado para aceitar conexões de:
- `http://localhost:3000` (desenvolvimento)
- `https://bitcoinarena.netlify.app` (produção)

## 📦 Deploy no Render

1. **Acesse:** [render.com](https://render.com)
2. **Conecte** sua conta GitHub
3. **Crie Web Service** desta pasta
4. **Configure:**
   - **Name:** `bitcoinarena`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Port:** `5000`

## 🌐 URLs de Produção

- **Frontend:** https://bitcoinarena.netlify.app
- **Backend:** https://bitcoinarena.onrender.com

## ⚙️ Variáveis de Ambiente

Opcional no Render:
```
NODE_ENV=production
PORT=5000
```

## 🔄 Redeploy Automático

O Render fará redeploy automático quando você:
1. Fizer push para o repositório GitHub
2. Modificar os arquivos do backend

## ✅ Status do Deploy

- [x] CORS configurado para Netlify
- [x] WebSockets prontos
- [x] Multiplayer habilitado
- [x] Sistema de compras ativado

**Último Update:** 05/06/2025 - Adicionado suporte ao https://bitcoinarena.netlify.app

---
*Deploy configurado para bitcoinarena.netlify.app ✨* 