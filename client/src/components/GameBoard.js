import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { GameContext } from '../App';

const neonGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(247, 147, 26, 0.5); }
  50% { box-shadow: 0 0 40px rgba(247, 147, 26, 1), 0 0 60px rgba(247, 147, 26, 0.5); }
`;

const hologramFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotateX(0deg); }
  50% { transform: translateY(-10px) rotateX(5deg); }
`;

const diceRoll = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.2); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
`;

const energyField = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

const dataFlow = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100vw); }
`;

const GameContainer = styled.div`
  min-height: 100vh;
  padding: 1rem;
  margin-top: 80px;
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-start;
  background: 
    radial-gradient(circle at 25% 25%, rgba(247, 147, 26, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(247, 147, 26, 0.05), 
      transparent, 
      rgba(247, 147, 26, 0.05)
    );
    background-size: 200% 200%;
    ${css`animation: ${energyField} 4s ease-in-out infinite;`}
    pointer-events: none;
  }
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    gap: 3rem;
    padding: 2rem;
    margin-top: 110px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    gap: 2.5rem;
    padding: 1.8rem;
    margin-top: 100px;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    gap: 2.2rem;
    padding: 1.5rem;
    margin-top: 90px;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    gap: 2rem;
    padding: 1.2rem;
    margin-top: 85px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    gap: 1.8rem;
    padding: 1rem;
    margin-top: 75px;
    flex-direction: column;
    align-items: center;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    gap: 1.6rem;
    padding: 0.9rem;
    margin-top: 65px;
    flex-direction: column;
    align-items: center;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    gap: 1.4rem;
    padding: 0.8rem;
    margin-top: 60px;
    flex-direction: column;
    align-items: center;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    gap: 1.2rem;
    padding: 0.7rem;
    margin-top: 55px;
    flex-direction: column;
    align-items: center;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    gap: 1rem;
    padding: 0.6rem;
    margin-top: 50px;
    flex-direction: column;
    align-items: center;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    gap: 0.8rem;
    padding: 0.5rem;
    margin-top: 45px;
    flex-direction: column;
    align-items: center;
  }
`;

const DataFlowLine = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['top', 'duration'].includes(prop),
})`
  position: absolute;
  top: ${props => props.top}%;
  height: 2px;
  width: 100px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(247, 147, 26, 0.8), 
    transparent
  );
  ${props => css`animation: ${dataFlow} ${props.duration}s linear infinite;`}
  z-index: 1;
`;

const BoardContainer = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
  margin: 0 auto;
  
  @media (max-width: 1200px) {
    flex: 1;
  }
`;

const Board = styled(motion.div)`
  width: 720px;
  height: 720px;
  position: relative;
  margin: 0 auto;
  background: 
    radial-gradient(circle at center, rgba(0, 0, 0, 0.7) 30%, rgba(247, 147, 26, 0.1) 100%),
    linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%),
    url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f7931a' fill-opacity='0.02'%3E%3Cpath d='M50 10c22.091 0 40 17.909 40 40s-17.909 40-40 40-40-17.909-40-40 17.909-40 40-40zm0 15c-13.807 0-25 11.193-25 25s11.193 25 25 25 25-11.193 25-25-11.193-25-25-25z'/%3E%3Cpath d='M20 20h10v10H20zm50 0h10v10H70zm-50 50h10v10H20zm50 0h10v10H70z'/%3E%3C/g%3E%3C/svg%3E");
  backdrop-filter: blur(20px);
  border-radius: 25px;
  border: 3px solid rgba(247, 147, 26, 0.4);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(247, 147, 26, 0.2);
  ${css`animation: ${hologramFloat} 6s ease-in-out infinite;`}
  transform-style: preserve-3d;
  background-size: cover, cover, 100px 100px;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a);
    border-radius: 28px;
    z-index: -1;
    opacity: 0.3;
    ${css`animation: ${neonGlow} 3s ease-in-out infinite;`}
  }
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    width: 900px;
    height: 900px;
    border-radius: 35px;
    border-width: 4px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    width: 800px;
    height: 800px;
    border-radius: 30px;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    width: 720px;
    height: 720px;
    border-radius: 25px;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    width: 650px;
    height: 650px;
    border-radius: 23px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    width: 580px;
    height: 580px;
    border-radius: 20px;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    width: 520px;
    height: 520px;
    border-radius: 18px;
    border-width: 2px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    width: 400px;
    height: 400px;
    border-radius: 16px;
    border-width: 2px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    width: 360px;
    height: 360px;
    border-radius: 15px;
    border-width: 2px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    width: 310px;
    height: 310px;
    border-radius: 14px;
    border-width: 2px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    width: 280px;
    height: 280px;
    border-radius: 12px;
    border-width: 1px;
  }
