import React, { useState, useMemo, useEffect } from 'react';
import type { UserLocation, Screen, POI, POIType, Language } from '../types';
import { mockData } from '../data';
import { findPath, getDistance } from '../services/routingService';
import FloatingActionButton from '../components/FloatingActionButton';
import { getIcon } from '../components/icons/PoiIcons';

interface Props {
  userLocation: UserLocation | null;
  onNavigate: (screen: Screen) => void;
  onNavigateWithRoute: (destination: POI) => void;
  initialDestination: POI | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  speak: (text: string) => void;
}

const mapDimensions = { width: 800, height: 1200 };
const mapBounds = {
  minLat: 25.667,
  maxLat: 25.6715,
  minLon: -100.251,
  maxLon: -100.245,
};

const latLonToPixels = (lat: number, lon: number) => {
  const x = ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) * mapDimensions.width;
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * mapDimensions.height;
  return { x, y };
};

const formatDistance = (distance?: number | null) => {
  if (!distance || Number.isNaN(distance)) return '—';
  if (distance >= 1000) return `${(distance / 1000).toFixed(1)} km`;
  return `${Math.round(distance)} m`;
};

const criticalDestinations: { type: POIType; es: string; en: string; detail_es: string; detail_en: string }[] = [
  { type: 'banos', es: 'Baños', en: 'Restrooms', detail_es: 'ISO 7001 · 🚻', detail_en: 'ISO 7001 · 🚻' },
  { type: 'enfermeria', es: 'Primeros auxilios', en: 'First aid', detail_es: '⛑️ Asistencia médica', detail_en: '⛑️ Medical help' },
  { type: 'comida', es: 'Comida', en: 'Food', detail_es: '🍴 Food court', detail_en: '🍴 Food court' },
  { type: 'salida', es: 'Salidas', en: 'Exits', detail_es: '🚪 Rutas de salida', detail_en: '🚪 Way out' },
  { type: 'reunion', es: 'Reunión', en: 'Assembly', detail_es: '📍 Punto seguro', detail_en: '📍 Safe point' },
  { type: 'taquilla', es: 'Taquillas', en: 'Tickets', detail_es: '🎟️ Pulseras', detail_en: '🎟️ Wristbands' },
  { type: 'recarga', es: 'Recargas', en: 'Top-ups', detail_es: '💳 Pulseras', detail_en: '💳 Wristbands' },
];

