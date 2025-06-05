// Configurações do Servidor Bitcoin Monopoly
module.exports = {
  server: {
    port: process.env.PORT || 5000,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  },
  
  game: {
    maxPlayersPerGame: 6,
    startingBalance: 0.15, // ₿0.15 = $1500 original Monopoly
    goBonus: 0.02, // ₿0.02 = $200 original por passar no início
    minPlayers: 2,
    
    // Valores originais Monopoly convertidos para Bitcoin
    railroadPrice: 0.02,    // ₿0.02 = $200 original
    utilityPrice: 0.015,    // ₿0.015 = $150 original
    incomeTax: 0.02,        // ₿0.02 = $200 original
    luxuryTax: 0.0075,      // ₿0.0075 = $75 original
    jailFine: 0.005         // ₿0.005 = $50 original para sair da prisão
  },
  
  bitcoin: {
    // Para futuras integrações com Bitcoin real
    network: process.env.BITCOIN_NETWORK || 'testnet',
    rpcHost: process.env.BITCOIN_RPC_HOST || 'localhost',
    rpcPort: process.env.BITCOIN_RPC_PORT || 18332,
    rpcUser: process.env.BITCOIN_RPC_USER || 'bitcoinrpc',
    rpcPassword: process.env.BITCOIN_RPC_PASSWORD || 'change_this_password'
  }
}; 