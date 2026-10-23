import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Printer,
  Sparkles,
  Medal,
  ChevronLeft,
  BookOpen,
  Volume2
} from 'lucide-react';
import { QUIZ_QUESTIONS, LESSON_INFO } from '../data/lessonData';
import { soundManager } from '../utils/audio';

export const QuizAndCertificate: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [schoolName, setSchoolName] = useState('');

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;

  // Calculate score
  const score = Object.entries(selectedAnswers).reduce((acc, [qIndex, ansIndex]) => {
    const question = QUIZ_QUESTIONS[Number(qIndex)];
    return question && question.correctIndex === ansIndex ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((score / totalQuestions) * 100);

  const handleSelectOption = (optionIndex: number) => {
    if (showExplanation) return; // Prevent changing after revealing
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
    setShowExplanation(true);

    if (optionIndex === currentQuestion.correctIndex) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    setShowExplanation(false);
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
      soundManager.playCelebration();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleRestartQuiz = () => {
    soundManager.playClick();
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setIsQuizCompleted(false);
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-1">
              <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                المحطة الرابعة
              </span>
              <span>تقييم المخرجات وإصدار شهادة التفوق</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              الاختبار التحصيلي وشهادة التميز
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              أجب عن الأسئلة العشرة الشاملة لجميع معارف الدرس لتحصل على شهادة تفوق موثقة باسمك بإشراف {LESSON_INFO.teacherName}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left font-mono">
              <span className="text-xs text-slate-400 block text-right">التقدم الحالي</span>
              <span className="text-sm font-bold text-slate-900">
                {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full mt-6 overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + (isQuizCompleted ? 1 : 0)) / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>

      {!isQuizCompleted ? (
        /* Question Card */
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-4 border-b border-slate-100">
            <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
              السؤال رقم ({currentQuestionIndex + 1})
            </span>
            <button
              onClick={() => {
                soundManager.playClick();
                soundManager.speakArabic(currentQuestion.question);
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>استمع للسؤال</span>
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === idx;
              const isCorrect = currentQuestion.correctIndex === idx;

              let btnStyle = 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200';
              if (showExplanation) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 text-emerald-950 border-emerald-400 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 text-rose-950 border-rose-400 font-bold';
                } else {
                  btnStyle = 'bg-slate-50 text-slate-400 border-slate-100 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={showExplanation}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between gap-4 text-sm font-medium ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 shrink-0">
                      {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}
                    </span>
                    <span>{option}</span>
                  </div>

                  {showExplanation && (
                    <div>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation Box */}
          {showExplanation && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs sm:text-sm text-amber-950 space-y-2">
              <div className="font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>التعليل التربوي والقانوني:</span>
              </div>
              <p className="leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <span>{currentQuestionIndex + 1 < totalQuestions ? 'السؤال التالي' : 'عرض النتيجة والشهادة'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results & Certificate Container */
        <div className="space-y-8">
          {/* Result Score Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-4 no-print">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mx-auto text-2xl font-black shadow-md">
              <Medal className="w-8 h-8 text-amber-950" />
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              {percentage >= 80 ? 'مبارك! تفوق رياضي باهر' : 'أحسنت! إنجاز تعليمي جيد'}
            </h3>

            <p className="text-sm text-slate-600">
              حصلت على <strong className="text-amber-600 text-base">{score}</strong> من أصل{' '}
              <strong className="text-slate-900 text-base">{totalQuestions}</strong> نقاط، بنسبة نجاح{' '}
              <strong className="text-emerald-600 text-base font-mono">{percentage}%</strong>.
            </p>

            {/* Inputs for student and school name to personalize certificate */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اسم الطالب / الطالبة للشهادة:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="اكتب اسمك الثلاثي هنا..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  اسم المدرسة / الصف:
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="المدرسة أو الصف الدراسي..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة شهادة التميز الرسمية</span>
              </button>

              <button
                onClick={handleRestartQuiz}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الاختبار</span>
              </button>
            </div>
          </div>

          {/* Printable Official Certificate */}
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-amber-50/40 via-white to-amber-50/30 rounded-3xl p-8 sm:p-12 border-8 border-double border-amber-400/60 shadow-xl relative overflow-hidden text-center print:border-amber-600 print:shadow-none print:m-0">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/50" />
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/50" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/50" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/50" />

            {/* Ministry / Header info */}
            <div className="text-xs text-slate-500 font-bold tracking-wider mb-2">
              سلطنة عُمان · وزارة التربية والتعليم · مادة الرياضة المدرسية
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-amber-900 tracking-tight mb-2">
              شهادة إتقان وتفوق رياضي
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-6" />

            <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto mb-6">
              تشهد منصة الدرس التعليمية التفاعلية بأن الطالب/ـة المتميز/ة:
            </p>

            {/* Student Name */}
            <div className="my-4 py-2 border-b-2 border-dashed border-amber-400/80 inline-block min-w-[280px]">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {studentName.trim() || 'اسم الطالب / الطالبة'}
              </span>
            </div>

            {schoolName && (
              <p className="text-xs text-slate-500 font-semibold mb-4">
                مدرسة: {schoolName}
              </p>
            )}

            <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mt-2">
              قد اجتاز/ت بنجاح متفوق جميع المحطات التعليمية والاختبار التحصيلي لدرس:
              <br />
              <strong className="text-slate-900 text-base font-bold">
                "الموضوع الثالث: تنظيم وإدارة مسابقة دفع الجلة (Putting The Shot)"
              </strong>
              <br />
              بدرجة استيعاب: <strong className="text-emerald-700 font-mono text-base">{percentage}%</strong> ({score} من {totalQuestions}).
            </p>

            {/* Signatures & Seal */}
            <div className="mt-10 pt-8 border-t border-amber-200/80 grid grid-cols-2 gap-8 items-end text-right">
              <div>
                <span className="text-xs text-slate-400 block mb-1">إعداد وإشراف المعلمة:</span>
                <span className="text-base font-black text-slate-900 block">
                  {LESSON_INFO.teacherName}
                </span>
                <span className="text-xs text-amber-700 font-medium">معلمة الرياضة المدرسية</span>
              </div>

              <div className="text-left">
                <span className="text-xs text-slate-400 block mb-1">تاريخ الإنجاز:</span>
                <span className="text-sm font-bold text-slate-800 font-mono block">
                  {new Date().toLocaleDateString('ar-OM', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                  معتمد وموثق رقمياً 🏅
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
