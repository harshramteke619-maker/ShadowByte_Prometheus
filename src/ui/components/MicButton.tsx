// src/ui/components/MicButton.tsx
import React, { useState } from 'react';
import { voice, i18n } from '../../api';

interface MicButtonProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export const MicButton: React.FC<MicButtonProps> = ({ onTranscript, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);

  const handleClick = async () => {
    if (isListening) {
      voice.stopListening();
      setIsListening(false);
      return;
    }

    try {
      setIsListening(true);
      const text = await voice.listen(i18n.getLang());
      setIsListening(false);
      if (text && text.trim().length > 0) {
        onTranscript(text.trim());
      }
    } catch {
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={isListening ? i18n.t('listening') : 'Voice input'}
      className={`relative inline-flex items-center justify-center p-3 rounded-2xl transition-all shadow-md active:scale-95 touch-manipulation ${
        isListening
          ? 'bg-rose-500 text-white ring-4 ring-rose-200 animate-pulse'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isListening ? (
        <span className="flex items-center gap-1.5 text-xs font-bold px-1">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        </span>
      ) : (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      )}
    </button>
  );
};
