import React, { useState } from 'react';
import {
  Network,
  Coins,
  Sliders,
  UtensilsCrossed,
  Trophy,
  Megaphone,
  Bus,
  ShieldCheck,
  HeartPulse,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { COMMITTEES, SORTING_TASKS, Committee } from '../data/lessonData';
import { soundManager } from '../utils/audio';

const ICON_MAP: Record<string, React.ElementType> = {
  Network,
  Coins,
  Sliders,
  UtensilsCrossed,
  Trophy,
  Megaphone,
  Bus,
  ShieldCheck,
  HeartPulse,
};

export const CommitteesHub: React.FC = () => {
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(COMMITTEES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCommittees, setExpandedCommittees] = useState<Record<string, boolean>>({
    coordination: true,
  });

  // Game state: Tournament Director Sorter
  const [gameActive, setGameActive] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);

  const toggleExpand = (id: string) => {
    soundManager.playClick();
    setExpandedCommittees((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCommittees = COMMITTEES.filter(
    (c) =>
      c.name.includes(searchQuery) ||
      c.duties.some((d) => d.includes(searchQuery)) ||
      c.shortDesc.includes(searchQuery)
  );

  const handleStartGame = () => {
    soundManager.playClick();
    setGameActive(true);
    setCurrentTaskIndex(0);
    setGameScore(0);
    setStreak(0);
    setAnsweredCount(0);
    setFeedback(null);
  };

  const handleSelectCommitteeAnswer = (committeeId: string) => {
    if (feedback) return; // Prevent double click during feedback
    const currentTask = SORTING_TASKS[currentTaskIndex];
    const isCorrect = currentTask.committeeId === committeeId;

    if (isCorrect) {
      soundManager.playCorrect();
      setGameScore((prev) => prev + 10 + streak * 2);
      setStreak((prev) => prev + 1);
      setFeedback({
        isCorrect: true,
        message: `إجابة صحيحة وممتازة! مهمة "${currentTask.duty}" تتبع فعلاً ${currentTask.committeeName}.`,
      });
    } else {
      soundManager.playWrong();
      setStreak(0);
      setFeedback({
        isCorrect: false,
        message: `إجابة غير دقيقة. هذه المهمة تتبع "${currentTask.committeeName}". راجع جدول اللجان أعلاه.`,
      });
    }

    setAnsweredCount((prev) => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      if (currentTaskIndex + 1 < SORTING_TASKS.length) {
        setCurrentTaskIndex((prev) => prev + 1);
      } else {
        soundManager.playCelebration();
      }
    }, 2000);
  };

  return (
    <div className="space-y-10">
      {/* Introduction Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
              <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                المحطة الأولى
              </span>
              <span>تنظيم وإدارة المسابقة أو البطولة</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              لجان تنظيم المسابقة أو البطولة (9 لجان أساسية)
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              لتنظيم وإدارة مسابقة دفع الجلة بنجاح سواء على مستوى المدرسة أو المنطقة التعليمية أو الوطني أو الدولي، يتم تشكيل تسع لجان تخصصية تتكامل جهودها لإنجاح هذا الحدث الرياضي.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleStartGame}
              className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>العب تحدي: مدير البطولة</span>
            </button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن لجنة أو مهمة معينة..."
              className="w-full pl-4 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-slate-900"
            />
          </div>

          <div className="text-xs text-slate-500">
            عرض {filteredCommittees.length} من أصل 9 لجان تنظيمية معتمدة
          </div>
        </div>
      </div>

      {/* Interactive Sorter Mini-Game (Shown when activated) */}
      {gameActive && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-amber-500/30">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-700/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">تحدي محاكي مدير البطولة</h3>
                <p className="text-xs text-slate-300">حدد اللجنة المختصة بالمهمة التنظيمية المعروضة</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                النقاط: <span className="text-amber-300 font-bold text-sm mr-1">{gameScore}</span>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                الحماس المتتالي: <span className="text-emerald-400 font-bold text-sm mr-1">{streak} 🔥</span>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                المهمة: <span className="text-white font-bold text-sm mr-1">{answeredCount + 1} / {SORTING_TASKS.length}</span>
              </div>
              <button
                onClick={() => setGameActive(false)}
                className="text-xs text-slate-400 hover:text-white underline mr-2"
              >
                إغلاق التحدي
              </button>
            </div>
          </div>

          {answeredCount < SORTING_TASKS.length ? (
            <div className="mt-6 space-y-6">
              {/* Question Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/15 text-center">
                <span className="text-xs text-amber-300 font-medium block mb-2">
                  ما هي اللجنة المسؤولة عن هذه المهمة الميدانية؟
                </span>
                <p className="text-lg sm:text-xl font-bold text-white leading-relaxed max-w-2xl mx-auto">
                  "{SORTING_TASKS[currentTaskIndex].duty}"
                </p>
              </div>

              {/* Feedback Alert */}
              {feedback && (
                <div
                  className={`p-4 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                    feedback.isCorrect
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
                  }`}
                >
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Committee Buttons to Choose */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {COMMITTEES.map((comm) => (
                  <button
                    key={comm.id}
                    disabled={feedback !== null}
                    onClick={() => handleSelectCommitteeAnswer(comm.id)}
                    className="p-3 bg-white/5 hover:bg-white/15 active:bg-amber-400 active:text-slate-900 border border-white/10 hover:border-amber-400/50 rounded-xl text-right transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-bold shrink-0">
                        {comm.number}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200">
                        {comm.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Game Complete Card */
            <div className="mt-8 text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mx-auto text-2xl font-black">
                🏆
              </div>
              <h4 className="text-2xl font-bold text-white">رائع جداً! أتممت بنجاح تحدي مدير البطولة!</h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                لقد حققت <strong className="text-amber-300">{gameScore} نقطة</strong> في مهارة توزيع وإدارة المهام التنظيمية الرياضية.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleStartGame}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة التحدي مرة أخرى</span>
                </button>
                <button
                  onClick={() => setGameActive(false)}
                  className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium text-sm rounded-xl transition-colors"
                >
                  العودة للدرس
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Committees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommittees.map((committee) => {
          const IconComponent = ICON_MAP[committee.iconName] || Network;
          const isExpanded = expandedCommittees[committee.id];

          return (
            <div
              key={committee.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 border border-slate-200 shadow-inner">
                      <IconComponent className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          اللجنة رقم {committee.number}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        {committee.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                  {committee.shortDesc}
                </p>

                {/* Highlight Badge */}
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 text-xs text-slate-700 font-medium mb-4 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{committee.keyHighlight}</span>
                </div>

                {/* Duties List */}
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-1 border-b border-slate-100">
                    <span>المهام والواجبات المحددة بالمنهج:</span>
                    <span className="text-slate-400 font-normal">{committee.duties.length} مهام</span>
                  </div>

                  <ul className="space-y-2 pt-1">
                    {(isExpanded ? committee.duties : committee.duties.slice(0, 3)).map((duty, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{duty}</span>
                      </li>
                    ))}
                  </ul>

                  {committee.duties.length > 3 && (
                    <button
                      onClick={() => toggleExpand(committee.id)}
                      className="mt-3 text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <span>عرض مهام أقل</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>عرض كافة المهام ({committee.duties.length})</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Card Bar: Voice Reading */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">مقرر مسابقات الميدان</span>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    soundManager.speakArabic(
                      `${committee.name}. مهامها: ${committee.duties.join('. ')}`
                    );
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
                  title="استماع للمهام بصوت ناطق"
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
  );
};
