import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import io from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';

import Home from './components/Home';
import GameLobby from './components/GameLobby';
import GameBoard from './components/GameBoard';

export const GameContext = createContext();

const matrixRain = keyframes`
  0% { transform: translateY(-100vh); opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
`;

const cosmicGlow = keyframes`
  0%, 100% { text-shadow: 0 0 20px rgba(247, 147, 26, 0.5); }
  50% { text-shadow: 0 0 40px rgba(247, 147, 26, 1), 0 0 60px rgba(247, 147, 26, 0.5); }
`;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Rajdhani', 'Arial', sans-serif;
    background: 
      radial-gradient(circle at 20% 80%, rgba(247, 147, 26, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(0, 0, 0, 0.8) 0%, transparent 50%),
      linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    color: white;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(247,147,26,0.05)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      pointer-events: none;
      z-index: -1;
    }
  }
  
  /* Customizar scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #f7931a, #ffcd00);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, #ffcd00, #f7931a);
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const MatrixChar = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['duration', 'left', 'delay'].includes(prop),
})`
  position: fixed;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: rgba(247, 147, 26, 0.3);
  pointer-events: none;
  z-index: 1;
  animation: ${matrixRain} ${props => props.duration}s linear infinite;
  left: ${props => props.left}%;
  animation-delay: ${props => props.delay}s;
`;

const Header = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: 
    linear-gradient(145deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%),
    rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border-bottom: 2px solid rgba(247, 147, 26, 0.3);
  padding: 1rem 2rem;
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    padding: 1.5rem 3rem;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    padding: 1.2rem 2.5rem;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    padding: 1rem 2rem;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    padding: 0.9rem 1.8rem;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    padding: 0.8rem 1.5rem;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    padding: 0.7rem 1.2rem;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    padding: 0.6rem 1rem;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    padding: 0.5rem 0.8rem;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    padding: 0.4rem 0.6rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    padding: 0.3rem 0.5rem;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    max-width: 1600px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    max-width: 1400px;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    max-width: 1200px;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    max-width: 100%;
  }
  
  /* Tablet e Mobile */
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  /* Mobile Muito Pequeno */
  @media (max-width: 374px) {
    flex-direction: column;
    gap: 0.3rem;
  }
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 800;
  color: #f7931a;
  animation: ${cosmicGlow} 3s ease-in-out infinite;
  letter-spacing: 2px;
  cursor: pointer;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    font-size: 2rem;
    gap: 1.5rem;
    letter-spacing: 3px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    font-size: 1.8rem;
    gap: 1.3rem;
    letter-spacing: 2.5px;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    font-size: 1.6rem;
    gap: 1.2rem;
    letter-spacing: 2px;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    font-size: 1.4rem;
    gap: 1rem;
    letter-spacing: 1.5px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    font-size: 1.3rem;
    gap: 0.9rem;
    letter-spacing: 1px;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    font-size: 1.2rem;
    gap: 0.8rem;
    letter-spacing: 0.8px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    font-size: 1.1rem;
    gap: 0.7rem;
    letter-spacing: 0.5px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    font-size: 1rem;
    gap: 0.6rem;
    letter-spacing: 0.3px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    font-size: 0.9rem;
    gap: 0.5rem;
    letter-spacing: 0.2px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    font-size: 0.8rem;
    gap: 0.4rem;
    letter-spacing: 0.1px;
  }
`;

const BitcoinIcon = styled(motion.span)`
  font-size: 2rem;
  filter: drop-shadow(0 0 20px rgba(247, 147, 26, 0.8));
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    font-size: 3rem;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    font-size: 2.5rem;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    font-size: 2.2rem;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    font-size: 2rem;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    font-size: 1.8rem;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    font-size: 1.6rem;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    font-size: 1.4rem;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    font-size: 1.2rem;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    font-size: 1rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    font-size: 0.9rem;
  }
`;

const ConnectionStatus = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    font-size: 1.3rem;
    gap: 1rem;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    font-size: 1.2rem;
    gap: 0.9rem;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    font-size: 1.1rem;
    gap: 0.8rem;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    font-size: 1rem;
    gap: 0.7rem;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    font-size: 0.95rem;
    gap: 0.6rem;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    font-size: 0.9rem;
    gap: 0.5rem;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    font-size: 0.85rem;
    gap: 0.4rem;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    font-size: 0.8rem;
    gap: 0.3rem;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    font-size: 0.75rem;
    gap: 0.25rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    font-size: 0.7rem;
    gap: 0.2rem;
  }
`;

const StatusIndicator = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['connected'].includes(prop),
})`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.connected ? 
    'linear-gradient(45deg, #00ff00, #00cc00)' : 
    'linear-gradient(45deg, #ff0000, #cc0000)'
  };
  box-shadow: 
    0 0 20px ${props => props.connected ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.5)'},
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  animation: ${props => props.connected ? cosmicGlow : 'none'} 2s ease-in-out infinite;
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at center, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%),
    linear-gradient(45deg, rgba(247, 147, 26, 0.1), transparent, rgba(247, 147, 26, 0.1));
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const LoadingSpinner = styled(motion.div)`
  width: 80px;
  height: 80px;
  border: 4px solid rgba(247, 147, 26, 0.2);
  border-top: 4px solid #f7931a;
  border-radius: 50%;
  margin-bottom: 2rem;
  box-shadow: 0 0 30px rgba(247, 147, 26, 0.5);
`;

const LoadingText = styled(motion.h2)`
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f7931a;
  text-align: center;
  animation: ${cosmicGlow} 2s ease-in-out infinite;
  letter-spacing: 2px;
