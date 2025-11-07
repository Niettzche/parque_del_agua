
export type Screen = 'welcome' | 'permissions' | 'map' | 'translate' | 'emergency';
export type Language = 'es' | 'en';

export interface UserLocation {
  lat: number;
  lon: number;
  source: 'gps' | 'nfc';
  plateId?: string;
}

export interface Sign {
  code: string;
  name_es: string;
  name_en: string;
  lat: number;
  lon: number;
  zone: string;
}

export type POIType = 'banos' | 'enfermeria' | 'salida' | 'reunion' | 'taquilla' | 'lockers' | 'comida' | 'agua' | 'recarga';

export interface POI {
  id: string;
  type: POIType;
  name_es: string;
  name_en: string;
  lat: number;
  lon: number;
  accessible?: boolean;
}

export interface GraphNode {
  id: string;
  lat: number;
  lon: number;
}

export interface GraphEdge {
  a: string;
  b: string;
  dist: number;
  accessible: boolean;
}

export interface OfficialTranslation {
  code: string;
  text_es: string;
  text_en: string;
  pictogram: string;
}

export interface FAQ {
  q_es: string;
  a_es: string;
  q_en: string;
  a_en: string;
  related_pois?: POIType[];
}

export interface MockData {
  settings: {
    languages: Language[];
    defaultLang: Language;
    theme: {
      primary: string;
      primaryDark: string;
      primaryLight: string;
      bg: string;
      text: string;
      muted: string;
    }
  };
  signs: Sign[];
  pois: POI[];
  graph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  translations_official: OfficialTranslation[];
  faqs: FAQ[];
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  actions?: {
    text: string;
    payload: any;
  }[];
}
