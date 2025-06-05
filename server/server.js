const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://bitcoinarena.netlify.app",
      "https://bitcoin-monopoly.netlify.app"
    ],
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://bitcoinarena.netlify.app",
    "https://bitcoin-monopoly.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Dados do jogo
const games = new Map();
const players = new Map();

// Tabuleiro do Monopoly - NOMES CURTOS para caber nas casas
const boardSpaces = [
  { id: 0, name: "PARTIDA", type: "go", price: 0 },
  { id: 1, name: "Bitcoin St", type: "property", price: 0.006, color: "brown", rent: [0.0002, 0.001, 0.003, 0.009, 0.016, 0.025] },
  { id: 2, name: "Arca Comunitária", type: "community_chest", price: 0 },
  { id: 3, name: "Satoshi St", type: "property", price: 0.006, color: "brown", rent: [0.0004, 0.002, 0.006, 0.018, 0.032, 0.045] },
  { id: 4, name: "Imposto", type: "tax", price: 0.02 },
  { id: 5, name: "Estação 1", type: "railroad", price: 0.02 },
  { id: 6, name: "Ethereum", type: "property", price: 0.01, color: "lightblue", rent: [0.0006, 0.003, 0.009, 0.027, 0.04, 0.055] },
  { id: 7, name: "Sorte", type: "chance", price: 0 },
  { id: 8, name: "Litecoin", type: "property", price: 0.01, color: "lightblue", rent: [0.0006, 0.003, 0.009, 0.027, 0.04, 0.055] },
  { id: 9, name: "Cardano", type: "property", price: 0.012, color: "lightblue", rent: [0.0008, 0.004, 0.01, 0.03, 0.045, 0.06] },
  { id: 10, name: "CADEIA", type: "jail", price: 0 },
  { id: 11, name: "Solana", type: "property", price: 0.014, color: "purple", rent: [0.001, 0.005, 0.015, 0.045, 0.0625, 0.075] },
  { id: 12, name: "Companhia Elétrica", type: "utility", price: 0.015 },
  { id: 13, name: "Polygon", type: "property", price: 0.014, color: "purple", rent: [0.001, 0.005, 0.015, 0.045, 0.0625, 0.075] },
  { id: 14, name: "Chainlink", type: "property", price: 0.016, color: "purple", rent: [0.0012, 0.006, 0.018, 0.05, 0.07, 0.09] },
  { id: 15, name: "Estação 2", type: "railroad", price: 0.02 },
  { id: 16, name: "DeFi St", type: "property", price: 0.018, color: "orange", rent: [0.0014, 0.007, 0.02, 0.055, 0.075, 0.095] },
  { id: 17, name: "Arca Comunitária", type: "community_chest", price: 0 },
  { id: 18, name: "NFT Plaza", type: "property", price: 0.018, color: "orange", rent: [0.0014, 0.007, 0.02, 0.055, 0.075, 0.095] },
  { id: 19, name: "Web3 Ave", type: "property", price: 0.02, color: "orange", rent: [0.0016, 0.008, 0.022, 0.06, 0.08, 0.1] },
  { id: 20, name: "ESTACIONAMENTO", type: "free_parking", price: 0 },
  { id: 21, name: "Metaverse", type: "property", price: 0.022, color: "red", rent: [0.0018, 0.009, 0.025, 0.07, 0.0875, 0.105] },
  { id: 22, name: "Sorte", type: "chance", price: 0 },
  { id: 23, name: "DAO St", type: "property", price: 0.022, color: "red", rent: [0.0018, 0.009, 0.025, 0.07, 0.0875, 0.105] },
  { id: 24, name: "Smart St", type: "property", price: 0.024, color: "red", rent: [0.002, 0.01, 0.03, 0.075, 0.0925, 0.11] },
  { id: 25, name: "Estação 3", type: "railroad", price: 0.02 },
  { id: 26, name: "Binance", type: "property", price: 0.026, color: "yellow", rent: [0.0022, 0.011, 0.033, 0.08, 0.0975, 0.115] },
  { id: 27, name: "Coinbase", type: "property", price: 0.026, color: "yellow", rent: [0.0022, 0.011, 0.033, 0.08, 0.0975, 0.115] },
  { id: 28, name: "Companhia de Águas", type: "utility", price: 0.015 },
  { id: 29, name: "Kraken", type: "property", price: 0.028, color: "yellow", rent: [0.0024, 0.012, 0.036, 0.085, 0.1025, 0.12] },
  { id: 30, name: "VÁ PARA CADEIA", type: "go_to_jail", price: 0 },
  { id: 31, name: "HODL Ave", type: "property", price: 0.03, color: "green", rent: [0.0026, 0.013, 0.039, 0.09, 0.11, 0.127] },
  { id: 32, name: "Diamond", type: "property", price: 0.032, color: "green", rent: [0.0028, 0.015, 0.045, 0.1, 0.12, 0.14] },
  { id: 33, name: "Arca Comunitária", type: "community_chest", price: 0 },
  { id: 34, name: "Moon St", type: "property", price: 0.032, color: "green", rent: [0.0028, 0.015, 0.045, 0.1, 0.12, 0.14] },
  { id: 35, name: "Estação 4", type: "railroad", price: 0.02 },
  { id: 36, name: "Sorte", type: "chance", price: 0 },
  { id: 37, name: "Lambo", type: "property", price: 0.035, color: "darkblue", rent: [0.0035, 0.0175, 0.05, 0.11, 0.13, 0.15] },
  { id: 38, name: "Imposto de Luxo", type: "tax", price: 0.0075 },
  { id: 39, name: "₿ Palace", type: "property", price: 0.04, color: "darkblue", rent: [0.005, 0.02, 0.06, 0.14, 0.17, 0.2] }
];

