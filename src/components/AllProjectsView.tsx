import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, ExternalLink, Lock } from 'lucide-react';
import { ALL_PROJECTS_LIST } from '../data/projectsData';

interface AllProjectsViewProps {
  onBack: () => void;
}

export const AllProjectsView: React.FC<AllProjectsViewProps> = ({ onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'featured' | 'mobile-web' | 'admin'>('all');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const filteredProjects = ALL_PROJECTS_LIST.filter((proj) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'featured') return proj.categoryFilter === 'featured';
    if (selectedFilter === 'mobile-web') {
      return proj.categoryFilter === 'mobile-web' || proj.categoryFilter === 'featured';
    }
    if (selectedFilter === 'admin') return proj.categoryFilter === 'admin';
    return true;
  });

  return (
    <div className="all-projects-page">
      <div className="container">
        
        {/* Navigation Back Bar */}
        <div className="all-projects-nav-bar">
          <button
            type="button"
            className="btn-back-home"
            onClick={onBack}
            aria-label="Back to Portfolio Home"
          >
            <ArrowLeft size={18} />
            <span>Back to Portfolio</span>
          </button>
          <span className="deck-header-num">02 — all projects</span>
        </div>

        {/* Page Header */}
        <div className="all-projects-header-block">
          <h1 className="all-projects-main-title reveal-text">PROJECTS & SYSTEMS</h1>
          <p className="all-projects-subtitle reveal-text reveal-delay-1">
            A comprehensive showcase of mobile apps, web systems, blockchain integrations, IoT hardware prototypes, and specialized admin platforms built by Steven.
          </p>

          {/* Filter Pills */}
          <div className="all-projects-filters reveal-fade reveal-delay-2">
            <button
              type="button"
              className={`filter-pill-btn ${selectedFilter === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              All Projects ({ALL_PROJECTS_LIST.length})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${selectedFilter === 'featured' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('featured')}
            >
              Featured (3)
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${selectedFilter === 'mobile-web' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('mobile-web')}
            >
              Mobile & Web
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${selectedFilter === 'admin' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('admin')}
            >
              Admin & Enterprise
            </button>
          </div>
        </div>

        {/* Projects Grid matching Card Design Aesthetic */}
        <div className="all-projects-grid">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-grid-card reveal-fade">
              
              {/* Card Header: Squircle App Logo & Category Badge */}
              <div className="card-top-row">
                <div className="card-app-logo-wrap">
                  <img
                    src={project.logoSrc}
                    alt={`${project.title} icon`}
                    className="card-app-logo-img"
                  />
                </div>

                <div className="card-header-meta">
                  <span className="card-category-label">{project.badgeCategory}</span>
                  <span className="card-number-badge">{project.number}</span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="card-content-block">
                <h2
                  className="card-app-title"
                  style={{ color: project.titleColor }}
                >
                  {project.title}
                </h2>
                <h3 className="card-app-subtitle">{project.subtitle}</h3>
                <p className="card-app-description">{project.description}</p>
              </div>

              {/* Technology Tags */}
              <div className="project-tags-cloud">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag-item">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Card Footer / Actions */}
              <div className="card-actions-row project-card-footer">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-view-project-btn"
                    title={`Open ${project.title}`}
                  >
                    <span>{project.id === 'laro-ng-lahi' ? 'Play Game' : 'View Project'}</span>
                    <ArrowUpRight size={16} />
                  </a>
                ) : project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-view-project-btn"
                    title={`View ${project.title} on GitHub`}
                  >
                    <span>View Repository</span>
                    <ExternalLink size={16} />
                  </a>
                ) : (
                  <div className="card-private-badge">
                    <Lock size={14} />
                    <span>Admin System (Internal)</span>
                  </div>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-github-circle-btn"
                    title={`View ${project.title} code on GitHub`}
                    aria-label={`View ${project.title} code on GitHub`}
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
          ))}
        </div>

        {/* Bottom Back Button */}
        <div className="all-projects-bottom-action">
          <button
            type="button"
            className="btn-back-home"
            onClick={onBack}
          >
            <ArrowLeft size={18} />
            <span>Return to Portfolio</span>
          </button>
        </div>

      </div>
    </div>
  );
};