`;

const Center = styled(motion.div)`
  position: absolute;
  top: 80px;
  left: 80px;
  right: 80px;
  bottom: 80px;
  background: 
    radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 20%, rgba(247, 147, 26, 0.1) 100%),
    linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f7931a' fill-opacity='0.05'%3E%3Cpath d='M30 15c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15zm0 5c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10z'/%3E%3Cpath d='M30 0L35 10H50L40 18L45 30L30 22L15 30L20 18L10 10H25L30 0Z'/%3E%3C/g%3E%3C/svg%3E");
  backdrop-filter: blur(25px);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 2px solid rgba(247, 147, 26, 0.3);
  box-shadow: 
    inset 0 0 30px rgba(247, 147, 26, 0.2),
    0 20px 40px rgba(0, 0, 0, 0.5);
  background-size: 60px 60px, cover, cover;
  
  &::before {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f7931a' fill-opacity='0.03'%3E%3Cpath d='M20 5L25 15L35 15L27 22L30 32L20 27L10 32L13 22L5 15L15 15Z'/%3E%3C/g%3E%3C/svg%3E");
    border-radius: 15px;
    z-index: 0;
    pointer-events: none;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  @media (max-width: 1400px) {
    top: 70px;
    left: 70px;
    right: 70px;
    bottom: 70px;
    border-radius: 18px;
  }
  
  @media (max-width: 1200px) {
    top: 60px;
    left: 60px;
    right: 60px;
    bottom: 60px;
    border-radius: 15px;
  }
  
  @media (max-width: 1000px) {
    top: 70px;
    left: 70px;
    right: 70px;
    bottom: 70px;
  }
  
  @media (max-width: 900px) {
    top: 60px;
    left: 60px;
    right: 60px;
    bottom: 60px;
    border-radius: 12px;
  }
  
  @media (max-width: 600px) {
    top: 50px;
    left: 50px;
    right: 50px;
    bottom: 50px;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    top: 42px;
    left: 42px;
    right: 42px;
    bottom: 42px;
    border-radius: 8px;
  }
`;

const Logo = styled(motion.div)`
  font-size: 2.5rem;
  color: #f7931a;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 30px rgba(247, 147, 26, 0.8));
  text-shadow: 0 0 20px rgba(247, 147, 26, 0.5);
  
  @media (max-width: 1400px) {
    font-size: 2.2rem;
    margin-bottom: 0.9rem;
  }
  
  @media (max-width: 1200px) {
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 1000px) {
    font-size: 1.8rem;
    margin-bottom: 0.7rem;
  }
  
  @media (max-width: 900px) {
    font-size: 1.6rem;
    margin-bottom: 0.6rem;
  }
  
  @media (max-width: 600px) {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 0.4rem;
  }
`;

const GameTitle = styled(motion.h2)`
  font-family: 'Orbitron', monospace;
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  ${css`animation: ${energyField} 3s ease-in-out infinite;`}
  text-shadow: 0 0 30px rgba(247, 147, 26, 0.5);
  letter-spacing: 2px;
  
  @media (max-width: 1024px) {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0.6rem;
  }
`;

const DiceContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  perspective: 200px;
  
  @media (max-width: 1200px) {
    gap: 0.9rem;
    margin-bottom: 1.3rem;
  }
  
  @media (max-width: 900px) {
    gap: 0.8rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 600px) {
    gap: 0.7rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.6rem;
    margin-bottom: 0.8rem;
  }
`;

const Die = styled(motion.div)`
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000;
  border: 3px solid #f7931a;
  box-shadow: 
    0 10px 30px rgba(247, 147, 26, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.7),
    inset 0 -2px 0 rgba(0, 0, 0, 0.1);
  transform-style: preserve-3d;
  
  &.rolling {
    ${css`animation: ${diceRoll} 1s ease-in-out;`}
  }
  
  @media (max-width: 1200px) {
    width: 45px;
    height: 45px;
    font-size: 1.4rem;
    border-radius: 10px;
  }
  
  @media (max-width: 900px) {
    width: 40px;
    height: 40px;
    font-size: 1.3rem;
    border-radius: 8px;
  }
  
  @media (max-width: 600px) {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 1rem;
    border-radius: 5px;
    border: 2px solid #f7931a;
  }
`;

const RollButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 15px;
  font-family: 'Orbitron', monospace;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  background: linear-gradient(135deg, #f7931a 0%, #ffcd00 100%);
  color: #000;
  margin-bottom: 1rem;
  box-shadow: 
    0 15px 35px rgba(247, 147, 26, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
    margin-bottom: 0.8rem;
  }
`;

const TurnIndicator = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['isYourTurn'].includes(prop),
})`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.isYourTurn ? '#f7931a' : '#fff'};
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
  
  ${props => props.isYourTurn && css`
    animation: ${neonGlow} 2s ease-in-out infinite;
  `}
`;

// Função para obter ícone da casa
const getSpaceIcon = (space) => {
  // Ícones específicos para casas especiais
  const specialIcons = {
    0: '🏁',   // INÍCIO
    2: '📦',   // Cofre
    4: '💰',   // Taxa ₿
    5: '🚂',   // Terminal 1
    7: '🎲',   // Sorte
    10: '🔒',  // PRISÃO
    12: '⛏️',   // Mining Co
    15: '🚂',  // Terminal 2
    17: '📦',  // Cofre
    20: '🅿️',   // PARKING
    22: '🎲',  // Sorte
    25: '🚂',  // Terminal 3
    28: '💱',  // Exchange
    30: '➡️',   // → PRISÃO
    33: '📦',  // Cofre
    35: '🚂',  // Terminal 4
    36: '🎲',  // Sorte
    38: '💎'   // Taxa Luxo
  };

  // Se tem ícone específico, retorna ele
  if (specialIcons[space.id]) {
    return specialIcons[space.id];
  }

  // Ícones por tipo de propriedade
  switch (space.type) {
    case 'property':
      // Ícones específicos por nome
      const propertyIcons = {
        'Bitcoin St': '₿',
        'Satoshi St': '🧠',
        'Ethereum': 'Ξ', 
        'Litecoin': '🪙',
        'Cardano': '🌊',
        'Solana': '☀️',
        'Polygon': '🔷',
        'Chainlink': '🔗',
        'DeFi St': '🏦',
        'NFT Plaza': '🖼️',
        'Web3 Ave': '🌐',
        'Metaverse': '🥽',
        'DAO St': '🗳️',
        'Smart St': '📝',
        'Binance': '🟡',
        'Coinbase': '🔵',
        'Kraken': '🐙',
        'HODL Ave': '💎',
        'Diamond': '💍',
        'Moon St': '🌙',
        'Lambo': '🏎️',
        '₿ Palace': '🏰'
      };
      return propertyIcons[space.name] || '🏠';
    
    case 'railroad':
      return '🚂';
    
    case 'utility':
      return space.name.includes('Mining') ? '⛏️' : '💱';
    
    default:
      return '❓';
  }
};

// Board spaces positioning - TABULEIRO ORIGINAL MONOPOLY
const getSpacePosition = (index, boardWidth = 720) => {
  // Tamanhos como no Monopoly tradicional
  const cornerSize = 80; // Cantos maiores
  const sideSpaceWidth = 60; // Casas dos lados
  const sideSpaceHeight = 80; // Altura das casas laterais
  
  // CANTOS como no Monopoly original
  if (index === 0) {
    // GO - Canto inferior direito
    return { 
      bottom: '0px', 
      right: '0px', 
      width: `${cornerSize}px`, 
      height: `${cornerSize}px` 
    };
  }
  if (index === 10) {
    // JAIL - Canto inferior esquerdo
    return { 
      bottom: '0px', 
      left: '0px', 
      width: `${cornerSize}px`, 
      height: `${cornerSize}px` 
    };
  }
  if (index === 20) {
    // FREE PARKING - Canto superior esquerdo
    return { 
      top: '0px', 
      left: '0px', 
      width: `${cornerSize}px`, 
      height: `${cornerSize}px` 
    };
  }
  if (index === 30) {
    // GO TO JAIL - Canto superior direito
    return { 
      top: '0px', 
      right: '0px', 
      width: `${cornerSize}px`, 
      height: `${cornerSize}px` 
    };
  }
  
  // LADO INFERIOR (1-9) - ENCOSTADAS como Monopoly original
  if (index >= 1 && index <= 9) {
    const position = index - 1;
    const rightDistance = cornerSize + (position * sideSpaceWidth);
    return {
      bottom: '0px',
      right: `${rightDistance}px`,
      width: `${sideSpaceWidth}px`,
      height: `${sideSpaceHeight}px`
    };
  }
  
  // LADO ESQUERDO (11-19) - ENCOSTADAS como Monopoly original
  if (index >= 11 && index <= 19) {
    const position = index - 11;
    const bottomDistance = cornerSize + (position * sideSpaceWidth);
    return {
      left: '0px',
      bottom: `${bottomDistance}px`,
      width: `${sideSpaceHeight}px`,
      height: `${sideSpaceWidth}px`
    };
  }
  
  // LADO SUPERIOR (21-29) - ENCOSTADAS como Monopoly original
  if (index >= 21 && index <= 29) {
    const position = index - 21;
    const leftDistance = cornerSize + (position * sideSpaceWidth);
    return {
      left: `${leftDistance}px`,
      top: '0px',
      width: `${sideSpaceWidth}px`,
      height: `${sideSpaceHeight}px`
    };
  }
  
  // LADO DIREITO (31-39) - ENCOSTADAS como Monopoly original
  if (index >= 31 && index <= 39) {
    const position = index - 31;
    const topDistance = cornerSize + (position * sideSpaceWidth);
    return {
      right: '0px',
      top: `${topDistance}px`,
      width: `${sideSpaceHeight}px`,
      height: `${sideSpaceWidth}px`
    };
  }
  
  // Fallback
  return { 
    bottom: '0px', 
    right: '0px', 
    width: `${sideSpaceWidth}px`, 
    height: `${sideSpaceHeight}px` 
  };
};

const BoardSpace = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['index', 'space'].includes(prop),
})`
  position: absolute;
  /* Width e height são definidos pelo style da função getSpacePosition */
  background: ${props => {
    if ([0, 10, 20, 30].includes(props.index)) {
      return `
        radial-gradient(circle at center, rgba(247, 147, 26, 0.5) 0%, rgba(247, 147, 26, 0.15) 100%),
        linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%),
        url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f7931a' fill-opacity='0.15'%3E%3Ccircle cx='15' cy='15' r='10'/%3E%3Cpath d='M15 5L18 12L25 15L18 18L15 25L12 18L5 15L12 12Z'/%3E%3C/g%3E%3C/svg%3E"),
        url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f7931a' fill-opacity='0.1'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")
      `;
    }
    if (props.space.type === 'property') {
      const colorData = {
        brown: {
          gradient: 'linear-gradient(45deg, #8B4513, #A0522D)',
          pattern: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 0 8-12 20-12s20 12 20 12-8 12-20 12-20-12-20-12zm0 0c0 0-8-12-20-12S-20 8-20 20s8 12 20 12 20-12 20-12z'/%3E%3C/g%3E%3C/svg%3E\")"
        },
        lightblue: {
          gradient: 'linear-gradient(45deg, #87CEEB, #B0E0E6)',
          pattern: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10z'/%3E%3C/g%3E%3C/svg%3E\")"
        },
        purple: {
          gradient: 'linear-gradient(45deg, #8A2BE2, #9370DB)',
          pattern: "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='15,0 30,15 15,30 0,15'/%3E%3C/g%3E%3C/svg%3E\")"
        },
        orange: {
          gradient: 'linear-gradient(45deg, #FFA500, #FFB84D)',
          pattern: "url(\"data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='12.5' cy='12.5' r='8'/%3E%3C/g%3E%3C/svg%3E\")"
        },
        red: {
          gradient: 'linear-gradient(45deg, #FF0000, #FF4444)',
          pattern: "url(\"data:image/svg+xml,%3Csvg width='15' height='15' viewBox='0 0 15 15' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M7.5 0L15 7.5L7.5 15L0 7.5z'/%3E%3C/g%3E%3C/svg%3E\")"
        },
        yellow: {
          gradient: 'linear-gradient(45deg, #FFFF00, #FFFF66)',
          pattern: "url(\"data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M9 0l2.5 6.5H18l-5.5 4 2 6.5L9 13l-5.5 4 2-6.5L0 6.5h6.5z'/%3E%3C/g%3E%3C/svg%3E\")"
        },
        green: {
          gradient: 'linear-gradient(45deg, #008000, #00AA00)',
          pattern: "url(\"data:image/svg+xml,%3Csvg width='35' height='35' viewBox='0 0 35 35' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M17.5 0C27 0 35 8 35 17.5S27 35 17.5 35 0 27 0 17.5 8 0 17.5 0zm0 7C13 7 9.5 10.5 9.5 15s3.5 8 8 8 8-3.5 8-8-3.5-8-8-8z'/%3E%3C/g%3E%3C/svg%3E\")"
        },
        darkblue: {
          gradient: 'linear-gradient(45deg, #00008B, #0000CD)',
          pattern: "url(\"data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M14 0l4 8h8l-6 6 2 8-8-6-8 6 2-8-6-6h8z'/%3E%3C/g%3E%3C/svg%3E\")"
        }
      };
      const colorInfo = colorData[props.space.color];
      return colorInfo ? `${colorInfo.gradient}, ${colorInfo.pattern}` : 'linear-gradient(45deg, #666, #888)';
    }
    // Casas especiais com padrões únicos
    if (props.space.type === 'community_chest') {
      return `
        linear-gradient(45deg, #4A90E2, #7BB3F0),
        url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Crect x='4' y='4' width='12' height='8' rx='2'/%3E%3Crect x='6' y='2' width='8' height='4' rx='1'/%3E%3C/g%3E%3C/svg%3E")
      `;
    }
    if (props.space.type === 'chance') {
      return `
        linear-gradient(45deg, #FF6B6B, #FF8E8E),
        url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8Z'/%3E%3C/g%3E%3C/svg%3E")
      `;
    }
    if (props.space.type === 'railroad') {
      return `
        linear-gradient(45deg, #2C3E50, #34495E),
        url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Crect x='2' y='12' width='26' height='6'/%3E%3Crect x='0' y='14' width='30' height='2'/%3E%3C/g%3E%3C/svg%3E")
      `;
    }
    if (props.space.type === 'utility') {
      return `
        linear-gradient(45deg, #9B59B6, #AF7AC5),
        url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M12.5 2L18 8H15V18H10V8H7L12.5 2Z'/%3E%3C/g%3E%3C/svg%3E")
      `;
    }
    if (props.space.type === 'tax') {
      return `
        linear-gradient(45deg, #E74C3C, #EC7063),
        url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M10 2L16 6V14L10 18L4 14V6Z'/%3E%3C/g%3E%3C/svg%3E")
      `;
    }
    return `
      linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%),
      url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M12.5 2L15 8L21 10L15 12L12.5 18L10 12L4 10L10 8Z'/%3E%3C/g%3E%3C/svg%3E"),
      url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='10' cy='10' r='3'/%3E%3C/g%3E%3C/svg%3E")
    `;
  }};
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
  text-align: center;
  padding: 4px;
  backdrop-filter: blur(10px);
  box-shadow: 
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  background-size: ${props => {
    if ([0, 10, 20, 30].includes(props.index)) {
      return 'cover, cover, 30px 30px, 20px 20px';
    }
    if (['community_chest', 'chance', 'railroad', 'utility', 'tax'].includes(props.space.type)) {
      return 'cover, 20px 20px';
    }
    return 'cover, 25px 25px, 20px 20px';
  }};
  background-blend-mode: multiply, normal;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      0 8px 25px rgba(247, 147, 26, 0.3);
  }
  
  // Posicionamento será feito via style prop
