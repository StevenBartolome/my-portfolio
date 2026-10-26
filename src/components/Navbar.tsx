import React, { useState } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';
import type { ThemeMode } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSetTheme: (theme: ThemeMode) => void;
  onNavigateToStacks?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onSetTheme, onNavigateToStacks }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Projects', href: '#projects' },
    { name: 'Stacks', href: '#stacks', isStacks: true },
    { name: 'GitHub', href: '#github' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="site-header" id="siteHeader">
      <div className="container nav-inner">
        {/* Minimal Monogram Logo (No emoji, no full name text) */}
        <a href="#hero" className="brand-logo-icon" id="brandLogo" aria-label="Home">
          <span className="logo-monogram">SB</span>
        </a>

        {/* Desktop Navigation */}
        <nav>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <a
                  href={link.href}
                  onClick={() => {
                    if (link.isStacks && onNavigateToStacks) {
                      onNavigateToStacks();
                    }
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          {/* Segmented Theme Switcher (Light / Dark) */}
          <div className="theme-segmented-switch" role="group" aria-label="Select Color Theme">
            <button
              type="button"
              className={`theme-segment-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => onSetTheme('light')}
              title="Switch to Light Theme"
              aria-pressed={theme === 'light'}
            >
              <Sun size={14} />
              <span>Light</span>
            </button>
            <button
              type="button"
              className={`theme-segment-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => onSetTheme('dark')}
              title="Switch to Dark Theme"
              aria-pressed={theme === 'dark'}
            >
              <Moon size={14} />
              <span>Dark</span>
            </button>
          </div>

          {/* Contact Pill Button */}
          <a href="#contact" className="btn-pill-contact">
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
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
