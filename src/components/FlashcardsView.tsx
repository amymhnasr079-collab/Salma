import React, { useState } from 'react';
import { RotateCw, Check, Sparkles, BookOpen, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Flashcard {
  id: number;
  category: 'لجان' | 'أبعاد' | 'أوزان' | 'قوانين';
  question: string;
  answer: string;
  hint: string;
}

const FLASHCARDS_DATA: Flashcard[] = [
  {
    id: 1,
    category: 'أوزان',
    question: "كم يبلغ الوزن القانوني لجلة الرجال في المسابقات الرسمية؟",
    answer: "7.260 كجم (7 كجم و 260 جرام / يعادل 16 رطلاً).",
    hint: "تذكر أن الرقم يحتوي على كسور بالجرامات بدقة."
  },
  {
    id: 2,
    category: 'أوزان',
    question: "كم يبلغ الوزن القانوني لجلة الإناث في المسابقات؟",
    answer: "4 كجم تماماً.",
    hint: "رقم صحيح بدون كسور."
  },
  {
    id: 3,
    category: 'أبعاد',
    question: "ما هو القطر الداخلي لدائرة دفع الجلة؟",
    answer: "2.135 متر.",
    hint: "متران وثلاثة عشر سنتيمتراً ونصف."
  },
  {
    id: 4,
    category: 'أبعاد',
    question: "كم يقل سطح أرضية الدائرة عن مستوى الإطار المعدني؟",
    answer: "بمسافة (2 سم).",
    hint: "انخفاض بسيط لسلامة وثبات قدم اللاعب."
  },
  {
    id: 5,
    category: 'أبعاد',
    question: "ما هو أقل سمك مسموح به للإطار المعدني المحيط بالدائرة؟",
    answer: "لا يقل عن (6 مم).",
    hint: "يقاس بالملليمترات وليس السنتيمترات."
  },
  {
    id: 6,
    category: 'أبعاد',
    question: "ما هي أبعاد لوحة الإيقاف (Stop Board) المعتمدة؟",
    answer: "الطول الداخلي: 1.21 إلى 1.23 م، العرض: 11.2 إلى 11.6 سم، الارتفاع: 9.8 إلى 10.2 سم.",
    hint: "ثلاثة قياسات: طول بالمتر، وعرض وارتفاع بالسنتيمتر."
  },
  {
    id: 7,
    category: 'أبعاد',
    question: "بأي لون يجب أن تُدهن لوحة الإيقاف؟",
    answer: "باللون الأبيض حصراً.",
    hint: "لون ناصع يسهل رؤيته للحكام والجمهور."
  },
  {
    id: 8,
    category: 'لجان',
    question: "ما هي اللجنة المسؤولة عن 'فحص الأدوات والمعدات وتعيين الحكام'؟",
    answer: "اللجنة الفنية.",
    hint: "اللجنة المتخصصة بكل الجوانب القانونية والفنية."
  },
  {
    id: 9,
    category: 'لجان',
    question: "ما هي اللجنة المسؤولة عن 'إعداد الميداليات والهدايا والشهادات وطابور العرض'؟",
    answer: "لجنة المراسم وتوزيع الجوائز.",
    hint: "تختص بحفلي الافتتاح والختام والتتويج."
  },
  {
    id: 10,
    category: 'لجان',
    question: "ما هي اللجنة المسؤولة عن 'إعداد شعار البطولة وتسجيل أسماء المشاركين'؟",
    answer: "لجنة التنسيق (اللجنة رقم 1).",
    hint: "اللجنة التي تنسق بين كافة اللجان وتضع الجدول الزمني."
  },
  {
    id: 11,
    category: 'لجان',
    question: "ما هي اللجنة المسؤولة عن 'إعداد معمل لفحوصات المنشطات في البطولات الدولية'؟",
    answer: "اللجنة الصحية (اللجنة رقم 9).",
    hint: "معنية بالرعاية الطبية والإسعاف والعلاج الطبيعي."
  },
  {
    id: 12,
    category: 'قوانين',
    question: "من أي جهة يجب على المتسابق الخروج من الدائرة بعد الرمية المحتسبة؟",
    answer: "من النصف الخلفي للدائرة بعد استقرار الجلة على الأرض.",
    hint: "الخروج من النصف الأمامي يعتبر خطأ وتلغى المحاولة فوراً."
  }
];

export const FlashcardsView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('الكل');
  const [masteredCards, setMasteredCards] = useState<number[]>([]);

  const filteredCards = FLASHCARDS_DATA.filter((card) => {
    if (selectedFilter === 'الكل') return true;
    return card.category === selectedFilter;
  });

  const currentCard = filteredCards[currentIndex] || filteredCards[0];
  const isMastered = currentCard ? masteredCards.includes(currentCard.id) : false;

  const handleFlip = () => {
    soundManager.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    soundManager.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    soundManager.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const toggleMastered = () => {
    soundManager.playCorrect();
    setMasteredCards((prev) =>
      prev.includes(currentCard.id)
        ? prev.filter((id) => id !== currentCard.id)
        : [...prev, currentCard.id]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
              <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
                المحطة الثالثة
              </span>
              <span>بطاقات المراجعة الذكية للحقائق والأرقام</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              بطاقات التقليب التفاعلية (Flashcards)
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              طريقة تفاعلية ممتازة لتثبيت المعلومات، وحفظ الأرقام القياسية ومهام اللجان قبل الامتحانات.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">البطاقات المُتقنة:</span>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
              {masteredCards.length} من {FLASHCARDS_DATA.length}
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto pb-1">
          {['الكل', 'أوزان', 'أبعاد', 'لجان', 'قوانين'].map((category) => (
            <button
              key={category}
              onClick={() => {
                soundManager.playClick();
                setSelectedFilter(category);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedFilter === category
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Interactive Stage */}
      {filteredCards.length > 0 && currentCard && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div
            onClick={handleFlip}
            className="cursor-pointer perspective min-h-[300px] w-full relative"
          >
            <div
              className={`w-full h-full min-h-[300px] rounded-3xl p-8 border text-right transition-all duration-300 shadow-md flex flex-col justify-between ${
                isFlipped
                  ? 'bg-slate-900 text-white border-amber-400/50'
                  : 'bg-white text-slate-900 border-slate-200 hover:border-amber-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isFlipped
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  تصنيف: {currentCard.category}
                </span>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>
                    بطاقة {currentIndex + 1} من {filteredCards.length}
                  </span>
                  <RotateCw className="w-4 h-4 text-amber-500 animate-pulse" />
                </div>
              </div>

              {/* Card Body */}
              <div className="py-8 text-center">
                {!isFlipped ? (
                  <div className="space-y-4">
                    <span className="text-xs text-amber-600 font-bold block">السؤال (انقر لقلب البطاقة ومعرفة الإجابة)</span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                      {currentCard.question}
                    </h3>
                    <p className="text-xs text-slate-400">💡 تلميح: {currentCard.hint}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <span className="text-xs text-emerald-400 font-bold block">الإجابة المنهجية المعتمدة ✅</span>
                    <h3 className="text-xl sm:text-2xl font-black text-amber-300 leading-snug">
                      {currentCard.answer}
                    </h3>
                  </div>
                )}
              </div>

              {/* Card Footer Bar */}
              <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-200/40">
                <span className="text-xs opacity-75">
                  {isFlipped ? 'انقر للعودة للسؤال' : 'انقر لكشف الإجابة'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playClick();
                    soundManager.speakArabic(isFlipped ? currentCard.answer : currentCard.question);
                  }}
                  className="flex items-center gap-1 opacity-80 hover:opacity-100 p-1"
                  title="استماع صوتي"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>استماع</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation and Mastery Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-sm transition-colors flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              <span>البطاقة السابقة</span>
            </button>

            <button
              onClick={toggleMastered}
              className={`px-4 py-2 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 ${
                isMastered
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isMastered ? 'تم إتقانها ✅' : 'تحديد كـ "مُتقنة"'}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center gap-2"
            >
              <span>البطاقة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
