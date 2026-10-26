import React, { useState } from 'react';
import { ArrowRight, Apple, Play } from 'lucide-react';

interface DeckProject {
  id: string;
  badge: string;
  title: string;
  description: string;
  iconBg: string;
  iconSvg: React.ReactNode;
  hasAppStore?: boolean;
  hasGooglePlay?: boolean;
}

export const Projects: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const projects: DeckProject[] = [
    {
      id: 'mayi',
      badge: '#1 PAID TRAVEL APP',
      title: 'Mayi — Travel Buddy',
      description: 'A travel buddy for planning trips and exploring on the go.',
      iconBg: '#59BBEF',
      iconSvg: (
        <svg viewBox="0 0 100 100" width="48" height="48" fill="white">
          <circle cx="50" cy="50" r="38" fill="white" />
          <circle cx="40" cy="48" r="8" fill="#59BBEF" />
          <circle cx="42" cy="46" r="3" fill="white" />
          <circle cx="62" cy="48" r="8" fill="#59BBEF" />
          <circle cx="64" cy="46" r="3" fill="white" />
          <path d="M47 58 Q51 63 55 58" stroke="#F89D28" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      ),
      hasAppStore: true,
      hasGooglePlay: true,
    },
    {
      id: 'kabi',
      badge: '#1 PAID FITNESS APP',
      title: 'Kabi — Gym Companion',
      description: 'A gym companion for tracking workouts and staying consistent.',
      iconBg: '#2C2D35',
      iconSvg: (
        <svg viewBox="0 0 100 100" width="48" height="48" fill="white">
          <path
            d="M30 45 C30 35 40 30 50 30 C60 30 70 35 70 45 C70 58 60 70 50 72 C40 70 30 58 30 45 Z"
            fill="white"
          />
          <circle cx="44" cy="44" r="3" fill="#2C2D35" />
          <circle cx="56" cy="44" r="3" fill="#2C2D35" />
          <path d="M30 38 L22 28 C20 25 24 22 27 24 L35 34 Z" fill="white" />
          <path d="M70 38 L78 28 C80 25 76 22 73 24 L65 34 Z" fill="white" />
        </svg>
      ),
      hasAppStore: true,
      hasGooglePlay: true,
    },
    {
      id: 'budget',
      badge: 'APP STORE HIDDEN GEMS',
      title: 'Budget Tracker',
      description: 'Minimalist expense tracker and automated budget manager.',
      iconBg: '#10B981',
      iconSvg: (
        <svg viewBox="0 0 100 100" width="48" height="48" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="25" y="30" width="50" height="42" rx="10" fill="white" />
          <circle cx="50" cy="51" r="7" fill="#10B981" />
          <path d="M38 30 V24 C38 20 42 16 50 16 C58 16 62 20 62 24 V30" />
        </svg>
      ),
      hasAppStore: true,
      hasGooglePlay: true,
    },
  ];

  // Cycling to the card below when clicked
  const handleCardClick = (clickedIndex: number) => {
    if (clickedIndex === activeIndex) {
      // Go to the card below (next card in stack)
      setActiveIndex((prev) => (prev + 1) % projects.length);
    } else {
      // Bring clicked background card to front
      setActiveIndex(clickedIndex);
    }
  };

  const total = projects.length;

  return (
    <section className="projects-section" id="projects">
      <div className="container">
        
        {/* Minimal Monospace Section Header (Matching Attached Image) */}
        <div className="projects-deck-header">
          <span className="deck-header-num">02 — projects</span>
          <a href="#projects" className="deck-header-all" onClick={(e) => { e.preventDefault(); setActiveIndex((prev) => (prev + 1) % projects.length); }}>
            <span>ALL PROJECTS</span>
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Interactive Stacked Cards Deck */}
        <div className="projects-deck-container">
          <div className="deck-cards-wrapper">
            {projects.map((project, index) => {
              // Calculate position in the 3-card stack relative to activeIndex
              const offset = (index - activeIndex + total) % total;

              let cardClass = 'deck-card';
              if (offset === 0) {
                cardClass += ' deck-card-center'; // In front
              } else if (offset === 1) {
                cardClass += ' deck-card-right'; // Tilted right
              } else {
                cardClass += ' deck-card-left'; // Tilted left
              }

              return (
                <div
                  key={project.id}
                  className={cardClass}
                  onClick={() => handleCardClick(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(index);
                    }
                  }}
                  aria-label={`${project.title}. Click to cycle card.`}
                >
                  {/* Top Pill Tag with Bracket Accents */}
                  <div className="card-top-pill">
                    <span className="bracket-left">&#10094;</span>
                    <span className="badge-text">{project.badge}</span>
                    <span className="bracket-right">&#10095;</span>
                  </div>

                  {/* App Identity Row */}
                  <div className="card-identity-row">
                    <div
                      className="card-app-icon"
                      style={{ backgroundColor: project.iconBg }}
                    >
                      {project.iconSvg}
                    </div>
                    <h3 className="card-app-title">{project.title}</h3>
                  </div>

                  {/* App Description */}
                  <p className="card-app-description">{project.description}</p>

                  {/* App Store & Google Play Pill Buttons */}
                  <div className="card-store-badges">
                    {project.hasAppStore && (
                      <div className="store-pill-btn">
                        <Apple size={16} />
                        <div className="store-text">
                          <span className="store-sub">Download on the</span>
                          <span className="store-name">App Store</span>
                        </div>
                      </div>
                    )}
                    {project.hasGooglePlay && (
                      <div className="store-pill-btn">
                        <Play size={13} fill="currentColor" />
                        <div className="store-text">
                          <span className="store-sub">GET IT ON</span>
                          <span className="store-name">Google Play</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Hint */}
          <div className="deck-interaction-hint">
            <span>Click card to cycle to the card below</span>
          </div>
        </div>

      </div>
    </section>
  );
};
