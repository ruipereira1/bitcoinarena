# ✅ Deploy Checklist - Bitcoin Monopoly

## 🎯 Ordem Recomendada

### **1. Backend primeiro (Render)**
```
□ Conta no Render criada
□ Repositório Git conectado
□ Web Service configurado:
  - Root Directory: render-backend
  - Build: npm install
  - Start: npm start
□ Variáveis de ambiente configuradas
□ Deploy executado com sucesso
□ URL do backend copiada
```

### **2. Frontend depois (Netlify)**
```
□ Conta no Netlify criada
□ Repositório Git conectado
□ Build configurado:
  - Base: netlify-frontend
  - Build: npm run build
  - Publish: netlify-frontend/build
□ Variável REACT_APP_SERVER_URL configurada
□ Deploy executado com sucesso
□ Jogo funcionando end-to-end
```

## 🔗 URLs para Anotar

**Backend**: _________________________  
**Frontend**: _________________________

## ⚡ Quick Test

1. **Backend Health Check**: Acesse `[URL_BACKEND]/`
2. **Frontend Load**: Acesse `[URL_FRONTEND]`
3. **WebSocket Connection**: Criar jogo e verificar se conecta
4. **Multiplayer Test**: Dois navegadores, dois jogadores

## 📝 Notas

- **Free Tier Render**: Backend "dorme" após 15min
- **Build Time**: Netlify ~2-3min, Render ~1-2min
- **Auto Deploy**: Push no Git atualiza automaticamente

---
**Status**: □ Deploy Completo ✅ 