import React from 'react';

export const About: React.FC = () => {
  const skills = [
    'Node.js & Express',
    'TypeScript',
    'PostgreSQL & MongoDB',
    'Redis Caching',
    'REST & GraphQL APIs',
    'Microservices Architecture',
    'Docker & CI/CD',
    'AWS & Cloud Infrastructure',
    'Database Optimization',
    'Mobile & Web Backend',
    'System Security & Auth',
  ];

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          
          {/* Portrait Card using Steven's standing photo */}
          <div className="about-portrait-card">
            <img src="/pictures/stand-up.jpg" alt="Steven Bartolome standing portrait" />
            <div className="about-caption-badge">Steven Bartolome • Backend Developer</div>
          </div>

          {/* Text Description */}
          <div className="about-text-content">
            <span className="tag-label">About Me</span>
            <h2 className="about-title">ENGINEERING RELIABLE SYSTEMS, ARCHITECTING SCALABLE CODE</h2>
            <p className="about-desc">
              I am Steven Bartolome, a backend developer specializing in high-performance server architectures, API design, and distributed systems for modern mobile and web applications.
            </p>
            <p className="about-desc">
              My core focus is delivering bulletproof backend infrastructure: low latency database queries, clean microservice communication, robust authentication, and seamless scalability to handle heavy application traffic with 99.9% uptime.
            </p>

            <div className="skills-chip-list">
              {skills.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
