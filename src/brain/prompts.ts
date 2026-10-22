import type { Lang } from '../contract/types';

export interface ContextPassage {
  text: string;
  source: string;
}

export function buildPrompt(
  question: string,
  lang: Lang,
  context: ContextPassage[]
): string {
  const languageNames: Record<Lang, string> = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi'
  };

  const instructions: Record<Lang, string> = {
    en: `Answer the question in ${languageNames[lang]} using ONLY the context below. Max 60 words. If the answer is not in the context, say "I don't know from the given context." Do not use outside knowledge.`,
    hi: `नीचे दिए गए संदर्भ का उपयोग करके प्रश्न का उत्तर ${languageNames[lang]} में दें। अधिकतम 60 शब्द। यदि उत्तर संदर्भ में नहीं है, तो कहें "मुझे दिए गए संदर्भ से पता नहीं है।" बाहरी ज्ञान का उपयोग न करें।`,
    mr: `खालील संदर्भ वापरून प्रश्नाचे उत्तर ${languageNames[lang]} मध्ये द्या. कमाल ६० शब्द. जर उत्तर संदर्भात नसेल, तर म्हणा "मला दिलेल्या संदर्भातून माहिती नाही." बाह्य ज्ञान वापरू नका.`
  };

  const contextText = context
    .map((c, i) => `[${i + 1}] ${c.source}: ${c.text}`)
    .join('\n');

  return `${instructions[lang]}\n\nContext:\n${contextText}\n\nQuestion: ${question}\n\nAnswer:`;
}

export function formatPassageForContext(qa: any, moduleExplanation?: string): ContextPassage {
  const text = qa.a?.en || qa.a || '';
  return {
    text,
    source: qa.id || 'unknown'
  };
}

export function formatModuleExplanation(module: any, lang: Lang): ContextPassage {
  const text = module.explanation?.[lang] || module.explanation?.en || '';
  return {
    text,
    source: `module-${module.id}`
  };
}
