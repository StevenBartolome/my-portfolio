import React, { useState, useEffect } from 'react';
import { LampPullCord } from './components/LampPullCord';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Stacks } from './components/Stacks';
import { GithubContributions } from './components/GithubContributions';
import { AllStacksView } from './components/AllStacksView';
import { AllProjectsView } from './components/AllProjectsView';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useScrollReveal } from './hooks/useScrollReveal';
import type { ThemeMode } from './types';

export type PageView = 'home' | 'stacks' | 'projects';

export const App: React.FC = () => {
  // Theme state: light or dark mode
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('steven_portfolio_theme') as ThemeMode) || 'light';
  });

  // Page view state: 'home', 'stacks', or 'projects'
  const [currentView, setCurrentView] = useState<PageView>(() => {
    if (window.location.hash === '#/stacks') return 'stacks';
    if (window.location.hash === '#/projects') return 'projects';
    return 'home';
  });

  // Smooth scroll text & element entrance observer
  useScrollReveal(currentView);

  // Sync theme with document element and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('steven_portfolio_theme', theme);
  }, [theme]);

  // Browser navigation history support for Stacks and Projects pages
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/stacks') {
        setCurrentView('stacks');
      } else if (window.location.hash === '#/projects') {
        setCurrentView('projects');
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

  const navigateToProjects = () => {
    window.location.hash = '#/projects';
    setCurrentView('projects');
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
      {/* Interactive Lamp Pull Cord (Physics-driven Rope Theme Switcher) */}
      <LampPullCord
        theme={theme}
        onToggle={toggleTheme}
        onSetTheme={setTheme}
      />

      {/* Top Header Navigation */}
      <Navbar
        onNavigateToStacks={navigateToStacks}
        onNavigateToHome={navigateToHome}
      />

      <main>
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <Hero />

            {/* Interactive Stacked Cards Deck */}
            <Projects onViewAll={navigateToProjects} />

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
        )}

        {currentView === 'stacks' && (
          /* Dedicated All Stacks Page */
          <AllStacksView onBack={navigateToHome} />
        )}

        {currentView === 'projects' && (
          /* Dedicated All Projects Page */
          <AllProjectsView onBack={navigateToHome} />
        )}
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default App;
