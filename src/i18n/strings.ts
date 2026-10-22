import type { Lang } from '../contract/types';
// OWNER: P2 Sayal. Add every UI string here. Others: request keys from Sayal.
export const strings: Record<string, Record<Lang, string>> = {
  appName: { en: 'Shiksha Saathi', hi: 'शिक्षा साथी', mr: 'शिक्षा साथी' },
  lessons: { en: 'Lessons', hi: 'पाठ', mr: 'धडे' },
  askMe: { en: 'Ask me anything', hi: 'कुछ भी पूछो', mr: 'काहीही विचारा' },
  offlineReady: { en: 'Offline ready', hi: 'ऑफ़लाइन तैयार', mr: 'ऑफलाइन तयार' },
  startQuiz: { en: 'Start quiz', hi: 'क्विज़ शुरू करो', mr: 'क्विझ सुरू करा' },
  xp: { en: 'XP', hi: 'XP', mr: 'XP' },
  streak: { en: 'Day streak', hi: 'दिन की लगातार', mr: 'दिवसांची मालिका' },
};
