import React from 'react';
import {
  FiCheckCircle,
  FiPlay,
  FiFileText,
  FiBookOpen
} from 'react-icons/fi';

const LessonItem = ({ lesson, isSelected, onSelect, darkMode }) => {
  const isAssignment = lesson.title.toLowerCase().includes('assignment');
  const isReadingMaterial = lesson.lessonType === 'reading' || lesson.type === 'reading' || !!lesson.readingUrl || (lesson.videoUrl && !lesson.videoUrl.includes('youtube.com/embed/'));

  return (
    <button
      id={`lesson-${lesson.id}`}
      aria-label={lesson.title}
      onClick={() => onSelect(lesson)}
      className={`
        lesson-item w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg
        transition-all duration-200 group
        ${
          isSelected
            ? 'active bg-blue-50 dark:bg-blue-900/20'
            : darkMode
            ? 'hover:bg-gray-700/50'
            : 'hover:bg-gray-50'
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-0.5
          transition-colors duration-200
          ${
            isSelected
              ? 'bg-blue-500 text-white'
              : lesson.completed
              ? 'bg-green-100 text-green-600'
              : isReadingMaterial
              ? 'bg-violet-100 text-violet-600'
              : darkMode
              ? 'bg-gray-600 text-gray-400 group-hover:bg-gray-500'
              : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
          }
        `}
      >
        {isAssignment ? (
          <FiFileText size={12} />
        ) : isReadingMaterial ? (
          <FiBookOpen size={12} />
        ) : (
          <FiPlay size={11} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`
            text-xs font-medium leading-snug
            ${
              isSelected
                ? 'text-blue-700 dark:text-blue-300'
                : darkMode
                ? 'text-gray-300 group-hover:text-white'
                : 'text-gray-700 group-hover:text-gray-900'
            }
          `}
        >
          {lesson.title}
        </p>

        <p
          className={`text-[10px] mt-0.5 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          {isReadingMaterial ? 'Reading Material' : lesson.duration}
        </p>
      </div>

      {/* Completed badge */}
      {lesson.completed && (
        <span className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-semibold mt-0.5">
          <FiCheckCircle size={10} />
          Done
        </span>
      )}
    </button>
  );
};

export default LessonItem;