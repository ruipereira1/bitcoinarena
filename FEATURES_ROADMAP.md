# 🚀 Bitcoin Monopoly - Roadmap de Features

## 📊 Status Atual
- ✅ **CORE**: Movimento, compra básica, cartas, turnos
- ⚠️ **PARCIAL**: Construção, aluguel, regras especiais  
- ❌ **FALTANDO**: Sistema completo de construção, falência, features avançadas

---

## 🎯 **PRIORIDADE ALTA - Funcionalidades Essenciais**

### 🏗️ **1. Sistema de Construção Completo**
**Status**: ❌ **NÃO IMPLEMENTADO**

#### Backend (`server/server.js`):
```javascript
// Adicionar aos eventos do socket
socket.on('build_house', (data) => {
  const { propertyId } = data;
  const result = game.buildHouse(playerId, propertyId);
  // Emitir atualização
});

socket.on('build_hotel', (data) => {
  const { propertyId } = data;
  const result = game.buildHotel(playerId, propertyId);
  // Emitir atualização
});

// Métodos na classe Game
buildHouse(playerId, propertyId) {
  // Verificar se jogador possui todas propriedades da cor
  // Verificar saldo suficiente
  // Verificar estoque de casas (32 máximo)
  // Verificar distribuição uniforme
  // Construir casa
}

buildHotel(playerId, propertyId) {
  // Verificar 4 casas na propriedade
  // Converter 4 casas em 1 hotel
  // Verificar estoque hotéis (12 máximo)
  // Devolver casas ao banco
}
```

#### Frontend (`components/GameBoard.js`):
```javascript
// Botões de construção para cada propriedade
const canBuildHouse = (property) => {
  // Verificar conjunto completo
  // Verificar distribuição uniforme
  // Verificar saldo
};

// Interface de construção
<BuildingControls>
  <Button onClick={() => buildHouse(propertyId)}>
    🏠 Casa (₿{houseCost})
  </Button>
  <Button onClick={() => buildHotel(propertyId)}>
    🏨 Hotel (₿{hotelCost})
  </Button>
</BuildingControls>
```

#### Visual de Construções:
```javascript
// Mostrar casas verdes e hotéis vermelhos
{property.houses > 0 && (
  <BuildingIndicator>
    {Array.from({length: property.houses}).map((_, i) => 
      <House key={i} />
    )}
  </BuildingIndicator>
)}

{property.hotel && (
  <BuildingIndicator>
    <Hotel>H</Hotel>
  </BuildingIndicator>
)}
```

---

### 💰 **2. Sistema de Hipoteca e Venda**
**Status**: ❌ **NÃO IMPLEMENTADO**

#### Backend:
```javascript
// Hipotecar propriedade
mortgageProperty(playerId, propertyId) {
  const property = this.properties.get(propertyId);
  // Verificar se não tem construções
  // Receber 50% do valor
  // Marcar como hipotecada
  property.mortgaged = true;
  player.balance += property.price * 0.5;
}

// Quitar hipoteca
unmortgageProperty(playerId, propertyId) {
  const property = this.properties.get(propertyId);
  const unmortgageCost = property.price * 0.55; // 55% (50% + 10% juros)
  // Verificar saldo
  // Quitar hipoteca
  property.mortgaged = false;
  player.balance -= unmortgageCost;
}

// Vender construções
sellBuilding(playerId, propertyId, type) {
  // type: 'house' ou 'hotel'
  // Receber 50% do custo de construção
  // Seguir distribuição uniforme
}
```

#### Frontend:
```javascript
// Menu de gerenciamento de propriedades
<PropertyMenu property={property}>
  {!property.mortgaged ? (
    <Button onClick={() => mortgageProperty(property.id)}>
      💸 Hipotecar (₿{property.price * 0.5})
    </Button>
  ) : (
    <Button onClick={() => unmortgageProperty(property.id)}>
      💰 Quitar (₿{property.price * 0.55})
    </Button>
  )}
  
  {property.houses > 0 && (
    <Button onClick={() => sellHouse(property.id)}>
      🏚️ Vender Casa (₿{property.price * 0.25})
    </Button>
  )}
</PropertyMenu>
```

---

### ⚖️ **3. Regras Especiais Completas**
**Status**: ❌ **PARCIALMENTE IMPLEMENTADO**

#### A. Conjunto Completo (Dobrar Aluguel):
```javascript
// Verificar se jogador possui todas propriedades da cor
hasColorMonopoly(playerId, color) {
  const colorProperties = this.board.filter(s => s.color === color);
  const playerProperties = this.players.find(p => p.id === playerId).properties;
  return colorProperties.every(prop => playerProperties.includes(prop.id));
}

// Calcular aluguel com bônus de conjunto
calculateRent(propertyId, rollValue = null) {
  const property = this.properties.get(propertyId);
  let rent = property.rent[0]; // Aluguel base
  
  // Conjunto completo sem construções = dobrar
  if (this.hasColorMonopoly(property.owner, property.color) && property.houses === 0) {
    rent *= 2;
  }
  
  // Aluguel com construções
  if (property.houses > 0) {
    rent = property.rent[property.houses];
  }
  
  if (property.hotel) {
    rent = property.rent[5]; // Último índice = hotel
  }
  
  return rent;
}
```

#### B. Sistema de Estações:
```javascript
// Calcular aluguel de estações baseado em quantidade
calculateRailroadRent(playerId) {
  const railroads = this.players.find(p => p.id === playerId).properties
    .filter(propId => this.properties.get(propId).type === 'railroad');
  
  const rentMultiplier = [0, 0.0025, 0.005, 0.01, 0.02]; // 1-4 estações
  return rentMultiplier[railroads.length];
}
```

