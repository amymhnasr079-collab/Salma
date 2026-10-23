import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Sparkles,
  Award,
  RotateCw,
  CheckCircle2,
  XCircle,
  Printer,
  Star,
  Flame,
  Volume2,
  Medal,
  Crown,
  Heart
} from 'lucide-react';
import { FINALE_WHEEL_ITEMS, WheelItem, LESSON_INFO } from '../data/lessonData';
import { soundManager } from '../utils/audio';

export const GrandFinaleGame: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const [score, setScore] = useState(0);
  const [answeredIds, setAnsweredIds] = useState<number[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);

  // Certificate personalization
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [showCoronation, setShowCoronation] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw the Golden Wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 25;
    const totalSegments = FINALE_WHEEL_ITEMS.length;
    const arcSize = (2 * Math.PI) / totalSegments;

    ctx.clearRect(0, 0, width, height);

    // Save and rotate context
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((currentRotation * Math.PI) / 180);

    // Draw Wheel Segments
    FINALE_WHEEL_ITEMS.forEach((item, index) => {
      const angle = index * arcSize;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + arcSize);
      ctx.closePath();

      // Alternate luxury jewel colors
      ctx.fillStyle = item.color;
      ctx.fill();

      // Segment Border
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Draw Label Text
      ctx.save();
      ctx.rotate(angle + arcSize / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Cairo, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 4;
      ctx.fillText(item.label, radius - 20, 5);
      ctx.restore();
    });

    // Outer Golden Ring with Sparkling Dots
    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, 2 * Math.PI);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius + 15, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    // Draw Golden Studs / Jewels around ring
    const totalStuds = 24;
    for (let s = 0; s < totalStuds; s++) {
      const studAngle = (s * 2 * Math.PI) / totalStuds;
      const sx = Math.cos(studAngle) * (radius + 8);
      const sy = Math.sin(studAngle) * (radius + 8);
      ctx.beginPath();
      ctx.arc(sx, sy, 3.5, 0, 2 * Math.PI);
      ctx.fillStyle = s % 2 === 0 ? '#ffffff' : '#fef08a';
      ctx.fill();
    }

    // Center Golden Hub
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, 2 * Math.PI);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', 0, 0);

    ctx.restore();
  }, [currentRotation]);

  // Spin Wheel Physics
  const handleSpinWheel = () => {
    if (isSpinning) return;
    soundManager.playClick();
    setIsSpinning(true);
    setSelectedItem(null);
    setShowQuestionModal(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);

    // Pick a random un-answered or random item
    const randomIndex = Math.floor(Math.random() * FINALE_WHEEL_ITEMS.length);
    const chosen = FINALE_WHEEL_ITEMS[randomIndex];

    // Compute rotation so needle at 270 deg (top) lands on chosen segment
    const segmentAngle = 360 / FINALE_WHEEL_ITEMS.length;
    // Target angle center
    const targetCenter = randomIndex * segmentAngle + segmentAngle / 2;
    // We want targetCenter + finalRotation mod 360 = 270 deg
    const spinRotations = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations
    const finalRot = currentRotation + spinRotations * 360 + (270 - (targetCenter % 360) + 360) % 360;

    const startTime = performance.now();
    const duration = 4000; // 4 seconds spin
    const startRot = currentRotation;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = startRot + (finalRot - startRot) * ease;
      setCurrentRotation(current);

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        setIsSpinning(false);
        setSelectedItem(chosen);
        setShowQuestionModal(true);
        soundManager.playCelebration();
      }
    };

    requestAnimationFrame(animateSpin);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIdx);
    setIsAnswerSubmitted(true);

    if (selectedItem && optionIdx === selectedItem.correctIndex) {
      soundManager.playCorrect();
      setScore((prev) => prev + selectedItem.bonusPoints);
      setAnsweredIds((prev) => [...prev, selectedItem.id]);

      // Unlock badges
      if (score + selectedItem.bonusPoints >= 300 && !earnedBadges.includes('بطلة دفع الجلة')) {
        setEarnedBadges((prev) => [...prev, 'بطلة دفع الجلة']);
      }
      if (score + selectedItem.bonusPoints >= 500 && !earnedBadges.includes('تاج التميز الذهبي')) {
        setEarnedBadges((prev) => [...prev, 'تاج التميز الذهبي']);
      }

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } else {
      soundManager.playWrong();
    }
  };

  const handleOpenCoronation = () => {
    soundManager.playCelebration();
    setShowCoronation(true);
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-10">
      {/* Spectacular Finale Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-rose-600 to-purple-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border-4 border-amber-300/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-xs font-black text-amber-200">
              <Crown className="w-4 h-4 text-amber-300" />
              <span>المحطة الختامية الكبرى: التتويج والتحدي المبهر</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              عجلة الحظ الذهبية لبطلات الميدان! 🎡
            </h2>

            <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed font-medium">
              أديري عجلة المعرفة الذهبية، أجيبي على التحديات الرياضية، اجمعي الأوسمة الشرفية، وتوّجي بكأس البطولة وشهادة التفوق المعتمدة بإشراف المعلمة المتميزة <strong>{LESSON_INFO.teacherName}</strong>.
            </p>
          </div>

          {/* Live Score Tally Box */}
          <div className="bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0 min-w-[200px] shadow-inner">
            <span className="text-xs text-amber-300 font-bold block mb-1">
              مجموع النقاط الذهبية
            </span>
            <span className="text-4xl font-black text-white font-mono block">
              {score} 🌟
            </span>
            <span className="text-[11px] text-white/70 block mt-1">
              تم إنجاز {answeredIds.length} من {FINALE_WHEEL_ITEMS.length} تحديات
            </span>
          </div>
        </div>

        {/* Badges Strip */}
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-amber-200">الأوسمة المكتسبة:</span>
          {earnedBadges.length > 0 ? (
            earnedBadges.map((badge, idx) => (
              <span
                key={idx}
                className="bg-amber-300 text-slate-900 text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1.5"
              >
                <Medal className="w-3.5 h-3.5 text-amber-900" />
                <span>{badge}</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-white/70 italic">
              أديري العجلة واحصلي على 300 نقطة لفتح أول وسام شرفي!
            </span>
          )}
        </div>
      </div>

      {/* Olympic Championship Podium Bar - Light Frosted Glass */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border-2 border-amber-400 text-slate-900 shadow-lg">
        <div className="text-center mb-5">
          <span className="text-xs font-black text-amber-800 uppercase tracking-widest block bg-amber-100/80 px-3 py-1 rounded-full inline-block border border-amber-300 mb-1">
            منصة التتويج المباشرة للاعبات البطولة (Live Olympic Podium)
          </span>
          <h3 className="text-xl font-black text-slate-900">ترتيب البطلات وفق النقاط المحققة</h3>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto items-end text-center">
          {/* 2nd Place: Silver */}
          <div className="bg-slate-100/80 backdrop-blur-md rounded-2xl p-4 border border-slate-300 flex flex-col items-center">
            <span className="text-3xl mb-1">🥈</span>
            <span className="text-xs font-bold text-slate-700">المركز الثاني</span>
            <span className="text-xs font-mono font-bold text-slate-500 mt-1">300 نقطة</span>
            <div className={`mt-2 w-full py-1 rounded-xl text-[10px] font-black ${score >= 300 ? 'bg-slate-300 text-slate-950' : 'bg-slate-200 text-slate-500'}`}>
              {score >= 300 ? 'محقق ✅' : 'قيد المنافسة'}
            </div>
          </div>

          {/* 1st Place: Gold */}
          <div className="bg-gradient-to-b from-amber-100/90 to-amber-200/90 backdrop-blur-md rounded-3xl p-5 border-2 border-amber-400 shadow-xl flex flex-col items-center scale-105">
            <span className="text-4xl mb-1">🥇</span>
            <span className="text-sm font-black text-amber-950">بطلة الذهب وكأس البطولة</span>
            <span className="text-xs font-mono font-bold text-amber-800 mt-1">500+ نقطة</span>
            <div className={`mt-2 w-full py-1.5 rounded-xl text-xs font-black shadow ${score >= 500 ? 'bg-amber-400 text-slate-950 animate-pulse' : 'bg-white/80 text-amber-800'}`}>
              {score >= 500 ? '👑 البطلة المتوجة' : 'الهدف الذهبي'}
            </div>
          </div>

          {/* 3rd Place: Bronze */}
          <div className="bg-amber-50/80 backdrop-blur-md rounded-2xl p-4 border border-amber-200 flex flex-col items-center">
            <span className="text-3xl mb-1">🥉</span>
            <span className="text-xs font-bold text-amber-900">المركز الثالث</span>
            <span className="text-xs font-mono font-bold text-amber-700 mt-1">100 نقطة</span>
            <div className={`mt-2 w-full py-1 rounded-xl text-[10px] font-black ${score >= 100 ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-700'}`}>
              {score >= 100 ? 'محقق ✅' : 'قيد المنافسة'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Wheel Stage - Light Frosted Glass */}
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/90 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Wheel Canvas Container (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          {/* Top Indicator Needle */}
          <div className="relative z-20 -mb-5 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-400 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] animate-bounce" />
          </div>

          <div className="relative">
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              className="max-w-full h-auto drop-shadow-2xl select-none"
            />
          </div>

          {/* Spin Action Button */}
          <div className="mt-6">
            <button
              disabled={isSpinning}
              onClick={handleSpinWheel}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 active:scale-95 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl transition-all flex items-center gap-3 disabled:opacity-50"
            >
              <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'العجلة تدور الآن...' : 'أديري عجلة التحدي الذهبية! 🎯'}</span>
            </button>
          </div>
        </div>

        {/* Side Details & Direct Coronation Action (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-50 p-6 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span>قواعد تحدي بطلات الميدان</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>كل قطاع في العجلة يمثل سؤالاً ذكياً من صميم مقرر دفع الجلة ومواصفاته القانونية.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span>الإجابة الصحيحة تمنحكِ نقاطاً فورية وتفتح لكِ أوسمة التفوق والريادة الرياضية.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>بعد إتمام التحدي، يمكنكِ الانتقال لمنصة التتويج وطباعة وثيقة الإتقان الرسمية باسمكِ.</span>
              </li>
            </ul>
          </div>

          {/* Quick Jump to Coronation Certificate */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 text-center sm:text-right">
            <h4 className="text-base font-black text-amber-300">
              جاهزة للتتويج واستلام وثيقة التميز؟ 📜
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              سجلي اسمكِ وتوّجي رسمياً بلقب بطلة تنظيم وإدارة مسابقة دفع الجلة بإشراف المعلمة سالمة الحكماني.
            </p>
            <button
              onClick={handleOpenCoronation}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>دخول منصة التتويج وإصدار الوثيقة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Question Modal */}
      {showQuestionModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border-4 border-amber-400 shadow-2xl space-y-5 animate-scale-up text-right">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span
                style={{ backgroundColor: selectedItem.color }}
                className="text-white text-xs font-black px-3 py-1 rounded-full shadow"
              >
                تحدي: {selectedItem.label} (+{selectedItem.bonusPoints} نقطة)
              </span>

              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-bold block">
                تصنيف: {selectedItem.category}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {selectedItem.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5 pt-2">
              {selectedItem.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = selectedItem.correctIndex === idx;

                let optStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optStyle = 'bg-emerald-50 text-emerald-950 border-emerald-400 font-bold';
                  } else if (isSelected) {
                    optStyle = 'bg-rose-50 text-rose-950 border-rose-400 font-bold';
                  } else {
                    optStyle = 'bg-slate-50 text-slate-400 border-slate-100 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-3.5 rounded-xl border text-right transition-all flex items-center justify-between text-xs sm:text-sm font-semibold ${optStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation after submission */}
            {isAnswerSubmitted && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 leading-relaxed">
                <strong>التفسير العلمي المعتمد:</strong> {selectedItem.explanation}
              </div>
            )}

            {isAnswerSubmitted && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowQuestionModal(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  متابعة اللعب وتدوير العجلة
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coronation & Official Diploma Modal */}
      {showCoronation && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 border-4 border-amber-400 shadow-2xl space-y-6 my-8 text-right">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 no-print">
              <span className="text-xs font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                منصة التتويج الشرفية 🏆
              </span>
              <button
                onClick={() => setShowCoronation(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            {/* Personalization Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 no-print bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اسم الطالبة البطلة:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="اكتبي اسمكِ الثلاثي هنا..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  المدرسة / الصف:
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="اسم المدرسة والصف..."
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Print Ready Certificate */}
            <div className="p-8 sm:p-12 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 rounded-3xl border-8 border-double border-amber-500/80 shadow-inner relative text-center">
              {/* Corner Ornaments */}
              <div className="absolute top-3 right-3 text-amber-500 text-lg">⚜️</div>
              <div className="absolute top-3 left-3 text-amber-500 text-lg">⚜️</div>
              <div className="absolute bottom-3 right-3 text-amber-500 text-lg">⚜️</div>
              <div className="absolute bottom-3 left-3 text-amber-500 text-lg">⚜️</div>

              <span className="text-[11px] font-bold text-slate-500 tracking-wider block mb-1">
                سلطنة عُمان · وزارة التربية والتعليم · مادة الرياضة المدرسية
              </span>

              <h3 className="text-2xl sm:text-4xl font-black text-amber-900 mb-1 tracking-tight">
                وثيقة التتويج والتميز الرياضي
              </h3>
              <p className="text-xs text-amber-700 font-bold mb-6">
                في مسابقات الميدان: تنظيم وإدارة مسابقة دفع الجلة (Putting The Shot)
              </p>

              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                تمنح هذه الوثيقة الشرفية تقديراً واعتزازاً بإتقان وتميز الطالبة الرياضية:
              </p>

              {/* Student Name */}
              <div className="my-4 py-2 border-b-2 border-dashed border-amber-400 inline-block min-w-[280px]">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">
                  {studentName.trim() || 'اسم الطالبة المتفوقة'}
                </span>
              </div>

              {schoolName && (
                <p className="text-xs font-bold text-slate-600 mb-3">
                  مدرسة: {schoolName}
                </p>
              )}

              <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed mt-2">
                نظير تفوقها الباهر في المحطات التعليمية، وإتقانها الشامل لمهام اللجان التسع، وأبعاد دائرة الدفع (2.135 متر)، ومواصفات لوحة الإيقاف البيضاء، وأوزان الجلل، وخوض الملعب ثلاثي الأبعاد بنجاح واقتدار.
              </p>

              {/* Badges / Score display */}
              <div className="mt-6 flex justify-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300">
                  مجموع النقاط: {score} نقطة 🌟
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                  درجة الإتقان: ممتاز مع مرتبة الشرف 🏅
                </span>
              </div>

              {/* Signatures */}
              <div className="mt-10 pt-6 border-t border-amber-200 grid grid-cols-2 gap-4 items-end text-right">
                <div>
                  <span className="text-[11px] text-slate-400 block">إعداد وتصميم المعلمة:</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">
                    {LESSON_INFO.teacherName}
                  </span>
                  <span className="text-[11px] text-amber-700 font-medium">معلمة الرياضة المدرسية</span>
                </div>

                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block">التاريخ والاعتماد:</span>
                  <span className="text-xs font-mono font-bold text-slate-800 block mt-0.5">
                    {new Date().toLocaleDateString('ar-OM', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="inline-block mt-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    معتمد رقمياً ✨
                  </span>
                </div>
              </div>
            </div>

            {/* Print and Close Actions */}
            <div className="flex justify-center gap-3 no-print pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الوثيقة الرسمية فوراً</span>
              </button>
              <button
                onClick={() => setShowCoronation(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors"
              >
                العودة للتحدي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
