import React, { useState, useEffect } from 'react';
import {
  FiCheckCircle, FiClock, FiChevronLeft, FiChevronRight,
  FiBookOpen, FiCheck
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

  // Re-mount iframe on lesson change for a clean load
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

  // Clean embed URL: strip any existing params, add our params
  const rawUrl  = lesson.videoUrl.split('?')[0];
  const embedUrl = `${rawUrl}?rel=0&modestbranding=1&enablejsapi=1`;

  return (
    <div key={key} className="animate-fadeIn flex flex-col gap-5">

      {/* ── Top bar: lesson title + completed badge ── */}
      <div className={`
        flex items-center justify-between gap-3 px-4 py-3 rounded-xl
        ${darkMode ? 'bg-gray-800 border border-gray-700/60' : 'bg-white border border-gray-100'}
        shadow-sm
      `}>
        <h2 className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {lesson.title}
        </h2>
        {(isCompleted || lesson.completed) && (
          <span className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <FiCheckCircle size={13} />
            Completed
          </span>
        )}
      </div>

      {/* ── YouTube iframe ────────────────────────── */}
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
