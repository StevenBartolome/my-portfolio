import React from 'react';
import { ArrowUp } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-copy">
          © {CURRENT_YEAR} Steven Bartolome. Backend Developer.
        </div>

        <div className="footer-social-links">
          <a href="https://github.com/StevenBartolome" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/mark-steven-bartolome-3ab057441?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://www.instagram.com/steveniee_"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
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
