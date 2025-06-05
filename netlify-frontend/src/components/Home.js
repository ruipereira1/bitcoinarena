import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { GameContext } from '../App';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(247, 147, 26, 0.4); }
  50% { box-shadow: 0 0 60px rgba(247, 147, 26, 0.9), 0 0 90px rgba(247, 147, 26, 0.5); }
`;

const bitcoinSpin = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

const gradientShift = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  margin-top: 80px;
  position: relative;
  overflow: hidden;
  background: 
    radial-gradient(circle at 20% 50%, rgba(247, 147, 26, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 205, 0, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(102, 126, 234, 0.12) 0%, transparent 50%),
    linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* Desktop Grande (1440px+) */
  @media (min-width: 1440px) {
    padding: 3rem;
    margin-top: 100px;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    padding: 2.5rem;
    margin-top: 90px;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    padding: 2rem;
    margin-top: 80px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    padding: 1.8rem;
    margin-top: 70px;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    padding: 1.5rem;
    margin-top: 60px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    padding: 1.2rem;
    margin-top: 55px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    padding: 1rem;
    margin-top: 50px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    padding: 0.8rem;
    margin-top: 45px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    padding: 0.5rem;
    margin-top: 40px;
  }
`;

const FloatingParticle = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['size', 'opacity', 'duration'].includes(prop),
})`
  position: absolute;
  font-size: ${props => props.size}px;
  color: rgba(247, 147, 26, ${props => props.opacity});
  pointer-events: none;
  z-index: 1;
  animation: ${floatAnimation} ${props => props.duration}s ease-in-out infinite;
`;

const WelcomeCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(30px);
  border-radius: 35px;
  padding: 5rem 4rem;
  text-align: center;
  box-shadow: 
    0 25px 80px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(247, 147, 26, 0.25);
  max-width: 650px;
  width: 100%;
  position: relative;
  z-index: 10;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a, #ffcd00);
    background-size: 300% 300%;
    border-radius: 38px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    animation: ${gradientShift} 4s ease-in-out infinite;
  }
  
  &:hover::before {
    opacity: 0.4;
  }
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    padding: 6rem 5rem;
    border-radius: 40px;
    max-width: 800px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    padding: 5.5rem 4.5rem;
    border-radius: 38px;
    max-width: 750px;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    padding: 5rem 4rem;
    border-radius: 35px;
    max-width: 700px;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    padding: 4.5rem 3.5rem;
    border-radius: 32px;
    max-width: 650px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    padding: 4rem 3rem;
    border-radius: 30px;
    max-width: 600px;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    padding: 3.5rem 2.5rem;
    border-radius: 28px;
    max-width: 520px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    padding: 3rem 2rem;
    border-radius: 25px;
    max-width: 450px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    padding: 2.5rem 1.8rem;
    border-radius: 22px;
    max-width: 380px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    padding: 2rem 1.5rem;
    border-radius: 20px;
    max-width: 320px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    padding: 1.5rem 1rem;
    border-radius: 18px;
    max-width: 280px;
  }
`;

const Title = styled(motion.h2)`
  font-family: 'Orbitron', monospace;
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 1.5rem 0;
  background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a, #ffcd00);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${pulseGlow} 3s ease-in-out infinite, ${gradientShift} 6s ease-in-out infinite;
  text-shadow: 0 0 40px rgba(247, 147, 26, 0.6);
  letter-spacing: 3px;
  text-align: center;
  line-height: 1.1;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    font-size: 5rem;
    letter-spacing: 4px;
    margin-bottom: 2rem;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    font-size: 4.5rem;
    letter-spacing: 3.5px;
    margin-bottom: 1.8rem;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    font-size: 4rem;
    letter-spacing: 3px;
    margin-bottom: 1.5rem;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    font-size: 3.8rem;
    letter-spacing: 2.5px;
    margin-bottom: 1.4rem;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    font-size: 3.5rem;
    letter-spacing: 2.5px;
    margin-bottom: 1.3rem;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    font-size: 3.2rem;
    letter-spacing: 2px;
    margin-bottom: 1.2rem;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    font-size: 2.8rem;
    letter-spacing: 1.5px;
    margin-bottom: 1.1rem;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    font-size: 2.5rem;
    letter-spacing: 1px;
    margin-bottom: 1rem;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    font-size: 2.2rem;
    letter-spacing: 0.8px;
    margin-bottom: 0.9rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    font-size: 1.8rem;
    letter-spacing: 0.5px;
    margin-bottom: 0.8rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0 0 3rem 0;
  opacity: 0.95;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 2.5rem;
    max-width: 450px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.15rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    max-width: 380px;
  }
  
  @media (max-width: 320px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
    max-width: 280px;
  }
