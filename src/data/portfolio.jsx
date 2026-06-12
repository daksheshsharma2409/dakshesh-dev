// Centralised portfolio data — sourced from "Resume-Dakshesh Sharma.pdf"
// Edit values here to update the entire site.

export const profile = {
  name: 'Dakshesh Sharma',
  role: 'Data Scientist & Quantitative Analyst',
  tagline: 'Building intelligent systems at the intersection of data, ML, and finance.',
  location: 'Pune, Maharashtra, India',
  email: 'dakshesh.sharma27@gmail.com',
  phone: '+91 86687 28732',
  availableFor: 'Full-time · Data Science / Quant roles',
  // Replace these with your own links
  social: {
    linkedin: 'https://www.linkedin.com/in/dakshesh-sharma',
    github: 'https://github.com/dakshesh-sharma',
    leetcode: 'https://leetcode.com/dakshesh-sharma',
    email: 'mailto:dakshesh.sharma27@gmail.com',
  },
};

export const education = [
  {
    school: 'Pune Vidyarthi Griha’s College of Engineering and Technology (PVG’s COEP)',
    degree: 'B.E. Computer Engineering (Data Science)',
    period: 'Aug 2022 – Present',
    location: 'Pune, Maharashtra',
    gpa: 'CGPA: 9.27 / 10',
  },
  {
    school: 'Delhi Public School, Nashik',
    degree: 'Class XII — CBSE',
    period: 'Apr 2021 – Mar 2022',
    location: 'Nashik, Maharashtra',
    gpa: 'Percentage: 94.4%',
  },
  {
    school: 'Delhi Public School, Nashik',
    degree: 'Class X — CBSE',
    period: 'Apr 2019 – Mar 2020',
    location: 'Nashik, Maharashtra',
    gpa: 'Percentage: 96.6%',
  },
];

export const experience = [
  {
    company: 'Niqo Robotics',
    role: 'Data Science & Quant Intern',
    period: 'May 2025 – Present',
    location: 'Bengaluru, India',
    description: [
      'Worked on the proprietary "Niqo Score" — a dataset of 100K+ farmers across 100+ Indian districts using telemetry, satellite, and weather data to rank creditworthiness.',
      'Trained and evaluated ML models (XGBoost, Random Forest) on 60+ derived features, benchmarking them against traditional bureau-based scoring.',
      'Performed feature selection and ablation studies; identified the most predictive agronomic, geographic, and behavioural signals for credit risk.',
    ],
    skills: ['Python', 'Pandas', 'scikit-learn', 'XGBoost', 'Feature Engineering', 'Agritech'],
    color: '#c8ff00',
  },
  {
    company: 'Securin',
    companyFull: 'Securin Inc.',
    role: 'Data Science Intern',
    period: 'Jan 2025 – Apr 2025',
    location: 'Remote',
    description: [
      'Conducted cybersecurity research and built threat-intelligence dashboards to surface emerging vulnerabilities, CVEs, and adversary behaviour trends.',
      'Built and automated data pipelines for threat feeds using APIs, regex-based parsers, and scheduled scripts to refresh insights daily.',
      'Authored 2 internal technical blogs translating cybersecurity findings for engineering and product teams.',
    ],
    skills: ['Python', 'Threat Intelligence', 'APIs', 'Dashboards', 'Cybersecurity'],
    color: '#00d4ff',
  },
  {
    company: 'Upraised',
    companyFull: 'Upraised (by Urban Company)',
    role: 'Data Science Fellow',
    period: 'Aug 2024 – Oct 2024',
    location: 'Remote',
    description: [
      'Selected as 1 of 150 fellows (top 5%) from a national pool, chosen for ML aptitude and problem-solving rigour.',
      'Built end-to-end ML case studies: product recommendation systems, churn prediction, and customer-lifetime-value models on real startup data.',
      'Mentored by senior data scientists from Urban Company, Flipkart, and Microsoft through weekly review sessions.',
    ],
    skills: ['ML Case Studies', 'Recommendation Systems', 'CLV', 'Mentorship'],
    color: '#7c3aed',
  },
];