#### C. Sistema de Utilities:
```javascript
// Aluguel baseado nos dados
calculateUtilityRent(playerId, diceRoll) {
  const utilities = this.players.find(p => p.id === playerId).properties
    .filter(propId => this.properties.get(propId).type === 'utility');
  
  const multiplier = utilities.length === 1 ? 4 : 10;
  return diceRoll * multiplier * 0.001; // ₿0.001 por ponto
}
```

---

### 🔒 **4. Sistema de Prisão Completo**
**Status**: ❌ **BÁSICO IMPLEMENTADO**

#### Funcionalidades Faltantes:
```javascript
// Duplas consecutivas (3x = prisão)
trackDoubles(playerId) {
  const player = this.players.find(p => p.id === playerId);
  if (this.lastDiceRoll[0] === this.lastDiceRoll[1]) {
    player.consecutiveDoubles = (player.consecutiveDoubles || 0) + 1;
    if (player.consecutiveDoubles >= 3) {
      this.sendToJail(playerId);
      player.consecutiveDoubles = 0;
    }
  } else {
    player.consecutiveDoubles = 0;
  }
}

// Opções para sair da prisão
getOutOfJail(playerId, method) {
  // method: 'pay', 'card', 'double'
  const player = this.players.find(p => p.id === playerId);
  
  switch(method) {
    case 'pay':
      player.balance -= 0.005; // ₿0.005 = $50
      break;
    case 'card':
      // Usar carta "Saia da Prisão Livre"
      break;
    case 'double':
      // Tirar dupla nos dados
      break;
  }
  
  player.inJail = false;
  player.jailTurns = 0;
}
```

---

## 🎯 **PRIORIDADE MÉDIA - Melhorias de Experiência**

### 🏆 **5. Sistema de Falência e Fim de Jogo**
**Status**: ❌ **NÃO IMPLEMENTADO**

```javascript
// Detectar falência
checkBankruptcy(playerId) {
  const player = this.players.find(p => p.id === playerId);
  
  // Calcular valor total liquidável
  const totalAssets = this.calculateTotalAssets(playerId);
  
  if (player.balance + totalAssets < debtAmount) {
    this.declareBankruptcy(playerId);
  }
}

// Processo de falência
declareBankruptcy(playerId) {
  // Devolver propriedades ao banco
  // Vender construções a 50%
  // Remover jogador
  // Verificar se jogo acabou
}

// Verificar vitória
checkGameEnd() {
  const activePlayers = this.players.filter(p => !p.bankrupt);
  if (activePlayers.length === 1) {
    this.endGame(activePlayers[0]);
  }
}
```

### ⏱️ **6. Timer de Turnos**
**Status**: ❌ **NÃO IMPLEMENTADO**

```javascript
// Timer automático para turnos
startTurnTimer(playerId) {
  this.turnTimer = setTimeout(() => {
    // Pular turno automaticamente
    this.nextPlayer();
  }, 60000); // 60 segundos
}

// Interface de timer
<TurnTimer>
  <CircularProgress value={timeRemaining} max={60} />
  <span>{timeRemaining}s</span>
</TurnTimer>
```

### 🎲 **7. Leilões de Propriedades**
**Status**: ❌ **NÃO IMPLEMENTADO**

```javascript
// Iniciar leilão se jogador não comprar
startAuction(propertyId) {
  this.auctionState = {
    propertyId,
    currentBid: 0.001, // ₿0.001 mínimo
    currentBidder: null,
    bids: [],
    timeRemaining: 30
  };
}

// Interface de leilão
<AuctionModal>
  <PropertyCard property={auctionProperty} />
  <BidInput placeholder="Seu lance..." />
  <BidButton>💰 Dar Lance</BidButton>
  <Timer>{timeRemaining}s</Timer>
</AuctionModal>
```

---

## 🎯 **PRIORIDADE BAIXA - Features Avançadas**

### 📊 **8. Estatísticas e Análises**
```javascript
// Tracking detalhado
const gameStats = {
  totalMoney: player.balance,
  propertiesOwned: player.properties.length,
  totalRentPaid: player.totalRentPaid,
  totalRentReceived: player.totalRentReceived,
  turnsInJail: player.turnsInJail,
  monopoliesFormed: player.monopolies.length
};
```

### 👀 **9. Modo Espectador**
```javascript
// Permitir espectadores assistindo
socket.on('join_as_spectator', (gameId) => {
  // Adicionar à sala como espectador
  // Receber updates mas não pode jogar
});
```

### 💾 **10. Persistência e Reconnect**
```javascript
// Salvar estado do jogo em banco
saveGameState() {
  // MongoDB/PostgreSQL
  // Permitir reconectar em jogos salvos
}

// Reconnect automático
handleReconnect(playerId, socketId) {
  // Restaurar jogador na partida
  // Sincronizar estado atual
}
```

---

## 🛠️ **IMPLEMENTAÇÃO SUGERIDA**

### **Fase 1 (Essencial - 2-3 dias):**
1. ✅ Sistema de construção (casas + hotéis)
2. ✅ Hipoteca e venda
3. ✅ Regras de conjunto completo
4. ✅ Estações e utilities corretos

### **Fase 2 (Experiência - 1-2 dias):**
5. ✅ Sistema de falência
6. ✅ Timer de turnos  
7. ✅ Prisão completa

### **Fase 3 (Avançado - opcional):**
8. ✅ Leilões
9. ✅ Estatísticas
10. ✅ Features premium

---

## 🎮 **O Bitcoin Monopoly será um Monopoly 100% completo e funcional!**

Com este roadmap, teremos todas as mecânicas originais implementadas com tema Bitcoin moderno! 🏛️⚡💰 