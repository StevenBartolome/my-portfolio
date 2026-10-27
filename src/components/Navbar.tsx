import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { ThemeMode } from '../types';

interface NavbarProps {
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onSetTheme?: (theme: ThemeMode) => void;
  onNavigateToStacks?: () => void;
  onNavigateToHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToStacks, onNavigateToHome }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Projects', href: '#projects' },
    { name: 'Stacks', href: '#stacks', isStacks: true },
    { name: 'GitHub', href: '#github' },
    { name: 'What I Do', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (isStacks?: boolean) => {
    setMobileMenuOpen(false);
    if (isStacks && onNavigateToStacks) {
      onNavigateToStacks();
    } else if (onNavigateToHome) {
      onNavigateToHome();
    }
  };

  return (
    <header className="site-header" id="siteHeader">
      <div className="container nav-inner">
        {/* Minimal Monogram Logo (No emoji, no full name text) */}
        <a
          href="#hero"
          className="brand-logo-icon"
          id="brandLogo"
          aria-label="Home"
          onClick={() => onNavigateToHome?.()}
        >
          <span className="logo-monogram">SB</span>
        </a>

        {/* Desktop Navigation */}
        <nav>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <a
                  href={link.href}
                  onClick={() => handleLinkClick(link.isStacks)}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          {/* Contact Pill Button */}
          <a
            href="#contact"
            className="btn-pill-contact"
            onClick={() => onNavigateToHome?.()}
          >
            Contact
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => handleLinkClick(link.isStacks)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
