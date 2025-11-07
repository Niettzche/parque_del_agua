import React from 'react';
import movimientoLogo from '../assets/movimiento-naranja.png';

interface Props {
  dismissed: boolean;
}

const SplashScreen: React.FC<Props> = ({ dismissed }) => {
  return (
    <div className={`splash-screen ${dismissed ? 'splash-exit' : 'splash-enter'}`}>
      <div className="splash-logo-wrapper">
        <img src={movimientoLogo} alt="Movimiento Naranja" className="splash-logo" />
      </div>
      <p className="splash-title">Movimiento Naranja</p>
      <p className="splash-subtitle">Wayfinding QR+NFC · Parque del Agua</p>
    </div>
  );
};

export default SplashScreen;
