import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import PermissionsScreen from './screens/PermissionsScreen';
import MapScreen from './screens/MapScreen';
import TranslateScreen from './screens/TranslateScreen';
import EmergencyScreen from './screens/EmergencyScreen';
import { mockData } from './data';
import type { Screen, Language, UserLocation, POI } from './types';
import Chat from './features/Chat';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('lang') as Language) || mockData.settings.defaultLang);
  const [isHighContrast, setHighContrast] = useState<boolean>(() => localStorage.getItem('highContrast') === 'true');
  const [isTextXL, setTextXL] = useState<boolean>(() => localStorage.getItem('textXL') === 'true');
  const [isTtsEnabled, setTtsEnabled] = useState<boolean>(() => localStorage.getItem('ttsEnabled') === 'true');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [routeDestination, setRouteDestination] = useState<POI | null>(null);
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [isSplashDone, setSplashDone] = useState(false);

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('highContrast', String(isHighContrast));
    document.body.classList.toggle('high-contrast', isHighContrast);
  }, [isHighContrast]);

  useEffect(() => {
    localStorage.setItem('textXL', String(isTextXL));
    document.body.classList.toggle('text-xl-enabled', isTextXL);
  }, [isTextXL]);

   useEffect(() => {
    localStorage.setItem('ttsEnabled', String(isTtsEnabled));
  }, [isTtsEnabled]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSplashVisible(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isSplashVisible) {
      const timer = window.setTimeout(() => setSplashDone(true), 600);
      return () => window.clearTimeout(timer);
    }
  }, [isSplashVisible]);

  const speak = useCallback((text: string) => {
    if (isTtsEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'es' ? 'es-MX' : 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [isTtsEnabled, language]);


  const navigateTo = (newScreen: Screen) => {
    setRouteDestination(null); // Clear destination on screen change
    setScreen(newScreen);
  };
  
  const navigateToMapWithRoute = (destination: POI) => {
    setRouteDestination(destination);
    setScreen('map');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onContinue={() => navigateTo('permissions')}
            language={language}
            setLanguage={setLanguage}
            isHighContrast={isHighContrast}
            setHighContrast={setHighContrast}
            isTextXL={isTextXL}
            setTextXL={setTextXL}
            isTtsEnabled={isTtsEnabled}
            setTtsEnabled={setTtsEnabled}
          />
        );
      case 'permissions':
        return (
          <PermissionsScreen
            onLocationSet={(location) => {
              setUserLocation(location);
              navigateTo('map');
            }}
            onBack={() => navigateTo('welcome')}
            language={language}
            speak={speak}
          />
        );
      case 'map':
        return (
          <MapScreen
            userLocation={userLocation}
            onNavigate={navigateTo}
            onNavigateWithRoute={navigateToMapWithRoute}
            initialDestination={routeDestination}
            language={language}
            setLanguage={setLanguage}
            speak={speak}
          />
        );
      case 'translate':
        return (
          <TranslateScreen 
            onBack={() => navigateTo('map')} 
            language={language}
            speak={speak}
          />
        );
      case 'emergency':
        return (
          <EmergencyScreen
            userLocation={userLocation}
            onNavigateWithRoute={navigateToMapWithRoute}
            onBack={() => navigateTo('map')}
            language={language}
            speak={speak}
          />
        );
      default:
        return <WelcomeScreen onContinue={() => navigateTo('permissions')} language={language} setLanguage={setLanguage} isHighContrast={isHighContrast} setHighContrast={setHighContrast} isTextXL={isTextXL} setTextXL={setTextXL} isTtsEnabled={isTtsEnabled} setTtsEnabled={setTtsEnabled}/>;
    }
  };

  return (
    <div className="bg-park-texture min-h-[100svh] px-3 py-3 relative overflow-hidden">
      {!isSplashDone && <SplashScreen dismissed={!isSplashVisible} />}
      <div
        className={`mx-auto w-full max-w-[420px] min-h-[100svh] relative transition-opacity duration-500 ${
          isSplashVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {renderScreen()}
        {screen !== 'welcome' && screen !== 'permissions' && userLocation && (
          <Chat
            userLocation={userLocation}
            language={language}
            navigateToMapWithRoute={navigateToMapWithRoute}
            speak={speak}
          />
        )}
      </div>
    </div>
  );
};

export default App;
