import React from 'react';

export const About: React.FC = () => {
  const skills = [
    'JavaScript & TypeScript',
    'Node.js & Express',
    'React & React Native',
    'Flutter & Dart',
    'PHP & MySQL',
    'PostgreSQL',
    'RESTful APIs',
    'Git & GitHub',
    'Problem Solving',
    'Eager to Learn & Adapt',
  ];

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          
          {/* Portrait Card using Steven's standing photo */}
          <div className="about-portrait-card reveal-fade">
            <img src="/pictures/stand-up.jpg" alt="Steven Bartolome standing portrait" />
          </div>

          {/* Text Description */}
          <div className="about-text-content">
            <span className="tag-label reveal-text">About Me</span>
            <h2 className="about-title reveal-text reveal-delay-1">
              BUILDING PRACTICAL APPS, LEARNING FAST, AND GROWING AS A DEVELOPER
            </h2>
            <p className="about-desc reveal-text reveal-delay-2">
              I am Steven Bartolome, an enthusiastic junior developer with a strong foundation in building mobile and web applications. I enjoy creating practical projects, exploring how systems work from frontend to backend, and writing clean, readable code.
            </p>
            <p className="about-desc reveal-text reveal-delay-3">
              As an early-career developer, I am always excited to learn, embrace new technologies, and take on new challenges. I'm eager to collaborate with experienced engineers, receive feedback, and continuously grow into a dependable, well-rounded software developer.
            </p>

            <div className="skills-chip-list reveal-fade reveal-delay-4">
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
