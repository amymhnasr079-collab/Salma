import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Scale,
  Ruler,
  Layers,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Award,
  Volume2,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { CommitteesHub } from './CommitteesHub';
import { ShotPutSimulator } from './ShotPutSimulator';
import { LESSON_INFO } from '../data/lessonData';
import { soundManager } from '../utils/audio';

interface CoreLessonHubProps {
  onGoTo3DField: () => void;
  onGoToFinale: () => void;
}

export const CoreLessonHub: React.FC<CoreLessonHubProps> = ({
  onGoTo3DField,
  onGoToFinale,
}) => {
  const [coreSubTab, setCoreSubTab] = useState<'committees' | 'specs'>('committees');

  return (
    <div className="space-y-10">
      {/* Core Lesson Banner with Teacher Guidance Stickers */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Floating Stickers */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
              المحطة الثانية: مركز قيادة اللجان والعمليات الميدانية
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              غرفة العمليات المركزية للبطولة
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>رئيسة اللجنة الفنية والتحكيم: {LESSON_INFO.teacherName}</span>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
          مركز قيادة البطولة: تنظيم وإدارة مسابقة دفع الجلة (Putting The Shot HQ)
        </h2>

        {/* Salma's Guidance Golden Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-200/80 flex items-start gap-3.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shrink-0 shadow-sm">
            👩‍🏫
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black text-amber-900 block">
              رسالة توجيهية من الأستاذة سالمة الحكماني:
            </span>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              "طالباتي العزيزات، النجاح في رياضة دفع الجلة لا يعتمد فقط على الرمية القوية، بل يبدأ من الإعداد الإداري المحكم عبر اللجان التسع، ومطابقة الميدان للأبعاد القانونية الدقيقة. تابعي بعناية ثم استعدي لتجربة الملعب ثلاثي الأبعاد!".
            </p>
          </div>
        </div>

        {/* Sub-Tabs for Core Lesson */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setCoreSubTab('committees');
            }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              coreSubTab === 'committees'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>1. لجان التنظيم التسع ومحاكي مدير البطولة</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setCoreSubTab('specs');
            }}
            className={`px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
              coreSubTab === 'specs'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Ruler className="w-4 h-4 text-sky-400" />
            <span>2. أبعاد الدائرة، لوحة الإيقاف، وأوزان الجلل</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Content */}
      {coreSubTab === 'committees' && <CommitteesHub />}
      {coreSubTab === 'specs' && <ShotPutSimulator />}

      {/* Transition Banner to 3D Field */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-500/30">
        <div className="space-y-1 text-center sm:text-right">
          <span className="text-xs font-bold text-amber-400 block">
            المحطة التالية: الإثارة والتشويق ثلاثي الأبعاد 🎮
          </span>
          <h3 className="text-xl font-black text-white">
            انتقلي الآن إلى ملعب دفع الجلة ثلاثي الأبعاد (3D Virtual Arena)!
          </h3>
          <p className="text-xs text-slate-300">
            شاهدي دائرة الدفع ولوحة الإيقاف البيضاء مجسمة وادفعي الجلة بنفسك بالفيزياء الحركية
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onGoTo3DField();
          }}
          className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 text-sm shrink-0"
        >
          <span>دخول الملعب ثلاثي الأبعاد</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
