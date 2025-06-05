import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { GameContext } from '../App';

const holographicShine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const dataStream = keyframes`
  0% { transform: translateY(100vh) rotate(0deg); }
  100% { transform: translateY(-100vh) rotate(360deg); }
`;

const energyPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(247, 147, 26, 0.4); }
  50% { box-shadow: 0 0 60px rgba(247, 147, 26, 0.8), 0 0 100px rgba(247, 147, 26, 0.4); }
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
    radial-gradient(circle at 30% 20%, rgba(247, 147, 26, 0.18) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(102, 126, 234, 0.18) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 205, 0, 0.08) 0%, transparent 70%),
    linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    padding: 3.5rem;
    margin-top: 110px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
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
    padding: 2.2rem;
    margin-top: 85px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    padding: 2rem;
    margin-top: 75px;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    padding: 1.8rem;
    margin-top: 65px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    padding: 1.5rem;
    margin-top: 60px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    padding: 1.2rem;
    margin-top: 55px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    padding: 1rem;
    margin-top: 50px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    padding: 0.8rem;
    margin-top: 45px;
  }
`;

const DataStreamParticle = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['duration'].includes(prop),
})`
  position: absolute;
  font-size: 12px;
  color: rgba(247, 147, 26, 0.3);
  font-family: 'Courier New', monospace;
  pointer-events: none;
  z-index: 1;
  animation: ${dataStream} ${props => props.duration}s linear infinite;
`;

const LobbyCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(35px);
  border-radius: 35px;
  padding: 5rem 4rem;
  text-align: center;
  box-shadow: 
    0 35px 100px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 0 0 1px rgba(247, 147, 26, 0.25);
  border: 2px solid transparent;
  background-clip: padding-box;
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 10;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(247, 147, 26, 0.1), 
      rgba(255, 205, 0, 0.1), 
      rgba(247, 147, 26, 0.1)
    );
    background-size: 200% 200%;
    border-radius: 30px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.5s ease;
    animation: ${holographicShine} 3s ease-in-out infinite;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    padding: 6rem 5rem;
    border-radius: 45px;
    max-width: 1000px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    padding: 5.5rem 4.5rem;
    border-radius: 40px;
    max-width: 950px;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    padding: 5rem 4rem;
    border-radius: 35px;
    max-width: 900px;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    padding: 4.5rem 3.8rem;
    border-radius: 33px;
    max-width: 850px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    padding: 4rem 3.5rem;
    border-radius: 30px;
    max-width: 750px;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    padding: 3.5rem 3rem;
    border-radius: 28px;
    max-width: 550px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    padding: 3rem 2.5rem;
    border-radius: 25px;
    max-width: 450px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    padding: 2.5rem 2rem;
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
    padding: 1.5rem 1.2rem;
    border-radius: 18px;
    max-width: 280px;
  }
`;

const Title = styled(motion.h2)`
  font-family: 'Orbitron', monospace;
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 2.5rem 0;
  background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a, #ffcd00);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${holographicShine} 2s ease-in-out infinite;
  text-shadow: 0 0 40px rgba(247, 147, 26, 0.6);
  letter-spacing: 4px;
  text-align: center;
  line-height: 1.1;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    font-size: 4.5rem;
    letter-spacing: 5px;
    margin-bottom: 3rem;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    font-size: 4rem;
    letter-spacing: 4.5px;
    margin-bottom: 2.8rem;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    font-size: 3.8rem;
    letter-spacing: 4px;
    margin-bottom: 2.6rem;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    font-size: 3.6rem;
    letter-spacing: 3.8px;
    margin-bottom: 2.4rem;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    font-size: 3.3rem;
    letter-spacing: 3.5px;
    margin-bottom: 2.2rem;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    font-size: 3rem;
    letter-spacing: 3px;
    margin-bottom: 2rem;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    font-size: 2.6rem;
    letter-spacing: 2.5px;
    margin-bottom: 1.8rem;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    font-size: 2.3rem;
    letter-spacing: 2px;
    margin-bottom: 1.6rem;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    font-size: 2rem;
    letter-spacing: 1.5px;
    margin-bottom: 1.4rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    font-size: 1.7rem;
    letter-spacing: 1px;
    margin-bottom: 1.2rem;
  }
`;

