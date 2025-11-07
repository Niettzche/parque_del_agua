
import type { MockData } from './types';

export const mockData: MockData = {
  "settings": {
    "languages": ["es", "en"],
    "defaultLang": "es",
    "theme": {
      "primary": "#FF6A00",
      "primaryDark": "#CC5500",
      "primaryLight": "#FFA64D",
      "bg": "#FFFFFF",
      "text": "#1A1A1A",
      "muted": "#F5F5F5"
    }
  },
  "signs": [
    {"code":"PLACA-A12","name_es":"Entrada Toboganes","name_en":"Slides Entrance","lat":25.67,"lon":-100.25,"zone":"Toboganes"},
    {"code":"S-BA-12","name_es":"Baño Zona Toboganes","name_en":"Restroom Slides Zone","lat":25.6705,"lon":-100.249,"zone":"Toboganes"}
  ],
  "pois": [
    {"id":"poi-banos-1","type":"banos","name_es":"Baños Zona Toboganes","name_en":"Restrooms Slides","lat":25.6705,"lon":-100.249,"accessible":true},
    {"id":"poi-banos-2","type":"banos","name_es":"Baños Food Court","name_en":"Restrooms Food Court","lat":25.6698, "lon":-100.2455, "accessible": true},
    {"id":"poi-banos-3","type":"banos","name_es":"Baños Entrada Norte","name_en":"Restrooms North Entrance","lat":25.6681, "lon":-100.2471, "accessible": false},
    {"id":"poi-firstaid-1","type":"enfermeria","name_es":"Enfermería Central","name_en":"First Aid Central","lat":25.669,"lon":-100.248,"accessible":true},
    {"id":"poi-salida-1","type":"salida","name_es":"Salida Norte","name_en":"North Exit","lat":25.668,"lon":-100.247,"accessible":true},
    {"id":"poi-reunion-1","type":"reunion","name_es":"Punto de Reunión A","name_en":"Assembly Point A","lat":25.6675,"lon":-100.246,"accessible":true},
    {"id":"poi-reunion-2","type":"reunion","name_es":"Punto de Reunión B","name_en":"Assembly Point B","lat":25.671, "lon":-100.2505, "accessible":true},
    {"id":"poi-taquilla-1","type":"taquilla","name_es":"Taquillas","name_en":"Ticket Booths","lat":25.6695,"lon":-100.2465, "accessible": true},
    {"id":"poi-lockers-1","type":"lockers","name_es":"Lockers y Vestidores","name_en":"Lockers & Changing Rooms","lat":25.671,"lon":-100.2495, "accessible": true},
    {"id":"poi-food-1","type":"comida","name_es":"Área de Comidas","name_en":"Food Court","lat":25.6698,"lon":-100.2458, "accessible": true},
    {"id":"poi-agua-1","type":"agua","name_es":"Punto de Agua","name_en":"Water Refill","lat":25.6692,"lon":-100.2462, "accessible": true},
    {"id":"poi-recarga-1","type":"recarga","name_es":"Recarga Pulsera (Taquillas)","name_en":"Wristband Recharge (Tickets)","lat":25.6695,"lon":-100.2465, "accessible": true},
    {"id":"poi-recarga-2","type":"recarga","name_es":"Recarga Pulsera (Food Court)","name_en":"Wristband Recharge (Food Court)","lat":25.6698,"lon":-100.2458, "accessible": true}
  ],
  "graph": {
    "nodes": [
      {"id":"n1","lat":25.67,"lon":-100.25},
      {"id":"n2","lat":25.6705,"lon":-100.249},
      {"id":"n3","lat":25.669,"lon":-100.248},
      {"id":"n4","lat":25.668,"lon":-100.247},
      {"id":"n5","lat":25.6675,"lon":-100.246},
      {"id":"n6","lat":25.6698,"lon":-100.2458},
      {"id":"n7","lat":25.671, "lon":-100.2495},
      {"id":"n8","lat":25.6695,"lon":-100.2465}
    ],
    "edges": [
      {"a":"n1","b":"n2","dist":120,"accessible":true},
      {"a":"n2","b":"n3","dist":140,"accessible":true},
      {"a":"n3","b":"n4","dist":130,"accessible":false},
      {"a":"n3","b":"n5","dist":150,"accessible":true},
      {"a":"n3","b":"n6","dist":220,"accessible":true},
      {"a":"n3","b":"n8","dist":160,"accessible":true},
      {"a":"n8","b":"n4","dist":170,"accessible":true},
      {"a":"n8","b":"n6","dist":80,"accessible":true},
      {"a":"n2","b":"n7","dist":60,"accessible":true}
    ]
  },
  "translations_official": [
    {"code":"S-BA-12","text_es":"Baños","text_en":"Restrooms","pictogram":"iso7001_restroom"},
    {"code":"E-01", "text_es": "Salida", "text_en": "Exit", "pictogram": "iso7001_exit"},
    {"code":"I-01", "text_es": "Información", "text_en": "Information", "pictogram": "iso7001_info"}
  ],
  "faqs": [
    {"q_es":"baños cerca","a_es":"Claro, aquí están los baños más cercanos. ¿A cuál quieres ir?","q_en":"nearest restrooms","a_en":"Of course, here are the nearest restrooms. Which one would you like to go to?","related_pois":["banos"]},
    {"q_es":"rampa silla de ruedas","a_es":"Todas las rutas principales son accesibles. Para verlas, activa el filtro 'Accesible' en el mapa.","q_en":"wheelchair ramp","a_en":"All main routes are accessible. To view them, activate the 'Accessible' filter on the map."},
    {"q_es":"horario cierre","a_es":"Hoy el parque cierra a las 21:00. Las atracciones acuáticas cierran a las 20:30.","q_en":"closing time","a_en":"The park closes at 9:00 PM today. Water attractions close at 8:30 PM."},
    {"q_es":"recargo mi pulsera","a_es":"Puedes recargar tu pulsera en las Taquillas o en el Área de Comidas. Te muestro las opciones.","q_en":"recharge my wristband","a_en":"You can recharge your wristband at the Ticket Booths or the Food Court. Here are the options.","related_pois":["recarga"]}
  ]
}
