import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch, FiX } from 'react-icons/fi';
import LessonItem from './LessonItem';
import ProgressBar from './ProgressBar';

const CourseContent = ({
  weeks,
  selectedLesson,
  onLessonSelect,
  darkMode,
  completedIds,
  progressData,
  defaultOpenWeekId,
}) => {
  const [expandedWeeks, setExpandedWeeks] = useState([defaultOpenWeekId ?? weeks[0]?.id]);
  const [searchQuery, setSearchQuery]     = useState('');
  const selectedRef = useRef(null);

  // Auto-expand the week containing the newly selected lesson
  useEffect(() => {
    if (!selectedLesson) return;
    for (const week of weeks) {
      if (week.lessons.some(l => l.id === selectedLesson.id)) {
        setExpandedWeeks(prev =>
          prev.includes(week.id) ? prev : [...prev, week.id]
        );
        break;
      }
    }
  }, [selectedLesson, weeks]);

  // Smooth-scroll selected lesson into view
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedLesson]);

  const toggleWeek = (id) => {
    setExpandedWeeks(prev =>
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  // Filter weeks/lessons by search query
  const filteredWeeks = searchQuery
    ? weeks
        .map(week => ({
          ...week,
          lessons: week.lessons.filter(l =>
            l.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter(week => week.lessons.length > 0)
    : weeks;

  // Merge completion state from parent (overrides data file)
  const enrichLesson = (lesson) => ({
    ...lesson,
    completed: completedIds.has(lesson.id) || lesson.completed,
  });

  return (
    <div className={`
      flex flex-col h-full rounded-2xl overflow-hidden
      ${darkMode ? 'bg-gray-800 border border-gray-700/60' : 'bg-white border border-gray-100'}
      shadow-md
    `}>
      {/* ── Panel header ─────────────────────────────── */}
      <div className={`
        px-4 pt-4 pb-3 border-b flex-shrink-0
        ${darkMode ? 'border-gray-700/60' : 'border-gray-100'}
      `}>
        <h2 className={`font-bold text-base mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Course Content
        </h2>

        {/* Search */}
        <div className="relative">
          <FiSearch
            size={14}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
          />
          <input
            id="lesson-search"
            type="text"
            placeholder="Search lessons…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`
              w-full pl-8 pr-8 py-2 text-xs rounded-xl border transition-all duration-200
              ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500/20
            `}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <FiX size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Progress bar ─────────────────────────────── */}
      <div className="px-4 py-3 flex-shrink-0">
        <ProgressBar
          total={progressData.total}
          completed={progressData.completed}
          darkMode={darkMode}
        />
      </div>

      {/* ── Weeks list ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4 space-y-1.5">
        {filteredWeeks.length === 0 && (
          <div className={`text-center py-8 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            No lessons found for "{searchQuery}"
          </div>
        )}

        {filteredWeeks.map(week => {
          const isOpen    = expandedWeeks.includes(week.id);
          const hasActive = week.lessons.some(l => l.id === selectedLesson?.id);
          const weekCompleted = week.lessons.filter(l => completedIds.has(l.id) || l.completed).length;

          return (
            <div
              key={week.id}
              id={`week-${week.id}`}
              className={`
                rounded-xl overflow-hidden border transition-all duration-200
                ${hasActive
                  ? darkMode
                    ? 'border-amber-500/40'
                    : 'border-amber-300/60'
                  : darkMode
                    ? 'border-gray-700/60'
                    : 'border-gray-100'
                }
              `}
            >
              {/* Week header */}
              <button
                onClick={() => toggleWeek(week.id)}
                className={`
                  w-full flex items-center justify-between px-3.5 py-3
                  transition-colors duration-200 text-left
                  ${hasActive
                    ? 'week-active-bg'
                    : darkMode
                      ? 'bg-gray-700/40 hover:bg-gray-700/70'
                      : 'bg-gray-50/80 hover:bg-gray-100/80'
                  }
                `}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`
                    flex-shrink-0 transition-transform duration-200
                    ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                    ${isOpen ? 'rotate-0' : '-rotate-90'}
                  `}>
                    <FiChevronDown size={15} />
                  </div>
                  <span className={`
                    font-semibold text-xs leading-snug truncate
                    ${hasActive
                      ? darkMode ? 'text-amber-300' : 'text-amber-800'
                      : darkMode ? 'text-gray-200' : 'text-gray-800'
                    }
                  `}>
                    {week.title}
                  </span>
                </div>

                {/* Lesson count / progress */}
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {weekCompleted > 0 && (
                    <span className="text-[10px] text-green-600 font-medium">
                      {weekCompleted}/{week.lessons.length}
                    </span>
                  )}
                  <span className={`
                    text-[10px] font-medium px-1.5 py-0.5 rounded-full
                    ${darkMode ? 'bg-gray-600/80 text-gray-300' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {week.lessons.length}
                  </span>
                </div>
              </button>

              {/* Lessons */}
              {isOpen && (
                <div className={`
                  py-1.5 px-1.5 space-y-0.5
                  ${darkMode ? 'bg-gray-800' : 'bg-white'}
                  animate-fadeIn
                `}>
                  {week.lessons.map(lesson => {
                    const enriched = enrichLesson(lesson);
                    const isActive = lesson.id === selectedLesson?.id;
                    return (
                      <div
                        key={lesson.id}
                        ref={isActive ? selectedRef : null}
                      >
                        <LessonItem
                          lesson={enriched}
                          isSelected={isActive}
                          onSelect={onLessonSelect}
                          darkMode={darkMode}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseContent;
