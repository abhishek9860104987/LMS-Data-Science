import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import SEOHead from '../components/SEOHead';

const LOGIN_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Sign In — Data Science Master',
  description: 'Sign in to your Data Science Master account and continue your learning journey.',
  url: 'https://datasciencemaster.edu/login',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [{
      '@type': 'ListItem', position: 1, name: 'Home', item: 'https://datasciencemaster.edu/'
    }, {
      '@type': 'ListItem', position: 2, name: 'Login', item: 'https://datasciencemaster.edu/login'
    }]
  }
};

const getDarkMode = () => {
  try { return JSON.parse(localStorage.getItem('lms_dark_mode')) ?? true; }
  catch { return true; }
};

const Login = () => {
  const darkMode = getDarkMode();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Sign In — Data Science Master"
        description="Sign in to your Data Science Master account and continue your learning journey in Python, ML, Deep Learning, and more."
        canonicalUrl="https://datasciencemaster.edu/login"
        jsonLd={LOGIN_JSON_LD}
      />
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-[#0f172a]' : 'bg-[#F8FAFC]'}`}>
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-[#1e293b] border border-gray-700' : 'bg-white border border-gray-100'}`}>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Welcome Back</h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign in to continue your learning journey</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30">
            <FiAlertCircle className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                  darkMode 
                    ? 'bg-[#0f172a] border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white'
                }`}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all ${
                  darkMode 
                    ? 'bg-[#0f172a] border-gray-700 text-white focus:border-blue-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white'
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={`mt-8 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Login;
