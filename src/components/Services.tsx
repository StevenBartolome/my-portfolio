import React from 'react';
import { Smartphone, Server, LayoutDashboard } from 'lucide-react';

interface ServiceItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  deliverables: string[];
}

export const Services: React.FC = () => {
  const services: ServiceItem[] = [
    {
      id: 'web-mobile-apps',
      title: 'Web & Mobile Applications',
      icon: <Smartphone size={22} />,
      description:
        'Building responsive web applications and cross-platform mobile apps with clean, intuitive interfaces, reliable state management, and smooth user experiences.',
      deliverables: ['React & React Native', 'Interactive Web & Games', 'TypeScript / JavaScript', 'Clean UI & Responsive UX'],
    },
    {
      id: 'backend-apis',
      title: 'Backend APIs & Databases',
      icon: <Server size={22} />,
      description:
        'Designing structured RESTful APIs, relational databases, secure authentication workflows, and server-side business logic connecting frontends with databases.',
      deliverables: ['Node.js & Express', 'PostgreSQL & MySQL', 'RESTful API Architecture', 'JWT Authentication & Security'],
    },
    {
      id: 'admin-systems',
      title: 'Admin Portals & Management Systems',
      icon: <LayoutDashboard size={22} />,
      description:
        'Creating administrative dashboards, tenant billing platforms, inventory auditing trackers, and smart IoT-assisted tools tailored for operational efficiency.',
      deliverables: ['Custom Admin Portals', 'Tenant & Booking Tracking', 'Inventory & Stock Auditing', 'Logistics & IoT Solutions'],
    },
  ];

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header-block">
          <span className="deck-header-num reveal-text">05 — what i do</span>
          <h2 className="section-title reveal-text reveal-delay-1">WHAT I DO</h2>
          <p className="section-subtitle reveal-text reveal-delay-2">
            Practical software development focused on building dependable mobile apps, full-stack web platforms, backend APIs, and custom operational tools.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, idx) => (
            <div key={service.id} className={`service-card reveal-fade reveal-delay-${idx + 1}`}>
              <div className="service-icon-wrap">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <div className="service-deliverables">
                {service.deliverables.map((item) => (
                  <span key={item} className="service-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