const GameIdContainer = styled(motion.div)`
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 25px;
  margin: 0 auto 3.5rem auto;
  border: 2px solid rgba(247, 147, 26, 0.4);
  position: relative;
  overflow: hidden;
  animation: ${energyPulse} 2s ease-in-out infinite;
  max-width: 600px;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -100%;
    width: 100%;
    height: calc(100% + 4px);
    background: linear-gradient(90deg, 
      transparent, 
      rgba(247, 147, 26, 0.5), 
      transparent
    );
    animation: ${holographicShine} 2s linear infinite;
  }
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    padding: 3.5rem;
    margin-bottom: 4.5rem;
    max-width: 800px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    padding: 3rem;
    margin-bottom: 4rem;
    max-width: 700px;
  }
  
  /* Desktop Médio (1200px - 1439px) */
  @media (max-width: 1439px) and (min-width: 1200px) {
    padding: 2.8rem;
    margin-bottom: 3.8rem;
    max-width: 650px;
  }
  
  /* Laptop/Tablet Grande (992px - 1199px) */
  @media (max-width: 1199px) and (min-width: 992px) {
    padding: 2.6rem;
    margin-bottom: 3.6rem;
    max-width: 600px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    padding: 2.4rem;
    margin-bottom: 3.4rem;
    max-width: 550px;
  }
  
  /* Mobile Grande/Tablet Pequeno (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    padding: 2.2rem;
    margin-bottom: 3.2rem;
    max-width: 500px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    padding: 2rem;
    margin-bottom: 3rem;
    max-width: 420px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    padding: 1.8rem;
    margin-bottom: 2.8rem;
    max-width: 380px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    padding: 1.6rem;
    margin-bottom: 2.5rem;
    max-width: 320px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    padding: 1.4rem;
    margin-bottom: 2.2rem;
    max-width: 280px;
  }
`;

const GameIdLabel = styled.p`
  margin: 0 0 1.5rem 0;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 3px;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    font-size: 1.6rem;
    letter-spacing: 4px;
    margin-bottom: 2rem;
  }
  
  /* Desktop Grande/Médio (1200px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1200px) {
    font-size: 1.4rem;
    letter-spacing: 3.5px;
    margin-bottom: 1.8rem;
  }
  
  /* Laptop/Tablet Grande (768px - 1199px) */
  @media (max-width: 1199px) and (min-width: 768px) {
    font-size: 1.3rem;
    letter-spacing: 3px;
    margin-bottom: 1.5rem;
  }
  
  /* Mobile Grande (414px - 767px) */
  @media (max-width: 767px) and (min-width: 414px) {
    font-size: 1.2rem;
    letter-spacing: 2.5px;
    margin-bottom: 1.3rem;
  }
  
  /* Mobile Pequeno (320px - 413px) */
  @media (max-width: 413px) and (min-width: 320px) {
    font-size: 1.1rem;
    letter-spacing: 2px;
    margin-bottom: 1.2rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    font-size: 1rem;
    letter-spacing: 1.5px;
    margin-bottom: 1rem;
  }
`;