`;

const SpaceIcon = styled.div`
  font-size: 1.2rem;
  margin-bottom: 2px;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8));
  position: relative;
  animation: ${css`
    ${keyframes`
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(5deg); }
    `} 3s ease-in-out infinite
  `};
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: radial-gradient(circle, rgba(247, 147, 26, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
    animation: ${css`
      ${keyframes`
        0%, 100% { opacity: 0.3; transform: scale(0.8); }
        50% { opacity: 0.7; transform: scale(1.2); }
      `} 2s ease-in-out infinite
    `};
  }
`;

const SpaceName = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
  margin-bottom: 3px;
  line-height: 1;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  font-size: 0.75rem;
  word-break: break-word;
  hyphens: auto;
`;

const SpacePrice = styled.div`
  font-family: 'Orbitron', monospace;
  font-size: 0.65rem;
  font-weight: 600;
  color: #f7931a;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  line-height: 1;
`;

const BuildingIndicator = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
  z-index: 10;
`;

const House = styled.div`
  width: 8px;
  height: 8px;
  background: linear-gradient(45deg, #00ff00, #00cc00);
  border-radius: 2px;
  border: 1px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
`;

const Hotel = styled.div`
  width: 16px;
  height: 10px;
  background: linear-gradient(45deg, #ff0000, #cc0000);
  border-radius: 3px;
  border: 1px solid #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  color: white;
  font-weight: bold;
  
  &::after {
    content: 'H';
  }
`;

const PlayerPiece = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['color', 'isCurrentPlayer'].includes(prop),
})`
  position: absolute;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Orbitron', monospace;
  color: #000;
  z-index: 100;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.6),
    inset 0 2px 0 rgba(255, 255, 255, 0.4),
    0 0 0 2px rgba(247, 147, 26, 0.7),
    0 0 20px rgba(247, 147, 26, 0.4);
  ${css`animation: ${neonGlow} 3s ease-in-out infinite;`}
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a);
    border-radius: 50%;
    z-index: -1;
    opacity: 0.6;
    ${css`animation: ${neonGlow} 2s ease-in-out infinite;`}
  }
  
  &::after {
    content: '👑';
    position: absolute;
    top: -15px;
    right: -8px;
    font-size: 0.8rem;
    opacity: ${props => props.isCurrentPlayer ? 1 : 0};
    transition: opacity 0.3s ease;
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
  }
  
  &:hover {
    transform: scale(1.2) translateY(-5px);
    box-shadow: 
      0 15px 35px rgba(0, 0, 0, 0.8),
      inset 0 3px 0 rgba(255, 255, 255, 0.6),
      0 0 0 3px rgba(247, 147, 26, 0.9),
      0 0 30px rgba(247, 147, 26, 0.6);
  }
  
  // Posicionamento será calculado e aplicado no componente principal
`;





const Sidebar = styled.div`
  width: 350px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    width: 450px;
    gap: 2rem;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    width: 400px;
    gap: 1.8rem;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    width: 370px;
    gap: 1.6rem;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    width: 340px;
    gap: 1.4rem;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    width: 100%;
    max-width: 600px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.2rem;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    width: 100%;
    max-width: 520px;
    flex-direction: column;
    gap: 1rem;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    width: 100%;
    max-width: 400px;
    flex-direction: column;
    gap: 0.9rem;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    width: 100%;
    max-width: 360px;
    flex-direction: column;
    gap: 0.8rem;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    width: 100%;
    max-width: 310px;
    flex-direction: column;
    gap: 0.7rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    width: 100%;
    max-width: 280px;
    flex-direction: column;
    gap: 0.6rem;
  }
`;

const PlayerCard = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['isCurrentPlayer'].includes(prop),
})`
  background: 
    linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%),
    radial-gradient(circle at top right, rgba(247, 147, 26, 0.1) 0%, transparent 70%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: ${props => props.isCurrentPlayer ? 
    '3px solid rgba(247, 147, 26, 0.8)' : 
    '2px solid rgba(255, 255, 255, 0.1)'
  };
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  ${props => props.isCurrentPlayer && css`
    animation: ${neonGlow} 2s ease-in-out infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, 
        rgba(247, 147, 26, 0.1), 
        transparent, 
        rgba(247, 147, 26, 0.1)
      );
      background-size: 200% 200%;
      animation: ${energyField} 3s ease-in-out infinite;
      pointer-events: none;
    }
  `}
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    padding: 2.5rem;
    border-radius: 25px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    padding: 2.3rem;
    border-radius: 23px;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    padding: 2.1rem;
    border-radius: 21px;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    padding: 1.9rem;
    border-radius: 19px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    flex: 1;
    min-width: 280px;
    max-width: 300px;
    padding: 1.7rem;
    border-radius: 17px;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    padding: 1.5rem;
    border-radius: 15px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    padding: 1.3rem;
    border-radius: 13px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    padding: 1.2rem;
    border-radius: 12px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    padding: 1rem;
    border-radius: 10px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    padding: 0.8rem;
    border-radius: 8px;
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    gap: 2rem;
    margin-bottom: 2rem;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    gap: 1.8rem;
    margin-bottom: 1.8rem;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    gap: 1.6rem;
    margin-bottom: 1.6rem;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    gap: 1.4rem;
    margin-bottom: 1.4rem;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    gap: 1.3rem;
    margin-bottom: 1.3rem;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    gap: 1.2rem;
    margin-bottom: 1.2rem;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    gap: 0.9rem;
    margin-bottom: 0.9rem;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    gap: 0.8rem;
    margin-bottom: 0.8rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    gap: 0.7rem;
    margin-bottom: 0.7rem;
  }
