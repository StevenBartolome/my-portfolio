import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { FEATURED_PROJECTS } from '../data/projectsData';

interface ProjectsProps {
  onViewAll?: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onViewAll }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const projects = FEATURED_PROJECTS;
  const total = projects.length;

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

  return (
    <section className="projects-section" id="projects">
      <div className="container">
        
        {/* Monospace Section Header with View All trigger */}
        <div className="projects-deck-header reveal-text">
          <span className="deck-header-num">02 — projects</span>
          <button
            type="button"
            className="deck-header-all"
            onClick={onViewAll}
            title="View complete list of all projects"
          >
            <span>ALL PROJECTS</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Interactive Stacked Cards Deck */}
        <div className="projects-deck-container reveal-fade reveal-delay-2">
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
                  {/* Top Header Row: Logo on left, Category & Number badge on right */}
                  <div className="card-top-row">
                    <div className="card-app-logo-wrap">
                      <img
                        src={project.logoSrc}
                        alt={`${project.title} logo`}
                        className="card-app-logo-img"
                      />
                    </div>

                    <div className="card-header-meta">
                      <span className="card-category-label">{project.badgeCategory}</span>
                      <span className="card-number-badge">{project.number}</span>
                    </div>
                  </div>

                  {/* App Identity & Description */}
                  <div className="card-content-block">
                    <h3
                      className="card-app-title"
                      style={{ color: project.titleColor }}
                    >
                      {project.title}
                    </h3>
                    <h4 className="card-app-subtitle">{project.subtitle}</h4>
                    <p className="card-app-description">{project.description}</p>
                  </div>

                  {/* Actions Row: View Project & Circular GitHub Button */}
                  <div className="card-actions-row">
                    <a
                      href={project.liveUrl || project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card-view-project-btn"
                      onClick={(e) => e.stopPropagation()}
                      title={`View ${project.title}`}
                    >
                      <span>View Project</span>
                      <ArrowUpRight size={16} />
                    </a>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-github-circle-btn"
                        onClick={(e) => e.stopPropagation()}
                        title={`View ${project.title} on GitHub`}
                        aria-label={`View ${project.title} source code on GitHub`}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                      </a>
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