// Cartas de Sorte
const chanceCards = [
  { id: 1, text: "Avance para o INÍCIO. Colete ₿0.002", action: "move_to_go" },
  { id: 2, text: "Seu investimento em Bitcoin deu lucro! Receba ₿0.005", action: "collect", amount: 0.005 },
  { id: 3, text: "Vá para a Prisão. Não passe pelo INÍCIO", action: "go_to_jail" },
  { id: 4, text: "Taxa de transação blockchain. Pague ₿0.001", action: "pay", amount: 0.001 },
  { id: 5, text: "Avance até a Rua Satoshi. Se passar pelo INÍCIO, colete ₿0.002", action: "move_to", space: 11 },
  { id: 6, text: "Você minerou um bloco! Receba ₿0.008", action: "collect", amount: 0.008 },
  { id: 7, text: "Retroceda 3 casas", action: "move_back", spaces: 3 },
  { id: 8, text: "Pague taxa de energia para mining: ₿0.003", action: "pay", amount: 0.003 },
  { id: 9, text: "Avance até a próxima Exchange. Pague o dobro do aluguel", action: "move_to_next", type: "railroad", double_rent: true },
  { id: 10, text: "Saia da Prisão Gratuitamente. Guarde esta carta.", action: "get_out_of_jail_free" }
];

// Cartas de Cofre Comunitário
const communityCards = [
  { id: 1, text: "Avance para o INÍCIO. Colete ₿0.002", action: "move_to_go" },
  { id: 2, text: "Erro bancário a seu favor. Receba ₿0.002", action: "collect", amount: 0.002 },
  { id: 3, text: "Taxas médicas. Pague ₿0.005", action: "pay", amount: 0.005 },
  { id: 4, text: "Venda de NFT! Receba ₿0.01", action: "collect", amount: 0.01 },
  { id: 5, text: "Imposto de renda. Pague ₿0.002", action: "pay", amount: 0.002 },
  { id: 6, text: "Prêmio DeFi! Receba ₿0.002", action: "collect", amount: 0.002 },
  { id: 7, text: "Seguro de carteira vence. Receba ₿0.001", action: "collect", amount: 0.001 },
  { id: 8, text: "Taxa de consultor cripto. Pague ₿0.005", action: "pay", amount: 0.005 },
  { id: 9, text: "Saia da Prisão Gratuitamente. Guarde esta carta.", action: "get_out_of_jail_free" },
  { id: 10, text: "Vá para a Prisão. Não passe pelo INÍCIO", action: "go_to_jail" }
];

