import React, { useState, useRef, useEffect } from 'react';
import type { Language, UserLocation, POI, ChatMessage } from '../types';
import { mockData } from '../data';
import { getDistance } from '../services/routingService';

interface Props {
  userLocation: UserLocation;
  language: Language;
  navigateToMapWithRoute: (destination: POI) => void;
  speak: (text: string) => void;
}

const Chat: React.FC<Props> = ({ userLocation, language, navigateToMapWithRoute, speak }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const text = {
    es: {
      welcome: 'Hola, soy tu asistente IA del Parque del Agua. Pregunta por servicios, eventos o rutas.',
      placeholder: 'Escribe tu pregunta...',
      no_answer: 'Lo siento, no tengo esa información. Intenta con otra pregunta.',
      view_route: 'Ver ruta',
      header: 'Asistente IA',
      prompts: ['Horarios', 'Eventos', 'Servicios', 'Recargas'],
    },
    en: {
      welcome: 'Hi! I’m your park AI guide. Ask about services, events, or routes.',
      placeholder: 'Type your question...',
      no_answer: 'Sorry, I do not have that info. Ask something else.',
      view_route: 'View route',
      header: 'AI Guide',
      prompts: ['Hours', 'Events', 'Amenities', 'Top ups'],
    },
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome = { id: Date.now(), sender: 'bot' as const, text: text[language].welcome };
      setMessages([welcome]);
      speak(text[language].welcome);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, language]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (message: string) => {
    if (!message.trim()) return;
    const newMessages: ChatMessage[] = [...messages, { id: Date.now(), sender: 'user', text: message }];
    const lower = message.toLowerCase();
    const faqMatch = mockData.faqs.find((faq) => lower.includes(faq[`q_${language}`].split(' ')[0].toLowerCase()));

    if (faqMatch) {
      const botResponse: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: faqMatch[`a_${language}`],
      };
      if (faqMatch.related_pois) {
        const relatedPois = mockData.pois
          .filter((poi) => faqMatch.related_pois?.includes(poi.type))
          .map((poi) => ({ ...poi, distance: getDistance(userLocation, poi) }))
          .sort((a, b) => a.distance - b.distance);
        botResponse.actions = relatedPois.map((poi) => ({
          text: `${poi[`name_${language}`]}`,
          payload: { type: 'navigate', destination: poi },
        }));
      }
      newMessages.push(botResponse);
      speak(botResponse.text);
    } else {
      newMessages.push({ id: Date.now() + 1, sender: 'bot', text: text[language].no_answer });
      speak(text[language].no_answer);
    }

    setMessages(newMessages);
  };

  const handleSendMessage = (preset?: string) => {
    const payload = preset ?? userInput;
    sendMessage(payload);
    if (!preset) {
      setUserInput('');
    }
  };

  const handleActionClick = (action: { type: string; destination: POI }) => {
    if (action.type === 'navigate') {
      navigateToMapWithRoute(action.destination);
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-4 z-40 bg-[var(--primary)] text-white w-14 h-14 rounded-2xl shadow-2xl shadow-[rgba(246,134,40,0.4)] flex items-center justify-center"
        aria-label="Abrir chat IA"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <rect x="6" y="9" width="12" height="9" rx="2" />
          <path d="M9 9V6a3 3 0 016 0v3" />
          <path d="M8 18v1a2 2 0 002 2h4a2 2 0 002-2v-1" />
          <circle cx="10" cy="13" r="1" fill="currentColor" />
          <circle cx="14" cy="13" r="1" fill="currentColor" />
          <path d="M4 12h2" />
          <path d="M18 12h2" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-40 flex flex-col justify-end md:items-end">
      <div className="w-full md:max-w-sm bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col mx-auto md:mr-6">
        <header className="p-4 border-b flex items-center justify-between bg-[var(--muted)]">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--sage)]">IA</p>
            <h2 className="text-xl font-semibold">{text[language].header}</h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-[var(--sage)]">
            ✕
          </button>
        </header>

        <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b text-sm text-[var(--pine)]">
          {text[language].prompts.map((prompt) => (
            <button key={prompt} onClick={() => handleSendMessage(prompt)} className="px-3 py-2 rounded-full border border-[var(--chip-border)] bg-white">
              {prompt}
            </button>
          ))}
        </div>

        <div ref={chatBodyRef} className="flex-1 px-4 py-4 space-y-3 overflow-y-auto bg-white">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                <p>{msg.text}</p>
                {msg.actions && (
                  <div className="mt-3 space-y-2">
                    {msg.actions.map((action, index) => (
                      <button
                        key={`${action.text}-${index}`}
                        onClick={() => handleActionClick(action.payload)}
                        className="w-full rounded-2xl border border-[var(--chip-border)] px-3 py-2 text-left text-sm font-semibold"
                      >
                        {action.text} →
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[var(--muted)] flex items-center gap-2">
          <button className="mic-button" aria-label="Activar micrófono">
            🎙️
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={text[language].placeholder}
            className="flex-1 px-4 py-3 rounded-full border border-[var(--chip-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)]"
          />
          <button
            onClick={() => handleSendMessage()}
            className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md"
            aria-label="Enviar mensaje"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
