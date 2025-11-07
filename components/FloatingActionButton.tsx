import React from 'react';

interface Props {
  icon: 'translate' | 'emergency';
  onClick: () => void;
  label: string;
  isEmergency?: boolean;
}

const FloatingActionButton: React.FC<Props> = ({ icon, onClick, label, isEmergency = false }) => {
  const icons = {
    translate: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 7h7m-2 -2v2a5 8 0 0 1 -5 8h-2a5 8 0 0 0 5 -8v-2" />
        <path d="M12 20l4 -9l4 9" />
        <path d="M19 18h-6" />
      </svg>
    ),
    emergency: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  const baseClasses =
    'w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-white transition transform hover:-translate-y-1 focus:outline-none focus-visible:ring-4';
  const colorClasses = isEmergency
    ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-200'
    : 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] focus-visible:ring-[var(--primary-light)]';

  return (
    <button onClick={onClick} className={`${baseClasses} ${colorClasses}`} aria-label={label}>
      {icons[icon]}
    </button>
  );
};

export default FloatingActionButton;
