import React from 'react';

interface Props {
  onClick: () => void;
  className?: string;
  tone?: 'light' | 'dark';
}

const BackButton: React.FC<Props> = ({ onClick, className = '', tone = 'light' }) => {
  const toneClasses =
    tone === 'dark'
      ? 'text-[var(--pine)] border-[var(--chip-border)] bg-white hover:bg-[var(--muted)]'
      : 'text-white border-white/40 bg-white/10 hover:bg-white/20';

  return (
    <button
      onClick={onClick}
      aria-label="Go back"
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase border backdrop-blur-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${toneClasses} ${className}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

export default BackButton;