`;

const PlayerAvatar = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['color'].includes(prop),
})`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #000;
  font-size: 2rem;
  font-family: 'Orbitron', monospace;
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.4),
    inset 0 3px 0 rgba(255, 255, 255, 0.3),
    0 0 0 3px rgba(247, 147, 26, 0.5);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a);
    border-radius: 50%;
    z-index: -1;
    ${css`animation: ${neonGlow} 2s ease-in-out infinite;`}
  }
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    width: 90px;
    height: 90px;
    font-size: 2.5rem;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    width: 80px;
    height: 80px;
    font-size: 2.3rem;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    width: 75px;
    height: 75px;
    font-size: 2.1rem;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    width: 70px;
    height: 70px;
    font-size: 2rem;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    width: 65px;
    height: 65px;
    font-size: 1.8rem;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    width: 60px;
    height: 60px;
    font-size: 1.6rem;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    width: 55px;
    height: 55px;
    font-size: 1.4rem;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

const PlayerInfo = styled.div`
  flex: 1;
`;

const PlayerName = styled.div`
  font-family: 'Orbitron', monospace;
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #f7931a;
  text-shadow: 0 2px 10px rgba(247, 147, 26, 0.5);
`;

const PlayerBalance = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  margin-top: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const PropertyList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PropertyChip = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['color'].includes(prop),
})`
  background: ${props => props.color};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.7rem;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ActionButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['primary', 'small'].includes(prop),
})`
  padding: ${props => props.small ? '0.5rem 1rem' : '1rem 1.5rem'};
  border: none;
  border-radius: 12px;
  font-family: 'Orbitron', monospace;
  font-size: ${props => props.small ? '0.7rem' : '0.9rem'};
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #f7931a 0%, #ffcd00 100%)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => props.primary ? '#000' : '#fff'};
  border: ${props => props.primary ? 'none' : '2px solid rgba(255, 255, 255, 0.2)'};
  margin-top: ${props => props.small ? '0.5rem' : '1rem'};
  margin-right: ${props => props.small ? '0.5rem' : '0'};
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const BuildingControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BuildingSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const PropertyStatus = styled.div`
  font-size: 0.75rem;
  color: #f7931a;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const CardModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  min-height: 300px;
  background: 
    radial-gradient(circle at center, rgba(0, 0, 0, 0.9) 20%, rgba(247, 147, 26, 0.1) 100%),
    linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(25px);
  border-radius: 20px;
  border: 3px solid rgba(247, 147, 26, 0.6);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  z-index: 1000;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a);
    border-radius: 23px;
    z-index: -1;
    opacity: 0.4;
    ${css`animation: ${neonGlow} 3s ease-in-out infinite;`}
  }
  
  @media (max-width: 600px) {
    width: 90vw;
    max-width: 380px;
    padding: 1.5rem;
    border-radius: 15px;
    min-height: 250px;
  }
  
  @media (max-width: 480px) {
    width: 95vw;
    max-width: 320px;
    padding: 1.2rem;
    border-radius: 12px;
    min-height: 220px;
  }
`;

const CardTitle = styled(motion.h2)`
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 800;
  color: #f7931a;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(247, 147, 26, 0.5);
`;

const CardText = styled(motion.p)`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const CardButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 15px;
  font-family: 'Orbitron', monospace;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  background: linear-gradient(135deg, #f7931a 0%, #ffcd00 100%);
  color: #000;
  box-shadow: 
    0 15px 35px rgba(247, 147, 26, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
`;

const BuyModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  min-height: 300px;
  background: 
    radial-gradient(circle at center, rgba(0, 0, 0, 0.9) 20%, rgba(247, 147, 26, 0.1) 100%),
    linear-gradient(45deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  backdrop-filter: blur(25px);
  border-radius: 20px;
  border: 3px solid rgba(247, 147, 26, 0.6);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  z-index: 1000;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a);
    border-radius: 23px;
    z-index: -1;
    opacity: 0.4;
    ${css`animation: ${neonGlow} 3s ease-in-out infinite;`}
  }
  
  @media (max-width: 600px) {
    width: 90vw;
    max-width: 400px;
    padding: 1.5rem;
    border-radius: 15px;
    min-height: 280px;
  }
  
  @media (max-width: 480px) {
    width: 95vw;
    max-width: 350px;
    padding: 1.2rem;
    border-radius: 12px;
    min-height: 250px;
  }
`;

const BuyTitle = styled(motion.h2)`
  font-family: 'Orbitron', monospace;
  font-size: 1.8rem;
  font-weight: 800;
  color: #f7931a;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(247, 147, 26, 0.5);
  text-align: center;
`;

const PropertyInfo = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(247, 147, 26, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
`;

const PropertyName = styled.h3`
  font-family: 'Orbitron', monospace;
  font-size: 1.3rem;
  color: #fff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const PropertyPrice = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f7931a;
  margin-bottom: 1rem;
  text-shadow: 0 0 15px rgba(247, 147, 26, 0.5);
`;

const BuyQuestion = styled.p`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const BuyButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 15px;
  font-family: 'Orbitron', monospace;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  flex: 1;
  max-width: 150px;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: #fff;
    box-shadow: 
      0 15px 35px rgba(40, 167, 69, 0.4),
      inset 0 2px 0 rgba(255, 255, 255, 0.3);
  ` : `
    background: linear-gradient(135deg, #dc3545 0%, #ff6b7d 100%);
    color: #fff;
    box-shadow: 
      0 15px 35px rgba(220, 53, 69, 0.4),
      inset 0 2px 0 rgba(255, 255, 255, 0.3);
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 20px 40px ${props => props.primary ? 'rgba(40, 167, 69, 0.6)' : 'rgba(220, 53, 69, 0.6)'},
      inset 0 2px 0 rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 480px) {
    max-width: none;
    padding: 0.8rem 1.5rem;
  }
`;

const GameEndModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const GameEndContent = styled(motion.div)`
  background: linear-gradient(135deg, rgba(247, 147, 26, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%);
  border: 2px solid rgba(247, 147, 26, 0.3);
  border-radius: 20px;
  padding: 3rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  text-align: center;
  backdrop-filter: blur(20px);
`;

const WinnerTitle = styled.h1`
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  color: #f7931a;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(247, 147, 26, 0.5);
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
`;

const PlayerStat = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  ${props => props.winner && `
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.3);
  `}
  
  ${props => props.bankrupt && `
    opacity: 0.5;
    background: rgba(255, 0, 0, 0.1);
  `}
