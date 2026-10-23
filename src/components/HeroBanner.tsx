import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Volume2,
  ArrowLeft,
  Sparkles,
  Flame,
  Radio,
  Timer,
  Wind,
  Flag,
  Award,
  Zap
} from 'lucide-react';
import { LESSON_INFO } from '../data/lessonData';
import { soundManager } from '../utils/audio';
import heroImage from '../assets/images/shot_put_championship_hero_1792751606383.jpg';

interface HeroBannerProps {
  onSelectTab: (tab: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectTab }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [clockTime, setClockTime] = useState('10:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setClockTime(
        now.toLocaleTimeString('en-GB', { hour12: false })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReadIntro = () => {
    if (isPlayingAudio) {
      soundManager.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = `أهلاً بكم في البث الحي لبطولة مسابقة دفع الجلة المدرسية. إعداد وإشراف رئيسة لجنة التحكيم الأستاذة سالمة الحكماني. استعدوا لدخول الميدان ثلاثي الأبعاد وخوض التحديات والمنافسات!`;
      soundManager.speakArabic(textToRead);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 12000);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white/95 via-amber-50/60 to-sky-50/70 text-slate-900 border-b-2 border-amber-300 shadow-md">
      {/* Stadium Background with Sunny Light Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="مضمار واستاد بطولة دفع الجلة"
          className="w-full h-full object-cover object-center opacity-20 filter brightness-110 contrast-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-white/70 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Live Broadcast Ticker Bar - Light Frosted Glass */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 border border-amber-300/60 backdrop-blur-xl px-4 py-2.5 rounded-2xl mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow animate-pulse">
              <Radio className="w-3.5 h-3.5" />
              <span>بث مباشر من الاستاد</span>
            </span>
            <span className="text-xs font-bold text-slate-800">
              بطولة ألعاب القوى المدرسية 2026 · نهائيات دفع الجلة (Putting The Shot Finals)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-700">
            <div className="flex items-center gap-1">
              <Timer className="w-3.5 h-3.5 text-amber-600" />
              <span>توقيت الاستاد: <strong className="text-slate-900">{clockTime}</strong></span>
            </div>
            <div className="flex items-center gap-1 hidden sm:flex">
              <Wind className="w-3.5 h-3.5 text-emerald-600" />
              <span>الرياح: <strong className="text-emerald-700">0.0 م/ث (قانونية)</strong></span>
            </div>
            <div className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[11px] shadow-sm">
              BIB #2026
            </div>
          </div>
        </div>

        {/* Tournament Jumbotron Headline - Light Translucent */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black text-amber-900 shadow-sm">
              <Trophy className="w-4 h-4 text-amber-700" />
              <span>الوحدة الثانية: مسابقات الميدان · الموضوع الثالث</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight">
              تنظيم وإدارة مسابقة دفع الجلة
              <span className="block text-xl sm:text-2xl lg:text-3xl font-extrabold text-amber-700 mt-2">
                بطولة الميدان الكبرى — إعداد وإشراف: {LESSON_INFO.teacherName}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-white/70 p-4 rounded-2xl border border-white/90 backdrop-blur-md max-w-2xl shadow-sm">
              لتنظيم وإدارة مسابقة دفع الجلة بنجاح باهر على مستوى المدارس أو المناطق التعليمية أو المستوى الدولي، ندخل اليوم قلب المعمعة الرياضية لنستكشف اللجان التسع، ومواصفات الميدان بدقة 2.135م، وخوض منافسة رمي ثلاثية الأبعاد بطريقة الزحف!
            </p>
          </div>

          {/* Electronic Stadium Scoreboard - Light Glassmorphic Style */}
          <div className="lg:col-span-4 bg-white/80 backdrop-blur-xl rounded-3xl p-5 border-2 border-amber-400 shadow-xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2 text-xs">
              <span className="text-amber-800 font-bold flex items-center gap-1.5 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>لوحة المواصفات الميدانية</span>
              </span>
              <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ● الميدان جاهز
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200">
                <span className="text-[10px] text-slate-600 font-sans block">قطر الدائرة</span>
                <span className="text-lg font-black text-slate-900">2.135 م</span>
              </div>
              <div className="bg-amber-50/70 p-2.5 rounded-2xl border border-amber-200">
                <span className="text-[10px] text-slate-600 font-sans block">عمق الأرضية</span>
                <span className="text-lg font-black text-amber-800">2 سم</span>
              </div>
              <div className="bg-rose-50/70 p-2.5 rounded-2xl border border-rose-200">
                <span className="text-[10px] text-slate-600 font-sans block">جلة الإناث</span>
                <span className="text-lg font-black text-rose-700">4.000 كجم</span>
              </div>
              <div className="bg-sky-50/70 p-2.5 rounded-2xl border border-sky-200">
                <span className="text-[10px] text-slate-600 font-sans block">جلة الرجال</span>
                <span className="text-lg font-black text-sky-800">7.260 كجم</span>
              </div>
            </div>

            {/* Referee Flags Preview */}
            <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-[11px] font-sans">
              <span className="text-slate-500 font-medium">رايات التحكيم:</span>
              <div className="flex items-center gap-2 font-bold">
                <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  🏳️ بيضاء (صحيحة)
                </span>
                <span className="text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                  🚩 حمراء (خطأ)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Action Navigation Bar - Light Glassmorphic Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-amber-200/60">
          <button
            onClick={() => {
              soundManager.playWhistle();
              onSelectTab('warmup');
            }}
            className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
          >
            <span>دخول غرفة الإحماء والتعلم القبلي</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              soundManager.playWhistle();
              onSelectTab('threeArena');
            }}
            className="px-5 py-3 bg-white/90 hover:bg-white text-indigo-900 font-black text-sm rounded-2xl transition-all border border-indigo-200 shadow-md flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>ميدان البطولة 3D (اللاعب وطريقة الزحف)</span>
          </button>

          <button
            onClick={() => {
              soundManager.playWhistle();
              onSelectTab('coreLesson');
            }}
            className="px-4 py-3 bg-white/80 hover:bg-white text-slate-800 font-bold text-sm rounded-2xl transition-all border border-slate-200 shadow-sm flex items-center gap-2"
          >
            <span>مركز قيادة اللجان التسع</span>
          </button>

          <button
            onClick={() => {
              soundManager.playCelebration();
              onSelectTab('finale');
            }}
            className="px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-black text-sm rounded-2xl transition-all shadow-md flex items-center gap-2"
          >
            <Trophy className="w-4 h-4 text-yellow-200" />
            <span>منصة التتويج وعجلة الحظ 🏆</span>
          </button>

          <button
            onClick={handleReadIntro}
            className="px-4 py-3 bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 font-bold text-xs sm:text-sm rounded-2xl transition-all border border-slate-200 shadow-sm flex items-center gap-2"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'text-amber-500 animate-pulse' : ''}`} />
            <span>{isPlayingAudio ? 'إيقاف المعلق' : 'استمع للمعلق الرياضي'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