const MapScreen: React.FC<Props> = ({
  userLocation,
  onNavigate,
  onNavigateWithRoute,
  initialDestination,
  language,
  setLanguage,
  speak,
}) => {
  const [activeFilters, setActiveFilters] = useState<Set<POIType>>(new Set());
  const [isAccessibleOnly, setAccessibleOnly] = useState(false);
  const [destination, setDestination] = useState<POI | null>(initialDestination);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  const filteredPois = useMemo(() => {
    let pois = mockData.pois;
    if (isAccessibleOnly) {
      pois = pois.filter((p) => p.accessible);
    }
    if (activeFilters.size > 0) {
      pois = pois.filter((p) => activeFilters.has(p.type));
    }
    if (searchTerm.trim()) {
      const normalized = searchTerm.toLowerCase();
      pois = pois.filter(
        (p) => p.name_es.toLowerCase().includes(normalized) || p.name_en.toLowerCase().includes(normalized),
      );
    }
    return pois;
  }, [isAccessibleOnly, activeFilters, searchTerm]);

  const routePath = useMemo(() => {
    if (!userLocation || !destination) return null;
    return findPath(userLocation, destination, isAccessibleOnly);
  }, [userLocation, destination, isAccessibleOnly]);

  const userPixelPos = userLocation ? latLonToPixels(userLocation.lat, userLocation.lon) : null;

  const estimateTime = (distance?: number | null) => {
    if (!distance) return '—';
    const speed = (4 * 1000) / 60; // 4 km/h
    return `${Math.max(1, Math.ceil(distance / speed))} min`;
  };

  const recommendedPois = useMemo(() => {
    if (!userLocation) return [];
    const base = isAccessibleOnly ? mockData.pois.filter((p) => p.accessible) : mockData.pois;
    return base
      .map((poi) => ({ poi, distance: getDistance(userLocation, poi) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map((item) => ({ ...item.poi, distance: item.distance }));
  }, [userLocation, isAccessibleOnly]);

  const getNearestPoiByType = (type: POIType) => {
    if (!userLocation) return null;
    const candidates = mockData.pois.filter((poi) => poi.type === type && (!isAccessibleOnly || poi.accessible));
    if (!candidates.length) return null;
    return candidates
      .map((poi) => ({ poi, distance: getDistance(userLocation, poi) }))
      .sort((a, b) => a.distance - b.distance)[0].poi;
  };

  const handleCategorySelect = (type: POIType) => {
    setActiveFilters((prev) => {
      const alreadyActive = prev.size === 1 && prev.has(type);
      if (alreadyActive) {
        setDestination(null);
        return new Set();
      }
      const next = new Set<POIType>();
      next.add(type);
      const nearest = getNearestPoiByType(type);
      if (nearest) {
        setDestination(nearest);
        speak(nearest[`name_${language}`]);
      }
      return next;
    });
  };

  const handleDestinationSelect = (poi: POI) => {
    setDestination(poi);
    speak(poi[`name_${language}`]);
  };

  const copy = {
    es: {
      breadcrumb: 'QR • Permisos • Usted está aquí',
      mapTitle: 'Mapa vivo del parque',
      searchPlaceholder: 'Buscar baños, comida, salidas...',
      filtersTitle: 'Atajos ISO 7001',
      recommended: 'Destinos cercanos',
      accessible: 'Ruta accesible',
      accessibleHint: 'Prioriza rampas, pendientes suaves y superficies lisas.',
      distanceLabel: 'Distancia',
      durationLabel: 'Tiempo estimado',
      startRoute: 'Iniciar guía',
      steps: 'Ver instrucciones paso a paso',
      emptyRouteTitle: 'Selecciona un destino',
      emptyRouteSubtitle: 'Toca un ícono en el mapa o usa los chips para filtrar servicios.',
      fallbackTitle: 'Activa tu ubicación',
      fallbackDesc: 'Necesitamos tu posición para mostrar “Usted está aquí”.',
      fallbackButton: 'Ir a permisos',
      syncGps: 'GPS activo',
      syncNfc: (plate?: string) => `Placa ${plate ?? 'NFC'} sincronizada`,
      quickActions: 'Acciones rápidas',
      routeAlt: 'Mini mapa con ruta peatonal',
    },
    en: {
      breadcrumb: 'QR • Permissions • You are here',
      mapTitle: 'Live park map',
      searchPlaceholder: 'Search restrooms, food, exits...',
      filtersTitle: 'ISO 7001 shortcuts',
      recommended: 'Nearby destinations',
      accessible: 'Accessible route',
      accessibleHint: 'Prioritises ramps, gentle slopes, and smooth paths.',
      distanceLabel: 'Distance',
      durationLabel: 'Estimated time',
      startRoute: 'Start guidance',
      steps: 'View step-by-step',
      emptyRouteTitle: 'Pick a destination',
      emptyRouteSubtitle: 'Tap any icon on the map or use the category chips.',
      fallbackTitle: 'Enable your location',
      fallbackDesc: 'We need your position to show “You are here.”',
      fallbackButton: 'Go to permissions',
      syncGps: 'GPS active',
      syncNfc: (plate?: string) => `NFC plate ${plate ?? ''} synced`,
      quickActions: 'Quick actions',
      routeAlt: 'Mini map with walking route',
    },
  };

  if (!userLocation) {
    return (
      <div className="h-[100svh] flex items-center justify-center px-3">
        <div className="rounded-3xl bg-white/95 w-full p-6 text-center space-y-4 shadow-lg border border-white/60">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--sage)]">{copy[language].breadcrumb}</p>
          <h1 className="text-3xl font-bold">{copy[language].fallbackTitle}</h1>
          <p className="text-[var(--sage)]">{copy[language].fallbackDesc}</p>
          <button
            onClick={() => onNavigate('permissions')}
            className="w-full bg-[var(--primary)] text-white font-semibold py-3 rounded-2xl shadow-md"
          >
            {copy[language].fallbackButton}
          </button>
        </div>
      </div>
    );
  }

  const routeMiniPoints =
    routePath?.path.map((point) => ({
      x: (point.x / mapDimensions.width) * 320,
      y: (point.y / mapDimensions.height) * 200,
    })) ?? [];

  const locationBadge = userLocation.source === 'nfc' ? copy[language].syncNfc(userLocation.plateId) : copy[language].syncGps;

  return (
    <div className="h-[100svh] flex flex-col gap-3 pb-24">
      <header className="hero-canopy rounded-3xl p-4 space-y-4 text-white shadow-lg animate-fade-down">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onNavigate('welcome')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5L12 4l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-8.5z" />
            </svg>
            Parque del Agua
          </button>
          <div className="flex bg-white/15 border border-white/25 rounded-full p-1">
            {(['es', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  language === lang ? 'bg-white text-[var(--primary)] shadow' : 'text-white/80'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.35em] text-white/70">{copy[language].breadcrumb}</p>
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl font-bold">{copy[language].mapTitle}</h1>
            {userLocation?.plateId && (
              <span className="px-3 py-1 rounded-full bg-white text-[var(--primary)] text-xs font-semibold">{userLocation.plateId}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <span className="flex items-center gap-2 font-semibold text-white">
            <span className="pulse-dot" aria-hidden="true" />
            {locationBadge}
          </span>
          <span>·</span>
          <span>{copy[language].routeAlt}</span>
        </div>
        <label className="flex items-center gap-3 bg-white text-[var(--pine)] border border-white/30 rounded-2xl px-3 py-3 focus-within:ring-2 focus-within:ring-white/70">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--sage)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.2-5.2M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={copy[language].searchPlaceholder}
            className="flex-1 bg-transparent outline-none placeholder:text-[var(--sage)]"
          />
        </label>
      </header>

      <div className="flex-1 overflow-y-auto space-y-4 px-1">
        <section className="rounded-[28px] border border-[var(--chip-border)] bg-white overflow-hidden" aria-label={copy[language].mapTitle}>
          <div className="relative bg-[var(--sand)]">
            <svg viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`} role="img" aria-label={copy[language].mapTitle} className="w-full h-[320px] max-h-[48vh]">
              <rect width={mapDimensions.width} height={mapDimensions.height} fill="#FFFFFF" rx="32" />
              <path d="M0 200 C200 150, 400 250, 800 150 L800 0 L0 0 Z" fill="#F3F3F3" opacity="0.9" />
              <path d="M0 800 C200 900, 400 700, 800 820 L800 1200 L0 1200 Z" fill="#EFEFEF" opacity="0.9" />
              <path
                d="M100 100 C200 200, 300 100, 400 220 C500 340, 600 260, 700 360"
                fill="none"
                stroke="#DEDAD4"
                strokeWidth="60"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.45"
              />
              {routePath && routePath.path && (
                <polyline
                  points={routePath.path.map((p) => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="24 16"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="160" dur="3s" repeatCount="indefinite" />
                </polyline>
              )}
              {filteredPois.map((poi) => {
                const pos = latLonToPixels(poi.lat, poi.lon);
                const isSelected = destination?.id === poi.id;
                return (
                  <g key={poi.id} transform={`translate(${pos.x}, ${pos.y})`} onClick={() => handleDestinationSelect(poi)} className="cursor-pointer">
                    <circle cx="0" cy="0" r={isSelected ? 26 : 20} fill={isSelected ? 'var(--primary)' : 'var(--accent)'} stroke="#fff" strokeWidth="4" />
                  </g>
                );
              })}
              {userPixelPos && (
                <g transform={`translate(${userPixelPos.x}, ${userPixelPos.y})`}>
                  <circle cx="0" cy="0" r="28" fill="#686A6E" opacity="0.18">
                    <animate attributeName="r" from="22" to="36" dur="1.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.35" to="0" dur="1.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="18" fill="#686A6E" stroke="#fff" strokeWidth="4" />
                  <text x="12" y="-18" fill="#1F1F1F" fontSize="32" fontWeight="600">
                    {language === 'es' ? 'Usted' : 'You'}
                  </text>
                  <text x="12" y="16" fill="#1F1F1F" fontSize="32" fontWeight="600">
                    {language === 'es' ? 'está aquí' : 'are here'}
                  </text>
                </g>
              )}
            </svg>
            <div className="absolute top-4 left-4 bg-white/90 rounded-2xl px-3 py-2 text-xs text-[var(--pine)] shadow">
              {locationBadge}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white/95 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--pine)] uppercase tracking-wide">{copy[language].filtersTitle}</p>
            <button
              onClick={() => setAccessibleOnly(!isAccessibleOnly)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${
                isAccessibleOnly ? 'bg-[var(--primary)] text-white' : 'bg-white border border-[var(--chip-border)]'
              }`}
            >
              ♿ {copy[language].accessible}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {criticalDestinations.map((item) => {
              const Icon = getIcon(item.type);
              const isActive = activeFilters.has(item.type);
              return (
                <button
                  key={item.type}
                  onClick={() => handleCategorySelect(item.type)}
                  className={`rounded-2xl border px-3 py-3 text-left flex flex-col gap-1 ${
                    isActive ? 'bg-[var(--primary)] text-white border-transparent shadow' : 'bg-white border-[var(--chip-border)]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{language === 'es' ? item.es : item.en}</span>
                  </div>
                  <p className="text-xs">{language === 'es' ? item.detail_es : item.detail_en}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-white/95 p-4 space-y-3">
          <p className="text-sm font-semibold text-[var(--pine)] uppercase tracking-wide">{copy[language].recommended}</p>
          {recommendedPois.length === 0 && (
            <p className="text-xs text-[var(--sage)]">{language === 'es' ? 'Activa tus filtros para ver opciones.' : 'Toggle filters to see options.'}</p>
          )}
          <div className="space-y-2">
            {recommendedPois.map((poi) => (
              <button
                key={poi.id}
                onClick={() => handleDestinationSelect(poi)}
                className="w-full flex items-center justify-between rounded-2xl bg-white border border-[var(--chip-border)] px-4 py-3 text-left"
              >
                <div>
                  <p className="font-semibold text-[var(--pine)]">{poi[`name_${language}`]}</p>
                  <p className="text-xs text-[var(--sage)]">{formatDistance(poi.distance)}</p>
                </div>
                <span className="text-sm font-semibold text-[var(--primary)]">→</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white/95 p-4 space-y-4">
          {destination && routePath ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[var(--sage)]">{copy[language].quickActions}</p>
                  <h2 className="text-xl font-bold">{destination[`name_${language}`]}</h2>
                  <div className="flex gap-4 text-sm text-[var(--sage)] mt-1">
                    <span>
                      {copy[language].distanceLabel}: <strong className="text-[var(--pine)]">{formatDistance(routePath.distance)}</strong>
                    </span>
                    <span>
                      {copy[language].durationLabel}: <strong className="text-[var(--pine)]">{estimateTime(routePath.distance)}</strong>
                    </span>
                  </div>
                </div>
                <button onClick={() => setDestination(null)} aria-label="Cerrar panel" className="text-[var(--sage)]">
                  ✕
                </button>
              </div>

              <div className="mini-map h-36 overflow-hidden rounded-2xl">
                <svg viewBox="0 0 320 200" aria-label={copy[language].routeAlt} className="w-full h-full">
                  <rect width="320" height="200" fill="transparent" />
                  {routeMiniPoints.length > 0 && (
                    <polyline
                      points={routeMiniPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="10 8"
                    />
                  )}
                </svg>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setAccessibleOnly(!isAccessibleOnly)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${
                    isAccessibleOnly ? 'bg-[var(--primary)] text-white' : 'bg-white border border-[var(--chip-border)]'
                  }`}
                >
                  ♿ {copy[language].accessible}
                </button>
                <span className="text-xs text-[var(--sage)]">{copy[language].accessibleHint}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigateWithRoute(destination)}
                  className="bg-[var(--accent)] text-white font-semibold py-3 rounded-2xl shadow-md"
                >
                  {copy[language].startRoute}
                </button>
                <button className="border border-[var(--chip-border)] rounded-2xl font-semibold text-[var(--pine)]">
                  {copy[language].steps}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-xs uppercase tracking-wide text-[var(--sage)]">{copy[language].quickActions}</p>
              <h2 className="text-xl font-bold">{copy[language].emptyRouteTitle}</h2>
              <p className="text-sm text-[var(--sage)]">{copy[language].emptyRouteSubtitle}</p>
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-20 right-4 flex flex-col gap-3">
        <FloatingActionButton icon="translate" onClick={() => onNavigate('translate')} label={language === 'es' ? 'Traducir' : 'Translate'} />
        <FloatingActionButton icon="emergency" onClick={() => onNavigate('emergency')} label={language === 'es' ? 'Emergencia' : 'Emergency'} isEmergency />
      </div>
    </div>
  );
};

export default MapScreen;
