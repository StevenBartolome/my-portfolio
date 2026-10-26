import React from 'react';
import { Server, Database, Cloud } from 'lucide-react';

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
      id: 'api-architecture',
      title: 'Scalable API Architecture',
      icon: <Server size={22} />,
      description:
        'Designing and implementing high-throughput RESTful and GraphQL APIs engineered for high-concurrency mobile apps and web platforms.',
      deliverables: ['Microservices', 'REST & GraphQL APIs', 'JWT & OAuth Authentication'],
    },
    {
      id: 'database-systems',
      title: 'Database & Cloud Systems',
      icon: <Database size={22} />,
      description:
        'Architecting resilient SQL and NoSQL database schemas, indexing strategies, Redis caching layers, and high-performance querying.',
      deliverables: ['PostgreSQL & MySQL', 'Redis Caching', 'Schema Optimization'],
    },
    {
      id: 'backend-devops',
      title: 'Backend DevOps & Cloud',
      icon: <Cloud size={22} />,
      description:
        'Containerization, automated CI/CD deployment pipelines, serverless functions, and monitoring to maintain rock-solid uptime.',
      deliverables: ['Docker & Kubernetes', 'Cloud Deployment (AWS)', 'Performance Telemetry'],
    },
  ];

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header-block">
          <h2 className="section-title">WHAT I DO</h2>
          <p className="section-subtitle">
            Backend development services engineered to power responsive mobile apps and resilient web systems.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon-wrap">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
