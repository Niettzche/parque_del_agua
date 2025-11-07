import React from 'react';
import type { Language } from '../types';

interface Props {
  onContinue: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isHighContrast: boolean;
  setHighContrast: (value: boolean) => void;
  isTextXL: boolean;
  setTextXL: (value: boolean) => void;
  isTtsEnabled: boolean;
  setTtsEnabled: (value: boolean) => void;
}

const WelcomeScreen: React.FC<Props> = ({ 
  onContinue, language, setLanguage, 
  isHighContrast, setHighContrast, 
  isTextXL, setTextXL,
  isTtsEnabled, setTtsEnabled
}) => {
  const text = {
    es: {
      title: 'Bienvenido',
      parkName: 'Parque del Agua',
      selectLanguage: 'Selecciona tu idioma',
      otherLanguages: 'Otro idioma...',
      accessibility: 'Accesibilidad',
      highContrast: 'Alto Contraste',
      largeText: 'Texto XL',
      tts: '🔊 TTS',
      continue: 'Continuar'
    },
    en: {
      title: 'Welcome',
      parkName: 'Parque del Agua',
      selectLanguage: 'Select your language',
      otherLanguages: 'Other language...',
      accessibility: 'Accessibility',
      highContrast: 'High Contrast',
      largeText: 'XL Text',
      tts: '🔊 TTS',
      continue: 'Continue'
    }
  };

  const otherLanguages = [
    "日本語 (Japanese)", "한국어 (Korean)", "Čeština (Czech)", "Русский (Russian)",
    "Français (French)", "Deutsch (German)", "Italiano (Italian)", "Português (Portuguese)",
    "中文 (Chinese)", "العربية (Arabic)", "हिन्दी (Hindi)", "Nederlands (Dutch)",
    "Polski (Polish)", "Svenska (Swedish)", "Türkçe (Turkish)", "Українська (Ukrainian)",
    "Tiếng Việt (Vietnamese)", "Ελληνικά (Greek)"
  ];

  const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
    <label className="flex items-center justify-between w-full cursor-pointer mt-4 text-left">
      <span className="text-lg">{label}</span>
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className={`block w-14 h-8 rounded-full transition ${checked ? 'bg-[var(--nlOrange)]' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${checked ? 'translate-x-6' : ''}`}></div>
      </div>
    </label>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-3xl shadow-lg text-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{text[language].title}</h1>
          <p className="text-gray-600 mt-2">{text[language].parkName}</p>
        </div>
        
        <div className="space-y-4">
          <p className="font-semibold">{text[language].selectLanguage}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setLanguage('es')}
              className={`px-6 py-3 rounded-2xl text-lg font-bold transition w-1/2 ${language === 'es' ? 'bg-[var(--nlOrange)] text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}
            >
              Español
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-3 rounded-2xl text-lg font-bold transition w-1/2 ${language === 'en' ? 'bg-[var(--nlOrange)] text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}
            >
              English
            </button>
          </div>
          <div className="pt-2">
            <select className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-600 rounded-2xl appearance-none text-center focus:outline-none focus:ring-2 focus:ring-[var(--nlOrangeLight)]">
              <option>{text[language].otherLanguages}</option>
              {otherLanguages.map(lang => <option key={lang} disabled>{lang}</option>)}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
            <h2 className="font-semibold text-lg text-left">{text[language].accessibility}</h2>
            <Toggle label={text[language].highContrast} checked={isHighContrast} onChange={setHighContrast} />
            <Toggle label={text[language].largeText} checked={isTextXL} onChange={setTextXL} />
            <Toggle label={text[language].tts} checked={isTtsEnabled} onChange={setTtsEnabled} />
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-[var(--nlOrange)] hover:bg-[var(--nlOrangeDark)] text-white font-bold py-4 px-4 rounded-2xl transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-[var(--nlOrangeLight)]"
        >
          {text[language].continue}
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;