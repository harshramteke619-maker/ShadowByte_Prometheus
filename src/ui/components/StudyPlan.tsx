// src/ui/components/StudyPlan.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Flame, ChevronRight } from 'lucide-react';
import { i18n, Lang } from '../../api';
import { AnimatedSection } from './AnimatedSection';

interface StudyTask {
  id: string;
  subject: string;
  title: Record<Lang, string>;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  completed: boolean;
}

const SAMPLE_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    subject: 'Science',
    title: { en: 'Photosynthesis & Plant Life', hi: 'प्रकाश संश्लेषण और पादप जीवन', mr: 'प्रकाशसंश्लेषण आणि वनस्पती जीवन' },
    duration: '25 min',
    priority: 'high',
    progress: 0.65,
    completed: false,
  },
  {
    id: 'task-2',
    subject: 'Geography',
    title: { en: 'The Water Cycle', hi: 'जल चक्र की कार्यप्रणाली', mr: 'जलचक्राची रचना' },
    duration: '20 min',
    priority: 'medium',
    progress: 0.3,
    completed: false,
  },
  {
    id: 'task-3',
    subject: 'Math',
    title: { en: 'Linear Equations Practice', hi: 'रैखिक समीकरण अभ्यास', mr: 'रेषीय समीकरण सराव' },
    duration: '30 min',
    priority: 'high',
    progress: 1,
    completed: true,
  },
  {
    id: 'task-4',
    subject: 'English',
    title: { en: 'Reading Comprehension', hi: 'पठन बोध', mr: 'वाचन आकलन' },
    duration: '15 min',
    priority: 'low',
    progress: 0,
    completed: false,
  },
];

const priorityStyles = {
  high: 'bg-rose-50 text-rose-600 border-rose-200',
  medium: 'bg-amber-50 text-amber-600 border-amber-200',
  low: 'bg-sage-50 text-sage-600 border-sage-200',
};

const priorityLabels: Record<string, Record<Lang, string>> = {
  high: { en: 'High', hi: 'उच्च', mr: 'उच्च' },
  medium: { en: 'Medium', hi: 'मध्यम', mr: 'मध्यम' },
  low: { en: 'Low', hi: 'निम्न', mr: 'कमी' },
};

interface StudyPlanProps {
  onSelectModule?: (moduleId: string) => void;
}

export const StudyPlan: React.FC<StudyPlanProps> = ({ onSelectModule }) => {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [lang, setLang] = useState<Lang>(i18n.getLang());

  useEffect(() => {
    const unsub = i18n.onLangChange((l) => setLang(l));
    return () => unsub();
  }, []);

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, progress: t.completed ? t.progress : 1 } : t
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <section aria-labelledby="study-plan-heading">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center">
            <Flame className="w-4.5 h-4.5 text-sage-500" />
          </div>
          <div>
            <h2 id="study-plan-heading" className="text-base font-bold text-navy-500">
              {lang === 'hi' ? 'आज की अध्ययन योजना' : lang === 'mr' ? 'आजचा अभ्यास प्लॅन' : "Today's Study Plan"}
            </h2>
            <p className="text-xs text-navy-200">
              {completedCount}/{tasks.length} {lang === 'hi' ? 'पूर्ण' : lang === 'mr' ? 'पूर्ण' : 'completed'}
            </p>
          </div>
        </div>

        {/* Overall progress */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sage-400 rounded-full transition-all duration-700 animate-progress-fill"
              style={{ width: `${(completedCount / tasks.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-navy-400">
            {Math.round((completedCount / tasks.length) * 100)}%
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <AnimatedSection key={task.id} delay={idx * 60}>
            <div
              className={`group bg-white rounded-2xl border p-4 card-hover cursor-pointer ${
                task.completed
                  ? 'border-sage-200/60 bg-sage-50/30'
                  : 'border-cream-200/80'
              }`}
              onClick={() => onSelectModule?.(task.id === 'task-1' ? 'mod-1' : task.id === 'task-2' ? 'mod-2' : '')}
              role="button"
              tabIndex={0}
              aria-label={`${task.title[lang]}, ${task.subject}, ${task.completed ? 'completed' : 'in progress'}`}
            >
              <div className="flex items-start gap-3">
                {/* Completion toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(task.id);
                  }}
                  className="mt-0.5 shrink-0 text-sage-400 hover:text-sage-600 transition-colors"
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-sage-500" fill="currentColor" strokeWidth={0} />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-navy-200 uppercase tracking-wider">
                        {task.subject}
                      </span>
                      <h3
                        className={`text-sm font-semibold leading-snug mt-0.5 ${
                          task.completed ? 'text-navy-300 line-through' : 'text-navy-500'
                        }`}
                      >
                        {task.title[lang]}
                      </h3>
                    </div>
                    <ChevronRight className="w-4 h-4 text-navy-200 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] font-medium text-navy-300">
                      <Clock className="w-3 h-3" /> {task.duration}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityStyles[task.priority]}`}
                    >
                      {priorityLabels[task.priority][lang]}
                    </span>
                  </div>

                  {/* Task progress bar */}
                  {!task.completed && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sage-300 rounded-full animate-progress-fill"
                          style={{ width: `${task.progress * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-navy-300 tabular-nums">
                        {Math.round(task.progress * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
};
