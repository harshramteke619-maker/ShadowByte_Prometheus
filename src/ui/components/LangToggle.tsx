// src/ui/components/LangToggle.tsx
import React, { useState, useEffect } from 'react';
import { i18n, Lang } from '../../api';

export const LangToggle: React.FC = () => {
  const [lang, setLangState] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    const unsub = i18n.onLangChange((newLang) => {
      setLangState(newLang);
    });
    return () => unsub();
  }, []);

  const handleSelect = (selected: Lang) => {
    i18n.setLang(selected);
  };

  return (
    <div className="inline-flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
      <button
        onClick={() => handleSelect('en')}
        className={`px-2 py-1 rounded-md transition-all ${
          lang === 'en' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleSelect('hi')}
        className={`px-2 py-1 rounded-md transition-all ${
          lang === 'hi' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        हिंदी
      </button>
      <button
        onClick={() => handleSelect('mr')}
        className={`px-2 py-1 rounded-md transition-all ${
          lang === 'mr' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        मराठी
      </button>
    </div>
  );
};