`;

const StatText = styled.span`
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
`;

function GameBoard() {
  console.log('🎮 GameBoard: Componente carregado!');
  
  const navigate = useNavigate();
  const { socket, gameState: contextGameState, setGameState, playerId } = useContext(GameContext);
  
  console.log('🎮 GameBoard: Socket:', !!socket);
  console.log('🎮 GameBoard: GameState:', !!contextGameState);
  console.log('🎮 GameBoard: PlayerId:', playerId);
  const [showCard, setShowCard] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showGameEnd, setShowGameEnd] = useState(false);
  const [gameEndData, setGameEndData] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [propertyToBuy, setPropertyToBuy] = useState(null);
  const [boardSize, setBoardSize] = useState({ width: 720, height: 720 });
  const [lastDiceRoll, setLastDiceRoll] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [dataFlows, setDataFlows] = useState([]);
  const [waitingForGameStart, setWaitingForGameStart] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [gameStartedByEvent, setGameStartedByEvent] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [gameActions, setGameActions] = useState([]);
  const [movingPlayer, setMovingPlayer] = useState(null);
  const [playerPositions, setPlayerPositions] = useState({});

  // Hook para detectar tamanho da tela
  useEffect(() => {
    const updateBoardSize = () => {
      const width = window.innerWidth;
      if (width <= 480) setBoardSize({ width: 320, height: 320 });
      else if (width <= 600) setBoardSize({ width: 380, height: 380 });
      else if (width <= 900) setBoardSize({ width: 450, height: 450 });
      else if (width <= 1000) setBoardSize({ width: 500, height: 500 });
      else if (width <= 1200) setBoardSize({ width: 600, height: 600 });
      else if (width >= 1600) setBoardSize({ width: 800, height: 800 });
      else setBoardSize({ width: 720, height: 720 });
    };

    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  // Usar gameState do contexto
  const gameState = contextGameState;

  // Atualizar gameState local quando contexto mudar
  useEffect(() => {
    if (contextGameState) {
      setGameState(contextGameState);
    }
  }, [contextGameState, setGameState]);

  useEffect(() => {
    if (!socket || !gameState) {
      navigate('/');
      return;
    }

    // Se o jogo não foi iniciado mas tem 2+ jogadores, aguardar por atualização
    if (!gameState.gameStarted && !gameStartedByEvent && gameState.players?.length >= 2 && !waitingForGameStart) {
      console.log('🔄 Aguardando gameState ser atualizado...');
      setWaitingForGameStart(true);
      setRetryCount(0);
    }

    // Criar fluxos de dados
    const flows = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      duration: Math.random() * 5 + 3
    }));
    setDataFlows(flows);

    socket.on('dice_rolled', (data) => {
      console.log('🎲 GameBoard recebeu dice_rolled:', data);
      setIsRolling(true);
      
      // Animar movimento do jogador
      if (data.playerId && data.newPosition !== undefined) {
        setMovingPlayer(data.playerId);
        
        // Simular movimento graduado
        setTimeout(() => {
          setPlayerPositions(prev => ({
            ...prev,
            [data.playerId]: data.newPosition
          }));
          
          // Atualizar gameState após movimento
          if (data.gameState) {
            setGameState(data.gameState);
          }
          
          setTimeout(() => {
            setMovingPlayer(null);
          }, 500);
        }, 500);
      } else if (data.gameState) {
        setGameState(data.gameState);
      }
      
      // Processar ações do jogo
      if (data.actions && data.actions.length > 0) {
        // Verificar se há carta para mostrar
        const cardAction = data.actions.find(action => action.type === 'card_drawn');
        if (cardAction) {
          setCurrentCard(cardAction);
          setShowCard(true);
        }
        
        // Verificar se há propriedade disponível para compra
        const propertyAction = data.actions.find(action => action.type === 'property_available');
        if (propertyAction && propertyAction.playerId === playerId) {
          setPropertyToBuy(propertyAction);
          setShowBuyModal(true);
        }
        
        // Processar outras ações
        data.actions.forEach(action => {
          switch (action.type) {
            case 'rent_paid':
              toast.success(`💰 Pagou ₿${action.amount} de aluguel para ${action.to}`, {
                position: "top-center",
                autoClose: 4000
              });
              break;
            
            case 'tax_paid':
              toast.warning(`🏛️ Pagou ₿${action.amount} de ${action.taxType}`, {
                position: "top-center",
                autoClose: 3000
              });
              break;
            
            case 'sent_to_jail':
              toast.error(`🚔 Enviado para a Prisão!`, {
                position: "top-center",
                autoClose: 3000
              });
              break;
            
            case 'bankrupt_warning':
              toast.error(`⚠️ Saldo insuficiente para pagar ₿${action.amount}!`, {
                position: "top-center",
                autoClose: 5000
              });
              break;
              
            default:
              // Ação não reconhecida
              break;
          }
        });
      }
      
      setTimeout(() => {
        setLastDiceRoll(data.dice);
        setIsRolling(false);
      }, 1000);
      
      toast.success(`🎲 ${data.dice[0]} + ${data.dice[1]} = ${data.total}`, {
        style: { 
          background: 'rgba(247, 147, 26, 0.1)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(247, 147, 26, 0.3)'
        }
      });
    });

    // Listener específico para mudança de turno
    socket.on('turn_changed', (newGameState) => {
      console.log('🔄 GameBoard recebeu turn_changed:', newGameState.currentPlayerIndex);
      console.log('🔄 Novo jogador atual:', newGameState.players[newGameState.currentPlayerIndex]?.name);
      
      // ATUALIZAR estado local para forçar re-render
      setGameState(newGameState);
      
      toast.info(`🎯 Turno de ${newGameState.players[newGameState.currentPlayerIndex]?.name}!`, {
        position: "top-center",
        autoClose: 2000
      });
    });

    // Listener direto para game_started - força carregamento
    socket.on('game_started', (newGameState) => {
      console.log('🎮 GameBoard recebeu game_started:', newGameState.gameStarted);
      console.log('🚀 FORÇANDO carregamento da arena!');
      setGameStartedByEvent(true);
      setWaitingForGameStart(false);
      toast.success('🏛️ Arena de Batalha ATIVADA!', {
        position: "top-center",
        autoClose: 2000
      });
    });

    // Listener para compra de propriedade
    socket.on('property_bought', (data) => {
      console.log('🏛️ Propriedade comprada:', data);
      setGameState(data.gameState);
      
      const property = gameState.board?.find(s => s.id === data.propertyId);
      toast.success(`🎉 ${property?.name || 'Propriedade'} conquistada!`, {
        position: "top-center",
        autoClose: 3000,
        style: { 
          background: 'rgba(0, 255, 0, 0.1)', 
          backdropFilter: 'blur(10px)' 
        }
      });
    });

    socket.on('error', (message) => {
      toast.error(`⚠️ ${message}`, {
        position: "top-center",
        autoClose: 4000
      });
    });

    // Novos listeners para construção
    socket.on('house_built', (data) => {
      console.log('🏠 Casa construída:', data);
      setGameState(data.gameState);
      toast.success(`🏠 Casa construída! ${data.message}`, {
        position: "top-center",
        autoClose: 3000,
        style: { 
          background: 'rgba(0, 255, 0, 0.1)', 
          backdropFilter: 'blur(10px)' 
        }
      });
    });

    socket.on('hotel_built', (data) => {
      console.log('🏨 Hotel construído:', data);
      setGameState(data.gameState);
      toast.success(`🏨 Hotel construído! ${data.message}`, {
        position: "top-center",
        autoClose: 3000,
        style: { 
          background: 'rgba(255, 215, 0, 0.1)', 
          backdropFilter: 'blur(10px)' 
        }
      });
    });

    socket.on('property_mortgaged', (data) => {
      console.log('💸 Propriedade hipotecada:', data);
      setGameState(data.gameState);
      toast.info(`💸 ${data.message}`, {
        position: "top-center",
        autoClose: 3000
      });
    });

    socket.on('property_unmortgaged', (data) => {
      console.log('💰 Hipoteca quitada:', data);
      setGameState(data.gameState);
      toast.success(`💰 ${data.message}`, {
        position: "top-center",
        autoClose: 3000
      });
    });

    socket.on('building_sold', (data) => {
      console.log('🏚️ Construção vendida:', data);
      setGameState(data.gameState);
      toast.warning(`🏚️ ${data.message}`, {
        position: "top-center",
        autoClose: 3000
      });
    });

    // Listeners para falência e fim de jogo
    socket.on('player_bankrupt', (data) => {
      console.log('💸 Jogador faliu:', data);
      setGameState(data.gameState);
      
      const player = gameState.players?.find(p => p.id === data.playerId);
      toast.error(`💸 ${player?.name || 'Jogador'} declarou falência!`, {
        position: "top-center",
        autoClose: 5000,
        style: { 
          background: 'rgba(255, 0, 0, 0.1)', 
          backdropFilter: 'blur(10px)' 
        }
      });
    });

    socket.on('game_ended', (data) => {
      console.log('🏆 Jogo terminou:', data);
      setGameState(data.gameState);
      setGameEndData(data);
      setShowGameEnd(true);
      
      if (data.winner) {
        toast.success(`🏆 ${data.winner.name} VENCEU o Bitcoin Monopoly!`, {
          position: "top-center",
          autoClose: 10000,
          style: { 
            background: 'rgba(255, 215, 0, 0.1)', 
            backdropFilter: 'blur(10px)' 
          }
        });
      } else {
        toast.info('🤝 Jogo terminou sem vencedor!', {
          position: "top-center",
          autoClose: 5000
        });
      }
    });

    return () => {
      socket.off('dice_rolled');
      socket.off('turn_changed');
      socket.off('game_started');
      socket.off('property_bought');
      socket.off('error');
      socket.off('house_built');
      socket.off('hotel_built');
      socket.off('property_mortgaged');
      socket.off('property_unmortgaged');
      socket.off('building_sold');
      socket.off('player_bankrupt');
      socket.off('game_ended');
    };
  }, [socket, gameState, navigate, waitingForGameStart, gameStartedByEvent, setGameState, playerId]);

  // Sistema de retry para aguardar gameState atualizar
  useEffect(() => {
    if (waitingForGameStart && retryCount < 20) { // 10 segundos máximo
      const timer = setTimeout(() => {
        console.log(`🔄 Retry ${retryCount + 1}/20 - Verificando gameStarted:`, gameState?.gameStarted);
        
        if (gameState?.gameStarted || gameStartedByEvent) {
          console.log('✅ Jogo pronto! Carregando arena...');
          setWaitingForGameStart(false);
        } else {
          setRetryCount(prev => prev + 1);
        }
      }, 500);

      return () => clearTimeout(timer);
    } else if (retryCount >= 20) {
      console.log('❌ Timeout aguardando gameStarted. Forçando carregamento...');
      setWaitingForGameStart(false);
      setGameStartedByEvent(true); // Força carregamento por timeout
    }
  }, [waitingForGameStart, retryCount, gameState?.gameStarted, gameStartedByEvent]);

  // Condição principal de carregamento
  const shouldShowArena = gameStartedByEvent || gameState?.gameStarted;
  
  if (!gameState || (!shouldShowArena && !waitingForGameStart)) {
    console.log('🔍 Debug GameBoard - gameState:', gameState);
    console.log('🔍 Debug GameBoard - gameStarted:', gameState?.gameStarted);
    console.log('🔍 Debug GameBoard - players:', gameState?.players?.length);
    
    return (
      <GameContainer>
        <BoardContainer>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ 
              color: '#f7931a', 
              fontSize: '2rem', 
              textAlign: 'center',
              fontFamily: 'Orbitron, monospace' 
            }}
          >
            ⚡ Carregando arena de batalha...
            <br />
            <small style={{ fontSize: '1rem', color: '#fff' }}>
              {!gameState ? 'Aguardando dados do servidor...' : 
               waitingForGameStart ? `🔄 Sincronizando arena... (Tentativa ${retryCount}/20)` :
               !gameState.gameStarted && !gameStartedByEvent ? `Iniciando batalha... (${gameState.players?.length || 0} guerreiros prontos)` : 
               'Carregando interface...'}
            </small>
            <br />
            <small style={{ fontSize: '0.8rem', color: '#888', marginTop: '1rem', display: 'block' }}>
              {gameState ? `Status: gameStarted = ${gameState.gameStarted}${gameStartedByEvent ? ' | Evento recebido ✅' : ''}${waitingForGameStart ? ' (aguardando sync...)' : ''}` : 'Conectando...'}
            </small>
          </motion.div>
        </BoardContainer>
      </GameContainer>
    );
  }

  // Verificação de segurança
  if (!gameState.players || !Array.isArray(gameState.players) || !gameState.board) {
    console.error('❌ GameState inválido:', gameState);
    return (
      <GameContainer>
        <BoardContainer>
          <motion.div style={{ color: '#ff0000', textAlign: 'center' }}>
            ❌ Erro ao carregar dados do jogo. Retornando...
          </motion.div>
        </BoardContainer>
      </GameContainer>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isMyTurn = currentPlayer?.id === playerId;

  // Debug logs para diagnosticar problema de turnos
  console.log('🎯 Debug Turnos:');
  console.log('  📊 currentPlayerIndex:', gameState.currentPlayerIndex);
  console.log('  👤 currentPlayer:', currentPlayer);
  console.log('  🆔 playerId:', playerId);
  console.log('  ✅ isMyTurn:', isMyTurn);
  console.log('  👥 players:', gameState.players.map(p => ({ id: p.id, name: p.name })));

  const rollDice = () => {
    console.log('🎲 Tentando rolar dados - isMyTurn:', isMyTurn, 'socket:', !!socket);
    if (!isMyTurn || !socket) {
      console.log('❌ Não pode rolar dados:', { isMyTurn, hasSocket: !!socket });
      return;
    }
    console.log('✅ Enviando roll_dice para o servidor...');
    socket.emit('roll_dice');
  };

  const buyProperty = (propertyId) => {
    if (!socket) {
      toast.error('❌ Sem conexão com o servidor!');
      return;
    }
    
    console.log('🏛️ Tentando comprar propriedade:', propertyId);
    socket.emit('buy_property', propertyId);
    
    toast.info('🔄 Processando compra...', {
      position: "top-center",
      autoClose: 2000
    });
  };

  // Novas funções de construção
  const buildHouse = (propertyId) => {
    if (!socket) {
      toast.error('❌ Sem conexão com o servidor!');
      return;
    }
    console.log('🏠 Construindo casa na propriedade:', propertyId);
    socket.emit('build_house', propertyId);
  };

  const buildHotel = (propertyId) => {
    if (!socket) {
      toast.error('❌ Sem conexão com o servidor!');
      return;
    }
    console.log('🏨 Construindo hotel na propriedade:', propertyId);
    socket.emit('build_hotel', propertyId);
  };

  const mortgageProperty = (propertyId) => {
    if (!socket) {
      toast.error('❌ Sem conexão com o servidor!');
      return;
    }
    console.log('💸 Hipotecando propriedade:', propertyId);
    socket.emit('mortgage_property', propertyId);
  };

  const unmortgageProperty = (propertyId) => {
    if (!socket) {
      toast.error('❌ Sem conexão com o servidor!');
      return;
    }
    console.log('💰 Quitando hipoteca:', propertyId);
    socket.emit('unmortgage_property', propertyId);
  };

  const sellBuilding = (propertyId) => {
    if (!socket) {
      toast.error('❌ Sem conexão com o servidor!');
      return;
    }
    console.log('🏚️ Vendendo construção:', propertyId);
    socket.emit('sell_building', propertyId);
  };

  const declareBankruptcy = () => {
    if (!socket) {
      toast.error('❌ Sem conexão com o servidor!');
      return;
    }
    
    const confirmBankruptcy = window.confirm(
      '⚠️ Tem certeza que deseja declarar falência?\n\n' +
      'Todos os seus bens serão liquidados e você será eliminado do jogo.\n' +
      'Esta ação não pode ser desfeita!'
    );
    
    if (confirmBankruptcy) {
      console.log('💸 Declarando falência...');
      socket.emit('declare_bankruptcy');
    }
  };

  const closeCard = () => {
    setShowCard(false);
    setCurrentCard(null);
  };

  const handleBuyProperty = () => {
    if (propertyToBuy && socket) {
      buyProperty(propertyToBuy.propertyId);
      setShowBuyModal(false);
      setPropertyToBuy(null);
    }
  };

  const handleDeclineBuy = () => {
    setShowBuyModal(false);
    setPropertyToBuy(null);
    toast.info('Propriedade não foi comprada', {
      position: "top-center",
      autoClose: 2000
    });
  };

  // Funções auxiliares para construção
  const hasColorMonopoly = (playerId, color) => {
    const colorProperties = gameState.board.filter(s => s.color === color && s.type === 'property');
    const player = gameState.players.find(p => p.id === playerId);
    const playerColorProperties = colorProperties.filter(prop => player?.properties?.includes(prop.id));
    return colorProperties.length === playerColorProperties.length;
  };

  const canBuildHouse = (propertyId) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return false;

    const properties = Array.isArray(gameState.properties) 
      ? gameState.properties 
      : Array.from(gameState.properties || []);
    const property = properties.find(([id]) => id === propertyId)?.[1];
    
    if (!property || property.type !== 'property') return false;
    if (property.mortgaged || property.hotel) return false;
    if (property.houses >= 4) return false;
    
    // Verificar conjunto completo
    if (!hasColorMonopoly(playerId, property.color)) return false;
    
    // Verificar saldo suficiente (casa custa 50% do preço da propriedade)
    const houseCost = property.price * 0.5;
    if (player.balance < houseCost) return false;
    
    // Verificar distribuição uniforme
    const sameColorProperties = properties.filter(([id, prop]) => 
      prop.color === property.color && prop.type === 'property' && prop.owner === playerId
    );
    const minHouses = Math.min(...sameColorProperties.map(([id, prop]) => prop.houses));
    if (property.houses > minHouses) return false;
    
    return true;
  };

  const canBuildHotel = (propertyId) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return false;

    const properties = Array.isArray(gameState.properties) 
      ? gameState.properties 
      : Array.from(gameState.properties || []);
    const property = properties.find(([id]) => id === propertyId)?.[1];
    
    if (!property || property.type !== 'property') return false;
    if (property.mortgaged || property.hotel) return false;
    if (property.houses !== 4) return false;
    
    // Verificar saldo suficiente (hotel custa 50% do preço da propriedade)
    const hotelCost = property.price * 0.5;
    if (player.balance < hotelCost) return false;
    
    return true;
  };

  const canSellBuilding = (propertyId) => {
    const properties = Array.isArray(gameState.properties) 
      ? gameState.properties 
      : Array.from(gameState.properties || []);
    const property = properties.find(([id]) => id === propertyId)?.[1];
    
    if (!property || property.type !== 'property') return false;
    if (property.houses === 0 && !property.hotel) return false;
    
    // Para casas, verificar distribuição uniforme
    if (property.houses > 0) {
      const sameColorProperties = properties.filter(([id, prop]) => 
        prop.color === property.color && prop.type === 'property' && prop.owner === playerId
      );
      const maxHouses = Math.max(...sameColorProperties.map(([id, prop]) => prop.houses));
      if (property.houses < maxHouses) return false;
    }
    
    return true;
  };

  const playerColors = [
    'linear-gradient(45deg, #FF6B6B, #FF8E8E)', 
    'linear-gradient(45deg, #4ECDC4, #7EDDD8)', 
    'linear-gradient(45deg, #45B7D1, #6CC5E0)', 
    'linear-gradient(45deg, #96CEB4, #B4D9C7)', 
    'linear-gradient(45deg, #FFEAA7, #FFF2C7)', 
    'linear-gradient(45deg, #DDA0DD, #E6B3E6)'
  ];

  // Ícones únicos para cada jogador
  const playerIcons = ['₿', 'Ξ', '🚀', '💎', '⚡', '🔥'];

  return (
    <GameContainer>
      <AnimatePresence>
        {dataFlows.map((flow) => (
          <DataFlowLine
            key={flow.id}
            top={flow.top}
            duration={flow.duration}
            initial={{ x: -100 }}
            animate={{ x: window.innerWidth + 100 }}
            transition={{ duration: flow.duration, repeat: Infinity }}
          />
        ))}
      </AnimatePresence>

      <BoardContainer>
        <Board
          initial={{ opacity: 0, rotateX: -30, scale: 0.8 }}
          animate={{ opacity: 1, rotateX: 0, scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <Center
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Logo
              animate={{ rotateY: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              ₿
            </Logo>
            
            <GameTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Bitcoin Arena
            </GameTitle>
            
            <DiceContainer
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring" }}
            >
              <Die
                className={isRolling ? 'rolling' : ''}
                whileHover={{ scale: 1.1, rotateX: 15 }}
              >
                {lastDiceRoll[0]}
              </Die>
              <Die
                className={isRolling ? 'rolling' : ''}
                whileHover={{ scale: 1.1, rotateX: -15 }}
              >
                {lastDiceRoll[1]}
              </Die>
            </DiceContainer>

            <RollButton
              onClick={rollDice}
              disabled={!isMyTurn || isRolling}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              {isRolling ? '🎲 Rolando...' : isMyTurn ? '🎲 Atacar' : '⏳ Aguarde'}
            </RollButton>

            <TurnIndicator 
              isYourTurn={isMyTurn}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              {isMyTurn ? '⚡ Sua Batalha!' : `🔥 Turno: ${currentPlayer?.name}`}
            </TurnIndicator>
          </Center>

          {/* Board Spaces */}
          {gameState.board.map((space, index) => {
            // Buscar dados detalhados da propriedade
            const properties = Array.isArray(gameState.properties) 
              ? gameState.properties 
              : Array.from(gameState.properties || []);
            const property = properties.find(([id]) => id === space.id)?.[1];
            
            return (
              <BoardSpace 
                key={index} 
                index={index} 
                space={space}
                boardWidth={boardSize}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.02 }}
                whileHover={{ scale: 1.1, y: -5 }}
                style={getSpacePosition(index, boardSize)}
              >
                {/* Mostrar construções */}
                {property && property.type === 'property' && (property.houses > 0 || property.hotel) && (
                  <BuildingIndicator>
                    {property.hotel ? (
                      <Hotel />
                    ) : (
                      Array.from({ length: property.houses }).map((_, i) => (
                        <House key={i} />
                      ))
                    )}
                  </BuildingIndicator>
                )}
                
                <SpaceIcon>{getSpaceIcon(space)}</SpaceIcon>
                <SpaceName>{space.name}</SpaceName>
                {space.price > 0 && (
                  <SpacePrice>₿{space.price}</SpacePrice>
                )}
                
                {/* Propriedades disponíveis para compra - destaque dourado */}
                {space.type === 'property' && !property?.owner && 
                 currentPlayer && currentPlayer.position === space.id && isMyTurn && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      border: '3px solid #f7931a',
                      borderRadius: '10px',
                      background: 'rgba(247, 147, 26, 0.1)',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      boxShadow: [
                        '0 0 20px rgba(247, 147, 26, 0.5)',
                        '0 0 40px rgba(247, 147, 26, 0.8)',
                        '0 0 20px rgba(247, 147, 26, 0.5)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Indicar proprietário da propriedade */}
                {property && property.owner && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '2px',
                    right: '2px',
                    background: 'rgba(247, 147, 26, 0.9)',
                    border: '1px solid #f7931a',
                    borderRadius: '3px',
                    padding: '1px 2px',
                    fontSize: '0.5rem',
                    fontWeight: 'bold',
                    color: '#000',
                    textAlign: 'center',
                    textShadow: 'none',
                    zIndex: 3,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}>
                    {(() => {
                      const owner = gameState.players?.find(p => p.id === property.owner);
                      return owner ? `👑 ${owner.name.substring(0, 8)}` : '👑 DONO';
                    })()}
                  </div>
                )}

                {/* Indicar se está hipotecada */}
                {property && property.mortgaged && (
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'rgba(255, 0, 0, 0.3)',
                    border: '2px solid red',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    fontWeight: 'bold',
                    color: '#fff',
                    textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    zIndex: 2
                  }}>
                    HIPOTECADA
                  </div>
                )}
              </BoardSpace>
            );
          })}

          {/* Player Pieces */}
          {gameState.players?.map((player, playerIndex) => {
            // Usar posição animada se existir, senão usar posição atual
            const position = playerPositions[player.id] !== undefined 
              ? playerPositions[player.id] 
              : (player.position || 0);
            const spacePos = getSpacePosition(position, boardSize);
            const scale = boardSize.width / 720; // Corrigido para usar 720 como base
            const offset = playerIndex * Math.floor(15 * scale);
            
            // Calcular transform baseado na posição
            let transform = '';
            if (spacePos.bottom !== undefined) {
              transform = `translate(${offset}px, -${offset}px)`;
            } else if (spacePos.top !== undefined) {
              transform = `translate(${offset}px, ${offset}px)`;
            } else if (spacePos.left !== undefined) {
              transform = `translate(${offset}px, ${offset}px)`;
            } else if (spacePos.right !== undefined) {
              transform = `translate(-${offset}px, ${offset}px)`;
            }
            
            const isMoving = movingPlayer === player.id;
            
            return (
              <PlayerPiece
                key={player.id || playerIndex}
                color={playerColors[playerIndex] || 'linear-gradient(45deg, #666, #888)'}
                isCurrentPlayer={player.id === currentPlayer?.id}
                initial={{ scale: 0, rotateY: 0 }}
                animate={{ 
                  scale: isMoving ? [1, 1.3, 1] : 1, 
                  rotateY: player.id === currentPlayer?.id ? [0, 360] : 0,
                  y: isMoving ? [-10, 0] : 0,
                  boxShadow: isMoving 
                    ? ['0 5px 15px rgba(247, 147, 26, 0.4)', '0 15px 35px rgba(247, 147, 26, 0.8)', '0 5px 15px rgba(247, 147, 26, 0.4)']
                    : '0 5px 15px rgba(0, 0, 0, 0.3)'
                }}
                transition={{ 
                  delay: 1.5 + playerIndex * 0.1, 
                  type: "spring",
                  stiffness: 200,
                  rotateY: { duration: 2, repeat: player.id === currentPlayer?.id ? Infinity : 0 },
                  scale: { duration: 0.8 },
                  y: { duration: 0.8 },
                  boxShadow: { duration: 0.8 }
                }}
                whileHover={{ scale: 1.3, y: -15, rotateY: 180 }}
                style={{
                  ...spacePos,
                  transform,
                  width: Math.floor(45 * scale) + 'px',
                  height: Math.floor(45 * scale) + 'px',
                  fontSize: Math.max(12, Math.floor(20 * scale)) + 'px'
                }}
              >
                {playerIcons[playerIndex] || '?'}
                {isMoving && (
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '16px',
                      color: '#f7931a',
                      fontWeight: 'bold',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    🏃‍♂️
                  </motion.div>
                )}
              </PlayerPiece>
            );
          }) || []}
        </Board>
      </BoardContainer>

      <Sidebar>
        {gameState.players.map((player, index) => (
          <PlayerCard
            key={player.id}
            isCurrentPlayer={player.id === currentPlayer?.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              delay: 1.0 + index * 0.1, 
              type: "spring",
              stiffness: 100 
            }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <PlayerHeader>
              <PlayerAvatar 
                color={playerColors[index]}
                whileHover={{ 
                  rotate: 360,
                  scale: 1.15
                }}
                animate={player.id === currentPlayer?.id ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 15px 35px rgba(0, 0, 0, 0.4)',
                    '0 20px 45px rgba(247, 147, 26, 0.6)',
                    '0 15px 35px rgba(0, 0, 0, 0.4)'
                  ]
                } : {}}
                transition={{ 
                  duration: 0.5,
                  scale: { duration: 2, repeat: Infinity },
                  boxShadow: { duration: 2, repeat: Infinity }
                }}
              >
                {playerIcons[index] || '?'}
              </PlayerAvatar>
              
              <PlayerInfo>
                <PlayerName>{player.name}</PlayerName>
                <PlayerBalance>₿{player.balance?.toFixed(4) || '0.0000'}</PlayerBalance>
              </PlayerInfo>
            </PlayerHeader>

            {player.properties && player.properties.length > 0 && (
              <PropertyList>
                {player.properties.map(propId => {
                  const property = gameState.board?.find(s => s.id === propId);
                  if (!property) return null;
                  
                  // Buscar dados detalhados da propriedade
                  const propertyDetails = gameState.properties?.find(([id]) => id === propId)?.[1];
                  
                  // Calcular aluguel baseado no tipo de propriedade
                  let rent = property.price * 0.1; // Valor padrão
                  
                  if (propertyDetails?.rent) {
                    // Se rent é um array (como nas propriedades), usar o primeiro valor
                    if (Array.isArray(propertyDetails.rent)) {
                      rent = propertyDetails.rent[0] || rent;
                    } else if (typeof propertyDetails.rent === 'number') {
                      rent = propertyDetails.rent;
                    }
                  }
                  
                  // Garantir que rent é um número
                  rent = Number(rent) || 0;
                  
                  return (
                    <div key={propId}>
                      <PropertyChip 
                        color={property.color || '#666'}
                        whileHover={{ scale: 1.1, y: -2 }}
                        title={`${property.name} - Aluguel: ₿${rent.toFixed(4)}`}
                      >
                        {property.name?.substring(0, 8) || 'Property'}
                        <br />
                        <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>
                          ₿{rent.toFixed(4)}
                        </span>
                        
                        {/* Mostrar construções */}
                        {propertyDetails && (
                          <div style={{ marginTop: '0.25rem', fontSize: '0.5rem' }}>
                            {propertyDetails.hotel ? '🏨' : 
                             propertyDetails.houses > 0 ? '🏠'.repeat(propertyDetails.houses) : ''}
                            {propertyDetails.mortgaged && ' 💸'}
                          </div>
                        )}
                      </PropertyChip>
                      
                      {/* Interface de construção - apenas para propriedades normais do jogador atual */}
                      {player.id === playerId && property.type === 'property' && propertyDetails && (
                        <BuildingControls>
                          <PropertyStatus>
                            {propertyDetails.mortgaged ? '💸 HIPOTECADA' :
                             propertyDetails.hotel ? '🏨 HOTEL' :
                             propertyDetails.houses > 0 ? `🏠 ${propertyDetails.houses} CASAS` :
                             hasColorMonopoly(playerId, property.color) ? '🎯 CONJUNTO COMPLETO' : '🏗️ TERRENO'
                            }
                          </PropertyStatus>
                          
                          {!propertyDetails.mortgaged && (
                            <BuildingSection>
                              {/* Construir Casa */}
                              <ActionButton
                                small
                                onClick={() => buildHouse(propId)}
                                disabled={!canBuildHouse(propId)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                🏠 Casa (₿{(property.price * 0.5).toFixed(3)})
                              </ActionButton>
                              
                              {/* Construir Hotel */}
                              <ActionButton
                                small
                                onClick={() => buildHotel(propId)}
                                disabled={!canBuildHotel(propId)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                🏨 Hotel (₿{(property.price * 0.5).toFixed(3)})
                              </ActionButton>
                              
                              {/* Vender Construção */}
                              <ActionButton
                                small
                                onClick={() => sellBuilding(propId)}
                                disabled={!canSellBuilding(propId)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                🏚️ Vender (₿{(property.price * 0.25).toFixed(3)})
                              </ActionButton>
                            </BuildingSection>
                          )}
                          
                          <BuildingSection>
                            {/* Hipotecar/Quitar */}
                            {!propertyDetails.mortgaged ? (
                              <ActionButton
                                small
                                onClick={() => mortgageProperty(propId)}
                                disabled={propertyDetails.houses > 0 || propertyDetails.hotel}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                💸 Hipotecar (₿{(property.price * 0.5).toFixed(3)})
                              </ActionButton>
                            ) : (
                              <ActionButton
                                small
                                primary
                                onClick={() => unmortgageProperty(propId)}
                                disabled={player.balance < property.price * 0.55}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                💰 Quitar (₿{(property.price * 0.55).toFixed(3)})
                              </ActionButton>
                            )}
                          </BuildingSection>
                        </BuildingControls>
                      )}
                    </div>
                  );
                })}
              </PropertyList>
            )}

            {player.id === playerId && !player.bankrupt && (
              <>
                {/* Botão de Falência - sempre disponível para o jogador atual */}
                <ActionButton
                  onClick={declareBankruptcy}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ background: 'linear-gradient(45deg, #dc3545, #ff4757)' }}
                >
                  💸 Declarar Falência
                </ActionButton>
              </>
            )}
            
            {/* Indicação de jogador falido */}
            {player.bankrupt && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(255, 0, 0, 0.2)',
                border: '2px solid #ff4757',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#fff',
                fontWeight: 'bold'
              }}>
                💸 FALIDO
              </div>
            )}
          </PlayerCard>
        ))}
      </Sidebar>

      {/* Modal de Fim de Jogo */}
      <AnimatePresence>
        {showGameEnd && gameEndData && (
          <GameEndModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GameEndContent
              initial={{ scale: 0.5, rotateY: 180 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, rotateY: -180 }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <WinnerTitle>
                {gameEndData.winner ? `🏆 ${gameEndData.winner.name} VENCEU!` : '🤝 EMPATE'}
              </WinnerTitle>
              
              <div style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '2rem' }}>
                ⚡ Bitcoin Monopoly Arena Finalizada ⚡
              </div>
              
              <StatsContainer>
                {gameEndData.finalStats?.map((stat, index) => (
                  <PlayerStat 
                    key={stat.id} 
                    winner={stat.winner}
                    bankrupt={stat.bankrupt}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {stat.winner ? '🏆' : stat.bankrupt ? '💸' : '⚔️'}
                      </span>
                      <StatText style={{ fontSize: '1.1rem' }}>
                        {stat.name}
                      </StatText>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <StatText style={{ color: '#f7931a' }}>
                        ₿{stat.totalWealth.toFixed(4)}
                      </StatText>
                      <br />
                      <StatText style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                        {stat.propertiesOwned} propriedades
                      </StatText>
                    </div>
                  </PlayerStat>
                ))}
              </StatsContainer>
              
              <CardButton
                onClick={() => {
                  setShowGameEnd(false);
                  navigate('/');
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🏠 Voltar ao Menu
              </CardButton>
            </GameEndContent>
          </GameEndModal>
        )}
      </AnimatePresence>

      {/* Modal de Carta */}
      <AnimatePresence>
        {showCard && currentCard && (
          <CardModal
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            transition={{ duration: 0.6, type: "spring" }}
            onClick={closeCard}
          >
            <motion.div
              initial={{ scale: 0.8, rotateX: 30 }}
              animate={{ scale: 1, rotateX: 0 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <motion.div style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' }}>
                  {currentCard.cardType === 'chance' ? '🎯' : '📦'}
                </motion.div>
                <CardTitle>
                  {currentCard.cardType === 'chance' ? 'SORTE' : 'ARCA COMUNITÁRIA'}
                </CardTitle>
              </motion.div>
              
              <CardText>
                {currentCard.card.text}
              </CardText>
              
              {currentCard.result?.message && (
                <CardText style={{ color: '#f7931a', fontSize: '1rem', fontWeight: 'bold' }}>
                  📈 {currentCard.result.message}
                </CardText>
              )}
              
              <CardButton
                onClick={closeCard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✅ Confirmar
              </CardButton>
            </motion.div>
          </CardModal>
        )}
      </AnimatePresence>

      {/* Modal de Compra de Propriedade */}
      <AnimatePresence>
        {showBuyModal && propertyToBuy && (
          <BuyModal
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <motion.div
              initial={{ scale: 0.8, rotateX: 30 }}
              animate={{ scale: 1, rotateX: 0 }}
              transition={{ delay: 0.2 }}
              style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <BuyTitle
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                🏛️ PROPRIEDADE DISPONÍVEL
              </BuyTitle>

              <PropertyInfo
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <PropertyName>{propertyToBuy.propertyName}</PropertyName>
                <PropertyPrice>₿{propertyToBuy.price}</PropertyPrice>
                <BuyQuestion>Deseja conquistar esta propriedade?</BuyQuestion>
              </PropertyInfo>

              <ButtonContainer>
                <BuyButton
                  primary
                  onClick={handleBuyProperty}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  💰 Comprar
                </BuyButton>
                
                <BuyButton
                  onClick={handleDeclineBuy}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  ❌ Recusar
                </BuyButton>
              </ButtonContainer>
            </motion.div>
          </BuyModal>
        )}
      </AnimatePresence>
    </GameContainer>
  );
}

export default GameBoard; 