`;

const InputGroup = styled(motion.div)`
  margin-bottom: 2.5rem;
  text-align: center;
  width: 100%;
  position: relative;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  color: #f7931a;
  text-shadow: 0 2px 15px rgba(247, 147, 26, 0.4);
  letter-spacing: 1.5px;
  text-align: center;
  text-transform: uppercase;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 1.5rem 2rem;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.2rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 500;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(247, 147, 26, 0.3);
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
    font-weight: 400;
    text-align: center;
  }
  
  &:focus {
    outline: none;
    border-color: #f7931a;
    box-shadow: 
      0 0 0 4px rgba(247, 147, 26, 0.15),
      0 0 30px rgba(247, 147, 26, 0.4),
      0 8px 25px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 1.3rem 1.5rem;
    font-size: 1.1rem;
  }
  
  @media (max-width: 320px) {
    padding: 1.2rem 1.3rem;
    font-size: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 600px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.2rem;
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['primary'].includes(prop),
})`
  padding: 1.2rem 2.5rem;
  border: none;
  border-radius: 15px;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Rajdhani', sans-serif;
  letter-spacing: 1px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #f7931a 0%, #ffcd00 100%)' : 
    'rgba(255, 255, 255, 0.08)'
  };
  color: ${props => props.primary ? '#000' : '#fff'};
  border: ${props => props.primary ? 'none' : '2px solid rgba(255, 255, 255, 0.2)'};
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 15px 35px rgba(247, 147, 26, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 1.8rem;
    font-size: 0.95rem;
    width: 100%;
    max-width: 280px;
  }
  
  @media (max-width: 320px) {
    padding: 0.9rem 1.5rem;
    font-size: 0.9rem;
    max-width: 250px;
  }
`;

const BitcoinIcon = styled(motion.div)`
  font-size: 6rem;
  margin-bottom: 1.5rem;
  color: #f7931a;
  filter: drop-shadow(0 0 20px rgba(247, 147, 26, 0.6));
  animation: ${bitcoinSpin} 10s linear infinite;
  
  @media (max-width: 768px) {
    font-size: 5rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 320px) {
    font-size: 3rem;
    margin-bottom: 0.8rem;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
  max-width: 1000px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-top: 2.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    margin-top: 2rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #f7931a, #ffcd00, #f7931a);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(247, 147, 26, 0.2);
    border-color: rgba(247, 147, 26, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 2rem;
    border-radius: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    border-radius: 12px;
  }
  
  @media (max-width: 320px) {
    padding: 1.2rem;
    border-radius: 10px;
  }
`;

const FeatureIcon = styled(motion.div)`
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 15px rgba(247, 147, 26, 0.3));
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2.2rem;
    margin-bottom: 0.7rem;
  }
`;

const FeatureTitle = styled.h3`
  font-family: 'Orbitron', monospace;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #f7931a;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.6rem;
  }
`;