const GameIdText = styled(motion.p)`
  margin: 0;
  font-family: 'Orbitron', monospace;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: #f7931a;
  cursor: pointer;
  user-select: all;
  padding: 1rem;
  background: rgba(247, 147, 26, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(247, 147, 26, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(247, 147, 26, 0.2);
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(247, 147, 26, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    max-width: 800px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.2rem;
    max-width: 700px;
  }
  
  /* Desktop Médio/Laptop (992px - 1439px) */
  @media (max-width: 1439px) and (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    max-width: 650px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.8rem;
    max-width: 580px;
  }
  
  /* Mobile Grande (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    max-width: 520px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
    max-width: 400px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    max-width: 360px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    max-width: 310px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
    max-width: 280px;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  padding: 1.2rem 0.6rem;
  border-radius: 15px;
  border: 1px solid rgba(247, 147, 26, 0.2);
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 80px;
  max-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    padding: 2rem 1.2rem;
    min-height: 120px;
    max-height: 160px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    padding: 1.8rem 1rem;
    min-height: 110px;
    max-height: 150px;
  }
  
  /* Desktop Médio/Laptop (992px - 1439px) */
  @media (max-width: 1439px) and (min-width: 992px) {
    padding: 1.6rem 0.9rem;
    min-height: 100px;
    max-height: 140px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    padding: 1.4rem 0.8rem;
    min-height: 95px;
    max-height: 130px;
  }
  
  /* Mobile Grande (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    padding: 1.3rem 0.7rem;
    min-height: 85px;
    max-height: 120px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    padding: 1.2rem 0.6rem;
    min-height: 80px;
    max-height: 110px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    padding: 1.1rem 0.5rem;
    min-height: 75px;
    max-height: 105px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    padding: 1rem 0.4rem;
    min-height: 70px;
    max-height: 100px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    padding: 0.9rem 0.3rem;
    min-height: 65px;
    max-height: 95px;
  }
  
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
`;

const StatValue = styled.div`
  font-family: 'Orbitron', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  color: #f7931a;
  margin-bottom: 0.3rem;
  text-shadow: 0 0 20px rgba(247, 147, 26, 0.5);
  text-align: center;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    font-size: 1.8rem;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    font-size: 1.6rem;
  }
  
  /* Desktop Médio/Laptop (992px - 1439px) */
  @media (max-width: 1439px) and (min-width: 992px) {
    font-size: 1.4rem;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    font-size: 1.3rem;
  }
  
  /* Mobile Grande (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    font-size: 1.2rem;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    font-size: 1.1rem;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    font-size: 1rem;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    font-size: 0.9rem;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    font-size: 0.8rem;
  }
`;

const StatLabel = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin-top: 0.2rem;
  
  /* Desktop Ultra Largo (1920px+) */
  @media (min-width: 1920px) {
    font-size: 0.95rem;
    letter-spacing: 1px;
  }
  
  /* Desktop Grande (1440px - 1919px) */
  @media (max-width: 1919px) and (min-width: 1440px) {
    font-size: 0.85rem;
    letter-spacing: 0.8px;
  }
  
  /* Desktop Médio/Laptop (992px - 1439px) */
  @media (max-width: 1439px) and (min-width: 992px) {
    font-size: 0.8rem;
    letter-spacing: 0.7px;
  }
  
  /* Tablet (768px - 991px) */
  @media (max-width: 991px) and (min-width: 768px) {
    font-size: 0.75rem;
    letter-spacing: 0.6px;
  }
  
  /* Mobile Grande (576px - 767px) */
  @media (max-width: 767px) and (min-width: 576px) {
    font-size: 0.7rem;
    letter-spacing: 0.5px;
  }
  
  /* Mobile Médio (414px - 575px) */
  @media (max-width: 575px) and (min-width: 414px) {
    font-size: 0.55rem;
    letter-spacing: 0.2px;
  }
  
  /* Mobile Pequeno (375px - 413px) */
  @media (max-width: 413px) and (min-width: 375px) {
    font-size: 0.5rem;
    letter-spacing: 0.1px;
  }
  
  /* Mobile Muito Pequeno (320px - 374px) */
  @media (max-width: 374px) and (min-width: 320px) {
    font-size: 0.45rem;
    letter-spacing: 0.1px;
  }
  
  /* Telas Ultra Pequenas (<320px) */
  @media (max-width: 319px) {
    font-size: 0.4rem;
    letter-spacing: 0px;
  }
`;

const PlayersSection = styled.div`
  margin-bottom: 3rem;
