import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Lightbulb,
  Target,
  Trophy,
  CheckCircle2,
  ArrowLeft,
  Volume2,
  Flame,
  Award,
  Zap,
  Radio,
  BookOpen
} from 'lucide-react';
import { WARMUP_CARDS, LESSON_INFO } from '../data/lessonData';
import { soundManager } from '../utils/audio';

interface WarmupPriorLearningProps {
  onStartCoreLesson: () => void;
}

export const WarmupPriorLearning: React.FC<WarmupPriorLearningProps> = ({ onStartCoreLesson }) => {
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const [studentVote, setStudentVote] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    soundManager.playClick();
    setRevealedCards((prev) => {
      const next = !prev[id];
      if (next) soundManager.playCorrect();
      return { ...prev, [id]: next };
    });
  };

  const handleVote = (choice: string) => {
    setStudentVote(choice);
    soundManager.playCorrect();
  };

  return (
    <div className="space-y-10">
      {/* Warmup Welcome Hero Banner with Stickers */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-rose-500 to-indigo-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl border-4 border-amber-300/40">
        {/* Floating Creative Stickers in Background */}
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-xs font-black rotate-[-6deg] shadow-sm select-none">
          🏅 بطلات الرياضة المدرسية
        </div>
        <div className="absolute bottom-4 left-6 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-xs font-black rotate-[8deg] shadow-sm select-none">
          ✨ إشراف: {LESSON_INFO.teacherName}
        </div>
        <div className="absolute top-10 right-8 bg-amber-300 text-slate-900 px-3 py-1 rounded-full font-black text-xs rotate-[4deg] shadow-md select-none hidden sm:block">
          🔥 طاقة وتحدي لا يتوقف!
        </div>

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold text-amber-200">
            <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>المحطة الأولى: غرفة النداء والإحماء الرياضي (Official Call Room)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            الاستعداد لدخول مضمار البطولة! 🏃‍♀️
            <span className="block text-amber-200 text-lg sm:text-2xl mt-1">
              النداء الأول للاعبات: مراجعة الجاهزية البدنية والفنية قبل المنافسة
            </span>
          </h2>

          <p className="text-sm sm:text-base text-white/95 leading-relaxed font-medium bg-black/25 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            قبل صفارة انطلاق جولة الرمي، تخضع اللاعبات في مسابقات الميدان لإجراءات غرفة النداء الرسمية، والتأكد من مطابقة الأدوات وفهم لوائح البطولة بإشراف رئيسة لجنة التحكيم.
          </p>
        </div>

        {/* Learning Objectives Stickers */}
        <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold shrink-0 shadow">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-amber-200 block">الهدف الأول</span>
              <p className="text-xs text-white/90 font-medium">إتقان مهام اللجان التسع لتنظيم البطولات</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-400 text-slate-900 flex items-center justify-center font-bold shrink-0 shadow">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-sky-200 block">الهدف الثاني</span>
              <p className="text-xs text-white/90 font-medium">ضبط الأبعاد الدقيقة للدائرة ولوحة الإيقاف</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-400 text-slate-900 flex items-center justify-center font-bold shrink-0 shadow">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-emerald-200 block">الهدف الثالث</span>
              <p className="text-xs text-white/90 font-medium">الخوض في الملعب 3D واختبار القوانين التحكيمية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Icebreaker Challenge: The Big Question */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/90 shadow-md relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-100 text-rose-800 text-xs font-black px-2.5 py-0.5 rounded-full">
                تحدي كسر الجليد 🧊
              </span>
              <span className="text-xs text-slate-500 font-medium">سؤال استكشافي ذكي</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              برأيكِ، ما هو السر وراء تسمية المسابقة بـ "دفع" الجلة وليس "رمي" الجلة؟
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          في مسابقات الميدان نقول: رمي الرمح، قذف القرص، وإطاحة المطرقة.. لكننا نقول حصراً: <strong>دفع الجلة (Shot Put)</strong>! اختاري الإجابة التي تعتقدين أنها الأقرب للحقيقة:
        </p>

        {/* Interactive Poll / Vote Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            {
              id: 'a',
              text: 'لأن الجلة مصنوعة من الحديد ولا يمكن رميها بالهواء أبداً',
              isCorrect: false
            },
            {
              id: 'b',
              text: 'لأنها تدفع من جانب الرقبة بحركة انفجارية مستقيمة لحماية مفصل الكتف',
              isCorrect: true
            },
            {
              id: 'c',
              text: 'مجرد اسم تقليدي لا يحمل أي قاعدة فنية أو ميكانيكية حركية',
              isCorrect: false
            }
          ].map((opt) => {
            const isSelected = studentVote === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                className={`p-4 rounded-2xl border text-right transition-all font-bold text-xs sm:text-sm ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300'
                      : 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-300'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                    {opt.id.toUpperCase()}
                  </span>
                  {isSelected && (
                    <span className="text-xs font-bold text-emerald-700">
                      {opt.isCorrect ? '✅ إجابة دقيقة وذكية!' : '❌ حاولي مجدداً!'}
                    </span>
                  )}
                </div>
                <span>{opt.text}</span>
              </button>
            );
          })}
        </div>

        {studentVote && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-950 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>توضيح الأستاذة سالمة:</strong> "ممتاز! الجلة ثقيلة جداً (تصل إلى 7.260 كجم للرجال و 4 كجم للإناث)، ولو قام اللاعب برميها بالذراع الممدودة لتعرض مفصل الكتف لخلع وإصابة بليغة. لذلك يتم دفعها من وضع ملاصق للفك والترقوة بقوة الجذع والساقين!".
            </p>
          </div>
        )}
      </div>

      {/* Prior Knowledge Exploration Cards (بطاقات التعلم القبلي التفاعلية) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              بطاقات التوقع والاستكشاف القبلي
            </h3>
            <p className="text-xs text-slate-500">
              انقري على كل بطاقة لكشف الحقيقة المنهجية وتحضير ذهنك للدرس
            </p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {Object.values(revealedCards).filter(Boolean).length} من {WARMUP_CARDS.length} مكتشفة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WARMUP_CARDS.map((card) => {
            const isRevealed = revealedCards[card.id];
            return (
              <div
                key={card.id}
                onClick={() => toggleReveal(card.id)}
                className={`cursor-pointer rounded-2xl p-5 border text-right transition-all duration-300 shadow-sm flex flex-col justify-between ${
                  isRevealed
                    ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {card.sticker}
                    </span>
                    <span className="text-xs text-amber-600 font-bold">
                      {isRevealed ? 'تم الكشف ✅' : 'انقري للكشف 👆'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                    {card.question}
                  </h4>

                  {!isRevealed ? (
                    <p className="text-xs text-slate-500 italic mt-2">
                      💡 {card.hint}
                    </p>
                  ) : (
                    <div className="mt-3 pt-3 border-t border-amber-200/80 text-xs text-amber-950 font-medium leading-relaxed bg-white/80 p-2.5 rounded-xl">
                      {card.revealedAnswer}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{isRevealed ? 'أحسنتِ الاستيعاب' : 'تحدي استكشافي'}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClick();
                      soundManager.speakArabic(isRevealed ? card.revealedAnswer : card.question);
                    }}
                    className="hover:text-amber-600 flex items-center gap-1"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>استماع</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Direct Transition to Core Lesson CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-slate-700">
        <div className="space-y-1 text-center sm:text-right">
          <div className="flex items-center gap-2 justify-center sm:justify-start text-xs text-amber-300 font-bold">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>أنتِ الآن جاهزة تماماً للانتقال إلى المحور الرئيسي!</span>
          </div>
          <h4 className="text-xl font-black text-white">
            انتقلي الآن لمحور الدرس: اللجان التنظيمية والأبعاد والمواصفات
          </h4>
          <p className="text-xs text-slate-300">
            استكشفي اللجان الـ 9 بدقة واكتشفي أسرار ملعب دفع الجلة ولوحة الإيقاف
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onStartCoreLesson();
          }}
          className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black rounded-2xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 text-sm shrink-0"
        >
          <span>دخول محور الدرس</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
