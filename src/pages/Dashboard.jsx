import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CourseContent from '../components/CourseContent';
import VideoPlayer from '../components/VideoPlayer';
import RecentlyWatched from '../components/RecentlyWatched';
import CoursesEnrolled from './CoursesEnrolled';
import SEOHead from '../components/SEOHead';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/api';
import {
  courseData,
  getFirstLesson,
  getNextLesson,
  getPreviousLesson,
  getProgress,
} from '../data/courseData';

/* ── helpers ─────────────────────────────────────────────── */
const LS_DARK     = 'lms_dark_mode';
const LS_LESSON   = 'lms_current_lesson';

const loadJSON = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

const Dashboard = () => {
  const { user, token } = useAuth();
  
  /* Dark mode */
  const [darkMode, setDarkMode] = useState(() => loadJSON(LS_DARK, false));

  /* Sidebar collapse */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [activeTab,        setActiveTab]        = useState('Dashboard');

  /* Selected lesson */
  const [selectedLesson, setSelectedLesson] = useState(() => {
    const saved = loadJSON(LS_LESSON, null);
    if (saved) {
      for (const week of courseData.weeks) {
        const found = week.lessons.find(l => l.id === saved.id);
        if (found) return found;
      }
    }
    return getFirstLesson();
  });

  /* Progress states synced with backend */
  const [completedIds, setCompletedIds] = useState(new Set());
  const [watchHistory, setWatchHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [progressLoaded, setProgressLoaded] = useState(false);

  /* ── Fetch progress from API ─────────────────────────────── */
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/progress`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.completedIds) setCompletedIds(new Set(data.completedIds));
      if (data.watchHistory) setWatchHistory(data.watchHistory);
      if (data.bookmarks) setBookmarks(new Set(data.bookmarks));
      setProgressLoaded(true);
    })
    .catch(err => {
      console.error('Failed to load progress', err);
      setProgressLoaded(true);
    });
  }, [token]);

  /* ── Sync progress to API ────────────────────────────────── */
  const syncProgress = useCallback((newCompleted, newHistory) => {
    if (!token) return;
    fetch(`${API_URL}/api/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        completedIds: [...newCompleted],
        watchHistory: newHistory
      })
    }).catch(console.error);
  }, [token]);


  /* ── Toggle Bookmark API ─────────────────────────────────── */
  const handleToggleBookmark = useCallback(async (lessonId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/progress/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lesson_id: lessonId })
      });
      const data = await res.json();
      setBookmarks(prev => {
        const next = new Set(prev);
        if (data.bookmarked) next.add(lessonId);
        else next.delete(lessonId);
        return next;
      });
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  }, [token]);

  /* ── Persist local state ────────────────────────────────── */
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem(LS_DARK, JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (selectedLesson) {
      localStorage.setItem(LS_LESSON, JSON.stringify(selectedLesson));
    }
  }, [selectedLesson]);


  /* ── Lesson selection ───────────────────────────────────── */
  const handleSelectLesson = useCallback((lesson) => {
    if (lesson.videoUrl.includes("geeksforgeeks.org")) {
      window.open(lesson.videoUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setSelectedLesson(lesson);
    setMobileOpen(false);

    setWatchHistory(prev => {
      const filtered = prev.filter(l => l.id !== lesson.id);
      const newHistory = [lesson, ...filtered].slice(0, 5);
      syncProgress(completedIds, newHistory); // sync instantly
      return newHistory;
    });
  }, [completedIds, syncProgress]);

  /* ── Next / Prev navigation ─────────────────────────────── */
  const handleNext = useCallback(() => {
    if (!selectedLesson) return;
    const next = getNextLesson(selectedLesson.id);
    if (next) handleSelectLesson(next);
  }, [selectedLesson, handleSelectLesson]);

  const handlePrev = useCallback(() => {
    if (!selectedLesson) return;
    const prev = getPreviousLesson(selectedLesson.id);
    if (prev) handleSelectLesson(prev);
  }, [selectedLesson, handleSelectLesson]);

  /* ── Mark complete / unread ─────────────────────────────── */
  const handleMarkComplete = useCallback((lessonId) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.add(lessonId);
      syncProgress(next, watchHistory); // sync instantly
      return next;
    });
  }, [watchHistory, syncProgress]);

  const handleMarkUnread = useCallback((lessonId) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.delete(lessonId);
      syncProgress(next, watchHistory); // sync instantly
      return next;
    });
  }, [watchHistory, syncProgress]);

  /* ── Progress calculation ───────────────────────────────── */
  const rawProgress = getProgress();
  let dynamicCompleted = 0;
  courseData.weeks.forEach(week => {
    week.lessons.forEach(l => {
      if (completedIds.has(l.id) || l.completed) dynamicCompleted++;
    });
  });
  const progressData = {
    total: rawProgress.total,
    completed: dynamicCompleted,
    percentage: rawProgress.total > 0 ? Math.round((dynamicCompleted / rawProgress.total) * 100) : 0,
  };

  const hasNext = selectedLesson ? !!getNextLesson(selectedLesson.id) : false;
  const hasPrev = selectedLesson ? !!getPreviousLesson(selectedLesson.id) : false;
  const isCurrentCompleted = selectedLesson
    ? completedIds.has(selectedLesson.id) || selectedLesson.completed
    : false;
  const sidebarW = sidebarCollapsed ? 72 : 256;

  if (!progressLoaded) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 dark:text-white">Loading your progress...</div>;
  }

  /* ── SEO metadata (dynamic based on active lesson) ─────── */
  const seoTitle = selectedLesson
    ? `${selectedLesson.title} — Data Science Master`
    : activeTab === 'Courses Enrolled'
      ? 'Courses Enrolled — Data Science Master'
      : 'Dashboard — Data Science Master';

  const seoDescription = selectedLesson
    ? `Watch: ${selectedLesson.title}. Track your progress through Data Science, Machine Learning, Deep Learning, LLMs, RAG and Agentic AI modules.`
    : 'Access your enrolled Data Science Master courses, track weekly progress, and resume your personalised learning journey.';

  const DASHBOARD_JSON_LD = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Data Science Master',
        url: 'https://datasciencemaster.edu/',
        logo: 'https://datasciencemaster.edu/logo.png',
        description: 'A comprehensive LMS offering Data Science, Machine Learning, Deep Learning, and AI courses.'
      },
      {
        '@type': 'Course',
        name: 'Data Science Master Program',
        description: 'A structured 8-week course covering Python, Machine Learning, Deep Learning, LLMs, RAG, and Agentic AI with hands-on modules and live progress tracking.',
        provider: {
          '@type': 'Organization',
          name: 'Data Science Master',
          url: 'https://datasciencemaster.edu/'
        },
        educationalLevel: 'Beginner to Advanced',
        inLanguage: 'en',
        courseMode: 'online'
      }
    ]
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'} transition-colors duration-300`}>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalUrl="https://datasciencemaster.edu/"
        jsonLd={DASHBOARD_JSON_LD}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        isMobileOpen={mobileOpen}
        setIsMobileOpen={setMobileOpen}
        darkMode={darkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <Header
        isCollapsed={sidebarCollapsed}
        currentLesson={selectedLesson}
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(d => !d)}
      />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: `${sidebarW}px`,
          paddingTop: '72px',
        }}
      >
        {activeTab === 'Courses Enrolled' ? (
          <CoursesEnrolled 
            progressData={progressData} 
            darkMode={darkMode} 
            onOpenDashboard={() => setActiveTab('Dashboard')}
          />
        ) : (
          <>
            <div className="flex h-[calc(100vh-72px)]">
              <main className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 py-5">
                <div className="max-w-4xl mx-auto space-y-5">
                  <VideoPlayer
                    lesson={selectedLesson}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    hasNext={hasNext}
                    hasPrev={hasPrev}
                    darkMode={darkMode}
                    onMarkComplete={handleMarkComplete}
                    onMarkUnread={handleMarkUnread}
                    isCompleted={isCurrentCompleted}
                  />
                  {watchHistory.length > 0 && (
                    <RecentlyWatched
                      history={watchHistory}
                      onSelect={handleSelectLesson}
                      darkMode={darkMode}
                    />
                  )}
                </div>
              </main>
              <aside
                className={`
                  hidden lg:flex flex-col flex-shrink-0
                  w-[340px] xl:w-[380px]
                  border-l h-full
                  ${darkMode ? 'border-gray-700/60' : 'border-gray-200/60'}
                `}
              >
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                  <CourseContent
                    weeks={courseData.weeks}
                    selectedLesson={selectedLesson}
                    onLessonSelect={handleSelectLesson}
                    darkMode={darkMode}
                    completedIds={completedIds}
                    progressData={progressData}
                    defaultOpenWeekId={courseData.weeks[0]?.id}
                  />
                </div>
              </aside>
            </div>
            <div className="lg:hidden px-4 pb-6">
              <CourseContent
                weeks={courseData.weeks}
                selectedLesson={selectedLesson}
                onLessonSelect={handleSelectLesson}
                darkMode={darkMode}
                completedIds={completedIds}
                progressData={progressData}
                defaultOpenWeekId={courseData.weeks[0]?.id}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