export const projects = [
  {
    id: 'vr-driving-sim',
    title: 'VR Driving Simulator',
    subtitle: 'Unity · C# · Photon Engine',
    description:
      'A full multiplayer VR driving environment with real-time physics, custom shaders, and a synchronised in-sim chat. Built for performance on standalone VR headsets.',
    highlights: [
      'Multiplayer networking over Photon Engine with sub-100ms latency on local sessions',
      'Custom physics for vehicle handling; head-tracking + 6DoF input pipeline',
      'Synchronised in-sim chat with optimised message batching',
    ],
    tags: ['Unity', 'C#', 'VR', 'Photon Engine', 'Shaders'],
    image: '/images/projects/vr-driving-sim.jpg',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
  },
  {
    id: 'crypto-volatility',
    title: 'Cryptocurrency Volatility Predictor',
    subtitle: 'ML · Time-series · Quant',
    description:
      'A machine-learning pipeline that forecasts short-term volatility in the top-50 cryptocurrencies using historical prices, on-chain metrics, and macro indicators.',
    highlights: [
      'Feature-engineered returns, rolling stats, GARCH-style signals, and on-chain metrics',
      'Benchmarked XGBoost, LSTM, and Transformer models with walk-forward validation',
      'Backtested a long-vol / short-vol strategy on the model output (Sharpe 1.8 in test window)',
    ],
    tags: ['Python', 'XGBoost', 'LSTM', 'Quant', 'Backtesting'],
    image: '/images/projects/crypto-volatility.jpg',
    gradient: 'linear-gradient(135deg, #c8ff00 0%, #00d4ff 100%)',
  },
  {
    id: 'landscape-skill-gap',
    title: 'Data Analytics Landscape vs Skill Gap',
    subtitle: 'EDA · Visualisation · Insight',
    description:
      'Mapped the current Indian data-analytics hiring landscape against self-reported student skill proficiency to surface the highest-leverage skills to learn.',
    highlights: [
      'Web-scraped 1,000+ job listings and combined with survey data from 200+ students',
      'Built an interactive Plotly dashboard with skill-demand vs supply heatmaps',
      'Delivered a prioritised "skill gap report" used by peers to plan learning paths',
    ],
    tags: ['Python', 'Pandas', 'Plotly', 'EDA', 'Web Scraping'],
    image: '/images/projects/landscape-skill-gap.jpg',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #c8ff00 100%)',
  },
  {
    id: 'customer-segmentation',
    title: 'Customer Segmentation',
    subtitle: 'Unsupervised · Clustering',
    description:
      'Segmented 100K+ retail customers using RFM analysis and K-Means clustering, then translated segments into targeted retention and reactivation campaigns.',
    highlights: [
      'Computed RFM features and applied log-transform + scaling before clustering',
      'Used the elbow method and silhouette score to choose k=6 optimal segments',
      'Authored segment playbooks that mapped each cluster to a marketing strategy',
    ],
    tags: ['Python', 'K-Means', 'scikit-learn', 'RFM', 'Retail'],
    image: '/images/projects/customer-segmentation.jpg',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #c8ff00 100%)',
  },
  {
    id: 'olympic-analysis',
    title: '120 Years of Olympic History',
    subtitle: 'EDA · Storytelling',
    description:
      'A narrative-driven exploratory analysis of 120 years of Olympic data — athlete demographics, country dominance, sport evolution, and gender trends.',
    highlights: [
      'Cleaned and normalised 270K+ row dataset from Kaggle (athletes + events)',
      'Built multi-page interactive dashboard with cross-filtered country and sport views',
      'Story-driven visualisations on India’s Olympic journey and the rise of women athletes',
    ],
    tags: ['Python', 'Plotly', 'Streamlit', 'Storytelling'],
    image: '/images/projects/olympic-analysis.jpg',
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #c8ff00 100%)',
  },
  {
    id: 'excel-dashboard',
    title: 'Excel Sales Dashboard',
    subtitle: 'Excel · Pivot · BI',
    description:
      'A fully dynamic Excel dashboard for retail sales with slicers, pivot tables, and conditional formatting — designed for non-technical stakeholders.',
    highlights: [
      'Modelled 50K+ row sales dataset with star-schema-style Excel tables',
      'Built KPI cards, regional heatmaps, and YoY growth views with slicer-driven filters',
      'Optimised workbook size and recalc time for use on low-spec laptops',
    ],
    tags: ['Excel', 'Pivot Tables', 'Power Query', 'BI'],
    image: '/images/projects/excel-dashboard.jpg',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #00d4ff 100%)',
  },
];

