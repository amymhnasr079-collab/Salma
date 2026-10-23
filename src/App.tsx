/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { WarmupPriorLearning } from './components/WarmupPriorLearning';
import { CoreLessonHub } from './components/CoreLessonHub';
import { ThreeShotPutArena } from './components/ThreeShotPutArena';
import { FlashcardsView } from './components/FlashcardsView';
import { BookPagesViewer } from './components/BookPagesViewer';
import { GrandFinaleGame } from './components/GrandFinaleGame';
import { LESSON_INFO } from './data/lessonData';
import { soundManager } from './utils/audio';
import { Sparkles, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('warmup');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [studySubTab, setStudySubTab] = useState<'flashcards' | 'textbook'>('flashcards');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/25 to-sky-50/35 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Hero Banner with Atmosphere and Quick Shortcuts */}
      <div className="no-print">
        <HeroBanner onSelectTab={setActiveTab} />
      </div>

      {/* Main Educational Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Navigation Indicator / Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 no-print">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-sm">
            <span>{LESSON_INFO.unit}</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-semibold">{LESSON_INFO.title}</span>
            <span aria-hidden="true">/</span>
            <span className="text-amber-800 font-bold">
              {activeTab === 'warmup' && '1. غرفة النداء والإحماء (Call Room)'}
              {activeTab === 'coreLesson' && '2. مركز قيادة اللجان والمواصفات'}
              {activeTab === 'threeArena' && '3. ميدان الرمي 3D والزحف'}
              {activeTab === 'studyAndBook' && '4. اللائحة الفنية والكتاب المدرسي'}
              {activeTab === 'finale' && '5. منصة التتويج الأولمبية والذهب 🥇'}
            </span>
          </div>

          <div className="text-xs text-amber-900 font-bold bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-300 shadow-sm">
            إعداد المعلمة: {LESSON_INFO.teacherName} ✨
          </div>
        </div>

        {/* Tab 1: Warmup & Prior Learning */}
        {activeTab === 'warmup' && (
          <WarmupPriorLearning onStartCoreLesson={() => setActiveTab('coreLesson')} />
        )}

        {/* Tab 2: Core Lesson Hub (Committees & Specs) */}
        {activeTab === 'coreLesson' && (
          <CoreLessonHub
            onGoTo3DField={() => setActiveTab('threeArena')}
            onGoToFinale={() => setActiveTab('finale')}
          />
        )}

        {/* Tab 3: Interactive 3D Shot Put Stadium Arena & Glide Technique */}
        {activeTab === 'threeArena' && <ThreeShotPutArena />}

        {/* Tab 4: Study Flashcards & Official Textbook Pages */}
        {activeTab === 'studyAndBook' && (
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl p-3 rounded-2xl border border-white/90 shadow-sm flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setStudySubTab('flashcards');
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  studySubTab === 'flashcards'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>بطاقات التقليب الذكية (Flashcards)</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setStudySubTab('textbook');
                }}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                  studySubTab === 'textbook'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4 text-indigo-700" />
                <span>صفحات الكتاب المدرسي الأصلية (22، 23، 24)</span>
              </button>
            </div>

            {studySubTab === 'flashcards' ? <FlashcardsView /> : <BookPagesViewer />}
          </div>
        )}

        {/* Tab 5: Grand Finale Game & Coronation */}
        {activeTab === 'finale' && <GrandFinaleGame />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center sm:text-right">
            <p className="font-bold text-slate-800 text-sm">
              درس: {LESSON_INFO.title} (Putting The Shot)
            </p>
            <p className="text-slate-500 mt-0.5">
              منهاج وزارة التربية والتعليم · الوحدة الثانية: مسابقات الميدان · إعداد وتصميم:{' '}
              <span className="text-amber-700 font-bold">{LESSON_INFO.teacherName}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-medium text-slate-600">
            <button
              onClick={() => {
                setActiveTab('warmup');
                soundManager.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              التمهيد
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setActiveTab('coreLesson');
                soundManager.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              محور الدرس
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setActiveTab('threeArena');
                soundManager.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors"
            >
              الملعب 3D
            </button>
            <span>·</span>
            <button
              onClick={() => {
                setActiveTab('finale');
                soundManager.playClick();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 transition-colors text-amber-700 font-bold"
            >
              عجلة الحظ والتتويج 🏆
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
