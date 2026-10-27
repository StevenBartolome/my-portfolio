import React from 'react';
import { BlockPortrait } from './BlockPortrait';

export const Hero: React.FC = () => {
  return (
    <section className="hero-section" id="hero">
      <div className="container hero-container">
        <div className="hero-layout-grid" id="heroGrid">
          
          {/* =================================================================
              LEFT COLUMN: Interactive Blocks Portrait (No badges, no chips)
              ================================================================= */}
          <div className="hero-image-col">
            <BlockPortrait
              imageSrc="/pictures/close-up-nobg.png"
              altText="Steven Bartolome - Backend Developer"
            />
          </div>

          {/* =================================================================
              RIGHT COLUMN: Typography & Social Links with Loading Animations
              ================================================================= */}
          <div className="hero-content-col">
            
            {/* Impact Headline */}
            <div className="hero-headline-group">
              <div className="hero-text-mask">
                <h1 className="hero-title-iam">I AM STEVEN BARTOLOME</h1>
              </div>
              <div className="hero-text-mask">
                <h2 className="hero-title-role">BACKEND DEVELOPER</h2>
              </div>
              <div className="hero-text-mask">
                <div className="hero-spec-tag">Mobile & Web Applications</div>
              </div>
            </div>

            {/* Description */}
            <p className="hero-bio-text">
              Focused on building practical mobile and web applications with clean backend logic, APIs, and databases. Driven by curiosity, continuous learning, and writing reliable code.
            </p>

            {/* Social Links */}
            <div className="hero-social-links">
              <a
                href="https://github.com/StevenBartolome"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-link"
                aria-label="GitHub Profile"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/mark-steven-bartolome-3ab057441?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-link"
                aria-label="LinkedIn Profile"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span>LinkedIn</span>
              </a>

              <a
                href="https://www.instagram.com/steveniee_"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-link"
                aria-label="Instagram Profile"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>Instagram</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

