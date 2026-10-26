import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Stacks } from './components/Stacks';
import { GithubContributions } from './components/GithubContributions';
import { AllStacksView } from './components/AllStacksView';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import type { ThemeMode } from './types';

export const App: React.FC = () => {
  // Theme state: light or dark mode
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('steven_portfolio_theme') as ThemeMode) || 'light';
  });

  // Page view state: 'home' or 'stacks'
  const [currentView, setCurrentView] = useState<'home' | 'stacks'>(() => {
    return window.location.hash === '#/stacks' ? 'stacks' : 'home';
  });

  // Sync theme with document element and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('steven_portfolio_theme', theme);
  }, [theme]);

  // Browser navigation history support for Stacks page
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/stacks') {
        setCurrentView('stacks');
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToStacks = () => {
    window.location.hash = '#/stacks';
    setCurrentView('stacks');
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="portfolio-app">
      {/* Top Header Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onSetTheme={setTheme}
        onNavigateToStacks={navigateToStacks}
      />

      <main>
        {currentView === 'home' ? (
          <>
            {/* Hero Section: Clean background, no emojis, left-side photo with pixel blocks */}
            <Hero />

            {/* Interactive Stacked Cards Deck */}
            <Projects />

            {/* Stacks Section (10 front items + more -> View All) */}
            <Stacks onViewAll={navigateToStacks} />

            {/* GitHub Contributions Dot Matrix Panel (Live Synced) */}
            <GithubContributions />

            {/* Services Section */}
            <Services />

            {/* About Section */}
            <About />

            {/* Call to Action Banner */}
            <Contact />
          </>
        ) : (
          /* Dedicated All Stacks Page */
          <AllStacksView onBack={navigateToHome} />
        )}
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default App;

