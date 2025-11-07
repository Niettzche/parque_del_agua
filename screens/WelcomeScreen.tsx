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
  onContinue,
  language,
  setLanguage,
  isHighContrast,
  setHighContrast,
  isTextXL,
  setTextXL,
  isTtsEnabled,
  setTtsEnabled,
}) => {
  const [showMoreLanguages, setShowMoreLanguages] = React.useState(false);

  const copy = {
    es: {
      heroTitle: 'Usted está aquí',
      heroSubtitle: 'Wayfinding QR+NFC · Parque del Agua Monterrey',
      language: 'Selecciona tu idioma',
      scanInfo: 'Escanea el QR o acerca tu teléfono al tag NFC para abrir este micrositio sin instalar nada.',
      flowLabel: 'Flujo',
      accessibility: 'Accesibilidad inmediata',
      continue: 'Comenzar recorrido',
      help: '¿Necesitas ayuda?',
      highlights: [
        { title: 'Escanea y listo', description: 'Activa el mapa instantáneamente con QR o NFC.', icon: '📲' },
        { title: 'Modo exterior', description: 'Tipografía grande y alto contraste bajo sol.', icon: '🕶️' },
        { title: 'Bilingüe', description: 'Contenido en Español e Inglés al mismo tiempo.', icon: '🌐' },
      ],
      moreLangToggle: 'Más idiomas',
      moreLangToggleHide: 'Ocultar idiomas',
      moreLangHeading: 'Idiomas en preparación',
      moreLangStatus: 'Traducción en progreso',
    },
    en: {
      heroTitle: 'You are here',
      heroSubtitle: 'Wayfinding QR+NFC · Parque del Agua Monterrey',
      language: 'Choose your language',
      scanInfo: 'Scan the QR or tap the NFC tag to load this microsite—no downloads.',
      flowLabel: 'Flow',
      accessibility: 'Instant accessibility',
      continue: 'Enter experience',
      help: 'Need help?',
      highlights: [
        { title: 'Scan & Go', description: 'Open the guide instantly via QR or NFC.', icon: '📲' },
        { title: 'Outdoor mode', description: 'Large, high-contrast type for sunlight.', icon: '🕶️' },
        { title: 'Bilingual', description: 'Spanish + English content side-by-side.', icon: '🌐' },
      ],
      moreLangToggle: 'More languages',
      moreLangToggleHide: 'Hide list',
      moreLangHeading: 'Languages in progress',
      moreLangStatus: 'Translation underway',
    },
  };

  const additionalLanguages = [
    { id: 'fr', label: { es: 'Francés', en: 'French' }, caption: 'FR · CA' },
    { id: 'de', label: { es: 'Alemán', en: 'German' }, caption: 'DE · AT' },
    { id: 'pt', label: { es: 'Portugués', en: 'Portuguese' }, caption: 'PT · BR' },
    { id: 'it', label: { es: 'Italiano', en: 'Italian' }, caption: 'IT' },
  ];

  const accessibilityControls = [
    {
      id: 'contrast',
      label: language === 'es' ? 'Alto contraste / High contrast' : 'High contrast / Alto contraste',
      active: isHighContrast,
      onToggle: () => setHighContrast(!isHighContrast),
      emoji: '🌗',
    },
    {
      id: 'text',
      label: language === 'es' ? 'Texto XL / XL text' : 'XL text / Texto XL',
      active: isTextXL,
      onToggle: () => setTextXL(!isTextXL),
      emoji: '🔠',
    },
    {
      id: 'tts',
      label: language === 'es' ? 'Narración / Voice' : 'Voice / Narración',
      active: isTtsEnabled,
      onToggle: () => setTtsEnabled(!isTtsEnabled),
      emoji: '🔊',
    },
  ];

  const flow = ['QR · NFC', language === 'es' ? 'Permisos' : 'Permissions', 'Mapa / Map', language === 'es' ? 'Ruta' : 'Route', language === 'es' ? 'Emergencias' : 'Emergency'];

  const renderLanguageButton = (lang: Language, label: string, caption: string) => {
    const isActive = language === lang;
    return (
      <button
        key={lang}
        onClick={() => setLanguage(lang)}
        className={`rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary-light)] ${
          isActive
            ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-lg shadow-[rgba(246,134,40,0.35)]'
            : 'bg-white border-[var(--chip-border)] text-[var(--pine)]'
        }`}
        aria-pressed={isActive}
      >
        <p className="text-[0.65rem] uppercase tracking-wide opacity-70">{caption}</p>
        <p className="text-xl font-semibold">{label}</p>
        {isActive && <p className="text-xs mt-1 opacity-90">{language === 'es' ? 'Idioma activo' : 'Active language'}</p>}
      </button>
    );
  };

  return (
    <div className="h-[100svh] flex flex-col gap-4">
      <section className="hero-canopy rounded-3xl p-5 text-white flex flex-col gap-5 overflow-hidden animate-fade-down">
        <div className="flex items-center gap-4">
          <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
            <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M24 6c7.732 0 14 6.268 14 14 0 12-14 22-14 22S10 32 10 20c0-7.732 6.268-14 14-14z" fill="url(#leaf)" />
              <defs>
                <linearGradient id="leaf" x1="10" x2="38" y1="6" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFD2A6" />
                  <stop offset="1" stopColor="#F68628" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.4em] text-white/70">Parque del Agua</p>
            <h1 className="text-3xl font-bold font-[Poppins]">{copy[language].heroTitle}</h1>
            <p className="text-sm text-white/80">{copy[language].heroSubtitle}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white text-[var(--pine)] p-4 shadow-sm">
          <p className="text-xs uppercase font-semibold tracking-wide text-[var(--sage)]">{copy[language].flowLabel}</p>
          <p className="mt-1 text-base font-semibold leading-snug">{copy[language].scanInfo}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[var(--sage)]">
            {flow.map((step, index) => (
              <span key={step} className="px-2 py-1 rounded-full bg-[var(--muted)]">
                {index + 1}. {step}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="flex-1 rounded-3xl bg-white/95 p-4 flex flex-col gap-4 overflow-hidden">
        <div className="space-y-4 overflow-y-auto pr-1">
          <div>
            <p className="text-xs font-semibold text-[var(--sage)] uppercase tracking-wide">{copy[language].language}</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {renderLanguageButton('es', 'Español', 'ES · MX')}
              {renderLanguageButton('en', 'English', 'EN · US')}
            </div>
            <div className="mt-2 space-y-2">
              <button
                type="button"
                onClick={() => setShowMoreLanguages((prev) => !prev)}
                className="w-full rounded-2xl border border-dashed border-[var(--chip-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--pine)] flex items-center justify-between transition hover:border-[var(--accent)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary-light)]"
                aria-expanded={showMoreLanguages}
              >
                <span>{showMoreLanguages ? copy[language].moreLangToggleHide : copy[language].moreLangToggle}</span>
                <span className="text-lg">{showMoreLanguages ? '−' : '+'}</span>
              </button>
              {showMoreLanguages && (
                <div className="rounded-2xl border border-[var(--chip-border)] bg-white p-3 space-y-2">
                  <p className="text-[0.6rem] uppercase tracking-wide text-[var(--sage)]">{copy[language].moreLangHeading}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {additionalLanguages.map((lang) => (
                      <div
                        key={lang.id}
                        className="rounded-xl border border-[var(--chip-border)] bg-[var(--muted)]/40 p-3"
                        aria-label={lang.label[language]}
                      >
                        <p className="text-[0.6rem] uppercase tracking-wide text-[var(--sage)]">{lang.caption}</p>
                        <p className="text-base font-semibold text-[var(--pine)]">{lang.label[language]}</p>
                        <p className="text-[0.6rem] text-[var(--sage)]">{copy[language].moreLangStatus}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-[var(--sage)] uppercase tracking-wide">{language === 'es' ? 'Modo exterior' : 'Outdoor mode'}</p>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {copy[language].highlights.map((item) => (
                <div key={item.title} className="min-w-[150px] rounded-2xl border border-[var(--chip-border)] p-3 bg-white flex flex-col gap-1">
                  <span className="text-xl" aria-hidden="true">
                    {item.icon}
                  </span>
                  <p className="text-sm font-semibold text-[var(--pine)] leading-tight">{item.title}</p>
                  <p className="text-xs text-[var(--sage)] leading-snug">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[var(--pine)]">{copy[language].accessibility}</p>
              <span className="text-xs text-[var(--sage)]">AA+</span>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {accessibilityControls.map((control) => (
                <button
                  key={control.id}
                  onClick={control.onToggle}
                  aria-pressed={control.active}
                  className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 border text-sm font-semibold ${
                    control.active ? 'bg-[var(--primary)] text-white border-transparent' : 'bg-white border-[var(--chip-border)] text-[var(--pine)]'
                  }`}
                >
                  <span className="flex items-center gap-3 text-left">
                    <span className="text-xl" aria-hidden="true">
                      {control.emoji}
                    </span>
                    <span className="leading-snug">{control.label}</span>
                  </span>
                  <span
                    className={`relative inline-flex h-6 w-11 items-center rounded-full toggle-track ${
                      control.active
                        ? 'bg-white/30 toggle-track--on'
                        : 'bg-black/10 toggle-track--off'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition toggle-thumb ${
                        control.active ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <button
            onClick={onContinue}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white font-semibold py-4 rounded-3xl text-lg shadow-lg shadow-[rgba(246,134,40,0.35)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white transition"
          >
            {copy[language].continue}
          </button>

          <div className="flex items-center justify-between text-sm text-[var(--sage)]">
            <span>{copy[language].help}</span>
            <button className="text-[var(--primary)] font-semibold underline-offset-4">{language === 'es' ? 'Línea de apoyo' : 'Help line'}</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomeScreen;
