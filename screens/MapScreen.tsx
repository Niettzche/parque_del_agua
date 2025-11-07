import React, { useState, useMemo, useEffect } from 'react';
import type { UserLocation, Screen, POI, POIType, Language } from '../types';
import { mockData } from '../data';
import { findPath } from '../services/routingService';
import FloatingActionButton from '../components/FloatingActionButton';

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
  minLat: 25.6670, maxLat: 25.6715,
  minLon: -100.2510, maxLon: -100.2450
};

const latLonToPixels = (lat: number, lon: number) => {
  const x = ((lon - mapBounds.minLon) / (mapBounds.maxLon - mapBounds.minLon)) * mapDimensions.width;
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * mapDimensions.height;
  return { x, y };
};

const MapScreen: React.FC<Props> = ({ userLocation, onNavigate, onNavigateWithRoute, initialDestination, language, setLanguage }) => {
  const [activeFilters, setActiveFilters] = useState<Set<POIType>>(new Set());
  const [isAccessibleOnly, setAccessibleOnly] = useState(false);
  const [destination, setDestination] = useState<POI | null>(initialDestination);
  
  useEffect(() => {
    if(initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  const toggleFilter = (filter: POIType) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
    setDestination(null); // Clear destination when filters change
  };

  const filteredPois = useMemo(() => {
    let pois = mockData.pois;
    if (isAccessibleOnly) {
      pois = pois.filter(p => p.accessible);
    }
    if (activeFilters.size > 0) {
      return pois.filter(p => activeFilters.has(p.type));
    }
    return pois;
  }, [activeFilters, isAccessibleOnly]);

  const routePath = useMemo(() => {
    if (!userLocation || !destination) return null;
    return findPath(userLocation, destination, isAccessibleOnly);
  }, [userLocation, destination, isAccessibleOnly]);

  const userPixelPos = userLocation ? latLonToPixels(userLocation.lat, userLocation.lon) : null;
  
  const estimateTime = (distance: number) => {
    const speed = 4 * 1000 / 60; // 4 km/h in meters per minute
    const time = distance / speed;
    return Math.ceil(time);
  };

  const criticalDestinations: { type: POIType, es: string, en: string }[] = [
    { type: 'banos', es: 'Baños', en: 'Restrooms' },
    { type: 'enfermeria', es: '1ros Aux', en: '1st Aid' },
    { type: 'salida', es: 'Salidas', en: 'Exits' },
    { type: 'reunion', es: 'Reunión', en: 'Assembly' },
    { type: 'taquilla', es: 'Taquillas', en: 'Tickets' },
    { type: 'lockers', es: 'Lockers', en: 'Lockers' },
    { type: 'comida', es: 'Comida', en: 'Food' },
  ];

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden">
        {/* Map Container */}
      <div className="flex-grow relative overflow-auto">
        <div className="absolute top-0 left-0" style={{ width: mapDimensions.width, height: mapDimensions.height }}>
          <img src="https://monterreyitcluster.com/wp-content/uploads/2025/11/parque.webp" alt="Park Map" className="w-full h-full object-cover" />
          
          <svg className="absolute top-0 left-0 w-full h-full" viewBox={`0 0 ${mapDimensions.width} ${mapDimensions.height}`}>
            {/* Route */}
            {routePath && routePath.path && (
              <polyline
                points={routePath.path.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="var(--nlOrange)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="15, 10"
              >
                  <animate attributeName="stroke-dashoffset" from="0" to="50" dur="2s" repeatCount="indefinite" />
              </polyline>
            )}
            
            {/* POIs */}
            {filteredPois.map(poi => {
              const pos = latLonToPixels(poi.lat, poi.lon);
              const isSelected = destination?.id === poi.id;
              return (
                <g key={poi.id} transform={`translate(${pos.x}, ${pos.y})`} onClick={() => setDestination(poi)} className="cursor-pointer">
                   <circle cx="0" cy="0" r={isSelected ? "24" : "18"} fill={isSelected ? 'var(--nlOrangeDark)' : 'var(--nlOrange)'} stroke="white" strokeWidth="3" />
                </g>
              );
            })}
            
            {/* User Location */}
            {userPixelPos && (
              <g transform={`translate(${userPixelPos.x}, ${userPixelPos.y})`}>
                <circle cx="0" cy="0" r="15" fill="blue" fillOpacity="0.3">
                    <animate attributeName="r" from="15" to="25" dur="1.5s" begin="0s" repeatCount="indefinite"/>
                    <animate attributeName="fill-opacity" from="0.3" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
                </circle>
                <circle cx="0" cy="0" r="12" fill="blue" stroke="white" strokeWidth="3" />
              </g>
            )}
          </svg>
        </div>
      </div>
      
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center bg-white rounded-2xl shadow-lg p-2">
            <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} className="p-2 text-gray-600 hover:text-[var(--nlOrange)] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13l4-4L19.5 9.5M18 13h-5a2 2 0 01-2-2V6a2 2 0 012-2h5m-3 14v-2m3 2v-2m-9-4a2 2 0 00-2 2v2a2 2 0 002 2h5" />
              </svg>
            </button>
            <input type="text" placeholder={language === 'es' ? "Buscar destino..." : "Search destination..."} className="flex-grow bg-transparent focus:outline-none px-2"/>
            <button className="p-2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
        </div>
        <div className="mt-3 flex space-x-2 overflow-x-auto pb-2">
           <button onClick={() => setAccessibleOnly(!isAccessibleOnly)} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full shadow transition ${isAccessibleOnly ? 'bg-[var(--nlOrange)] text-white' : 'bg-white text-gray-700'}`}>♿ {language==='es' ? 'Accesible' : 'Accessible'}</button>
            {criticalDestinations.map(dest => (
                <button key={dest.type} onClick={() => toggleFilter(dest.type)} className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full shadow transition ${activeFilters.has(dest.type) ? 'bg-[var(--nlOrange)] text-white' : 'bg-white text-gray-700'}`}>
                    {language === 'es' ? dest.es : dest.en}
                </button>
            ))}
        </div>
      </div>
      
      {/* Home Button */}
      <div className="absolute bottom-24 left-4">
        <button
          onClick={() => onNavigate('welcome')}
          className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-gray-800 bg-white/80 backdrop-blur-sm hover:bg-white transform transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300"
          aria-label="Go Home"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-24 right-4 space-y-4">
        <FloatingActionButton icon="translate" onClick={() => onNavigate('translate')} label={language === 'es' ? 'Traducir' : 'Translate'} />
        <FloatingActionButton icon="emergency" onClick={() => onNavigate('emergency')} label={language === 'es' ? 'Emergencia' : 'Emergency'} isEmergency />
      </div>

      {/* Destination Info Panel */}
      {destination && (
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 rounded-t-3xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.3)]">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{destination[`name_${language}`]}</h2>
              {routePath && (
                <p className="text-gray-600">{language === 'es' ? `Aprox. ${estimateTime(routePath.distance)} min de caminata` : `Approx. ${estimateTime(routePath.distance)} min walk`}</p>
              )}
            </div>
            <button onClick={() => setDestination(null)} className="p-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapScreen;