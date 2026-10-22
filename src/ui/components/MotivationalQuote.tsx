// src/ui/components/MotivationalQuote.tsx
import React, { useState, useEffect } from 'react';
import { Quote, Target } from 'lucide-react';
import { i18n, Lang } from '../../api';

interface DailyQuote {
  text: Record<Lang, string>;
  author: string;
}

const QUOTES: DailyQuote[] = [
  {
    text: {
      en: 'Education is the most powerful weapon which you can use to change the world.',
      hi: 'शिक्षा सबसे शक्तिशाली हथियार है जिसका उपयोग आप दुनिया बदलने के लिए कर सकते हैं।',
      mr: 'शिक्षण हे सर्वात शक्तिशाली शस्त्र आहे ज्याचा वापर तुम्ही जग बदलण्यासाठी करू शकता.',
    },
    author: 'Nelson Mandela',
  },
  {
    text: {
      en: 'The beautiful thing about learning is that no one can take it away from you.',
      hi: 'सीखने की सबसे अच्छी बात यह है कि कोई इसे आपसे छीन नहीं सकता।',
      mr: 'शिकण्यातील सर्वात सुंदर गोष्ट म्हणजे ते कोणीही तुमच्याकडून हिरावून घेऊ शकत नाही.',
    },
    author: 'B.B. King',
  },
  {
    text: {
      en: 'An investment in knowledge pays the best interest.',
      hi: 'ज्ञान में निवेश सबसे अच्छा ब्याज देता है।',
      mr: 'ज्ञानातील गुंतवणूक सर्वोत्तम व्याज देते.',
    },
    author: 'Benjamin Franklin',
  },
];

export const MotivationalQuote: React.FC = () => {
  const [lang, setLang] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    const unsub = i18n.onLangChange((l) => setLang(l));
    return () => unsub();
  }, []);

  // Pick quote based on day
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const quote = QUOTES[dayOfYear % QUOTES.length];

  const goalLabel: Record<Lang, string> = {
    en: 'Daily Goal: Complete 2 lessons and 1 quiz',
    hi: 'दैनिक लक्ष्य: 2 पाठ और 1 क्विज पूरा करें',
    mr: 'दैनिक ध्येय: 2 धडे आणि 1 क्विझ पूर्ण करा',
  };

  return (
    <section className="space-y-3" aria-label="Motivation and daily goal">
      {/* Quote */}
      <div className="bg-gradient-to-br from-cream-200/60 via-white to-cream-100 rounded-2xl border border-cream-200/60 p-5 relative overflow-hidden">
        <Quote className="absolute top-3 right-3 w-10 h-10 text-cream-300/50" />
        <blockquote className="relative z-10">
          <p className="text-sm font-medium text-navy-400 italic leading-relaxed pr-8">
            "{quote.text[lang]}"
          </p>
          <footer className="mt-2.5 text-xs font-bold text-navy-300">
            — {quote.author}
          </footer>
        </blockquote>
      </div>

      {/* Daily goal */}
      <div className="bg-amber-50/60 rounded-2xl border border-amber-200/50 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <Target className="w-4 h-4 text-amber-600" />
        </div>
        <p className="text-xs font-semibold text-amber-800/80 leading-snug">{goalLabel[lang]}</p>
      </div>
    </section>
  );
};
