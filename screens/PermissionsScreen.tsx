import React, { useEffect } from 'react';
import type { Language, UserLocation } from '../types';
import { mockData } from '../data';
import BackButton from '../components/BackButton';

interface Props {
  onLocationSet: (location: UserLocation) => void;
  language: Language;
  speak: (text: string) => void;
  onBack: () => void;
}

const iconClasses = 'w-12 h-12 text-[var(--primary)]';

const PermissionsScreen: React.FC<Props> = ({ onLocationSet, language, speak, onBack }) => {
  const text = {
    es: {
      title: 'Activa tu ubicación',
      subtitle: 'Permite ubicación o acerca tu teléfono a la placa QR / NFC para posicionarte en el mapa.',
      allow: 'Permitir ubicación',
      simulate: 'Usar placa NFC (PLACA-A12)',
      manual: 'Ingresar código manual',
      gpsTitle: 'GPS en exteriores',
      gpsDesc: 'Precisión suficiente para ubicarte en el parque.',
      nfcTitle: 'Toca la placa NFC',
      nfcDesc: 'Coloca la parte superior del teléfono sobre la señal metálica.',
      note: 'Tu ubicación solo se usa para mostrar “Usted está aquí”.',
      status: 'Paso 2 · Permisos',
    },
    en: {
      title: 'Enable your location',
      subtitle: 'Allow GPS or tap your phone on the QR / NFC plaque to position yourself on the map.',
      allow: 'Allow location',
      simulate: 'Use NFC plaque (PLACA-A12)',
      manual: 'Enter code manually',
      gpsTitle: 'Outdoor GPS',
      gpsDesc: 'Enough accuracy to place you inside the park.',
      nfcTitle: 'Tap the NFC plaque',
      nfcDesc: 'Align the top of your phone with the metal sign.',
      note: 'Location is only used to display “You are here.”',
      status: 'Step 2 · Permissions',
    },
  };

  const handleAllowLocation = () => {
    const mockLocation: UserLocation = { lat: 25.6695, lon: -100.2485, source: 'gps' };
    onLocationSet(mockLocation);
  };

  const handleSimulateNFC = () => {
    const plateId = 'PLACA-A12';
    const sign = mockData.signs.find((s) => s.code === plateId);
    if (sign) {
      const location: UserLocation = { lat: sign.lat, lon: sign.lon, source: 'nfc', plateId: sign.code };
      onLocationSet(location);
    } else {
      alert('Error: Placa no encontrada / Plate not found');
    }
  };

  useEffect(() => {
    speak(`${text[language].title}. ${text[language].subtitle}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="h-[100svh] flex flex-col gap-4">
      <section className="relative hero-canopy rounded-3xl p-5 overflow-hidden text-white space-y-4 animate-fade-down">
        <BackButton onClick={onBack} className="mb-1" />
        <p className="text-[0.7rem] uppercase tracking-[0.35em] text-white/70">{text[language].status}</p>
        <h1 className="text-3xl font-bold mt-2 font-[Poppins]">{text[language].title}</h1>
        <p className="text-white/85 text-base mt-3">{text[language].subtitle}</p>
        <div className="mt-5 flex items-center gap-3 text-white/85 text-sm">
          <span className="pulse-dot" aria-hidden="true" />
          <p>GPS · NFC · QR</p>
        </div>
      </section>

      <section className="flex-1 rounded-3xl bg-white/95 p-4 flex flex-col gap-4 overflow-hidden">
        <div className="space-y-4 overflow-y-auto pr-1">
          <div className="grid gap-3">
            <div className="p-4 rounded-2xl border border-[var(--chip-border)] bg-white flex gap-4 items-start">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={iconClasses} fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m13.364 5.364l-2.121-2.121M8.757 8.757L6.636 6.636m9.9 0l-2.122 2.121M8.757 15.243L6.636 17.364" />
              </svg>
              <div>
                <p className="font-semibold text-[var(--pine)]">{text[language].gpsTitle}</p>
                <p className="text-sm text-[var(--sage)]">{text[language].gpsDesc}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--chip-border)] bg-white flex gap-4 items-start relative nfc-wave">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={iconClasses} fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h-1.5A1.5 1.5 0 005.25 8.25v7.5a1.5 1.5 0 001.5 1.5h1.5M15.75 6.75h1.5a1.5 1.5 0 011.5 1.5v7.5a1.5 1.5 0 01-1.5 1.5h-1.5m-7.5-9h7.5m-7.5 3h7.5m-7.5 3h4.5" />
              </svg>
              <div>
                <p className="font-semibold text-[var(--pine)]">{text[language].nfcTitle}</p>
                <p className="text-sm text-[var(--sage)]">{text[language].nfcDesc}</p>
              </div>
              <span className="absolute top-4 right-4 text-xs font-semibold text-[var(--primary)]">NFC</span>
            </div>
          </div>

          <div className="grid gap-3">
            <button
              onClick={handleAllowLocation}
              className="w-full flex items-center justify-between bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold py-4 px-5 rounded-3xl shadow-lg shadow-[rgba(246,134,40,0.35)] transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary-light)]"
            >
              <span>{text[language].allow}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
              </svg>
            </button>
            <button
              onClick={handleSimulateNFC}
              className="w-full flex items-center justify-between bg-white text-[var(--pine)] font-semibold py-4 px-5 rounded-3xl border border-[var(--chip-border)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary)]"
            >
              <span>{text[language].simulate}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            </button>
            <button className="text-sm text-[var(--primary)] underline underline-offset-4">{text[language].manual}</button>
          </div>
        </div>

        <p className="text-xs text-[var(--sage)] flex items-start gap-2">
          <span className="text-[var(--primary)] mt-0.5">ⓘ</span>
          {text[language].note}
        </p>
      </section>
    </div>
  );
};

export default PermissionsScreen;
