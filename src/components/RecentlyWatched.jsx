import React from 'react';
import { FiClock, FiPlay } from 'react-icons/fi';

const RecentlyWatched = ({ history, onSelect, darkMode }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className={`
      rounded-2xl p-4 shadow-sm border
      ${darkMode ? 'bg-gray-800 border-gray-700/60' : 'bg-white border-gray-100'}
    `}>
      <h3 className={`font-bold text-sm mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Recently Watched
      </h3>
      <div className="space-y-2">
        {history.map((lesson, i) => (
          <button
            key={lesson.id}
            id={`recent-${lesson.id}`}
            onClick={() => onSelect(lesson)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
              transition-all duration-200 group
              ${i === 0
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg'
                : darkMode
                  ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }
            `}
          >
            {/* Play icon */}
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
              ${i === 0 ? 'bg-white/20' : darkMode ? 'bg-gray-600' : 'bg-blue-50'}
            `}>
              <FiPlay size={13} className={i === 0 ? 'text-white' : 'text-blue-500'} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${i === 0 ? 'text-white' : ''}`}>
                {i === 0 ? '▶ Continue: ' : ''}{lesson.title}
              </p>
              <p className={`flex items-center gap-1 text-[10px] mt-0.5 ${i === 0 ? 'text-blue-100' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <FiClock size={9} />
                {lesson.duration}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentlyWatched;
