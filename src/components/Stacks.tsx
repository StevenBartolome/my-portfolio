import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

interface StacksProps {
  onViewAll: () => void;
}

export const Stacks: React.FC<StacksProps> = ({ onViewAll }) => {
  // Front page 10 technologies requested by user
  const frontStacks = [
    'JavaScript',
    'Flutter',
    'Dart',
    'React',
    'React Native',
    'Tailwind CSS',
    'Java',
    'PHP',
    'MySQL',
    'PostgreSQL',
  ];

  return (
    <section className="stacks-section" id="stacks">
      <div className="container">
        
        {/* Monospace Section Header */}
        <div className="stacks-header-row">
          <div className="stacks-title-group">
            <span className="deck-header-num">03 — stacks</span>
            <h2 className="stacks-main-heading">Core Technologies</h2>
          </div>
          <button
            type="button"
            className="deck-header-all"
            onClick={onViewAll}
            title="View complete list of technology stacks"
          >
            <span>VIEW ALL STACKS</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 10 Stacks Chips Grid + More chip */}
        <div className="stacks-front-grid">
          {frontStacks.map((tech) => (
            <div key={tech} className="stack-card-chip">
              <span className="stack-chip-dot" />
              <span className="stack-chip-name">{tech}</span>
            </div>
          ))}

          {/* "+ More" Interactive Chip */}
          <button
            type="button"
            className="stack-card-chip stack-more-chip"
            onClick={onViewAll}
            title="Click to view all stacks"
          >
            <span className="more-count">+ more</span>
            <Layers size={14} />
          </button>
        </div>

        {/* View All Button CTA */}
        <div className="stacks-cta-row">
          <button
            type="button"
            className="btn-view-all-stacks"
            onClick={onViewAll}
          >
            <span>Explore All Stacks & Tools</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
};
