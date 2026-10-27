import React, { useState } from 'react';
import { Mail, Check, Copy, ArrowUpRight } from 'lucide-react';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const EMAIL_ADDRESS = 'marksteven.0211@gmail.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(EMAIL_ADDRESS);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([15, 10, 15]);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2600);
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      handle: 'Mark Steven Bartolome',
      url: 'https://www.linkedin.com/in/mark-steven-bartolome-3ab057441?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      ariaLabel: 'Connect with Mark Steven Bartolome on LinkedIn',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      handle: '@StevenBartolome',
      url: 'https://github.com/StevenBartolome',
      ariaLabel: 'View GitHub Profile and Repositories of Steven Bartolome',
      icon: (
        <svg
          width="22"
          height="22"
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
      ),
    },
    {
      name: 'Instagram',
      handle: '@steveniee_',
      url: 'https://www.instagram.com/steveniee_',
      ariaLabel: 'Follow Steven on Instagram',
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="cta-section" id="contact">
      <div className="container">
        <div className="cta-banner-box">
          <h2 className="cta-title reveal-text">
            CONNECT WITH ME <span className="cta-title-divider">/</span> CONTACT ME
          </h2>

          <p className="cta-subtitle reveal-text reveal-delay-1">
            Whether you have an upcoming project, backend engineering opportunity, or just want to discuss APIs and system architecture, let's connect.
          </p>

          {/* Interactive Direct Email Copy Action */}
          <div className="contact-email-wrapper reveal-fade reveal-delay-2">
            <button
              type="button"
              onClick={handleCopyEmail}
              className={`contact-email-pill ${copied ? 'is-copied' : ''}`}
              aria-label={copied ? 'Email address copied to clipboard' : 'Click to copy email address marksteven.0211@gmail.com'}
              title="Click to copy email address"
            >
              <div className="email-pill-left">
                <div className="email-pill-icon">
                  <Mail size={18} />
                </div>
                <span className="email-pill-address">{EMAIL_ADDRESS}</span>
              </div>

              <div className="email-pill-action">
                <span className="email-pill-status">
                  {copied ? (
                    <>
                      <Check size={15} className="email-status-icon check-pop" />
                      <span className="email-status-text">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} className="email-status-icon" />
                      <span className="email-status-text">Copy</span>
                    </>
                  )}
                </span>
              </div>
            </button>

            {/* Floating confirmation toast with smooth pop animation */}
            {copied && (
              <div className="email-copied-toast" role="status" aria-live="polite">
                <Check size={14} />
                <span>Copied to clipboard</span>
              </div>
            )}
          </div>

          {/* Social Connect Cards Grid */}
          <div className="contact-social-grid reveal-fade reveal-delay-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-card"
                aria-label={social.ariaLabel}
              >
                <div className="social-card-icon-wrap">
                  {social.icon}
                </div>
                <div className="social-card-info">
                  <div className="social-card-name-row">
                    <span className="social-card-name">{social.name}</span>
                    <ArrowUpRight size={16} className="social-card-arrow" />
                  </div>
                  <span className="social-card-handle">{social.handle}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
