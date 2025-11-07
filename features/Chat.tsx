
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
      welcome: 'Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?',
      placeholder: 'Escribe tu pregunta...',
      no_answer: 'Lo siento, no entiendo esa pregunta. ¿Puedo ayudarte con otra cosa?',
      view_route: 'Ver ruta'
    },
    en: {
      welcome: 'Hi! I am your virtual assistant. How can I help you?',
      placeholder: 'Type your question...',
      no_answer: 'Sorry, I don\'t understand that question. Can I help with something else?',
      view_route: 'View route'
    }
  };
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setMessages([{ id: Date.now(), sender: 'bot', text: text[language].welcome }]);
        speak(text[language].welcome);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, language]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newMessages: ChatMessage[] = [...messages, { id: Date.now(), sender: 'user', text: userInput }];
    
    const lowerUserInput = userInput.toLowerCase();
    const faqMatch = mockData.faqs.find(faq => lowerUserInput.includes(faq[`q_${language}`].split(' ')[0].toLowerCase()));

    if (faqMatch) {
        const botResponse: ChatMessage = {
            id: Date.now() + 1,
            sender: 'bot',
            text: faqMatch[`a_${language}`],
        };

        if (faqMatch.related_pois) {
            const relatedPois = mockData.pois
                .filter(p => faqMatch.related_pois?.includes(p.type))
                .map(p => ({ ...p, distance: getDistance(userLocation, p) }))
                .sort((a, b) => a.distance - b.distance);
            
            botResponse.actions = relatedPois.map(poi => ({
                text: `${poi[`name_${language}`]}`,
                payload: { type: 'navigate', destination: poi }
            }));
        }
        newMessages.push(botResponse);
        speak(botResponse.text);

    } else {
        newMessages.push({ id: Date.now() + 1, sender: 'bot', text: text[language].no_answer });
        speak(text[language].no_answer);
    }

    setMessages(newMessages);
    setUserInput('');
  };

  const handleActionClick = (action: { type: string, destination: POI }) => {
    if (action.type === 'navigate') {
        navigateToMapWithRoute(action.destination);
        setIsOpen(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-5 bg-[var(--nlOrange)] text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 transform transition-transform hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex flex-col justify-end">
        <div className="bg-white w-full max-w-lg mx-auto h-[75%] rounded-t-3xl shadow-2xl flex flex-col">
            <header className="p-4 border-b flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-bold">Asistente Virtual</h2>
                <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
            </header>
            <div ref={chatBodyRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-[var(--nlOrange)] text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                           <p>{msg.text}</p>
                           {msg.actions && (
                               <div className="mt-2 space-y-2">
                                   {msg.actions.map((action, index) => (
                                       <button key={index} onClick={() => handleActionClick(action.payload)} className="w-full text-left bg-white/50 hover:bg-white/80 text-black font-semibold px-3 py-2 rounded-lg text-sm">
                                           {action.text} &rarr;
                                       </button>
                                   ))}
                               </div>
                           )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t flex items-center space-x-2 flex-shrink-0">
                <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={text[language].placeholder}
                    className="flex-grow px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--nlOrangeLight)]"
                />
                <button onClick={handleSendMessage} className="bg-[var(--nlOrange)] text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Chat;