class Game {
  constructor(id, hostId) {
    this.id = id;
    this.hostId = hostId;
    this.players = [];
    this.currentPlayerIndex = 0;
    this.gameStarted = false;
    this.gameEnded = false;
    this.winner = null;
    this.startTime = Date.now();
    this.board = [...boardSpaces];
    this.properties = new Map();
    this.bankBalance = 1000; // Bitcoin do banco
    this.chanceCards = [...chanceCards];
    this.communityCards = [...communityCards];
    this.drawnCards = [];
    this.lastDiceRoll = [1, 1];
    this.housesRemaining = 32; // Casas disponíveis no banco
    this.hotelsRemaining = 12; // Hotéis disponíveis no banco
    this.freeParking = 0; // Dinheiro acumulado no estacionamento livre
    this.emptyGameTimeout = null; // Timer para deletar jogos vazios
    
    // Embaralhar cartas
    this.shuffleCards();
    
    // Inicializar propriedades
    this.board.forEach(space => {
      if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
        this.properties.set(space.id, {
          ...space,
          owner: null,
          houses: 0,
          hotel: false,
          mortgaged: false,
          rent: space.rent || this.calculateBaseRent(space)
        });
      }
    });
  }

  shuffleCards() {
    this.chanceCards = this.chanceCards.sort(() => Math.random() - 0.5);
    this.communityCards = this.communityCards.sort(() => Math.random() - 0.5);
  }

  calculateBaseRent(property) {
    // Aluguéis baseados no preço da propriedade
    if (property.type === 'property') {
      return property.price * 0.1; // 10% do valor
    } else if (property.type === 'railroad') {
      return 0.0005; // Valor fixo para estações
    } else if (property.type === 'utility') {
      return 0.0003; // Valor fixo para utilities
    }
    return 0;
  }

  calculateRent(propertyId, playerId) {
    const property = this.properties.get(propertyId);
    if (!property || !property.owner || property.mortgaged || property.owner === playerId) return 0;

    let rent = 0;

    if (property.type === 'property') {
      if (property.hotel) {
        // Hotel: último valor da array de aluguéis
        rent = property.rent[5];
      } else if (property.houses > 0) {
        // Casas: índice baseado no número de casas
        rent = property.rent[property.houses];
      } else {
        // Terreno vazio
        rent = property.rent[0];
        
        // Verificar se possui conjunto completo (dobra aluguel)
        const sameColorProperties = Array.from(this.properties.values())
          .filter(p => p.color === property.color && p.type === 'property');
        const ownerProperties = sameColorProperties.filter(p => p.owner === property.owner);
        
        if (sameColorProperties.length === ownerProperties.length) {
          rent *= 2; // Dobra o aluguel se tem conjunto completo
        }
      }
    } else if (property.type === 'railroad') {
      // Estações: aluguel baseado no número de estações do jogador
      const railroads = Array.from(this.properties.values())
        .filter(p => p.type === 'railroad' && p.owner === property.owner);
      const railroadRents = [0.0025, 0.005, 0.01, 0.02]; // 1, 2, 3, 4 estações (₿25, ₿50, ₿100, ₿200)
      rent = railroadRents[railroads.length - 1] || 0;
    } else if (property.type === 'utility') {
      // Utilities: aluguel baseado nos dados
      const utilities = Array.from(this.properties.values())
        .filter(p => p.type === 'utility' && p.owner === property.owner);
      const multiplier = utilities.length === 2 ? 10 : 4;
      const lastRoll = this.lastDiceRoll || [1, 1];
      rent = (lastRoll[0] + lastRoll[1]) * 0.001 * multiplier; // 4x ou 10x dos dados
    }

    return rent;
  }

  drawCard(type) {
    const deck = type === 'chance' ? this.chanceCards : this.communityCards;
    if (deck.length === 0) {
      // Reembaralhar se acabaram as cartas
      if (type === 'chance') {
        this.chanceCards = [...chanceCards].sort(() => Math.random() - 0.5);
      } else {
        this.communityCards = [...communityCards].sort(() => Math.random() - 0.5);
      }
    }
    
    const card = deck.pop();
    this.drawnCards.push({...card, type});
    return card;
  }

  executeCardAction(playerId, card) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return false;

    let message = "";

    switch (card.action) {
      case 'move_to_go':
        player.position = 0;
        player.balance += 0.002;
        message = "Movido para o INÍCIO. Recebeu ₿0.002";
        break;

      case 'collect':
        player.balance += card.amount;
        message = `Recebeu ₿${card.amount}`;
        break;

      case 'pay':
        if (player.balance >= card.amount) {
          player.balance -= card.amount;
          message = `Pagou ₿${card.amount}`;
        } else {
          message = `Não tem saldo suficiente para pagar ₿${card.amount}`;
        }
        break;

      case 'go_to_jail':
        player.position = 10;
        player.inJail = true;
        player.jailTurns = 0;
        player.doublesCount = 0;
        message = "Enviado para a Prisão";
        break;

      case 'get_out_of_jail_free':
        player.hasGetOutOfJailCard = true;
        message = "Recebeu carta de sair da prisão gratuitamente!";
        break;

      case 'move_to':
        const oldPos = player.position;
        player.position = card.space;
        if (player.position < oldPos) {
          player.balance += 0.002; // Passou pelo início
          message = `Movido para posição ${card.space}. Passou pelo INÍCIO, recebeu ₿0.002`;
        } else {
          message = `Movido para posição ${card.space}`;
        }
        break;

      case 'move_back':
        player.position = Math.max(0, player.position - card.spaces);
        message = `Retrocedeu ${card.spaces} casas`;
        break;

      case 'move_to_next':
        // Implementar lógica para mover para próximo tipo
        message = "Movido para próxima propriedade especial";
        break;
    }

    return { success: true, message };
  }

  addPlayer(player) {
    if (this.players.length < 6) {
      // Cancelar timeout de deletar jogo vazio se existir
      if (this.emptyGameTimeout) {
        console.log('✅ Cancelando timeout - jogador entrou no jogo');
        clearTimeout(this.emptyGameTimeout);
        this.emptyGameTimeout = null;
      }

      player.position = 0;
      player.balance = 0.15; // ₿0.15 = $1500 original do Monopoly
      player.properties = [];
      player.inJail = false;
      player.jailTurns = 0;
      player.doublesCount = 0; // Para contar dados duplos consecutivos
      player.hasGetOutOfJailCard = false;
      this.players.push(player);
      return true;
    }
    return false;
  }

  removePlayer(playerId) {
    console.log('🔄 Removendo jogador:', playerId, 'de', this.players.length, 'jogadores');
    this.players = this.players.filter(p => p.id !== playerId);
    console.log('🔄 Jogadores restantes:', this.players.length);
    
    // Limpar timeout anterior se existir
    if (this.emptyGameTimeout) {
      clearTimeout(this.emptyGameTimeout);
      this.emptyGameTimeout = null;
    }
    
    // Se o jogo ainda não iniciou e ficar sem jogadores, aguardar 2 minutos antes de deletar
    if (this.players.length === 0 && !this.gameStarted) {
      console.log('⏰ Iniciando timer de 2 minutos para deletar jogo vazio');
      this.emptyGameTimeout = setTimeout(() => {
        console.log('🗑️ Deletando jogo vazio por timeout:', this.id);
        return true; // Will be handled by the timeout callback
      }, 120000); // 2 minutes
      return false; // Don't delete immediately
    }
    
    // Se o jogo já iniciou, manter o jogo ativo mesmo sem jogadores (reconexão)
    if (this.gameStarted && this.players.length === 0) {
      console.log('⏸️ Jogo pausado - aguardando reconexão');
      return false; // Keep game alive for reconnection
    }
    
    // Adjust current player index if needed
    if (this.players.length > 0 && this.currentPlayerIndex >= this.players.length) {
      this.currentPlayerIndex = 0;
    }
    
    return false;
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }

  rollDice() {
    return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
  }

  movePlayer(playerId, spaces) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return false;

    const oldPosition = player.position;
    player.position = (player.position + spaces) % 40;
    
    // Passou pelo início
    if (player.position < oldPosition) {
      player.balance += 0.02; // Recebe ₿0.02 = $200 original por passar no início
    }

    // Verificar ação da casa atual
    const currentSpace = this.board[player.position];
    const actions = [];

    switch (currentSpace.type) {
      case 'property':
      case 'railroad':
      case 'utility':
        const property = this.properties.get(currentSpace.id);
        if (property.owner && property.owner !== playerId) {
          // Pagar aluguel
          const rent = this.calculateRent(currentSpace.id, playerId);
          if (player.balance >= rent) {
            player.balance -= rent;
            const owner = this.players.find(p => p.id === property.owner);
            if (owner) {
              owner.balance += rent;
              actions.push({
                type: 'rent_paid',
                amount: rent,
                to: owner.name,
                property: currentSpace.name
              });
            }
          } else {
            // Verificar se jogador pode pagar liquidando bens
            const canPayDebt = !this.checkBankruptcy(playerId, rent);
            
            if (canPayDebt) {
              actions.push({
                type: 'insufficient_funds',
                amount: rent,
                property: currentSpace.name,
                message: 'Venda propriedades ou construções para pagar'
              });
            } else {
              // Declarar falência
              this.declareBankruptcy(playerId, property.owner);
              actions.push({
                type: 'bankruptcy',
                amount: rent,
                property: currentSpace.name,
                creditor: property.owner
              });
            }
          }
        } else if (!property.owner && player.balance >= property.price) {
          // Propriedade disponível para compra
          actions.push({
            type: 'property_available',
            propertyId: currentSpace.id,
            propertyName: currentSpace.name,
            price: property.price,
            playerId: playerId
          });
        }
        break;

      case 'chance':
        const chanceCard = this.drawCard('chance');
        const chanceResult = this.executeCardAction(playerId, chanceCard);
        actions.push({
          type: 'card_drawn',
          cardType: 'chance',
          card: chanceCard,
          result: chanceResult
        });
        break;

      case 'community_chest':
        const communityCard = this.drawCard('community_chest');
        const communityResult = this.executeCardAction(playerId, communityCard);
        actions.push({
          type: 'card_drawn',
          cardType: 'community_chest',
          card: communityCard,
          result: communityResult
        });
        break;

      case 'tax':
        const taxAmount = currentSpace.price;
        if (player.balance >= taxAmount) {
          player.balance -= taxAmount;
          this.freeParking += taxAmount; // Acumula no estacionamento livre
          actions.push({
            type: 'tax_paid',
            amount: taxAmount,
            taxType: currentSpace.name
          });
        }
        break;

      case 'free_parking':
        // Jogador recebe todo o dinheiro acumulado no estacionamento
        if (this.freeParking > 0) {
          player.balance += this.freeParking;
          actions.push({
            type: 'free_parking_bonus',
            amount: this.freeParking,
            message: `Recebeu ₿${this.freeParking} do estacionamento livre!`
          });
          this.freeParking = 0;
        }
        break;

      case 'go_to_jail':
        player.position = 10;
        player.inJail = true;
        player.jailTurns = 0;
        actions.push({
          type: 'sent_to_jail'
        });
        break;
    }

    return { success: true, actions };
  }

  buyProperty(playerId, propertyId) {
    const player = this.players.find(p => p.id === playerId);
    const property = this.properties.get(propertyId);
    
    if (!player || !property || property.owner || player.balance < property.price) {
      return false;
    }

    player.balance -= property.price;
    property.owner = playerId;
    player.properties.push(propertyId);
    
    return true;
  }

  getGameState() {
    return {
      id: this.id,
      hostId: this.hostId,
      players: this.players,
      currentPlayerIndex: this.currentPlayerIndex,
      gameStarted: this.gameStarted,
      gameEnded: this.gameEnded,
      winner: this.winner,
      board: this.board,
      properties: Array.from(this.properties.entries()),
      freeParking: this.freeParking,
      housesRemaining: this.housesRemaining,
      hotelsRemaining: this.hotelsRemaining
    };
  }

  // Nova função: Construir casa
  buildHouse(playerId, propertyId) {
    const player = this.players.find(p => p.id === playerId);
    const property = this.properties.get(propertyId);
    
    if (!player || !property || property.owner !== playerId || property.type !== 'property') {
      return { success: false, message: "Não é possível construir aqui" };
    }

    if (property.mortgaged) {
      return { success: false, message: "Propriedade hipotecada" };
    }

    if (property.hotel) {
      return { success: false, message: "Já possui hotel" };
    }

    if (property.houses >= 4) {
      return { success: false, message: "Máximo de 4 casas" };
    }

    // Verificar se possui conjunto completo
    const sameColorProperties = Array.from(this.properties.values())
      .filter(p => p.color === property.color && p.type === 'property');
    const ownerProperties = sameColorProperties.filter(p => p.owner === playerId);
    
    if (sameColorProperties.length !== ownerProperties.length) {
      return { success: false, message: "Precisa do conjunto completo" };
    }

    // Verificar distribuição uniforme de casas
    const minHouses = Math.min(...ownerProperties.map(p => p.houses));
    if (property.houses > minHouses) {
      return { success: false, message: "Deve construir uniformemente" };
    }

    // Custo da casa (metade do preço da propriedade)
    const houseCost = property.price * 0.5;
    
    if (player.balance < houseCost) {
      return { success: false, message: `Saldo insuficiente: ₿${houseCost}` };
    }

    if (this.housesRemaining <= 0) {
      return { success: false, message: "Não há casas disponíveis no banco" };
    }

    // Construir casa
    player.balance -= houseCost;
    property.houses += 1;
    this.housesRemaining -= 1;

    return { 
      success: true, 
      message: `Casa construída! Custo: ₿${houseCost}`,
      newHouseCount: property.houses 
    };
  }

  // Nova função: Construir hotel
  buildHotel(playerId, propertyId) {
    const player = this.players.find(p => p.id === playerId);
    const property = this.properties.get(propertyId);
    
    if (!player || !property || property.owner !== playerId || property.type !== 'property') {
      return { success: false, message: "Não é possível construir aqui" };
    }

    if (property.mortgaged) {
      return { success: false, message: "Propriedade hipotecada" };
    }

    if (property.hotel) {
      return { success: false, message: "Já possui hotel" };
    }

    if (property.houses !== 4) {
      return { success: false, message: "Precisa de 4 casas para construir hotel" };
    }

    // Custo do hotel (metade do preço da propriedade)
    const hotelCost = property.price * 0.5;
    
    if (player.balance < hotelCost) {
      return { success: false, message: `Saldo insuficiente: ₿${hotelCost}` };
    }

    if (this.hotelsRemaining <= 0) {
      return { success: false, message: "Não há hotéis disponíveis no banco" };
    }

    // Construir hotel (remove 4 casas e adiciona hotel)
    player.balance -= hotelCost;
    property.houses = 0;
    property.hotel = true;
    this.housesRemaining += 4; // Devolve as 4 casas ao banco
    this.hotelsRemaining -= 1;

    return { 
      success: true, 
      message: `Hotel construído! Custo: ₿${hotelCost}` 
    };
  }

  // Nova função: Hipotecar propriedade
  mortgageProperty(playerId, propertyId) {
    const player = this.players.find(p => p.id === playerId);
    const property = this.properties.get(propertyId);
    
    if (!player || !property || property.owner !== playerId) {
      return { success: false, message: "Não é sua propriedade" };
    }

    if (property.mortgaged) {
      return { success: false, message: "Já está hipotecada" };
    }

    if (property.houses > 0 || property.hotel) {
      return { success: false, message: "Remova construções primeiro" };
    }

    // Valor da hipoteca (metade do preço)
    const mortgageValue = property.price * 0.5;
    
    player.balance += mortgageValue;
    property.mortgaged = true;

    return { 
      success: true, 
      message: `Propriedade hipotecada por ₿${mortgageValue}`,
      mortgageValue 
    };
  }

  // Nova função: Quitar hipoteca
  unmortgageProperty(playerId, propertyId) {
    const player = this.players.find(p => p.id === playerId);
    const property = this.properties.get(propertyId);
    
    if (!player || !property || property.owner !== playerId) {
      return { success: false, message: "Não é sua propriedade" };
    }

    if (!property.mortgaged) {
      return { success: false, message: "Não está hipotecada" };
    }

    // Custo para quitar (110% do valor da hipoteca)
    const unmortgageCost = property.price * 0.55;
    
    if (player.balance < unmortgageCost) {
      return { success: false, message: `Saldo insuficiente: ₿${unmortgageCost}` };
    }

    player.balance -= unmortgageCost;
    property.mortgaged = false;

    return { 
      success: true, 
      message: `Hipoteca quitada! Custo: ₿${unmortgageCost}` 
    };
  }

  // Nova função: Vender construções
  sellBuilding(playerId, propertyId) {
    const player = this.players.find(p => p.id === playerId);
    const property = this.properties.get(propertyId);
    
    if (!player || !property || property.owner !== playerId) {
      return { success: false, message: "Não é sua propriedade" };
    }

    if (property.houses === 0 && !property.hotel) {
      return { success: false, message: "Não há construções para vender" };
    }

    // Verificar distribuição uniforme para casas
    if (property.houses > 0) {
      const sameColorProperties = Array.from(this.properties.values())
        .filter(p => p.color === property.color && p.type === 'property' && p.owner === playerId);
      const maxHouses = Math.max(...sameColorProperties.map(p => p.houses));
      
      if (property.houses < maxHouses) {
        return { success: false, message: "Deve vender uniformemente" };
      }
    }

    let sellValue = 0;
    
    if (property.hotel) {
      // Vender hotel por 50% do custo de construção
      sellValue = property.price * 0.25; // 50% de 50% do preço
      property.hotel = false;
      property.houses = 4; // Volta para 4 casas
      this.hotelsRemaining += 1;
      this.housesRemaining -= 4;
    } else if (property.houses > 0) {
      // Vender uma casa por 50% do custo de construção  
      sellValue = property.price * 0.25; // 50% de 50% do preço
      property.houses -= 1;
      this.housesRemaining += 1;
    }

    player.balance += sellValue;

    return { 
      success: true, 
      message: `Construção vendida por ₿${sellValue}`,
      sellValue 
    };
  }

  // Função melhorada: Verificar falência
  checkBankruptcy(playerId, debt) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return false;

    // Calcular patrimônio total liquidável
    let totalAssets = player.balance;
    
    player.properties.forEach(propId => {
      const property = this.properties.get(propId);
      if (property) {
        // Valor das propriedades
        totalAssets += property.mortgaged ? 0 : property.price * 0.5; // Valor de hipoteca
        
        // Valor das construções
        if (property.hotel) {
          totalAssets += property.price * 0.25; // Valor de venda do hotel
        } else {
          totalAssets += property.houses * property.price * 0.25; // Valor de venda das casas
        }
      }
    });

    return totalAssets < debt;
  }

  // Nova função: Declarar falência
  declareBankruptcy(playerId, creditorId = null) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return false;

    console.log(`💸 Jogador ${player.name} declarou falência!`);
    
    // Liquidar todos os bens
    const liquidationValue = this.liquidatePlayerAssets(playerId);
    
    if (creditorId) {
      // Pagar ao credor
      const creditor = this.players.find(p => p.id === creditorId);
      if (creditor) {
        creditor.balance += liquidationValue;
        console.log(`💰 ${creditor.name} recebeu ₿${liquidationValue} da falência`);
      }
    } else {
      // Devolver ao banco
      this.bankBalance += liquidationValue;
    }
    
    // Marcar jogador como falido
    player.bankrupt = true;
    player.active = false;
    
    // Verificar se o jogo acabou
    const activePlayers = this.players.filter(p => !p.bankrupt);
    if (activePlayers.length <= 1) {
      this.endGame(activePlayers[0] || null);
    }
    
    return true;
  }

  // Nova função: Liquidar bens do jogador
  liquidatePlayerAssets(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return 0;

    let totalValue = player.balance;
    
    // Vender todas as construções primeiro
    player.properties.forEach(propId => {
      const property = this.properties.get(propId);
      if (property) {
        // Vender construções
        if (property.hotel) {
          totalValue += property.price * 0.25;
          property.hotel = false;
          this.hotelsRemaining += 1;
        }
        if (property.houses > 0) {
          totalValue += property.houses * property.price * 0.25;
          this.housesRemaining += property.houses;
          property.houses = 0;
        }
        
        // Hipotecar ou vender propriedade
        if (!property.mortgaged) {
          totalValue += property.price * 0.5;
        }
        
        // Devolver propriedade ao banco
        property.owner = null;
        property.mortgaged = false;
      }
    });
    
    // Limpar propriedades do jogador
    player.properties = [];
    player.balance = 0;
    
    return totalValue;
  }

  // Nova função: Terminar jogo
  endGame(winner) {
    this.gameEnded = true;
    this.winner = winner;
    
    // Calcular estatísticas finais
    const finalStats = this.calculateFinalStats();
    
    console.log(`🏆 Jogo terminado! Vencedor: ${winner?.name || 'Nenhum'}`);
    
    return {
      winner,
      finalStats,
      endTime: new Date(),
      totalDuration: Date.now() - this.startTime
    };
  }

  // Nova função: Calcular estatísticas finais
  calculateFinalStats() {
    return this.players.map(player => {
      let totalWealth = player.balance;
      
      // Somar valor das propriedades
      player.properties.forEach(propId => {
        const property = this.properties.get(propId);
        if (property) {
          totalWealth += property.price;
          if (property.hotel) {
            totalWealth += property.price * 0.5;
          } else {
            totalWealth += property.houses * property.price * 0.5;
          }
        }
      });
      
      return {
        id: player.id,
        name: player.name,
        finalBalance: player.balance,
        totalWealth,
        propertiesOwned: player.properties.length,
        bankrupt: player.bankrupt || false,
        winner: player.id === this.winner?.id
      };
    });
  }

  // Sistema de prisão
  sendToJail(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return false;
    
    player.position = 10; // Posição da cadeia
    player.inJail = true;
    player.jailTurns = 0;
    player.doublesCount = 0; // Reset dados duplos
    
    return true;
  }

  payToGetOutOfJail(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.inJail) return { success: false, message: "Jogador não está na prisão" };
    
    const bailAmount = 0.005; // ₿0.005 = $50 original
    
    if (player.balance < bailAmount) {
      return { success: false, message: "Saldo insuficiente para pagar fiança" };
    }
    
    player.balance -= bailAmount;
    player.inJail = false;
    player.jailTurns = 0;
    
    return { success: true, message: `Fiança paga: ₿${bailAmount}` };
  }

  useGetOutOfJailCard(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.inJail) return { success: false, message: "Jogador não está na prisão" };
    
    if (!player.hasGetOutOfJailCard) {
      return { success: false, message: "Jogador não possui carta de saída da prisão" };
    }
    
    player.hasGetOutOfJailCard = false;
    player.inJail = false;
    player.jailTurns = 0;
    
    return { success: true, message: "Carta de saída da prisão usada!" };
  }

  attemptJailEscape(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player || !player.inJail) return { success: false, message: "Jogador não está na prisão" };
    
    player.jailTurns++;
    
    // Automaticamente sai após 3 turnos
    if (player.jailTurns >= 3) {
      const bailAmount = 0.005;
      if (player.balance >= bailAmount) {
        player.balance -= bailAmount;
        player.inJail = false;
        player.jailTurns = 0;
        return { success: true, message: "Forçado a pagar fiança após 3 turnos", forcedPayment: true };
      } else {
        // Se não pode pagar, fica mais um turno
        return { success: false, message: "Sem dinheiro para fiança obrigatória" };
      }
    }
    
    return { success: false, message: `Turno ${player.jailTurns} na prisão` };
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Novo jogador conectado:', socket.id);

  socket.on('create_game', (playerName) => {
    console.log('🎮 CREATE_GAME request:', { playerName, socketId: socket.id });
    
    const gameId = uuidv4();
    const playerId = socket.id;
    
    const player = {
      id: playerId,
      name: playerName,
      socketId: socket.id
    };

    const game = new Game(gameId, playerId);
    game.addPlayer(player);
    
    games.set(gameId, game);
    players.set(playerId, { gameId, socketId: socket.id });
    
    socket.join(gameId);
    
    console.log('✅ Jogo criado com sucesso:', {
      gameId,
      hostId: playerId,
      playerName,
      totalGames: games.size
    });
    
    socket.emit('game_created', { gameId, playerId, gameState: game.getGameState() });
  });

  socket.on('join_game', ({ gameId, playerName }) => {
    console.log('🚀 JOIN_GAME request:', { gameId, playerName, socketId: socket.id });
    
    const game = games.get(gameId);
    const playerId = socket.id;
    
    console.log('🔍 Buscando jogo:', { gameId, gameFound: !!game, totalGames: games.size });
    
    if (!game) {
      console.log('❌ Jogo não encontrado:', gameId);
      socket.emit('error', 'Jogo não encontrado');
      return;
    }

    const player = {
      id: playerId,
      name: playerName,
      socketId: socket.id
    };

    if (game.addPlayer(player)) {
      players.set(playerId, { gameId, socketId: socket.id });
      socket.join(gameId);
      
      // Enviar para o jogador que se juntou seu próprio ID
      socket.emit('player_joined_self', {
        playerId: playerId,
        gameState: game.getGameState()
      });
      
      // Enviar para todos os outros jogadores na sala
      io.to(gameId).emit('player_joined', {
        player,
        gameState: game.getGameState()
      });
    } else {
      socket.emit('error', 'Jogo está cheio');
    }
  });

  socket.on('start_game', () => {
    console.log('🎮 Recebido start_game de:', socket.id);
    const playerData = players.get(socket.id);
    console.log('📊 Player data:', playerData);
    
    if (!playerData) {
      console.log('❌ Player data não encontrado para:', socket.id);
      return;
    }
    
    const game = games.get(playerData.gameId);
    console.log('🎯 Game encontrado:', !!game);
    console.log('🎯 Game ID:', playerData.gameId);
    
    if (!game) {
      console.log('❌ Jogo não encontrado:', playerData.gameId);
      return;
    }
    
    console.log('👑 Host check - Game hostId:', game.hostId, 'Socket ID:', socket.id);
    if (game.hostId !== socket.id) {
      console.log('❌ Não é o host. Host:', game.hostId, 'Player:', socket.id);
      socket.emit('error', 'Apenas o host pode iniciar o jogo');
      return;
    }

    console.log('👥 Players count check:', game.players.length);
    if (game.players.length < 2) {
      console.log('❌ Poucos jogadores:', game.players.length);
      socket.emit('error', 'Precisa de pelo menos 2 jogadores');
      return;
    }

    console.log('✅ Todas as verificações passaram! Iniciando jogo:', playerData.gameId);
    console.log('🔧 gameStarted antes:', game.gameStarted);
    game.gameStarted = true;
    console.log('🔧 gameStarted depois:', game.gameStarted);
    
    const gameStateToSend = game.getGameState();
    console.log('📤 Enviando game_started com gameState:', gameStateToSend.gameStarted);
    
    io.to(playerData.gameId).emit('game_started', gameStateToSend);
    console.log('📡 game_started enviado para sala:', playerData.gameId);
  });

  socket.on('roll_dice', () => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game || !game.gameStarted) return;
    
    const currentPlayer = game.getCurrentPlayer();
    console.log('🎲 Servidor - Roll dice request:');
    console.log('  📊 currentPlayerIndex:', game.currentPlayerIndex);
    console.log('  👤 currentPlayer:', currentPlayer?.name, '(ID:', currentPlayer?.id, ')');
    console.log('  🎮 socket.id:', socket.id);
    console.log('  ✅ Is current player?', currentPlayer.id === socket.id);
    
    if (currentPlayer.id !== socket.id) {
      console.log('❌ Não é a vez deste jogador!');
      socket.emit('error', 'Não é sua vez');
      return;
    }

    // Se está na prisão, tentar escapar
    if (currentPlayer.inJail) {
      const dice = game.rollDice();
      const isDoubles = dice[0] === dice[1];
      game.lastDiceRoll = dice;
      
      if (isDoubles) {
        // Dados duplos: sai da prisão
        currentPlayer.inJail = false;
        currentPlayer.jailTurns = 0;
        
        const moveResult = game.movePlayer(socket.id, dice[0] + dice[1]);
        
        io.to(playerData.gameId).emit('dice_rolled', {
          playerId: socket.id,
          dice,
          total: dice[0] + dice[1],
          newPosition: currentPlayer.position,
          actions: [...(moveResult.actions || []), { type: 'jail_escape', message: 'Dados duplos! Saiu da prisão!' }],
          gameState: game.getGameState()
        });
      } else {
        // Não conseguiu sair
        const escapeResult = game.attemptJailEscape(socket.id);
        
        io.to(playerData.gameId).emit('dice_rolled', {
          playerId: socket.id,
          dice,
          total: dice[0] + dice[1],
          newPosition: currentPlayer.position,
          actions: [{ type: 'jail_attempt', message: escapeResult.message }],
          gameState: game.getGameState()
        });
      }
      
      // Só avança turno se não conseguiu sair ou se forçou pagamento
      if (!isDoubles) {
        setTimeout(() => {
          if (game.players.length === 0) return;
          game.nextTurn();
          io.to(playerData.gameId).emit('turn_changed', game.getGameState());
        }, 3000);
      }
      
      return;
    }

    // Jogada normal
    const dice = game.rollDice();
    const total = dice[0] + dice[1];
    const isDoubles = dice[0] === dice[1];
    game.lastDiceRoll = dice;
    
    // Contar dados duplos consecutivos
    if (isDoubles) {
      currentPlayer.doublesCount = (currentPlayer.doublesCount || 0) + 1;
      
      // 3 dados duplos seguidos = prisão
      if (currentPlayer.doublesCount >= 3) {
        game.sendToJail(socket.id);
        
        io.to(playerData.gameId).emit('dice_rolled', {
          playerId: socket.id,
          dice,
          total,
          newPosition: currentPlayer.position,
          actions: [{ type: 'sent_to_jail', message: '3 dados duplos seguidos! Vai para a prisão!' }],
          gameState: game.getGameState()
        });
        
        setTimeout(() => {
          if (game.players.length === 0) return;
          game.nextTurn();
          io.to(playerData.gameId).emit('turn_changed', game.getGameState());
        }, 3000);
        
        return;
      }
    } else {
      currentPlayer.doublesCount = 0;
    }
    
    const moveResult = game.movePlayer(socket.id, total);
    
    io.to(playerData.gameId).emit('dice_rolled', {
      playerId: socket.id,
      dice,
      total,
      newPosition: currentPlayer.position,
      actions: moveResult.actions,
      gameState: game.getGameState(),
      isDoubles,
      doublesCount: currentPlayer.doublesCount
    });

    // Auto advance turn (exceto se dados duplos)
    if (!isDoubles) {
      setTimeout(() => {
        console.log('⏳ 3 segundos passaram - mudando turno...');
        console.log('  📊 currentPlayerIndex antes:', game.currentPlayerIndex);
        
        // Verificar se ainda há players no jogo
        if (game.players.length === 0) {
          console.log('❌ Não há players no jogo. Cancelando mudança de turno.');
          return;
        }
        
        game.nextTurn();
        console.log('  📊 currentPlayerIndex depois:', game.currentPlayerIndex);
        console.log('  👤 Novo jogador:', game.getCurrentPlayer()?.name);
        
        const updatedGameState = game.getGameState();
        io.to(playerData.gameId).emit('turn_changed', updatedGameState);
        console.log('📡 turn_changed enviado!');
      }, 3000);
    }
  });

  socket.on('buy_property', (propertyId) => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game) return;
    
    if (game.buyProperty(socket.id, propertyId)) {
      io.to(playerData.gameId).emit('property_bought', {
        playerId: socket.id,
        propertyId,
        gameState: game.getGameState()
      });
    } else {
      socket.emit('error', 'Não foi possível comprar a propriedade');
    }
  });

  // Construir casa
  socket.on('build_house', (propertyId) => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game) return;
    
    const result = game.buildHouse(socket.id, propertyId);
    
    if (result.success) {
      io.to(playerData.gameId).emit('house_built', {
        playerId: socket.id,
        propertyId,
        houseCount: result.newHouseCount,
        message: result.message,
        gameState: game.getGameState()
      });
    } else {
      socket.emit('error', result.message);
    }
  });

  // Construir hotel
  socket.on('build_hotel', (propertyId) => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game) return;
    
    const result = game.buildHotel(socket.id, propertyId);
    
    if (result.success) {
      io.to(playerData.gameId).emit('hotel_built', {
        playerId: socket.id,
        propertyId,
        message: result.message,
        gameState: game.getGameState()
      });
    } else {
      socket.emit('error', result.message);
    }
  });

  // Hipotecar propriedade
  socket.on('mortgage_property', (propertyId) => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game) return;
    
    const result = game.mortgageProperty(socket.id, propertyId);
    
    if (result.success) {
      io.to(playerData.gameId).emit('property_mortgaged', {
        playerId: socket.id,
        propertyId,
        mortgageValue: result.mortgageValue,
        message: result.message,
        gameState: game.getGameState()
      });
    } else {
      socket.emit('error', result.message);
    }
  });

  // Quitar hipoteca
  socket.on('unmortgage_property', (propertyId) => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game) return;
    
    const result = game.unmortgageProperty(socket.id, propertyId);
    
    if (result.success) {
      io.to(playerData.gameId).emit('property_unmortgaged', {
        playerId: socket.id,
        propertyId,
        message: result.message,
        gameState: game.getGameState()
      });
    } else {
      socket.emit('error', result.message);
    }
  });

  // Vender construção
  socket.on('sell_building', (propertyId) => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game) return;
    
    const result = game.sellBuilding(socket.id, propertyId);
    
    if (result.success) {
      io.to(playerData.gameId).emit('building_sold', {
        playerId: socket.id,
        propertyId,
        sellValue: result.sellValue,
        message: result.message,
        gameState: game.getGameState()
      });
    } else {
      socket.emit('error', result.message);
    }
  });

  // Pagar para sair da prisão
  socket.on('pay_jail_bail', () => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game) return;
    
    const result = game.payToGetOutOfJail(socket.id);
    
    if (result.success) {
      io.to(playerData.gameId).emit('jail_bail_paid', {
        playerId: socket.id,
        message: result.message,
        gameState: game.getGameState()
      });
    } else {
      socket.emit('error', result.message);
    }
  });

  // Usar carta de sair da prisão
  socket.on('use_jail_card', () => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game) return;
    
    const result = game.useGetOutOfJailCard(socket.id);
    
    if (result.success) {
      io.to(playerData.gameId).emit('jail_card_used', {
        playerId: socket.id,
        message: result.message,
        gameState: game.getGameState()
      });
    } else {
      socket.emit('error', result.message);
    }
  });

  // Declarar falência manualmente
  socket.on('declare_bankruptcy', () => {
    const playerData = players.get(socket.id);
    if (!playerData) return;
    
    const game = games.get(playerData.gameId);
    if (!game) return;
    
    const success = game.declareBankruptcy(socket.id);
    
    if (success) {
      io.to(playerData.gameId).emit('player_bankrupt', {
        playerId: socket.id,
        gameState: game.getGameState()
      });
      
      // Verificar se o jogo terminou
      if (game.gameEnded) {
        io.to(playerData.gameId).emit('game_ended', {
          winner: game.winner,
          finalStats: game.calculateFinalStats(),
          gameState: game.getGameState()
        });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Jogador desconectado:', socket.id);
    
    const playerData = players.get(socket.id);
    if (playerData) {
      const game = games.get(playerData.gameId);
      if (game) {
        const shouldDeleteGame = game.removePlayer(socket.id);
        
        if (shouldDeleteGame) {
          games.delete(playerData.gameId);
        } else {
          io.to(playerData.gameId).emit('player_left', {
            playerId: socket.id,
            gameState: game.getGameState()
          });
        }
      }
      
      players.delete(socket.id);
    }
  });
});

// Rotas básicas
app.get('/health', (req, res) => {
  res.json({ status: 'ok', games: games.size, players: players.size });
});

app.get('/debug', (req, res) => {
  const gamesArray = Array.from(games.entries()).map(([id, game]) => ({
    id,
    hostId: game.hostId,
    playersCount: game.players.length,
    gameStarted: game.gameStarted,
    players: game.players.map(p => ({ id: p.id, name: p.name }))
  }));
  
  res.json({
    totalGames: games.size,
    totalPlayers: players.size,
    games: gamesArray
  });
});

server.listen(PORT, () => {
  console.log(`Servidor Bitcoin Monopoly rodando na porta ${PORT}`);
}); 