`;

const PlayersTitle = styled.h3`
  font-family: 'Orbitron', monospace;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #f7931a;
  text-shadow: 0 0 20px rgba(247, 147, 26, 0.5);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const PlayersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const PlayerCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  padding: 2rem;
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  
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
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(247, 147, 26, 0.5);
    box-shadow: 0 20px 40px rgba(247, 147, 26, 0.2);
  }
`;

const PlayerAvatar = styled(motion.div)`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f7931a, #ffcd00);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #000;
  font-size: 2rem;
  font-family: 'Orbitron', monospace;
  box-shadow: 
    0 10px 30px rgba(247, 147, 26, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(45deg, #f7931a, #ffcd00, #f7931a);
    border-radius: 50%;
    z-index: -1;
    animation: ${energyPulse} 2s ease-in-out infinite;
  }
`;

const PlayerInfo = styled.div`
  flex: 1;
  text-align: left;
`;

const PlayerName = styled.div`
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`;

const PlayerStatus = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
`;

const HostBadge = styled(motion.span)`
  background: linear-gradient(45deg, #f7931a, #ffcd00);
  color: #000;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-left: 1rem;
  font-family: 'Orbitron', monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(247, 147, 26, 0.4);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['primary'].includes(prop),
})`
  padding: 1.5rem 3rem;
  border: none;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: 'Orbitron', monospace;
  letter-spacing: 2px;
  cursor: pointer;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #f7931a 0%, #ffcd00 100%)' : 
    'rgba(255, 255, 255, 0.05)'
  };
  color: ${props => props.primary ? '#000' : '#fff'};
  border: ${props => props.primary ? 'none' : '2px solid rgba(255, 255, 255, 0.2)'};
  backdrop-filter: blur(15px);
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.3), 
      transparent
    );
    transition: left 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 25px 50px rgba(247, 147, 26, 0.4),
      inset 0 2px 0 rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
`;

const WaitingMessage = styled(motion.div)`
  padding: 2rem;
  background: rgba(255, 193, 7, 0.1);
  border: 2px solid rgba(255, 193, 7, 0.3);
  border-radius: 20px;
  margin-bottom: 2rem;
  color: #ffcd00;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  backdrop-filter: blur(15px);
  box-shadow: 0 10px 30px rgba(255, 193, 7, 0.2);
