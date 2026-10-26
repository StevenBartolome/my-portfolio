import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const email = 'steven.portfolio@example.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="cta-section" id="contact">
      <div className="container">
        <div className="cta-banner-box">
          <h2 className="cta-title">HAVE A PROJECT IN MIND?</h2>
          <p className="cta-subtitle">
            Let's collaborate on your next digital experience. Reach out and let's create something extraordinary together.
          </p>
          <div style={{ display: 'inline-flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={`mailto:${email}`} className="cta-email-btn" id="emailContactBtn">
              <span>Send An Email</span>
              <Mail size={18} />
            </a>
            <button
              onClick={handleCopyEmail}
              className="btn-secondary-action"
              style={{ padding: '16px 28px' }}
            >
              <span>{copied ? 'Email Copied!' : 'Copy Email Address'}</span>
              {copied ? <Check size={18} color="var(--accent-orange)" /> : <Mail size={18} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
