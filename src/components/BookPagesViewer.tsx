import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, BookOpen, ChevronRight, ChevronLeft, Eye } from 'lucide-react';
import { LESSON_INFO } from '../data/lessonData';
import { soundManager } from '../utils/audio';

export const BookPagesViewer: React.FC = () => {
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  const currentPage = LESSON_INFO.bookPages[selectedPageIndex];

  const handleZoomIn = () => {
    soundManager.playClick();
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    soundManager.playClick();
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    soundManager.playClick();
    setZoomLevel(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
              <span className="bg-indigo-100 text-indigo-900 px-2.5 py-0.5 rounded-full font-bold">
                المحطة الخامسة
              </span>
              <span>المصدر التعليمي الرسمي والتوثيق المنهجي</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              صفحات كتاب الرياضة المدرسية الأصلية
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              تصفح الصفحات الثلاث الأصلية (صفحة 22، 23، 24) الصادرة عن وزارة التربية والتعليم مع إمكانية التكبير والتنقل السلس.
            </p>
          </div>

          {/* Page Switcher Tabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
            {LESSON_INFO.bookPages.map((page, idx) => (
              <button
                key={page.pageNumber}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedPageIndex(idx);
                  setZoomLevel(1);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  selectedPageIndex === idx
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                صفحة {page.pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Viewer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Image Container with Controls (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-lg flex flex-col items-center">
          {/* Controls Bar */}
          <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-white text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400">
                {currentPage.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomIn}
                title="تكبير"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                title="تصغير"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                title="إعادة ضبط الحجم"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-slate-400 font-mono">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>

          {/* Book Image */}
          <div className="w-full overflow-auto max-h-[750px] flex justify-center bg-slate-950/50 rounded-2xl p-2 border border-slate-800">
            <img
              src={currentPage.path}
              alt={currentPage.title}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease',
              }}
              className="max-w-full h-auto rounded-xl shadow-2xl object-contain"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Navigation Arrows */}
          <div className="w-full flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
            <button
              disabled={selectedPageIndex === 0}
              onClick={() => {
                soundManager.playClick();
                setSelectedPageIndex((prev) => Math.max(prev - 1, 0));
                setZoomLevel(1);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الصفحة السابقة</span>
            </button>

            <span className="text-xs text-slate-400">
              صفحة {selectedPageIndex + 1} من {LESSON_INFO.bookPages.length}
            </span>

            <button
              disabled={selectedPageIndex === LESSON_INFO.bookPages.length - 1}
              onClick={() => {
                soundManager.playClick();
                setSelectedPageIndex((prev) => Math.min(prev + 1, LESSON_INFO.bookPages.length - 1));
                setZoomLevel(1);
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-2"
            >
              <span>الصفحة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Index & Curriculum Cross-Reference (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>فهرس ومحتويات الصفحة ({currentPage.pageNumber})</span>
            </div>

            <div className="space-y-2">
              {currentPage.sections.map((section, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-800 flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded-md bg-amber-400 text-slate-900 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    {idx + 1}
                  </span>
                  <span>{section}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>ملاحظة هامة:</strong> تم إدراج كافة نصوص وقوانين وأرقام هذه الصفحات الثلاث بالكامل وبدقة متناهية في محطات التطبيق التفاعلي لضمان تجربة تعليمية ممتعة وسهلة الاستيعاب.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
