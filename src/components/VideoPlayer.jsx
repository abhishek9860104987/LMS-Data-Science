import React, { useState, useEffect } from 'react';
import {
  FiCheckCircle, FiClock, FiChevronLeft, FiChevronRight,
  FiBookOpen, FiCheck, FiExternalLink
} from 'react-icons/fi';

const VideoPlayer = ({
  lesson,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  darkMode,
  onMarkComplete,
  onMarkUnread,
  isCompleted
}) => {
  const [key, setKey] = useState(lesson?.id ?? '');

  // Re-mount iframe / view on lesson change for a clean load
  useEffect(() => {
    setKey(lesson?.id ?? '');
  }, [lesson?.id]);

  if (!lesson) {
    return (
      <div className={`
        flex flex-col items-center justify-center h-80 rounded-2xl
        ${darkMode ? 'bg-gray-800 border border-gray-700/60 text-gray-400' : 'bg-gray-50 border border-gray-200 text-gray-400'}
      `}>
        <FiBookOpen size={40} className="mb-3 opacity-40" />
        <p className="font-medium">Select a lesson to start learning</p>
        <p className="text-sm mt-1 opacity-60">Choose from the course content panel →</p>
      </div>
    );
  }

  const isReadingModule = lesson.lessonType === 'reading' || lesson.type === 'reading' || !!lesson.readingUrl || (lesson.videoUrl && !lesson.videoUrl.includes('youtube.com/embed/'));
  const readingTargetUrl = lesson.readingUrl || lesson.videoUrl;

  // Clean embed URL: strip any existing params, add our params
  const rawUrl  = lesson.videoUrl ? lesson.videoUrl.split('?')[0] : '';
  const embedUrl = rawUrl ? `${rawUrl}?rel=0&modestbranding=1&enablejsapi=1` : '';

  return (
    <div key={key} className="animate-fadeIn flex flex-col gap-5">

      {/* ── Top bar: lesson title + completed badge ── */}
      <div className={`
        flex items-center justify-between gap-3 px-4 py-3 rounded-xl
        ${darkMode ? 'bg-gray-800 border border-gray-700/60' : 'bg-white border border-gray-100'}
        shadow-sm
      `}>
        <div className="flex items-center gap-2 min-w-0">
          {isReadingModule && (
            <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
              Reading Module
            </span>
          )}
          <h2 className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {lesson.title}
          </h2>
        </div>
        {(isCompleted || lesson.completed) && (
          <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <FiCheckCircle size={13} />
            Completed
          </span>
        )}
      </div>

      {/* ── Media Content Area: Video Iframe or Reading Module Card ── */}
      {isReadingModule ? (
        <div className={`
          rounded-2xl p-6 sm:p-10 shadow-xl border flex flex-col items-center justify-center text-center gap-5
          ${darkMode ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-gray-700/60' : 'bg-gradient-to-b from-blue-50/50 to-white border-blue-100'}
        `}>
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
            <FiBookOpen size={32} />
          </div>
          <div className="max-w-xl">
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {lesson.title}
            </h3>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {lesson.description || 'Access the official reading material and documentation for this lesson.'}
            </p>
          </div>
          {readingTargetUrl && (
            <a
              href={readingTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Open Reading Material <FiExternalLink size={16} />
            </a>
          )}
        </div>
      ) : (
        <div className={`
          rounded-2xl overflow-hidden shadow-xl
          ${darkMode ? 'ring-1 ring-gray-700/60' : 'ring-1 ring-gray-200/80'}
        `}>
          <div className="video-responsive">
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* ── Lesson meta + actions ─────────────────── */}
      <div className={`
        rounded-2xl p-4 shadow-sm border
        ${darkMode ? 'bg-gray-800 border-gray-700/60' : 'bg-white border-gray-100'}
      `}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Title + duration + description */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-base mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {lesson.title}
            </h3>
            <div className="flex items-center gap-3 mb-2">
              <span className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <FiClock size={12} />
                {lesson.duration}
              </span>
            </div>
            {lesson.description && (
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {lesson.description}
              </p>
            )}
          </div>

          {/* Action Button: Mark Complete or Mark as Unread */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isCompleted || lesson.completed ? (
              <button
                id={`mark-unread-${lesson.id}`}
                onClick={() => onMarkUnread(lesson.id)}
                className={`flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mark as Unread
              </button>
            ) : (
              <button
                id={`mark-complete-${lesson.id}`}
                onClick={() => onMarkComplete(lesson.id)}
                className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                <FiCheck size={15} />
                Mark Complete
              </button>
            )}
          </div>
        </div>

        {/* ── Navigation buttons ────────────────── */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-dashed"
          style={{ borderColor: darkMode ? 'rgba(75,85,99,0.5)' : 'rgba(229,231,235,0.8)' }}>
          <button
            id="prev-lesson-btn"
            onClick={onPrev}
            disabled={!hasPrev}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-200 active:scale-95
              ${hasPrev
                ? darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed dark:bg-gray-700/50 dark:text-gray-600'
              }
            `}
          >
            <FiChevronLeft size={16} />
            Previous
          </button>

          <button
            id="next-lesson-btn"
            onClick={onNext}
            disabled={!hasNext}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              transition-all duration-200 active:scale-95 shadow-sm
              ${hasNext
                ? 'bg-[#2563EB] hover:bg-blue-700 text-white hover:shadow-md'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed dark:bg-gray-700/50 dark:text-gray-600'
              }
            `}
          >
            Next Lesson
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
