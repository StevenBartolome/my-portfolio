import React, { useEffect } from 'react';
import { ArrowLeft, Code2, Server, Bot, Wrench } from 'lucide-react';

interface AllStacksViewProps {
  onBack: () => void;
}

export const AllStacksView: React.FC<AllStacksViewProps> = ({ onBack }) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const stackCategories = [
    {
      id: 'frontend',
      title: 'Frontend',
      description: 'Client-side technologies, UI libraries, and reactive frameworks.',
      icon: <Code2 size={20} />,
      items: [
        'JavaScript',
        'TypeScript',
        'React',
        'Tailwind CSS',
        'Styled Components',
        'Vite',
      ],
    },
    {
      id: 'backend',
      title: 'Backend',
      description: 'Server runtimes, relational & NoSQL databases, RESTful APIs, and security protocols.',
      icon: <Server size={20} />,
      items: [
        'Node.js',
        'Python',
        'Java',
        'PHP',
        'FastAPI',
        'PostgreSQL',
        'MySQL',
        'OAuth',
        'JWT',
        'REST',
      ],
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      description: 'Modern LLM APIs, prompt engineering, and AI-accelerated developer environments.',
      icon: <Bot size={20} />,
      items: [
        'OpenAI',
        'Anthropic',
        'Claude Code',
        'Codex',
      ],
    },
    {
      id: 'dev-tools',
      title: 'Developer Tools',
      description: 'Version control systems, code editors, and engineering workflows.',
      icon: <Wrench size={20} />,
      items: [
        'Git',
        'GitHub',
        'VS Code',
        'Discord',
      ],
    },
  ];

  return (
    <div className="all-stacks-page">
      <div className="container">
        
        {/* Navigation Back Bar */}
        <div className="all-stacks-nav-bar">
          <button
            type="button"
            className="btn-back-home"
            onClick={onBack}
            aria-label="Back to Portfolio Home"
          >
            <ArrowLeft size={18} />
            <span>Back to Portfolio</span>
          </button>
          <span className="deck-header-num">03 — all stacks</span>
        </div>

        {/* Page Header */}
        <div className="all-stacks-header-block">
          <h1 className="all-stacks-main-title">TECHNOLOGY STACK</h1>
          <p className="all-stacks-subtitle">
            Comprehensive breakdown of my technical stack across frontend frameworks, backend engines, AI tooling, and developer environments.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="all-stacks-category-grid">
          {stackCategories.map((category) => (
            <div key={category.id} className="stack-category-card">
              <div className="category-card-header">
                <div className="category-icon-box">{category.icon}</div>
                <div className="category-title-wrap">
                  <h2>{category.title}</h2>
                  <span className="category-count-badge">
                    {category.items.length} items
                  </span>
                </div>
              </div>
              <p className="category-description">{category.description}</p>

              <div className="category-items-list">
                {category.items.map((item) => (
                  <div key={item} className="stack-detail-chip">
                    <span className="chip-bullet" />
                    <span className="chip-name">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Back Button */}
        <div className="all-stacks-bottom-action">
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