export const achievements = [
  {
    metric: '99.83',
    suffix: ' %ile',
    label: 'JEE Mains 2022',
    description: 'Top 0.17% nationally among 1M+ candidates.',
    icon: 'trophy',
  },
  {
    metric: '9.27',
    suffix: ' / 10',
    label: 'University CGPA',
    description: 'B.E. Computer Engineering (Data Science).',
    icon: 'graduation',
  },
  {
    metric: '6+',
    suffix: '',
    label: 'ML Projects Shipped',
    description: 'End-to-end pipelines from data to deployment.',
    icon: 'rocket',
  },
  {
    metric: '3',
    suffix: '',
    label: 'Industry Internships',
    description: 'Niqo Robotics · Securin · Upraised.',
    icon: 'briefcase',
  },
];

export const certifications = [
  {
    title: 'Google Advanced Data Analytics',
    issuer: 'Coursera',
    description:
      'Professional certificate covering statistical analysis, regression, ML, and capstone project on real-world business problems.',
    icon: 'google',
    color: '#c8ff00',
  },
  {
    title: 'Data Analysis with Python',
    issuer: 'freeCodeCamp',
    description:
      'Hands-on certification covering NumPy, Pandas, Matplotlib, and Seaborn through 5 real-world data analysis projects.',
    icon: 'python',
    color: '#00d4ff',
  },
  {
    title: 'Algorithms Specialization',
    issuer: 'Stanford · Coursera (Tim Roughgarden)',
    description:
      'Four-course deep dive into divide-and-conquer, graph algorithms, greedy, dynamic programming, and NP-completeness.',
    icon: 'algo',
    color: '#7c3aed',
  },
  {
    title: 'Crash Course on Python',
    issuer: 'Google · Coursera',
    description:
      'Foundational Python certificate covering syntax, data structures, functions, and introductory scripting.',
    icon: 'python',
    color: '#ff6b6b',
  },
  {
    title: 'Certified System Security Analyst',
    issuer: 'Securin',
    description:
      'Internal certification on threat modelling, vulnerability assessment, and security operations workflows.',
    icon: 'shield',
    color: '#c8ff00',
  },
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco · NetAcad',
    description:
      'Entry-level certification on cyber threats, cryptography, network defence, and security operations fundamentals.',
    icon: 'shield',
    color: '#00d4ff',
  },
];

export const skills = {
  'Languages': ['Python', 'C++', 'SQL', 'JavaScript', 'TypeScript'],
  'ML & Data Science': ['scikit-learn', 'XGBoost', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy'],
  'Visualisation': ['Plotly', 'Matplotlib', 'Seaborn', 'Power BI', 'Excel', 'Streamlit'],
  'Tools & Cloud': ['Git', 'Docker', 'Linux', 'AWS', 'Jupyter', 'VS Code'],
  'Domains': ['Time-series', 'Quant Finance', 'NLP', 'Threat Intel', 'Clustering', 'Recommenders'],
};
