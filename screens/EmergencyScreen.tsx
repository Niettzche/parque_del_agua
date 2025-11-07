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
      title: 'Emergencias',
      subtitle: 'Sigue estas acciones y alerta al personal del parque.',
      call: 'Llamar 911',
      simulateCall: 'Simulando llamada al 911...',
      nearest: 'Puntos de ayuda más cercanos',
      firstAid: 'Ruta a primeros auxilios',
      assembly: 'Ruta a punto de reunión',
      info: 'Comparte tu ubicación, describe la situación y mantén la calma.',
      legal: 'Esta herramienta no reemplaza las instrucciones oficiales del personal de seguridad.',
      meters: 'metros',
    },
    en: {
      title: 'Emergencies',
      subtitle: 'Follow these actions and alert park staff.',
      call: 'Call 911',
      simulateCall: 'Simulating call to 911...',
      nearest: 'Closest help points',
      firstAid: 'Route to first aid',
      assembly: 'Route to meeting point',
      info: 'Share your location, describe the situation, and stay calm.',
      legal: 'This tool does not replace official instructions from safety staff.',
      meters: 'meters',
    },
  };

  useEffect(() => {
    speak(text[language].title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const nearestHelpPoints = useMemo(() => {
    if (!userLocation) return [];
    const helpPois = mockData.pois.filter((p) => p.type === 'reunion' || p.type === 'enfermeria');
    return helpPois
      .map((poi) => ({
        ...poi,
        distance: getDistance(userLocation, poi),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [userLocation]);

  const findNearestType = (type: 'enfermeria' | 'reunion') => {
    if (!userLocation) return null;
    return mockData.pois
      .filter((poi) => poi.type === type)
      .map((poi) => ({ ...poi, distance: getDistance(userLocation, poi) }))
      .sort((a, b) => a.distance - b.distance)[0];
  };

  const handleQuickRoute = (type: 'enfermeria' | 'reunion') => {
    const poi = findNearestType(type);
    if (poi) {
      onNavigateWithRoute(poi);
    }
  };

  const handleCall911 = () => {
    alert(text[language].simulateCall);
  };

  return (
    <div className="h-[100svh] flex flex-col gap-4">
      <section className="relative rounded-3xl bg-[var(--primary)] text-white p-5 pb-12 overflow-hidden space-y-4 animate-fade-down">
        <BackButton onClick={onBack} className="mb-1" />
        <p className="text-xs uppercase tracking-[0.5em] text-white/70">SOS · 24/7</p>
        <h1 className="text-4xl font-bold font-[Poppins]">{text[language].title}</h1>
        <p className="text-white/85 mt-3">{text[language].subtitle}</p>
      </section>

      <section className="flex-1 rounded-3xl bg-white/95 p-4 space-y-5 overflow-y-auto">
        <button
          onClick={handleCall911}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-3xl text-lg shadow-lg shadow-red-200 flex items-center justify-center gap-2"
        >
          🚨 {text[language].call}
        </button>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-[var(--pine)] uppercase tracking-wide">{text[language].nearest}</p>
          {nearestHelpPoints.length === 0 && (
            <p className="text-xs text-[var(--sage)]">{language === 'es' ? 'Activa tu ubicación para ver las opciones.' : 'Enable location to see options.'}</p>
          )}
          {nearestHelpPoints.map((poi) => (
            <div key={poi.id} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--chip-border)] bg-[var(--muted)]">
              <div>
                <p className="font-semibold text-[var(--pine)]">{poi[`name_${language}`]}</p>
                {'distance' in poi && (
                  <p className="text-xs text-[var(--sage)]">
                    {Math.round(poi.distance)} {text[language].meters}
                  </p>
                )}
              </div>
              <button
                onClick={() => onNavigateWithRoute(poi)}
                className="px-4 py-2 rounded-full bg-[var(--primary)] text-white text-sm font-semibold"
              >
                Go
              </button>
            </div>
          ))}
        </div>

        <div className="grid gap-3">
          <button
            onClick={() => handleQuickRoute('enfermeria')}
            className="w-full flex items-center justify-between rounded-3xl border border-[var(--chip-border)] px-4 py-3 font-semibold"
          >
            <span>⛑️ {text[language].firstAid}</span>
            <span>→</span>
          </button>
          <button
            onClick={() => handleQuickRoute('reunion')}
            className="w-full flex items-center justify-between rounded-3xl border border-[var(--chip-border)] px-4 py-3 font-semibold"
          >
            <span>📍 {text[language].assembly}</span>
            <span>→</span>
          </button>
        </div>

        <div className="rounded-3xl bg-[var(--muted)] p-4 text-sm text-[var(--pine)]">
          <p>{text[language].info}</p>
        </div>
        <p className="text-xs text-[var(--sage)]">{text[language].legal}</p>
      </section>
    </div>
  );
};

export default EmergencyScreen;
