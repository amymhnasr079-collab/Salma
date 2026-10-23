import React from 'react';
import { Volume2, VolumeX, Sparkles, Trophy, Radio, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    const next = soundManager.toggleSound();
    setSoundEnabled(next);
    if (next) soundManager.playWhistle();
  };

  const navItems = [
    { id: 'warmup', label: '1. غرفة النداء والإحماء (Call Room)' },
    { id: 'coreLesson', label: '2. مركز قيادة اللجان والمواصفات' },
    { id: 'threeArena', label: '3. ميدان الرمي 3D والزحف' },
    { id: 'studyAndBook', label: '4. اللائحة الفنية والكتاب' },
    { id: 'finale', label: '5. منصة التتويج والذهب 🥇' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-amber-200/80 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Championship Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveTab('warmup');
              soundManager.playWhistle();
            }}
            className="flex items-center gap-2.5 text-right group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform border border-amber-300">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black text-slate-950 tracking-tight block whitespace-nowrap">
                  بطولة دفع الجلة المدرسية
                </span>
                <span className="bg-red-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shadow-sm">
                  Live
                </span>
              </div>
              <span className="text-xs text-amber-800 font-bold block whitespace-nowrap">
                إشراف: أ. سالمة الحكماني (رئيسة لجنة التحكيم)
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  soundManager.playWhistle();
                }}
                className={`px-3 py-1.5 text-xs xl:text-sm font-black rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Sound toggle + Whistle Test + Finale Trophy) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'كتم أصوات الاستاد والصافرة' : 'تفعيل أصوات الاستاد'}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            aria-label="تبديل الصوت"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('finale');
              soundManager.playCelebration();
            }}
            className="px-3.5 py-2 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-transform hover:scale-105 shadow-md whitespace-nowrap shrink-0 flex items-center gap-1.5 border border-amber-300"
          >
            <Trophy className="w-3.5 h-3.5 text-slate-950" />
            <span>منصة التتويج 🥇</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-100 overflow-x-auto bg-white/90 backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                soundManager.playWhistle();
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
