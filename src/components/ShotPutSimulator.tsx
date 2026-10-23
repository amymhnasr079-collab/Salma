import React, { useState } from 'react';
import {
  Ruler,
  Scale,
  CircleDot,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  Maximize2,
  Play,
  RotateCcw,
  Sparkles,
  Volume2
} from 'lucide-react';
import { TECHNICAL_SPECIFICATIONS } from '../data/lessonData';
import { soundManager } from '../utils/audio';

export const ShotPutSimulator: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');
  const [activeHotspot, setActiveHotspot] = useState<string>('stopBoard');
  const [simulationScenario, setSimulationScenario] = useState<number | null>(null);

  const scenarios = [
    {
      id: 1,
      title: "الخروج من النصف الخلفي بعد سقوط الجلة",
      isLegal: true,
      description: "قام المتسابق بدفع الجلة بشكل صحيح واستقرت داخل قطاع الرمي، ثم خرج متزناً من النصف الخلفي للدائرة.",
      judgment: "محاولة صحيحة وقانونية (تُسجل المسافة)",
      rule: "يشترط القانون بقاء المتسابق داخل الدائرة حتى تلمس الجلة الأرض، ثم يخرج من النصف الخلفي المقسم بخطي الامتداد."
    },
    {
      id: 2,
      title: "ملامسة السطح العلوي للوحة الإيقاف",
      isLegal: false,
      description: "أثناء حركة دفع الجلة، لامست قدم اللاعب الحافة العلوية أو الجزء العلوي للوحة الإيقاف البيضاء.",
      judgment: "محاولة ملغاة (خطأ قانوني - Foul)",
      rule: "يمنع لمس الحافة أو السطح العلوي للوحة الإيقاف أو الإطار المعدني أو الأرض خارج الدائرة أثناء الدفع."
    },
    {
      id: 3,
      title: "الاستناد على السطح الداخلي للوحة الإيقاف",
      isLegal: true,
      description: "استندت قدم اللاعب على الجدار الداخلي للوحة الإيقاف البيضاء دون أن تلمس سطحها العلوي.",
      judgment: "محاولة صحيحة وقانونية",
      rule: "يسمح القانون بلمس الجدار الداخلي المقوس للوحة الإيقاف، والخطأ هو لمس السطح العلوي فقط."
    },
    {
      id: 4,
      title: "الخروج من النصف الأمامي للدائرة",
      isLegal: false,
      description: "بعد رمي الجلة بنجاح، مشى اللاعب للأمام وخرج من فوق لوحة الإيقاف أو النصف الأمامي.",
      judgment: "محاولة ملغاة (خطأ قانوني - Foul)",
      rule: "يجب على اللاعب الخروج حصراً من خلف الخط الأبيض الذي ينصف الدائرة عرضياً."
    },
    {
      id: 5,
      title: "سقوط الجلة خارج قطاع الرمي",
      isLegal: false,
      description: "انطلقت الجلة وسقطت خارج خطوط قطاع الرمي المحددة بزاوية القطاع.",
      judgment: "محاولة ملغاة (خطأ قانوني)",
      rule: "يجب أن تهبط الجلة بالكامل داخل خطوط قطاع الرمي المحددة بالميدان."
    }
  ];

  const handleSelectScenario = (index: number) => {
    setSimulationScenario(index);
    if (scenarios[index].isLegal) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-2">
          <span className="bg-sky-100 text-sky-900 px-2.5 py-0.5 rounded-full font-bold">
            المحطة الثانية
          </span>
          <span>المواصفات الفنية والهندسية المعتمدة</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          إدارة مسابقة دفع الجلة والمواصفات القانونية (Putting The Shot)
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          وفقاً للمنهج المدرسي، تنقسم المواصفات الفنية إلى ثلاثة محاور رئيسية: أوزان الجلل، أبعاد دائرة دفع الجلة، ومواصفات لوحة الإيقاف البيضاء.
        </p>
      </div>

      {/* Part 1: Shot Weights (أوزان الجلل) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              أولاً بالمنهج
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              أوزان الجلل القانونية (Shot Weights)
            </h3>
          </div>

          {/* Toggle between Men and Women */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setSelectedGender('men');
                soundManager.playClick();
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                selectedGender === 'men'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جلة الرجال (7.260 كجم)
            </button>
            <button
              onClick={() => {
                setSelectedGender('women');
                soundManager.playClick();
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                selectedGender === 'women'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              جلة الإناث (4 كجم)
            </button>
          </div>
        </div>

        {/* Shot Visualizer Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white text-center flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden">
            {/* Background circular effect */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-64 h-64 rounded-full border-4 border-dashed border-white animate-spin duration-1000" />
            </div>

            {/* Simulated 3D Shot Sphere */}
            <div
              className={`rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center text-white font-mono font-bold border-4 ${
                selectedGender === 'men'
                  ? 'w-36 h-36 bg-gradient-to-tr from-slate-700 via-slate-500 to-slate-200 border-slate-400 shadow-slate-900/80 scale-105'
                  : 'w-28 h-28 bg-gradient-to-tr from-amber-700 via-amber-500 to-amber-200 border-amber-300 shadow-amber-950/80'
              }`}
            >
              <div className="text-center">
                <span className="block text-2xl font-black">
                  {selectedGender === 'men' ? '7.260' : '4.000'}
                </span>
                <span className="text-xs opacity-90">كجم</span>
              </div>
            </div>

            <div className="mt-4 relative z-10">
              <span className="text-xs text-amber-300 font-semibold block">
                {selectedGender === 'men' ? 'وزن الرجال الرسمي' : 'وزن الإناث الرسمي'}
              </span>
              <p className="text-xs text-slate-300 mt-1">
                {selectedGender === 'men'
                  ? '7 كجم و 260 جرام (تعادل 16 رطلاً إنجليزياً)'
                  : '4 كيلوجرامات تماماً معتمدة للمسابقات النسائية والمدرسية'}
              </p>
            </div>
          </div>

          {/* Comparative Specifications Details */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>مقارنة الأوزان القانونية المعتمدة في المنهج:</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    selectedGender === 'men'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-xs block text-slate-500">للرجال</span>
                  <span className="text-lg font-black block font-mono">7.260 كجم</span>
                  <span className="text-xs text-slate-500">7 كجم و 260 جم</span>
                </div>

                <div
                  className={`p-3 rounded-lg border transition-all ${
                    selectedGender === 'women'
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-xs block text-slate-500">للإناث</span>
                  <span className="text-lg font-black block font-mono">4 كجم</span>
                  <span className="text-xs text-slate-500">4 كيلوجرامات</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 leading-relaxed space-y-1">
              <span className="font-bold block">💡 ملحوظة تعليمية مهمة للامتحانات:</span>
              <p>
                يجب كتابة وزن جلة الرجال بدقة (<strong>7.260 كجم</strong>) وليس بالتقريب، أما جلة الإناث فوزنها محدد وصريح بـ (<strong>4 كجم</strong>).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Interactive SVG Field Diagram (دائرة الدفع ولوحة الإيقاف) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="mb-6 pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              ثانياً وثالثاً بالمنهج
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              المخطط التفاعلي لدائرة دفع الجلة ولوحة الإيقاف
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              انقر على أي جزء من الرسم التوضيحي أدناه لاستعراض أبعاده القانونية وتفاصيله المنهجية
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => setActiveHotspot('stopBoard')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeHotspot === 'stopBoard'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              لوحة الإيقاف البيضاء
            </button>
            <button
              onClick={() => setActiveHotspot('circleDiameter')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeHotspot === 'circleDiameter'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              قطر الدائرة (2.135 م)
            </button>
            <button
              onClick={() => setActiveHotspot('metalRim')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeHotspot === 'metalRim'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              الإطار والعمق (2 سم / 6 مم)
            </button>
            <button
              onClick={() => setActiveHotspot('sector')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeHotspot === 'sector'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              قطاع الرمي وخطي الامتداد
            </button>
          </div>
        </div>

        {/* Interactive SVG Arena Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 sm:p-6 text-white flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
            {/* Legend indicators */}
            <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span>مسقط رأسي لميدان دفع الجلة (Top-Down Engineering View)</span>
              <span className="text-amber-400 font-mono">قطر الدائرة: 2.135 م</span>
            </div>

            <svg
              viewBox="0 0 500 420"
              className="w-full max-w-[460px] h-auto drop-shadow-xl select-none"
            >
              <defs>
                {/* Sector landing gradient */}
                <radialGradient id="sectorGrad" cx="50%" cy="80%" r="90%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
                </radialGradient>
                {/* Circle ground texture pattern */}
                <pattern id="concretePattern" width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#334155" />
                  <circle cx="2" cy="2" r="1" fill="#475569" />
                  <circle cx="7" cy="7" r="1" fill="#1e293b" />
                </pattern>
              </defs>

              {/* Tartan / Arena outer field */}
              <rect x="10" y="10" width="480" height="400" rx="16" fill="#1e1e24" />

              {/* Sector Lines & Landing Area */}
              <polygon
                points="250,290 80,20 420,20"
                fill="url(#sectorGrad)"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6,4"
                className="cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  soundManager.playClick();
                  setActiveHotspot('sector');
                }}
              />
              <text x="250" y="80" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">
                قطاع الرمي وسقوط الجلة (34.92°)
              </text>

              {/* Rear Half Divider Line (Extended lines) */}
              <line
                x1="60"
                y1="290"
                x2="440"
                y2="290"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeDasharray="4,2"
              />
              <text x="120" y="315" fill="#94a3b8" fontSize="10">
                منطقة الخروج القانوني (النصف الخلفي)
              </text>

              {/* Outer Metallic Rim Circle */}
              <circle
                cx="250"
                cy="290"
                r="100"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="10"
                className="cursor-pointer hover:stroke-amber-400 transition-colors"
                onClick={() => {
                  soundManager.playClick();
                  setActiveHotspot('metalRim');
                }}
              />

              {/* Inner Circle Floor (Concrete/Asphalt/Tartan) */}
              <circle
                cx="250"
                cy="290"
                r="95"
                fill="url(#concretePattern)"
                className="cursor-pointer"
                onClick={() => {
                  soundManager.playClick();
                  setActiveHotspot('circleDiameter');
                }}
              />

              {/* Diameter Measurement Line */}
              <g
                className="cursor-pointer group"
                onClick={() => {
                  soundManager.playClick();
                  setActiveHotspot('circleDiameter');
                }}
              >
                <line x1="155" y1="290" x2="345" y2="290" stroke="#38bdf8" strokeWidth="2.5" />
                <polygon points="155,290 165,285 165,295" fill="#38bdf8" />
                <polygon points="345,290 335,285 335,295" fill="#38bdf8" />
                <rect x="210" y="278" width="80" height="24" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="250" y="294" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                  2.135 متر
                </text>
              </g>

              {/* Curved White Stop Board (لوحة الإيقاف المقوسة البيضاء) */}
              {/* Radius 95, Top Arc from -60 deg to +60 deg relative to top */}
              <path
                d="M 183,219 A 95 95 0 0 1 317,219 L 325,207 A 108 108 0 0 0 175,207 Z"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="2"
                className={`cursor-pointer transition-all ${
                  activeHotspot === 'stopBoard'
                    ? 'filter drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] stroke-amber-400'
                    : 'hover:opacity-90'
                }`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveHotspot('stopBoard');
                }}
              />

              {/* Label for Stop Board */}
              <g
                className="cursor-pointer"
                onClick={() => {
                  soundManager.playClick();
                  setActiveHotspot('stopBoard');
                }}
              >
                <rect x="180" y="160" width="140" height="26" rx="6" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
                <text x="250" y="177" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
                  لوحة الإيقاف (باللون الأبيض)
                </text>
                <line x1="250" y1="187" x2="250" y2="207" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,2" />
              </g>

              {/* Athlete Standing Position Icon */}
              <circle cx="250" cy="330" r="14" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <text x="250" y="334" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold">
                اللاعب
              </text>
            </svg>

            <span className="text-[11px] text-slate-400 mt-2">
              اضغط على أي جزء من المخطط للتعرف على أدق تفاصيله
            </span>
          </div>

          {/* Details & Specs Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {activeHotspot === 'stopBoard' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-white border-2 border-slate-900" />
                  <h4 className="text-base font-bold text-slate-900">
                    لوحة الإيقاف (Stop Board) - الشكل رقم (1)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تصنع من الخشب أو أي مادة أخرى على شكل قوس بحيث يطابق حدها الداخلي حد الدائرة الداخلي، وتثبت بإحكام بالأرض.
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-medium">الطول من الداخل:</span>
                    <strong className="text-slate-900 font-mono">بين 1.21 و 1.23 متر</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-medium">العرض:</span>
                    <strong className="text-slate-900 font-mono">بين 11.2 و 11.6 سنتيمتر</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-medium">الارتفاع:</span>
                    <strong className="text-slate-900 font-mono">بين 9.8 و 10.2 سنتيمتر</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-white rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-medium">لون الطلاء الإلزامي:</span>
                    <strong className="text-slate-900">تُدهن باللون الأبيض</strong>
                  </div>
                </div>
              </div>
            )}

            {activeHotspot === 'circleDiameter' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <CircleDot className="w-5 h-5 text-sky-600" />
                  <h4 className="text-base font-bold text-slate-900">
                    قطر وأرضية دائرة دفع الجلة
                  </h4>
                </div>
                <div className="p-3 bg-sky-50 rounded-lg border border-sky-100 text-sky-950">
                  <span className="text-xs block text-sky-700">القطر الداخلي القانوني المعتمد:</span>
                  <span className="text-2xl font-black font-mono">2.135 متر</span>
                </div>
                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <p>
                    <strong>مادة الأرضية:</strong> تصنع من الإسمنت أو الإسفلت أو الترتان أو أي مادة قوية غير قابلة للانزلاق لضمان توازن اللاعب أثناء أداء مهارة الدفع.
                  </p>
                  <p>
                    <strong>خط المنتصف:</strong> يقسم الدائرة إلى نصفين (أمامي وخلفي) بطول 75 سم خارج الإطار من كل جانب.
                  </p>
                </div>
              </div>
            )}

            {activeHotspot === 'metalRim' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-amber-600" />
                  <h4 className="text-base font-bold text-slate-900">
                    الإطار المعدني ومستوى الانخفاض
                  </h4>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500 block">سمك الإطار المعدني:</span>
                    <strong className="text-sm text-slate-900">لا يقل عن (6 مم)</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      يصنع من الحديد أو الصلب أو أي مادة معدنية أخرى ويثبت في مستوى سطح الأرض.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <span className="text-xs text-slate-500 block">انخفاض سطح الدائرة:</span>
                    <strong className="text-sm text-slate-900">أقل بمسافة (2 سم)</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      يكون سطح الأرضية بالدائرة أقل من مستوى الإطار المعدني بمسافة 2 سم.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeHotspot === 'sector' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-bold text-slate-900">
                    قطاع الرمي وقواعد احتساب المحاولة
                  </h4>
                </div>
                <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
                  <p>
                    <strong>منطقة الهبوط:</strong> محددة بخطين أبيضين عريضين (قطاع الرمي)، ويجب أن تسقط الجلة داخل حدودهما الداخلية حتى تحتسب المحاولة.
                  </p>
                  <p>
                    <strong>الخروج القانوني:</strong> بعد سقوط الجلة، يجب على اللاعب مغادرة الدائرة من النصف الخلفي حصراً بعد وقفة اتزان واضحة.
                  </p>
                </div>
              </div>
            )}

            {/* Read Specs Aloud Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                soundManager.speakArabic(
                  `دائرة دفع الجلة: قطرها 2.135 متر، تنخفض أرضيتها 2 سم عن الإطار المعدني الذي لا يقل سمكه عن 6 مم. لوحة الإيقاف بيضاء مقوسة طولها بين 1.21 و 1.23 متر، عرضها بين 11.2 و 11.6 سم، وارتفاعها بين 9.8 و 10.2 سم.`
                );
              }}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4 text-slate-600" />
              <span>استمع لملخص الأبعاد بصوت ناطق</span>
            </button>
          </div>
        </div>
      </div>

      {/* Part 3: Interactive Judicial Simulator (حكم المسابقة: مواقف قانونية) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              تطبيق عملي ذكي
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              محاكي حكم المسابقة (القرارات والمواقف التحكيمية)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              اختر أحد المواقف الرياضية أدناه لمعرفة القرار التحكيمي الصحيح والتعليل القانوني المنهجي
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {scenarios.map((sc, index) => {
            const isSelected = simulationScenario === index;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(index)}
                className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? sc.isLegal
                      ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400/20'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-500">موقف رقم {sc.id}</span>
                    {isSelected && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          sc.isLegal
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        {sc.isLegal ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>صحيحة</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>ملغاة</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{sc.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{sc.description}</p>
                </div>

                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-900">
                      الحكم: <span className={sc.isLegal ? 'text-emerald-700' : 'text-rose-700'}>{sc.judgment}</span>
                    </div>
                    <div className="text-slate-600 bg-white/80 p-2 rounded border border-slate-100">
                      <strong>القاعدة القانونية:</strong> {sc.rule}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