`;

const CustomToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(247, 147, 26, 0.3);
    border-radius: 15px;
    color: white;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 500;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
  
  .Toastify__toast--success {
    border-color: rgba(0, 255, 0, 0.3);
  }
  
  .Toastify__toast--error {
    border-color: rgba(255, 0, 0, 0.3);
  }
  
  .Toastify__toast--info {
    border-color: rgba(0, 150, 255, 0.3);
  }
  
  .Toastify__close-button {
    color: #f7931a;
  }
`;

function App() {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [matrixChars, setMatrixChars] = useState([]);

  useEffect(() => {
    // Criar caracteres Matrix flutuantes
    const chars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      char: ['₿', '1', '0', 'Ξ', '♦', '◊', '●', '○'][Math.floor(Math.random() * 8)],
      left: Math.random() * 100,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5
    }));
    setMatrixChars(chars);

    // Simular carregamento inicial
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Conectar ao servidor
    console.log('🔌 Iniciando conexão com servidor...');
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5
      // Removido forceNew: true para evitar desconexões desnecessárias
    });

    newSocket.on('connect', () => {
      console.log('🚀 Conectado ao servidor Bitcoin Arena!');
      setIsConnected(true);
      setSocket(newSocket);
      toast.success('🌐 Conectado à Matrix Bitcoin!', {
        position: "top-right",
        autoClose: 3000
      });
    });

    newSocket.on('disconnect', () => {
      console.log('⚡ Desconectado do servidor');
      setIsConnected(false);
      toast.error('🔌 Conexão perdida com a Matrix!', {
        position: "top-right",
        autoClose: 5000
      });
    });

    newSocket.on('connect_error', (error) => {
      console.log('❌ Erro de conexão:', error);
      setIsConnected(false);
      toast.error('❌ Falha na conexão com o servidor!', {
        position: "top-right",
        autoClose: 5000
      });
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconectado após', attemptNumber, 'tentativas');
      setIsConnected(true);
      toast.success('🔄 Reconectado ao servidor!', {
        position: "top-right",
        autoClose: 3000
      });
    });

    newSocket.on('game_created', (data) => {
      console.log('🎮 Game created event:', data);
      console.log('🆔 Definindo playerId (criador):', data.playerId);
      setGameState(data.gameState);
      setPlayerId(data.playerId);
      setGameId(data.gameId);
    });

    newSocket.on('player_joined', (data) => {
      console.log('👥 Player joined event:', data);
      setGameState(data.gameState);
      
      // Se este jogador acabou de se juntar, definir seu playerId
      if (!playerId && newSocket.id) {
        console.log('🆔 Definindo playerId para jogador que se juntou:', newSocket.id);
        setPlayerId(newSocket.id);
      }
    });

    newSocket.on('player_joined_self', (data) => {
      console.log('🎯 Player joined self event:', data);
      console.log('🆔 Definindo playerId (self):', data.playerId);
      setGameState(data.gameState);
      setPlayerId(data.playerId);
    });

    newSocket.on('player_left', (data) => {
      setGameState(data.gameState);
      toast.info('👋 Um guerreiro abandonou a batalha');
    });

    newSocket.on('turn_changed', (data) => {
      setGameState(data);
    });

    newSocket.on('game_started', (data) => {
      console.log('🎮 Jogo iniciado! Atualizando gameState:', data);
      console.log('🎮 gameStarted status:', data.gameStarted);
      console.log('🎮 Players count:', data.players?.length);
      setGameState(data);
      toast.success('🚀 Arena de Batalha ATIVADA!', {
        position: "top-center",
        autoClose: 3000
      });
    });

    newSocket.on('error', (message) => {
      toast.error(`⚠️ ${message}`, {
        position: "top-center",
        autoClose: 4000
      });
    });

    return () => {
      console.log('🧹 Limpando socket conexões...');
      if (newSocket) {
        newSocket.off('game_created');
        newSocket.off('player_joined');
        newSocket.off('player_joined_self');
        newSocket.off('player_left');
        newSocket.off('turn_changed');
        newSocket.off('game_started');
        newSocket.off('error');
        newSocket.disconnect();
      }
    };
      }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const contextValue = {
    socket,
    gameState,
    setGameState,
    playerId,
    playerName,
    setPlayerName,
    gameId,
    setGameId
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <AnimatePresence>
          {matrixChars.map((char) => (
            <MatrixChar
              key={char.id}
              left={char.left}
              duration={char.duration}
              delay={char.delay}
              initial={{ y: -100, opacity: 1 }}
              animate={{ y: window.innerHeight + 100, opacity: 0 }}
              transition={{
                duration: char.duration,
                delay: char.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {char.char}
            </MatrixChar>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && (
            <LoadingOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <LoadingText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                🚀 Inicializando Matrix Bitcoin...
              </LoadingText>
            </LoadingOverlay>
          )}
        </AnimatePresence>

        <Header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <HeaderContent>
            <Logo
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BitcoinIcon
                animate={{ rotateY: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                ₿
              </BitcoinIcon>
              Bitcoin Arena
            </Logo>
            
            <ConnectionStatus>
              <StatusIndicator 
                connected={isConnected}
                animate={isConnected ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>
                {isConnected ? '🌐 Matrix Online' : '⚡ Conectando...'}
              </span>
            </ConnectionStatus>
          </HeaderContent>
        </Header>

        <GameContext.Provider value={contextValue}>
          <Router>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lobby/:gameId" element={<GameLobby />} />
                <Route path="/game/:gameId" element={<GameBoard />} />
              </Routes>
            </motion.div>
          </Router>
        </GameContext.Provider>

        <CustomToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </AppContainer>
    </>
  );
}

export default App; 