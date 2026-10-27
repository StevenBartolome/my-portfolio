export interface ProjectItem {
  id: string;
  number: number;
  badgeCategory: string;
  categoryFilter: 'featured' | 'mobile-web' | 'admin' | 'iot-ai' | 'games';
  title: string;
  titleColor: string;
  subtitle: string;
  description: string;
  logoSrc: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  isPrivate?: boolean;
}

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: 'iskolarako',
    number: 1,
    badgeCategory: 'Mobile & Web • Blockchain',
    categoryFilter: 'featured',
    title: 'IskolarAko',
    titleColor: '#2563EB',
    subtitle: 'Blockchain Scholarship Platform',
    description: 'A mobile and web system integrated with blockchain for secure, transparent scholarship disbursement, identity verification, and immutable student records.',
    logoSrc: '/projects/iskolarako-icon.png',
    tags: ['React Native', 'Web App', 'Blockchain', 'Smart Contracts', 'Node.js', 'PostgreSQL'],
    githubUrl: 'https://github.com/StevenBartolome/iskolarako',
    liveUrl: 'https://github.com/StevenBartolome/iskolarako',
  },
  {
    id: 'ani-grow',
    number: 2,
    badgeCategory: 'Poultry & Livestock',
    categoryFilter: 'featured',
    title: 'Ani-Grow',
    titleColor: '#007A3D',
    subtitle: 'Poultry and Livestock Guide',
    description: 'AI-powered poultry and livestock guide with data analytics, IoT weight segregation, automated feed dispenser controls, and real-time farm health insights.',
    logoSrc: '/projects/anigrow-icon.png',
    tags: ['IoT', 'AI / ML', 'Python', 'Mobile App', 'Sensors / ESP32', 'Data Analytics'],
    githubUrl: 'https://github.com/StevenBartolome/Ani-grow-v2',
    liveUrl: 'https://github.com/StevenBartolome/Ani-grow-v2',
  },
  {
    id: 'laro-ng-lahi',
    number: 3,
    badgeCategory: 'Web Game Simulator',
    categoryFilter: 'featured',
    title: 'Laro ng Lahi',
    titleColor: '#E11D48',
    subtitle: 'Filipino Street Games Web Application',
    description: 'An interactive web game application that faithfully simulates traditional Filipino street games like Patintero, Tumbang Preso, and Luksong Baka.',
    logoSrc: '/projects/laro-ng-lahi-icon.png',
    tags: ['JavaScript', 'HTML5 Canvas', 'Web Audio API', 'Render', 'CSS3 Animations'],
    githubUrl: 'https://github.com/StevenBartolome/laro-ng-lahi',
    liveUrl: 'https://laro-ng-lahi.onrender.com',
  },
];

export const ALL_PROJECTS_LIST: ProjectItem[] = [
  ...FEATURED_PROJECTS,
  {
    id: 'internlink',
    number: 4,
    badgeCategory: 'University Portal',
    categoryFilter: 'mobile-web',
    title: 'InternLink',
    titleColor: '#1E40AF',
    subtitle: 'Internship Management System in NU Baliwag',
    description: 'Comprehensive internship tracking and management web system for National University Baliwag, managing student intern progress, endorsements, requirements, and host company evaluations.',
    logoSrc: '/projects/internlink-logo.png',
    tags: ['React', 'Node.js', 'Express', 'MySQL', 'JWT Auth', 'REST API'],
    githubUrl: 'https://github.com/StevenBartolome/InternLink',
    liveUrl: 'https://github.com/StevenBartolome/InternLink',
  },
  {
    id: 'pesowise',
    number: 5,
    badgeCategory: 'FinTech',
    categoryFilter: 'mobile-web',
    title: 'PesoWise',
    titleColor: '#059669',
    subtitle: 'Smart Budgeting Application',
    description: 'Personal finance and budgeting mobile app designed to help users track day-to-day income and expenditures, categorize spending habits, set savings targets, and build disciplined financial habits.',
    logoSrc: '/projects/pesowise-icon.svg',
    tags: ['Mobile App', 'TypeScript', 'State Management', 'Budget Planning', 'Financial Analytics'],
    githubUrl: 'https://github.com/StevenBartolome/PesoWise',
  },
  {
    id: 'palengkego',
    number: 6,
    badgeCategory: 'On-Demand Delivery',
    categoryFilter: 'mobile-web',
    title: 'PalengkeGo',
    titleColor: '#EA580C',
    subtitle: 'Local Palengke On-Demand Delivery',
    description: 'An on-demand marketplace and delivery application (similar to Grab / Foodpanda) built specifically for local wet markets (palengke), connecting community vendors directly with neighborhood households.',
    logoSrc: '/projects/palengkego-icon.svg',
    tags: ['Mobile App', 'Order Dispatch', 'Geolocation', 'Local Commerce', 'Vendor Dashboard'],
    isPrivate: true,
  },
  {
    id: 'jbs-apartment',
    number: 7,
    badgeCategory: 'Property Management',
    categoryFilter: 'admin',
    title: "Jb's Apartment Management",
    titleColor: '#4F46E5',
    subtitle: 'Airbnb & Apartment Tenant Management System',
    description: 'Admin-only property operations portal engineered to centralize Airbnb short-stay bookings, monthly tenant billing cycles, utility tracking, and automated financial collection reports.',
    logoSrc: '/projects/jbs-apartment-icon.svg',
    tags: ['Admin System', 'Booking Management', 'Tenant Billing', 'Lease Records', 'Financial Reports'],
    isPrivate: true,
  },
  {
    id: 'purple-dreams',
    number: 8,
    badgeCategory: 'Enterprise Admin',
    categoryFilter: 'admin',
    title: 'Purple Dreams',
    titleColor: '#9333EA',
    subtitle: 'Inventory Management System',
    description: 'Dedicated administrative inventory and stock management system with real-time stock-in / stock-out logs, low-quantity alerts, supplier purchase logs, and inventory audit metrics.',
    logoSrc: '/projects/purpledreams-icon.svg',
    tags: ['Inventory Control', 'Admin Portal', 'Stock Auditing', 'Reporting', 'Role Access'],
    isPrivate: true,
  },
  {
    id: 'jrb-trucking',
    number: 9,
    badgeCategory: 'Logistics & Fleet',
    categoryFilter: 'admin',
    title: 'JRB Trucking Services',
    titleColor: '#0284C7',
    subtitle: 'Fleet Operations & Trip Management',
    description: 'Fleet logistics and administrative tracking platform for hauling operations, managing trip dispatches, truck maintenance schedules, driver duty logs, and hauling expense accounting.',
    logoSrc: '/projects/jrb-trucking-icon.svg',
    tags: ['Logistics', 'Fleet Management', 'Trip Dispatch', 'Maintenance Tracker', 'Admin Portal'],
    isPrivate: true,
  },
];
