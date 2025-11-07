import React from 'react';
import type { Language, UserLocation } from '../types';
import { mockData } from '../data';
import BackButton from '../components/BackButton';

interface Props {
  onLocationSet: (location: UserLocation) => void;
  language: Language;
  speak: (text: string) => void;
  onBack: () => void;
}

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[var(--nlOrange)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const NFCIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

const GpsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657l-5.657 5.657-5.657-5.657a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);

const PermissionsScreen: React.FC<Props> = ({ onLocationSet, language, speak, onBack }) => {
  const text = {
    es: {
      title: "Para mostrar 'Usted está aquí'",
      description: "Permite el acceso a tu ubicación o acerca tu teléfono a la placa (NFC/QR) más cercana.",
      allow: "Permitir ubicación",
      simulate: "Simular NFC (PLACA-A12)"
    },
    en: {
      title: "To show 'You are here'",
      description: "Allow location access or tap your phone on the nearest sign (NFC/QR).",
      allow: "Allow location",
      simulate: "Simulate NFC (PLACA-A12)"
    }
  };

  const handleAllowLocation = () => {
    // Mock successful geolocation
    const mockLocation: UserLocation = { lat: 25.6695, lon: -100.2485, source: 'gps' };
    onLocationSet(mockLocation);
  };
  
  const handleSimulateNFC = () => {
    const plateId = 'PLACA-A12';
    const sign = mockData.signs.find(s => s.code === plateId);
    if (sign) {
      const location: UserLocation = { lat: sign.lat, lon: sign.lon, source: 'nfc', plateId: sign.code };
      onLocationSet(location);
    } else {
        // Fallback if sign not found
      alert('Error: Placa no encontrada / Plate not found');
    }
  };

  React.useEffect(() => {
    speak(text[language].title + ". " + text[language].description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center relative">
      <BackButton onClick={onBack} />
      <LocationIcon />
      <h1 className="text-3xl font-bold text-[var(--text)] mb-2">{text[language].title}</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">{text[language].description}</p>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={handleAllowLocation}
          className="w-full flex items-center justify-center bg-[var(--nlOrange)] hover:bg-[var(--nlOrangeDark)] text-white font-bold py-4 px-4 rounded-2xl transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-[var(--nlOrangeLight)] text-xl"
        >
            <GpsIcon />
          {text[language].allow}
        </button>
        <button
          onClick={handleSimulateNFC}
          className="w-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-4 rounded-2xl transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300 text-xl"
        >
            <NFCIcon />
          {text[language].simulate}
        </button>
      </div>
    </div>
  );
};

export default PermissionsScreen;