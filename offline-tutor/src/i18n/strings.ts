import type { Lang } from '../contract/types';
// OWNER: P2 Sayal. Add every UI string here. Others: request keys from Sayal.
// Keys are grouped by screen. NEVER rename or delete a key without telling Rutuja.
export const strings: Record<string, Record<Lang, string>> = {
  // ---------- existing keys (do not change) ----------
  appName: { en: 'Shiksha Saathi', hi: 'शिक्षा साथी', mr: 'शिक्षा साथी' },
  lessons: { en: 'Lessons', hi: 'पाठ', mr: 'धडे' },
  askMe: { en: 'Ask me anything', hi: 'कुछ भी पूछो', mr: 'काहीही विचारा' },
  offlineReady: { en: 'Offline ready', hi: 'ऑफ़लाइन तैयार', mr: 'ऑफलाइन तयार' },
  startQuiz: { en: 'Start quiz', hi: 'क्विज़ शुरू करो', mr: 'क्विझ सुरू करा' },
  xp: { en: 'XP', hi: 'XP', mr: 'XP' },
  streak: { en: 'Day streak', hi: 'दिन की लगातार', mr: 'दिवसांची मालिका' },

  // ---------- common ----------
  home: { en: 'Home', hi: 'होम', mr: 'मुख्यपृष्ठ' },
  chat: { en: 'Ask', hi: 'पूछो', mr: 'विचारा' },
  share: { en: 'Share', hi: 'शेयर करो', mr: 'शेअर करा' },
  language: { en: 'Language', hi: 'भाषा', mr: 'भाषा' },
  back: { en: 'Back', hi: 'वापस', mr: 'मागे' },
  next: { en: 'Next', hi: 'आगे', mr: 'पुढे' },
  ok: { en: 'OK', hi: 'ठीक है', mr: 'ठीक आहे' },
  cancel: { en: 'Cancel', hi: 'रद्द करो', mr: 'रद्द करा' },
  loading: { en: 'Loading…', hi: 'लोड हो रहा है…', mr: 'लोड होत आहे…' },
  retry: { en: 'Try again', hi: 'फिर कोशिश करो', mr: 'पुन्हा प्रयत्न करा' },
  errorGeneric: { en: 'Something went wrong. Try again.', hi: 'कुछ गड़बड़ हो गई। फिर कोशिश करो।', mr: 'काहीतरी चुकले. पुन्हा प्रयत्न करा.' },

  // language names: always shown in their own script, same in every language
  langEn: { en: 'English', hi: 'English', mr: 'English' },
  langHi: { en: 'हिन्दी', hi: 'हिन्दी', mr: 'हिन्दी' },
  langMr: { en: 'मराठी', hi: 'मराठी', mr: 'मराठी' },

  // ---------- home ----------
  welcome: { en: 'Welcome!', hi: 'स्वागत है!', mr: 'स्वागत आहे!' },
  continueLearning: { en: 'Continue learning', hi: 'पढ़ना जारी रखो', mr: 'शिकणे सुरू ठेवा' },
  level: { en: 'Level', hi: 'स्तर', mr: 'स्तर' },
  badges: { en: 'Badges', hi: 'बैज', mr: 'बॅज' },
  progress: { en: 'Progress', hi: 'प्रगति', mr: 'प्रगती' },

  // ---------- lesson ----------
  startLesson: { en: 'Start lesson', hi: 'पाठ शुरू करो', mr: 'धडा सुरू करा' },
  listen: { en: 'Listen', hi: 'सुनो', mr: 'ऐका' },
  stop: { en: 'Stop', hi: 'रुको', mr: 'थांबा' },
  markDone: { en: 'Mark as done', hi: 'पूरा हुआ', mr: 'पूर्ण झाले' },
  noVoice: { en: 'Voice is not available on this phone', hi: 'इस फ़ोन पर आवाज़ उपलब्ध नहीं है', mr: 'या फोनवर आवाज उपलब्ध नाही' },

  // ---------- quiz ----------
  question: { en: 'Question', hi: 'सवाल', mr: 'प्रश्न' },
  hint: { en: 'Hint', hi: 'संकेत', mr: 'संकेत' },
  checkAnswer: { en: 'Check answer', hi: 'उत्तर जाँचो', mr: 'उत्तर तपासा' },
  correct: { en: 'Correct!', hi: 'सही!', mr: 'बरोबर!' },
  tryAgain: { en: 'Try again', hi: 'फिर कोशिश करो', mr: 'पुन्हा प्रयत्न करा' },
  nextQuestion: { en: 'Next question', hi: 'अगला सवाल', mr: 'पुढचा प्रश्न' },
  quizDone: { en: 'Quiz complete!', hi: 'क्विज़ पूरा हुआ!', mr: 'क्विझ पूर्ण झाली!' },
  score: { en: 'Score', hi: 'स्कोर', mr: 'गुण' },
  wellDone: { en: 'Well done!', hi: 'शाबाश!', mr: 'शाबास!' },
  keepGoing: { en: 'Keep going!', hi: 'लगे रहो!', mr: 'असेच चालू ठेवा!' },
  xpEarned: { en: 'XP earned', hi: 'मिले XP', mr: 'मिळालेले XP' },

  // ---------- chat ----------
  typeQuestion: { en: 'Type your question', hi: 'अपना सवाल लिखो', mr: 'तुमचा प्रश्न लिहा' },
  send: { en: 'Send', hi: 'भेजो', mr: 'पाठवा' },
  tapToSpeak: { en: 'Tap to speak', hi: 'बोलने के लिए दबाओ', mr: 'बोलण्यासाठी दाबा' },
  listening: { en: 'Listening…', hi: 'सुन रहा हूँ…', mr: 'ऐकत आहे…' },
  thinking: { en: 'Thinking…', hi: 'सोच रहा हूँ…', mr: 'विचार करत आहे…' },
  editTranscript: { en: 'Check what you said, then send', hi: 'जो बोला उसे जाँचो, फिर भेजो', mr: 'तुम्ही काय बोललात ते तपासा, मग पाठवा' },
  didntHear: { en: "Couldn't hear you. Try again.", hi: 'आवाज़ सुनाई नहीं दी। फिर कोशिश करो।', mr: 'आवाज ऐकू आला नाही. पुन्हा प्रयत्न करा.' },
  micDenied: { en: 'Please allow microphone access', hi: 'कृपया माइक की अनुमति दो', mr: 'कृपया मायक्रोफोनला परवानगी द्या' },
  answerCurated: { en: 'Verified answer', hi: 'जाँचा हुआ जवाब', mr: 'तपासलेले उत्तर' },
  answerAI: { en: 'On-device AI', hi: 'फ़ोन पर चलने वाला AI', mr: 'फोनवर चालणारे AI' },
  answerFallback: { en: 'Basic answer', hi: 'सामान्य जवाब', mr: 'साधे उत्तर' },
  noAnswer: { en: "I don't know this yet. Try asking differently.", hi: 'मुझे यह अभी नहीं पता। दूसरे तरीके से पूछो।', mr: 'मला हे अजून माहीत नाही. वेगळ्या प्रकारे विचारा.' },

  // ---------- setup / download ----------
  setupTitle: { en: 'Get ready for offline use', hi: 'ऑफ़लाइन इस्तेमाल के लिए तैयार करो', mr: 'ऑफलाइन वापरासाठी तयार करा' },
  download: { en: 'Download', hi: 'डाउनलोड करो', mr: 'डाउनलोड करा' },
  downloadingModel: { en: 'Downloading voice and AI…', hi: 'आवाज़ और AI डाउनलोड हो रहा है…', mr: 'आवाज आणि AI डाउनलोड होत आहे…' },
  connectOnce: { en: 'Connect to the internet once to download.', hi: 'एक बार इंटरनेट से जुड़ो और डाउनलोड करो।', mr: 'एकदा इंटरनेटशी जोडा आणि डाउनलोड करा.' },
  setupReady: { en: 'Ready! Works without internet.', hi: 'तैयार! बिना इंटरनेट चलेगा।', mr: 'तयार! इंटरनेटशिवाय चालेल.' },

  // ---------- share ----------
  shareLessons: { en: 'Share lessons', hi: 'पाठ शेयर करो', mr: 'धडे शेअर करा' },
  showQR: { en: 'Show QR code', hi: 'QR कोड दिखाओ', mr: 'QR कोड दाखवा' },
  scanQR: { en: 'Scan QR code', hi: 'QR कोड स्कैन करो', mr: 'QR कोड स्कॅन करा' },
  exportFile: { en: 'Save as file', hi: 'फ़ाइल में सेव करो', mr: 'फाइल म्हणून सेव्ह करा' },
  importFile: { en: 'Open lesson file', hi: 'पाठ फ़ाइल खोलो', mr: 'धडा फाइल उघडा' },
  importDone: { en: 'Lessons added!', hi: 'पाठ जुड़ गए!', mr: 'धडे जोडले गेले!' },
  importFailed: { en: "Couldn't read this pack.", hi: 'यह पैक पढ़ा नहीं जा सका।', mr: 'हा पॅक वाचता आला नाही.' },

  // ---------- online / sync status ----------
  online: { en: 'Online', hi: 'ऑनलाइन', mr: 'ऑनलाइन' },
  offline: { en: 'Offline', hi: 'ऑफ़लाइन', mr: 'ऑफलाइन' },
  syncPending: { en: 'Waiting to sync', hi: 'सिंक होना बाकी', mr: 'सिंक होणे बाकी' },
  syncing: { en: 'Syncing…', hi: 'सिंक हो रहा है…', mr: 'सिंक होत आहे…' },
  synced: { en: 'Synced', hi: 'सिंक हो गया', mr: 'सिंक झाले' },
};
