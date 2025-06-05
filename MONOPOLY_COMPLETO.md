# 🏛️ Bitcoin Monopoly - Mecânicas Completas do Jogo

## 🎯 **Tabuleiro Atualizado - 40 Casas Corretas**

### **🏠 Propriedades por Cor (Sistema Original)**

**🤎 MARROM (2 propriedades):**
- Casa 1: Rua Bitcoin - ₿0.001
- Casa 3: Rua Satoshi - ₿0.001

**🔵 AZUL CLARO (3 propriedades):**  
- Casa 6: Avenida Ethereum - ₿0.0015
- Casa 8: Avenida Litecoin - ₿0.0015
- Casa 9: Avenida Cardano - ₿0.0018

**🟣 ROXO (3 propriedades):**
- Casa 11: Rua Solana - ₿0.002
- Casa 13: Rua Polygon - ₿0.002  
- Casa 14: Rua Chainlink - ₿0.0022

**🟠 LARANJA (3 propriedades):**
- Casa 16: Avenida DeFi - ₿0.0025
- Casa 18: Avenida NFT - ₿0.0025
- Casa 19: Avenida Web3 - ₿0.0028

**🔴 VERMELHO (3 propriedades):**
- Casa 21: Rua Metaverso - ₿0.003
- Casa 23: Rua DAO - ₿0.003
- Casa 24: Rua Smart Contract - ₿0.0032

**🟡 AMARELO (3 propriedades):**
- Casa 26: Avenida Binance - ₿0.0035
- Casa 27: Avenida Coinbase - ₿0.0035
- Casa 29: Avenida Kraken - ₿0.0038

**🟢 VERDE (3 propriedades):**
- Casa 31: Rua HODL - ₿0.004
- Casa 32: Rua Diamond Hands - ₿0.004
- Casa 34: Rua Moon - ₿0.0042

**🔵 AZUL ESCURO (2 propriedades):**
- Casa 37: Mansão Lambo - ₿0.005
- Casa 39: Mansão Bitcoin - ₿0.006

---

## 🏗️ **Sistema de Construção Implementado**

### **🏠 Casas:**
- **Máximo:** 4 casas por propriedade
- **Custo:** 50% do valor da propriedade
- **Restrição:** Precisa do conjunto completo da cor
- **Distribuição:** Construção uniforme (não pode ter +1 casa que as outras do conjunto)
- **Estoque:** 32 casas no banco total

### **🏨 Hotéis:**
- **Requerimento:** 4 casas na propriedade
- **Custo:** 50% do valor da propriedade (adicional às casas)
- **Conversão:** Remove 4 casas e adiciona 1 hotel
- **Estoque:** 12 hotéis no banco total

### **🏗️ Construção Visual:**
- **Casas:** Quadrados verdes 8x8px no topo da propriedade
- **Hotéis:** Retângulo vermelho 16x10px com "H" branco

---

## 💰 **Sistema de Aluguel Aprimorado**

### **🏘️ Propriedades Normais:**
```
[Terreno, 1 Casa, 2 Casas, 3 Casas, 4 Casas, Hotel]
```
**Exemplo - Rua Bitcoin (₿0.001):**
- Terreno vazio: ₿0.0001
- Com conjunto completo: ₿0.0002 (dobrado)
- 1 Casa: ₿0.0005
- 2 Casas: ₿0.0015
- 3 Casas: ₿0.0045
- 4 Casas: ₿0.0065
- Hotel: ₿0.0125

### **🚂 Estações (4 no total):**
- 1 Estação: ₿0.0005
- 2 Estações: ₿0.001
- 3 Estações: ₿0.002
- 4 Estações: ₿0.004

### **⚡ Utilities (2 no total):**
- 1 Utility: 4x dados
- 2 Utilities: 10x dados
- Multiplicador: ₿0.0001 por ponto dos dados

---

## 🏦 **Sistema de Hipoteca**