`;

function GameLobby() {
  const { gameId: urlGameId } = useParams();
  const navigate = useNavigate();
  const { socket, gameState, playerId } = useContext(GameContext);
  const [dataStreams, setDataStreams] = useState([]);

  useEffect(() => {
    if (!socket) {
      navigate('/');
      return;
    }

    // Criar streams de dados flutuando
    const streams = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      text: ['01001001', '11001010', '₿₿₿₿', 'BLOCKCHAIN', 'CRYPTO', 'HODL'][Math.floor(Math.random() * 6)],
      duration: Math.random() * 15 + 10
    }));
    setDataStreams(streams);

    socket.on('game_started', (newGameState) => {
      console.log('🎮 GameLobby: Recebido game_started event:', newGameState);
      console.log('🎮 GameLobby: Navegando para:', `/game/${urlGameId}`);
      
      toast.success('🚀 Iniciando batalha épica!', {
        style: { 
          background: 'rgba(247, 147, 26, 0.1)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(247, 147, 26, 0.3)'
        }
      });
      
      // Adicionar pequeno delay para garantir que o toast apareça
      setTimeout(() => {
        navigate(`/game/${urlGameId}`);
      }, 500);
    });

    return () => {
      socket.off('game_started');
    };
  }, [socket, navigate, urlGameId]);

  const copyGameId = () => {
    navigator.clipboard.writeText(urlGameId);
    toast.success('🎯 ID da batalha copiado!', {
      style: { 
        background: 'rgba(0, 255, 0, 0.1)', 
        backdropFilter: 'blur(10px)' 
      }
    });
  };

  const startGame = () => {
    if (!socket) {
      console.log('❌ Socket não encontrado');
      return;
    }
    console.log('🚀 Enviando start_game para servidor');
    socket.emit('start_game');
  };

  const leaveGame = () => {
    navigate('/');
  };

  if (!gameState) {
    return (
      <Container>
        <AnimatePresence>
          {dataStreams.map((stream) => (
            <DataStreamParticle
              key={stream.id}
              initial={{ x: stream.x, y: window.innerHeight + 100 }}
              animate={{ y: -100 }}
              transition={{ duration: stream.duration, repeat: Infinity }}
              duration={stream.duration}
              style={{ left: stream.x }}
            >
              {stream.text}
            </DataStreamParticle>
          ))}
        </AnimatePresence>
        
        <LobbyCard
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Title>⚡ Carregando Matriz...</Title>
        </LobbyCard>
      </Container>
    );
  }

  const isHost = gameState.hostId === playerId;
  const canStart = gameState.players.length >= 2 && isHost;

  return (
    <Container>
      <AnimatePresence>
        {dataStreams.map((stream) => (
          <DataStreamParticle
            key={stream.id}
            initial={{ x: stream.x, y: window.innerHeight + 100 }}
            animate={{ y: -100 }}
            transition={{ duration: stream.duration, repeat: Infinity }}
            duration={stream.duration}
            style={{ left: stream.x }}
          >
            {stream.text}
          </DataStreamParticle>
        ))}
      </AnimatePresence>

      <LobbyCard
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        <Title
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
        >
          ⚡ Centro de Comando
        </Title>
        
        <GameIdContainer
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <GameIdLabel>🎯 ID da Batalha (Clique para Copiar)</GameIdLabel>
          <GameIdText 
            onClick={copyGameId}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {urlGameId}
          </GameIdText>
        </GameIdContainer>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <StatValue>{gameState.players.length}</StatValue>
            <StatLabel>Guerreiros / 6</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <StatValue>{gameState.gameStarted ? 'ATIVO' : 'STANDBY'}</StatValue>
            <StatLabel>Status da Missão</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <StatValue>{isHost ? 'COMANDANTE' : 'SOLDADO'}</StatValue>
            <StatLabel>Sua Patente</StatLabel>
          </StatCard>
        </StatsGrid>

        <PlayersSection>
          <PlayersTitle
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            🏛️ Guerreiros Conectados
          </PlayersTitle>
          
          <PlayersList>
            {gameState.players.map((player, index) => (
              <PlayerCard
                key={player.id}
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  delay: 1.2 + index * 0.1, 
                  type: "spring", 
                  stiffness: 100 
                }}
                whileHover={{ scale: 1.03 }}
              >
                <PlayerAvatar
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </PlayerAvatar>
                
                <PlayerInfo>
                  <PlayerName>
                    {player.name}
                    {player.id === gameState.hostId && (
                      <HostBadge
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 + index * 0.1 }}
                      >
                        Comandante
                      </HostBadge>
                    )}
                  </PlayerName>
                  <PlayerStatus>
                    {player.id === playerId ? '🎯 Você' : '🤝 Conectado'}
                  </PlayerStatus>
                </PlayerInfo>
              </PlayerCard>
            ))}
          </PlayersList>
        </PlayersSection>

        {gameState.players.length < 2 && (
          <WaitingMessage
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, type: "spring" }}
          >
            ⏳ Aguardando mais guerreiros para iniciar a batalha...
            <br />
            <strong>Mínimo: 2 jogadores</strong>
          </WaitingMessage>
        )}

        <ButtonContainer>
          {isHost ? (
            <Button
              primary
              onClick={startGame}
              disabled={!canStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0, type: "spring" }}
            >
              {canStart ? '🚀 Iniciar Batalha' : '⏳ Aguarde Guerreiros'}
            </Button>
          ) : (
            <WaitingMessage
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
            >
              ⚡ Aguardando comandante iniciar a missão...
            </WaitingMessage>
          )}
          
          <Button
            onClick={leaveGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, type: "spring" }}
          >
            🚪 Abandonar Missão
          </Button>
        </ButtonContainer>
      </LobbyCard>
    </Container>
  );
}

export default GameLobby; 