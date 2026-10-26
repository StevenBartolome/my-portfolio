import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-copy">
          © {new Date().getFullYear()} Steven Bartolome. Backend Developer.
        </div>

        <div className="footer-social-links">
          <a href="https://github.com/StevenBartolome" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            Twitter / X
          </a>
        </div>

        <a href="#hero" onClick={scrollToTop} className="back-to-top-btn" id="backToTopBtn">
          <span>Back to Top</span>
          <ArrowUp size={16} />
        </a>
      </div>
    </footer>
  );
};
