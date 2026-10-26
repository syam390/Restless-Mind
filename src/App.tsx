import React, { useState, useEffect } from 'react';
import Header, { AppRoute } from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ToolsPage from './pages/ToolsPage';
import ResourcesPage from './pages/ResourcesPage';
import StoriesPage from './pages/StoriesPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import VolunteerPage from './pages/VolunteerPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { CrisisRegionCode } from './lib/wellbeingLogic';

const VALID_ROUTES: AppRoute[] = [
  '/',
  '/tools',
  '/resources',
  '/stories',
  '/blog',
  '/contact',
  '/volunteer',
  '/privacy',
  '/terms',
];

const STORAGE_THEME_KEY = 'rm_theme_dark_v1';
const STORAGE_REGION_KEY = 'rm_crisis_region_v1';

function parseRoute(pathname: string): AppRoute {
  const clean = pathname.split('?')[0].split('#')[0] || '/';
  return (VALID_ROUTES.includes(clean as AppRoute) ? clean : '/') as AppRoute;
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    parseRoute(window.location.pathname)
  );
  const [querySubject, setQuerySubject] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('subject') || '';
  });
  const [region, setRegion] = useState<CrisisRegionCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REGION_KEY) as CrisisRegionCode | null;
      if (saved && ['IN', 'US', 'UK', 'GLOBAL'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'IN';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_THEME_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(parseRoute(window.location.pathname));
      const params = new URLSearchParams(window.location.search);
      setQuerySubject(params.get('subject') || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, String(darkMode));
    } catch {
      // ignore
    }
  }, [darkMode]);

  const handleRegionChange = (nextRegion: CrisisRegionCode) => {
    setRegion(nextRegion);
    try {
      localStorage.setItem(STORAGE_REGION_KEY, nextRegion);
    } catch {
      // ignore
    }
  };

  const handleNavigate = (target: string) => {
    const [pathWithQuery, hash] = target.split('#');
    const [rawPath, queryStr] = pathWithQuery.split('?');
    const nextRoute = parseRoute(rawPath || '/');

    window.history.pushState({}, '', target);
    setCurrentRoute(nextRoute);

    if (queryStr) {
      const params = new URLSearchParams(queryStr);
      setQuerySubject(params.get('subject') || '');
    } else {
      setQuerySubject('');
    }

    if (hash) {
      window.setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header
        currentPath={currentRoute}
        onNavigate={handleNavigate}
        region={region}
        onRegionChange={handleRegionChange}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
      />

      <main className="flex-1">
        {currentRoute === '/' && (
          <HomePage
            onNavigate={handleNavigate}
            region={region}
            onRegionChange={handleRegionChange}
          />
        )}
        {currentRoute === '/tools' && (
          <ToolsPage region={region} onNavigate={handleNavigate} />
        )}
        {currentRoute === '/resources' && (
          <ResourcesPage onNavigate={handleNavigate} />
        )}
        {currentRoute === '/stories' && (
          <StoriesPage onNavigate={handleNavigate} />
        )}
        {currentRoute === '/blog' && (
          <BlogPage onNavigate={handleNavigate} region={region} />
        )}
        {currentRoute === '/contact' && (
          <ContactPage initialSubject={querySubject} />
        )}
        {currentRoute === '/volunteer' && (
          <VolunteerPage onNavigate={handleNavigate} />
        )}
        {currentRoute === '/privacy' && <PrivacyPage />}
        {currentRoute === '/terms' && <TermsPage />}
      </main>

      <Footer
        onNavigate={handleNavigate}
        region={region}
        onRegionChange={handleRegionChange}
      />
    </div>
  );
}
