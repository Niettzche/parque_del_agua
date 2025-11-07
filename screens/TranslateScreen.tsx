import React, { useState, useEffect } from 'react';
import type { Language } from '../types';
import { mockData } from '../data';
import { getIcon } from '../components/icons/PoiIcons';
import BackButton from '../components/BackButton';

interface Props {
  onBack: () => void;
  language: Language;
  speak: (text: string) => void;
}

type TranslationResult = {
  code?: string;
  text_es: string;
  text_en: string;
  pictogram?: string;
  official: boolean;
};

const TranslateScreen: React.FC<Props> = ({ onBack, language, speak }) => {
  const [mode, setMode] = useState<'photo' | 'text'>('photo');
  const [input, setInput] = useState('');
  const [translation, setTranslation] = useState<TranslationResult | null>(null);
  const [detected, setDetected] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const text = {
    es: {
      title: 'Traducir letrero',
      subtitle: 'Usa la cámara o escribe lo que ves en la señal.',
      photo: 'Foto',
      ocr: 'Detectar texto',
      textTab: 'Texto',
      placeholder: 'Ej. “S-BA-12” o “Baños”',
      button: 'Traducir',
      tip: 'Este módulo funciona sin instalar apps: solo enfoca el letrero.',
      copy: 'Copiar traducción',
      official: 'Traducción oficial',
      fallback: 'Traducción estimada',
      detected: 'Texto detectado',
      empty: 'Aún no detectamos texto. Intenta otra vez.',
      clipboard: 'Texto copiado',
      examples: 'Códigos frecuentes',
    },
    en: {
      title: 'Translate sign',
      subtitle: 'Use the camera or type what you see on the signage.',
      photo: 'Photo',
      ocr: 'Detect text',
      textTab: 'Text',
      placeholder: 'Ex. “S-BA-12” or “Restrooms”',
      button: 'Translate',
      tip: 'No downloads needed—just point the camera at the sign.',
      copy: 'Copy translation',
      official: 'Official translation',
      fallback: 'Estimated translation',
      detected: 'Detected text',
      empty: 'No text yet. Try again.',
      clipboard: 'Copied to clipboard',
      examples: 'Frequent codes',
    },
  };

  useEffect(() => {
    speak(text[language].title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const resolveTranslation = (rawInput: string) => {
    const normalized = rawInput.trim();
    if (!normalized) {
      setTranslation(null);
      setStatus(text[language].empty);
      return;
    }
    setDetected(normalized);
    const lowered = normalized.toLowerCase();
    const official = mockData.translations_official.find(
      (item) =>
        item.code.toLowerCase() === lowered ||
        item.text_es.toLowerCase() === lowered ||
        item.text_en.toLowerCase() === lowered,
    );
    if (official) {
      const payload: TranslationResult = {
        ...official,
        official: true,
      };
      setTranslation(payload);
      setStatus(null);
      speak(official[`text_${language}`]);
      return;
    }
    const fallback: TranslationResult = {
      text_es: normalized,
      text_en: normalized,
      official: false,
    };
    setTranslation(fallback);
    setStatus(text[language].fallback);
    speak(text[language].fallback);
  };

  const handleProcessPhoto = () => {
    const simulated = 'S-BA-12';
    setDetected(simulated);
    resolveTranslation(simulated);
  };

  const handleManualTranslate = () => {
    resolveTranslation(input);
  };

  const handleCopy = async () => {
    if (!translation) return;
    try {
      await navigator.clipboard.writeText(`${translation.text_es} / ${translation.text_en}`);
      setStatus(text[language].clipboard);
      setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus('Clipboard unavailable');
    }
  };

  const examples = ['S-BA-12', 'E-01', 'I-01'];

  const Icon = translation?.pictogram ? getIcon(translation.pictogram) : null;

  return (
    <div className="h-[100svh] flex flex-col gap-4">
      <section className="relative hero-canopy rounded-3xl p-5 space-y-4 animate-fade-down">
        <BackButton onClick={onBack} className="mb-1" />
        <p className="text-xs uppercase tracking-[0.35em] text-white/70">QR · NFC · AI</p>
        <h1 className="text-3xl font-bold font-[Poppins]">{text[language].title}</h1>
        <p className="text-white/85 mt-2">{text[language].subtitle}</p>
      </section>

      <section className="flex-1 rounded-3xl bg-white/95 p-4 space-y-5 overflow-y-auto">
        <div className="flex gap-2 bg-[var(--muted)] rounded-2xl p-1">
          <button
            onClick={() => setMode('photo')}
            className={`flex-1 rounded-2xl py-3 font-semibold ${
              mode === 'photo' ? 'bg-white shadow text-[var(--pine)]' : 'text-[var(--sage)]'
            }`}
          >
            {text[language].photo}
          </button>
          <button
            onClick={() => setMode('text')}
            className={`flex-1 rounded-2xl py-3 font-semibold ${
              mode === 'text' ? 'bg-white shadow text-[var(--pine)]' : 'text-[var(--sage)]'
            }`}
          >
            {text[language].textTab}
          </button>
        </div>

        {mode === 'photo' ? (
          <div className="relative h-56 rounded-3xl border-2 border-dashed border-[var(--chip-border)] flex items-center justify-center text-[var(--sage)]">
            <div className="absolute inset-4 border border-white/60 rounded-2xl pointer-events-none" />
            <p className="text-center px-6">{text[language].subtitle}</p>
            <button
              onClick={handleProcessPhoto}
              className="absolute bottom-4 right-4 bg-[var(--accent)] text-white font-semibold px-4 py-2 rounded-full shadow"
            >
              {text[language].ocr}
            </button>
          </div>
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={text[language].placeholder}
            className="w-full min-h-[140px] rounded-3xl border border-[var(--chip-border)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]"
          />
        )}

        {mode === 'text' && (
          <button onClick={handleManualTranslate} className="w-full bg-[var(--primary)] text-white font-semibold py-3 rounded-3xl shadow">
            {text[language].button}
          </button>
        )}

        {mode === 'photo' && (
          <p className="text-xs text-[var(--sage)] flex items-center gap-2">
            <span className="text-[var(--primary)]">ⓘ</span>
            {text[language].tip}
          </p>
        )}

        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--pine)]">{text[language].examples}</p>
          <div className="flex gap-2 flex-wrap">
            {examples.map((code) => (
              <button
                key={code}
                onClick={() => {
                  setInput(code);
                  resolveTranslation(code);
                }}
                className="px-3 py-2 rounded-full border border-[var(--chip-border)] text-sm"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-[var(--sage)]">{text[language].detected}</p>
          <div className="rounded-2xl bg-[var(--muted)] px-4 py-3 text-[var(--pine)]">
            {detected || input || text[language].empty}
          </div>
        </div>

        {translation && (
          <div className="rounded-3xl border border-[var(--chip-border)] p-5 space-y-4 bg-white/95 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-[var(--sage)]">
                  {translation.official ? text[language].official : text[language].fallback}
                </p>
                {translation.code && <p className="text-sm font-semibold text-[var(--pine)]">{translation.code}</p>}
              </div>
              {Icon && <Icon className="w-12 h-12 text-[var(--primary)]" />}
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-[var(--muted)] px-3 py-2 flex items-center justify-between">
                <span className="text-sm font-semibold">🇲🇽 Español</span>
                <span className="text-lg font-bold">{translation.text_es}</span>
              </div>
              <div className="rounded-2xl bg-[var(--muted)] px-3 py-2 flex items-center justify-between">
                <span className="text-sm font-semibold">🇺🇸 English</span>
                <span className="text-lg font-bold">{translation.text_en}</span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="w-full border border-[var(--chip-border)] rounded-2xl py-3 font-semibold text-[var(--pine)]"
            >
              {text[language].copy}
            </button>
          </div>
        )}

        {status && <p className="text-xs text-[var(--sage)]">{status}</p>}
      </section>
    </div>
  );
};

export default TranslateScreen;
