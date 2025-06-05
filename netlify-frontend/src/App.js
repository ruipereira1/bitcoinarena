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
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
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
`;

const BitcoinIcon = styled(motion.span)`
  font-size: 2rem;
  filter: drop-shadow(0 0 20px rgba(247, 147, 26, 0.8));
`;

const ConnectionStatus = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 1rem;
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
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
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