const FeatureDesc = styled.p`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.4;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

function Home() {
  const [playerName, setPlayerName] = useState('');
  const [gameIdInput, setGameIdInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const { socket, setPlayerName: setContextPlayerName, setGameId } = useContext(GameContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Criar partículas flutuantes de Bitcoin
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 20 + 15,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 10 + 15
    }));
    setParticles(newParticles);
  }, []);

  const createGame = () => {
    if (!playerName.trim()) {
      toast.error('Por favor, digite seu nome!', {
        style: { background: 'rgba(255, 0, 0, 0.1)', backdropFilter: 'blur(10px)' }
      });
      return;
    }

    if (!socket) {
      toast.error('Conectando ao servidor...');
      return;
    }

    setIsLoading(true);
    setContextPlayerName(playerName);
    socket.emit('create_game', playerName);

    socket.once('game_created', (data) => {
      setIsLoading(false);
      setGameId(data.gameId);
      navigate(`/lobby/${data.gameId}`);
      toast.success('🎮 Jogo criado com sucesso!', {
        style: { background: 'rgba(247, 147, 26, 0.1)', backdropFilter: 'blur(10px)' }
      });
    });

    socket.once('error', (message) => {
      setIsLoading(false);
      toast.error(message);
    });
  };

  const joinGame = () => {
    if (!playerName.trim()) {
      toast.error('Por favor, digite seu nome!');
      return;
    }

    if (!gameIdInput.trim()) {
      toast.error('Por favor, digite o ID do jogo!');
      return;
    }

    if (!socket) {
      toast.error('Conectando ao servidor...');
      return;
    }

    setIsLoading(true);
    setContextPlayerName(playerName);
    socket.emit('join_game', { gameId: gameIdInput, playerName });

    socket.once('player_joined', () => {
      setIsLoading(false);
      setGameId(gameIdInput);
      navigate(`/lobby/${gameIdInput}`);
      toast.success('🚀 Entrou no jogo com sucesso!');
    });

    socket.once('error', (message) => {
      setIsLoading(false);
      toast.error(message);
    });
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <AnimatePresence>
          {particles.map((particle) => (
            <FloatingParticle
              key={particle.id}
              size={particle.size}
              opacity={particle.opacity}
              duration={particle.duration}
              initial={{ x: particle.x, y: particle.y }}
              animate={{ 
                x: particle.x + (Math.sin(Date.now() * 0.001) * 50),
                y: particle.y + (Math.cos(Date.now() * 0.001) * 30)
              }}
              transition={{ duration: particle.duration, repeat: Infinity }}
            >
              ₿
            </FloatingParticle>
          ))}
        </AnimatePresence>

        <WelcomeCard
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <BitcoinIcon
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            ₿
          </BitcoinIcon>
          
          <Title
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Bitcoin Monopoly
          </Title>
          
          <Subtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            🚀 O futuro dos jogos chegou! Domine o mercado cripto em uma experiência
            multiplayer épica com gráficos de última geração.
          </Subtitle>

          <InputGroup
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Label>👤 Nome do Jogador</Label>
            <Input
              type="text"
              placeholder="Digite seu nome épico..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createGame()}
              whileFocus={{ scale: 1.02 }}
            />
          </InputGroup>

          <ButtonContainer>
            <Button
              primary
              onClick={createGame}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              {isLoading ? '🔄 Criando...' : '🎮 Criar Jogo Épico'}
            </Button>
          </ButtonContainer>

          <InputGroup 
            style={{ marginTop: '2.5rem' }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <Label>🎯 Entrar em Batalha Existente</Label>
            <Input
              type="text"
              placeholder="ID da batalha..."
              value={gameIdInput}
              onChange={(e) => setGameIdInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && joinGame()}
              whileFocus={{ scale: 1.02 }}
            />
          </InputGroup>

          <ButtonContainer>
            <Button
              onClick={joinGame}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              {isLoading ? '🔄 Entrando...' : '🚀 Entrar na Batalha'}
            </Button>
          </ButtonContainer>
        </WelcomeCard>

        <Features>
          <FeatureCard
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
            whileHover={{ scale: 1.05 }}
          >
            <FeatureIcon
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              🌐
            </FeatureIcon>
            <FeatureTitle>Multiplayer Épico</FeatureTitle>
            <FeatureDesc>Até 6 guerreiros crypto em batalhas épicas em tempo real</FeatureDesc>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <FeatureIcon
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            >
              ₿
            </FeatureIcon>
            <FeatureTitle>Universo Bitcoin</FeatureTitle>
            <FeatureDesc>Propriedades e economia 100% baseada em Bitcoin</FeatureDesc>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <FeatureIcon
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              ✨
            </FeatureIcon>
            <FeatureTitle>Gráficos Futuristas</FeatureTitle>
            <FeatureDesc>Interface 3D com efeitos visuais de última geração</FeatureDesc>
          </FeatureCard>
        </Features>
      </Container>
    </>
  );
}

export default Home; 