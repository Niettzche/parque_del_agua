import React, { useMemo, useEffect } from 'react';
import type { UserLocation, POI, Language } from '../types';
import { mockData } from '../data';
import { getDistance } from '../services/routingService';
import BackButton from '../components/BackButton';

interface Props {
  userLocation: UserLocation | null;
  onNavigateWithRoute: (destination: POI) => void;
  onBack: () => void;
  language: Language;
  speak: (text: string) => void;
}

const EmergencyScreen: React.FC<Props> = ({ userLocation, onNavigateWithRoute, onBack, language, speak }) => {

  const text = {
    es: {
      title: 'Emergencia',
      call911: 'Llamar al 911',
      call_alert: 'Simulando llamada al 911...',
      route_title: 'Ruta a Punto de Reunión / Enfermería',
      nearest_points: 'Puntos de ayuda más cercanos:',
      start_route: 'Iniciar Ruta',
      legal_notice: 'Esta es una herramienta de orientación. En una emergencia real, siga las instrucciones del personal del parque.'
    },
    en: {
      title: 'Emergency',
      call911: 'Call 911',
      call_alert: 'Simulating call to 911...',
      route_title: 'Route to Assembly Point / First Aid',
      nearest_points: 'Nearest help points:',
      start_route: 'Start Route',
      legal_notice: 'This is an orientation tool. In a real emergency, follow instructions from park staff.'
    }
  };
  
  useEffect(() => {
    speak(text[language].title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);


  const nearestHelpPoints = useMemo(() => {
    if (!userLocation) return [];
    
    const helpPois = mockData.pois.filter(p => p.type === 'reunion' || p.type === 'enfermeria');
    
    return helpPois
      .map(poi => ({
        ...poi,
        distance: getDistance(userLocation, poi)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);
  }, [userLocation]);

  const handleCall911 = () => {
    alert(text[language].call_alert);
    // In a real app, this would be: window.location.href = 'tel:911';
  };

  return (
    <div className="p-6 h-screen flex flex-col bg-red-50 relative">
      <BackButton onClick={onBack} />
      
      <div className="flex-grow flex flex-col items-center justify-center text-center pt-12">
        <h1 className="text-5xl font-extrabold text-red-700 mb-8">{text[language].title}</h1>

        <div className="w-full max-w-sm space-y-6">
          <button
            onClick={handleCall911}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 px-4 rounded-2xl text-2xl shadow-lg transform transition-transform hover:scale-105"
          >
            {text[language].call911}
          </button>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-200">
             <h2 className="text-xl font-bold text-red-800">{text[language].route_title}</h2>
             <p className="text-gray-600 mt-2 mb-4">{text[language].nearest_points}</p>
             <div className="space-y-3">
               {nearestHelpPoints.map(poi => (
                 <div key={poi.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                   <div>
                     <p className="font-semibold text-left">{poi[`name_${language}`]}</p>
                     <p className="text-sm text-gray-500 text-left">{Math.round(poi.distance)}m</p>
                   </div>
                   <button 
                    onClick={() => onNavigateWithRoute(poi)}
                    className="bg-[var(--nlOrange)] text-white font-semibold px-4 py-2 rounded-lg"
                   >
                     {text[language].start_route}
                   </button>
                 </div>
               ))}
             </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-12 max-w-sm">
          {text[language].legal_notice}
        </p>
      </div>
    </div>
  );
};

export default EmergencyScreen;