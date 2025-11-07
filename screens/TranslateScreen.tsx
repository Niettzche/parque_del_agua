import React, { useState, useEffect } from 'react';
import type { Language, OfficialTranslation } from '../types';
import { mockData } from '../data';
import { getIcon } from '../components/icons/PoiIcons';
import BackButton from '../components/BackButton';

interface Props {
  onBack: () => void;
  language: Language;
  speak: (text: string) => void;
}

const TranslateScreen: React.FC<Props> = ({ onBack, language, speak }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<OfficialTranslation | { error: string } | null>(null);
  const [ocrText, setOcrText] = useState('');

  const text = {
    es: {
      title: 'Traducir Letrero',
      placeholder: 'Escribe el código (ej. S-BA-12)',
      button: 'Traducir',
      official: 'Traducción Oficial',
      simulated: 'Traducción Simulada (OCR)',
      notFound: 'Código no encontrado en la base de datos.',
      back: 'Volver al mapa'
    },
    en: {
      title: 'Translate Sign',
      placeholder: 'Enter code (e.g., S-BA-12)',
      button: 'Translate',
      official: 'Official Translation',
      simulated: 'Simulated Translation (OCR)',
      notFound: 'Code not found in the database.',
      back: 'Back to map'
    }
  };
  
  useEffect(() => {
    speak(text[language].title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);


  const handleTranslate = () => {
    const foundTranslation = mockData.translations_official.find(t => t.code.toLowerCase() === code.toLowerCase());
    if (foundTranslation) {
      setResult(foundTranslation);
      setOcrText('');
      speak(foundTranslation[`text_${language}`]);
    } else {
      setResult({ error: text[language].notFound });
      setOcrText(code); // Simulate OCR text is what user typed
      speak(text[language].notFound);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    if ('error' in result) {
      return (
        <div className="mt-6 p-4 border border-yellow-400 bg-yellow-50 rounded-2xl">
          <h3 className="font-bold text-yellow-800">{text[language].simulated}</h3>
          <p className="mt-1 text-gray-700">"{ocrText}"</p>
          <p className="mt-2 font-semibold text-gray-800">
            {language === 'es' ? `→ (Traducción simulada para "${ocrText}")` : `→ (Simulated translation for "${ocrText}")`}
          </p>
          <p className="text-sm text-yellow-600 mt-2">{result.error}</p>
        </div>
      );
    }
    
    const Icon = getIcon(result.pictogram as any);

    return (
      <div className="mt-6 p-6 border border-green-400 bg-green-50 rounded-2xl text-center shadow-md">
        <h3 className="font-bold text-green-800 text-lg mb-4">{text[language].official}</h3>
        {Icon && <Icon className="w-24 h-24 mx-auto text-[var(--nlOrange)] mb-4" />}
        <p className="text-3xl font-bold text-gray-900">{result[`text_${language}`]}</p>
        <p className="text-xl text-gray-500 mt-1">{result[`text_${language === 'es' ? 'en' : 'es'}`]}</p>
      </div>
    );
  };


  return (
    <div className="p-6 h-screen flex flex-col bg-white relative">
      <BackButton onClick={onBack} />
      <div className="flex-shrink-0 pt-12 text-center">
        <h1 className="text-4xl font-bold mt-4 mb-6">{text[language].title}</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Simulated Camera View */}
        <div className="w-full max-w-sm h-64 bg-gray-900 rounded-2xl flex items-center justify-center text-white mb-6 relative overflow-hidden">
          <p className="z-10">[ Vista de cámara simulada ]</p>
          <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-white opacity-50"></div>
          <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-white opacity-50"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-white opacity-50"></div>
          <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-white opacity-50"></div>
        </div>
        
        <div className="w-full max-w-sm">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={text[language].placeholder}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--nlOrangeLight)]"
          />
          <button
            onClick={handleTranslate}
            className="w-full mt-4 bg-[var(--nlOrange)] hover:bg-[var(--nlOrangeDark)] text-white font-bold py-4 rounded-2xl text-xl shadow-lg"
          >
            {text[language].button}
          </button>
        </div>
        
        <div className="w-full max-w-sm">{renderResult()}</div>
      </div>
    </div>
  );
};

export default TranslateScreen;