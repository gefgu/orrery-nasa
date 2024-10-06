import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import loaderAnimation from '../Loader/Loader.json'; // Substitua pelo caminho correto

const Loader = () => {
  return (
    <div style={styles.loaderContainer}>
      <Player
        autoplay
        loop
        src={loaderAnimation}
        style={{ height: '150px', width: '150px' }} // Ajuste o tamanho conforme necessário
      />
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Full screen height
    backgroundColor: '#f0f0f0', // Cor de fundo, ajuste conforme necessário
  },
};

export default Loader;