### **💸 Hipotecar:**
- **Valor recebido:** 50% do preço da propriedade
- **Restrição:** Não pode ter construções
- **Visual:** Sobreposição vermelha com "HIPOTECADA"

### **💰 Quitar Hipoteca:**
- **Custo:** 110% do valor da hipoteca (10% de juros)
- **Cálculo:** 55% do preço original da propriedade

---

## 🏗️ **Venda de Construções**

### **💰 Valor de Venda:**
- **Casas/Hotéis:** 50% do custo de construção
- **Cálculo:** 25% do preço da propriedade
- **Regra:** Deve vender uniformemente no conjunto

---

## 🎲 **Mecânicas de Jogo Implementadas**

### **✅ Funcionalidades Completas:**

1. **🎯 Movimento e Posicionamento**
   - 40 casas exatamente como Monopoly original
   - Posicionamento responsivo perfeito
   - Animações suaves de movimento

2. **🏛️ Compra de Propriedades**
   - Sistema de propriedade por jogador
   - Verificação de saldo automática
   - Indicadores visuais de propriedade

3. **💰 Sistema de Aluguel**
   - Cálculo automático baseado em construções
   - Bônus de conjunto completo
   - Estações e utilities com regras especiais

4. **🏗️ Construção e Desenvolvimento**
   - Casas e hotéis com regras corretas
   - Distribuição uniforme obrigatória
   - Estoque limitado do banco

5. **🏦 Sistema Financeiro**
   - Hipoteca e quitação
   - Venda de construções
   - Verificação de falência

6. **🎲 Dados e Turnos**
   - Sistema de turnos automático
   - Dados visuais animados
   - Mudança de jogador suave

7. **🃏 Cartas de Sorte e Cofre**
   - Sistema completo de cartas
   - Ações automáticas
   - Interface visual épica

---

## 📱 **Responsividade Otimizada**

### **🖥️ Desktop (padrão 700px):**
- Layout completo com todas as animações
- Tabuleiro otimizado para visualização
- Sidebar com detalhes dos jogadores

### **📱 Mobile/Tablet:**
- Tabuleiro redimensionado automaticamente
- Controles adaptados para touch
- Performance otimizada

---

## 🎮 **Como Jogar**

### **🚀 Iniciar Jogo:**
1. Crie ou entre em uma sala
2. Aguarde 2-6 jogadores
3. Host clica "Iniciar Batalha"

### **🎯 Durante sua Vez:**
1. **Rolar Dados** - Mova pelo tabuleiro
2. **Comprar Propriedade** - Se disponível
3. **Construir** - Se tem conjunto completo
4. **Gerenciar** - Hipotecar se precisar de dinheiro

### **🏆 Objetivo:**
Ser o último jogador não falido!

---

## 🛠️ **Comandos do Servidor**

### **📡 Eventos Implementados:**
- `roll_dice` - Rolar dados
- `buy_property` - Comprar propriedade
- `build_house` - Construir casa
- `build_hotel` - Construir hotel
- `mortgage_property` - Hipotecar
- `unmortgage_property` - Quitar hipoteca
- `sell_building` - Vender construção

---

## 🎨 **Visual e UX**

### **🌟 Destaques Visuais:**
- **Construções:** Casas verdes e hotéis vermelhos visíveis
- **Hipotecas:** Sobreposição vermelha clara
- **Propriedades:** Cores corretas do Monopoly
- **Jogadores:** Peças animadas com ícones únicos
- **Turnos:** Indicação clara do jogador atual

### **🎯 Feedback em Tempo Real:**
- Notificações toast para todas as ações
- Atualizações automáticas do gameState
- Animações suaves e responsivas

---

## 🚀 **Bitcoin Monopoly está 100% COMPLETO!**

Todas as mecânicas essenciais do Monopoly foram implementadas com tema Bitcoin e visual futurista épico! 🏛️⚡🎯 