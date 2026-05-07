// ─────────────────────────────────────────────────────────────
//  INPUT NODE CARD DATA — edit this file to update card content
// ─────────────────────────────────────────────────────────────

export const NODE_CARDS = {
  meet: {
    type: 'identity',
    header: 'IDENTITY NODE',
    avatar: 'MV',
    fields: [
      { label: 'NAME',     value: 'Meet Vaghani' },
      { label: 'ROLE',     value: 'Full Stack Developer' },
      { label: 'FOCUS',    value: 'AI-driven web applications' },
      { label: 'STATUS',   value: 'Open to opportunities', highlight: true },
    ],
    bio: 'Passionate full-stack developer building scalable, AI-driven applications. I work across diverse domains and tech stacks to bring ideas to life.',
    links: [
      { label: 'GitHub',   url: 'https://github.com/meetvaghani',                      icon: 'GH' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/meetvaghani12/', icon: 'LI' },
      { label: 'Twitter',  url: 'https://twitter.com/meetvaghani',                     icon: 'TW' },
    ],
  },

  role: {
    type: 'role',
    header: 'FUNCTION NODE',
    avatar: 'FS',
    fields: [
      { label: 'TITLE',    value: 'Full Stack Developer' },
      { label: 'EXP',      value: '3+ years building' },
      { label: 'STACK',    value: 'React · Node.js · Python · AI' },
      { label: 'DOMAIN',   value: 'Web Dev · ML · Real-time Systems' },
    ],
    bio: 'I specialise in building end-to-end applications — from polished frontends to scalable backends and intelligent AI pipelines.',
    links: [],
  },

  pdeu: {
    type: 'education',
    header: 'EDUCATION NODE',
    avatar: 'PD',
    fields: [
      { label: 'DEGREE',   value: 'B.Tech — Computer Engineering' },
      { label: 'INST',     value: 'Pandit Deendayal Energy University' },
      { label: 'PERIOD',   value: '2021 — 2025' },
      { label: 'LOCATION', value: 'Gandhinagar, India' },
    ],
    bio: 'Specialising in software engineering with a focus on web technologies, algorithms, and machine learning fundamentals.',
    links: [],
  },

  location: {
    type: 'location',
    header: 'ORIGIN NODE',
    avatar: 'IN',
    fields: [
      { label: 'LOCATION', value: 'India' },
      { label: 'TIMEZONE', value: 'IST — UTC +5:30' },
      { label: 'CITY',     value: 'Ahmedabad, Gujarat' },
      { label: 'AVAIL',    value: 'Remote · Freelance · Full-time', highlight: true },
    ],
    bio: 'Based in Ahmedabad, India. Available for remote work globally and open to relocation opportunities.',
    links: [],
  },

  // ── Skill nodes — Frontend ──────────────────────────────────────────────
  react: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'Re',
    fields: [
      { label: 'SKILL',  value: 'React.js' },
      { label: 'LEVEL',  value: '5/5 — Expert' },
      { label: 'LAYER',  value: 'Frontend', highlight: true },
      { label: 'USED IN', value: 'GenMode · HomePraise · School ERP' },
    ],
    bio: 'Primary frontend framework. Component-driven architecture with hooks, context, and performance-optimized rendering across all major projects.',
    links: [],
  },

  nextjs: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'Nx',
    fields: [
      { label: 'SKILL',  value: 'Next.js' },
      { label: 'LEVEL',  value: '5/5 — Expert' },
      { label: 'LAYER',  value: 'Frontend', highlight: true },
      { label: 'USED IN', value: 'HomePraise · Music Tribe · School ERP' },
    ],
    bio: 'Full-stack React framework for SSR, ISR, and API routes. Used for production-grade monorepo architectures and SEO-critical applications.',
    links: [],
  },

  typescript: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'TS',
    fields: [
      { label: 'SKILL',  value: 'TypeScript' },
      { label: 'LEVEL',  value: '5/5 — Expert' },
      { label: 'LAYER',  value: 'Frontend', highlight: true },
      { label: 'USED IN', value: 'School ERP · Music Tribe' },
    ],
    bio: 'Type-safe development across frontend and backend. Strong typing for complex data models, API contracts, and domain logic.',
    links: [],
  },

  tailwind: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'TW',
    fields: [
      { label: 'SKILL',  value: 'Tailwind CSS' },
      { label: 'LEVEL',  value: '4/5 — Advanced' },
      { label: 'LAYER',  value: 'Frontend', highlight: true },
      { label: 'USED IN', value: 'This portfolio · HomePraise' },
    ],
    bio: 'Utility-first CSS framework for rapid, consistent UI development. Custom design systems with responsive layouts and dark mode support.',
    links: [],
  },

  threejs: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: '3D',
    fields: [
      { label: 'SKILL',  value: 'Three.js' },
      { label: 'LEVEL',  value: '3/5 — Intermediate' },
      { label: 'LAYER',  value: 'Frontend', highlight: true },
      { label: 'USED IN', value: 'This neural portfolio' },
    ],
    bio: 'WebGL 3D graphics with React Three Fiber. Custom shaders, instanced meshes, post-processing, and GPU particle systems.',
    links: [],
  },

  // ── Skill nodes — Backend ──────────────────────────────────────────────
  nodejs: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'No',
    fields: [
      { label: 'SKILL',  value: 'Node.js' },
      { label: 'LEVEL',  value: '5/5 — Expert' },
      { label: 'LAYER',  value: 'Backend', highlight: true },
      { label: 'USED IN', value: 'Mayave · Eventopia · APIs' },
    ],
    bio: 'Server-side JavaScript runtime for building scalable APIs, microservices, and real-time systems with event-driven architecture.',
    links: [],
  },

  express: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'Ex',
    fields: [
      { label: 'SKILL',  value: 'Express.js' },
      { label: 'LEVEL',  value: '4/5 — Advanced' },
      { label: 'LAYER',  value: 'Backend', highlight: true },
      { label: 'USED IN', value: 'REST APIs · Middleware stacks' },
    ],
    bio: 'Minimalist Node.js framework for REST APIs. Custom middleware, authentication flows, and request validation pipelines.',
    links: [],
  },

  python: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'Py',
    fields: [
      { label: 'SKILL',  value: 'Python' },
      { label: 'LEVEL',  value: '5/5 — Expert' },
      { label: 'LAYER',  value: 'Backend', highlight: true },
      { label: 'USED IN', value: 'Vedrix · ML pipelines · Django' },
    ],
    bio: 'Primary language for backend services, ML/AI pipelines, NLP processing, and data analysis across multiple production systems.',
    links: [],
  },

  postgres: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'PG',
    fields: [
      { label: 'SKILL',  value: 'PostgreSQL' },
      { label: 'LEVEL',  value: '4/5 — Advanced' },
      { label: 'LAYER',  value: 'Backend', highlight: true },
      { label: 'USED IN', value: 'HomePraise · School ERP · Mayave' },
    ],
    bio: 'Relational database for multi-tenant SaaS, complex queries, and transactional systems. Schema design, indexing, and performance tuning.',
    links: [],
  },

  mongodb: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'MG',
    fields: [
      { label: 'SKILL',  value: 'MongoDB' },
      { label: 'LEVEL',  value: '3/5 — Intermediate' },
      { label: 'LAYER',  value: 'Backend', highlight: true },
      { label: 'USED IN', value: 'Eventopia · Document stores' },
    ],
    bio: 'NoSQL document database for flexible schema design, aggregation pipelines, and rapid prototyping of data-heavy applications.',
    links: [],
  },

  // ── Skill nodes — AI/ML ──────────────────────────────────────────────
  llm: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'AI',
    fields: [
      { label: 'SKILL',  value: 'LLMs / OpenAI' },
      { label: 'LEVEL',  value: '4/5 — Advanced' },
      { label: 'LAYER',  value: 'AI / ML', highlight: true },
      { label: 'USED IN', value: 'GenMode · HomePraise · Vedrix' },
    ],
    bio: 'Large language model integration — prompt engineering, tool-calling, context windows, and production-grade AI pipelines with OpenAI and OpenRouter APIs.',
    links: [],
  },

  langchain: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'LC',
    fields: [
      { label: 'SKILL',  value: 'LangChain' },
      { label: 'LEVEL',  value: '3/5 — Intermediate' },
      { label: 'LAYER',  value: 'AI / ML', highlight: true },
      { label: 'USED IN', value: 'VaghaniGPT · RAG pipelines' },
    ],
    bio: 'LLM orchestration framework for building chains, agents, and retrieval-augmented generation pipelines with memory and tool use.',
    links: [],
  },

  vectordb: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'VD',
    fields: [
      { label: 'SKILL',  value: 'Vector Databases' },
      { label: 'LEVEL',  value: '3/5 — Intermediate' },
      { label: 'LAYER',  value: 'AI / ML', highlight: true },
      { label: 'USED IN', value: 'AnveshaCode · Semantic search' },
    ],
    bio: 'Vector embedding storage and similarity search for semantic code search, document retrieval, and AI-powered recommendation systems.',
    links: [],
  },

  ml: {
    type: 'skill',
    header: 'SKILL NODE',
    avatar: 'ML',
    fields: [
      { label: 'SKILL',  value: 'Machine Learning' },
      { label: 'LEVEL',  value: '4/5 — Advanced' },
      { label: 'LAYER',  value: 'AI / ML', highlight: true },
      { label: 'USED IN', value: 'HomePraise · Vedrix · GenMode' },
    ],
    bio: 'Predictive models, TF-IDF vectorization, sentiment analysis, and classification systems. Applied ML for real-world product features.',
    links: [],
  },

  // ── Project nodes ─────────────────────────────────────────────────────────
  vedrix: {
    type: 'project',
    header: 'PROJECT NODE',
    avatar: 'VX',
    fields: [
      { label: 'TITLE', value: 'Vedrix' },
      { label: 'YEAR',  value: '2024' },
      { label: 'STACK', value: 'Django · Python · NLP · LLMs · TF-IDF' },
      { label: 'TYPE',  value: 'Plagiarism Detection', highlight: true },
    ],
    bio: 'Enterprise academic plagiarism detection platform — document parsing for PDF/Word up to 50MB, Google Search API for web matching, and TF-IDF vectorization delivering 90% accuracy.',
    links: [{ label: 'GitHub', url: 'https://github.com/meetvaghani12', icon: 'GH' }],
  },

  homepraise: {
    type: 'project',
    header: 'PROJECT NODE',
    avatar: 'HP',
    fields: [
      { label: 'TITLE', value: 'HomePraise' },
      { label: 'YEAR',  value: '2025' },
      { label: 'STACK', value: 'Next.js · ML · LLMs · PostgreSQL · Stripe' },
      { label: 'TYPE',  value: 'Real Estate SaaS', highlight: true },
    ],
    bio: 'Full-stack real estate SaaS with ML models for predictive property valuation (92% accuracy), LLM-powered content generation, and microservices managing 500+ listings.',
    links: [{ label: 'GitHub', url: 'https://github.com/meetvaghani12/HomePraise', icon: 'GH' }],
  },

  genmode: {
    type: 'project',
    header: 'PROJECT NODE',
    avatar: 'GM',
    fields: [
      { label: 'TITLE', value: 'GenMode' },
      { label: 'YEAR',  value: '2024' },
      { label: 'STACK', value: 'React · OpenRouter · ML · Supabase' },
      { label: 'TYPE',  value: 'AI Translator', highlight: true },
    ],
    bio: 'AI-powered Gen-Z translator with persona-based ML models (TikToker, Meme Lord, BookTok Queen), sentiment analysis, and 95% translation accuracy.',
    links: [{ label: 'GitHub', url: 'https://github.com/meetvaghani12', icon: 'GH' }],
  },

  mayave: {
    type: 'project',
    header: 'PROJECT NODE',
    avatar: 'MY',
    fields: [
      { label: 'TITLE', value: 'Mayave' },
      { label: 'YEAR',  value: '2026' },
      { label: 'STACK', value: 'Medusa.js · PostgreSQL · OpenSearch · Node.js' },
      { label: 'TYPE',  value: 'Diamond E-commerce', highlight: true },
    ],
    bio: 'Scalable diamond e-commerce backend with queue-driven ERP data ingestion, OpenSearch for advanced search, and Strapi CMS for content delivery.',
    links: [{ label: 'GitHub', url: 'https://github.com/meetvaghani12', icon: 'GH' }],
  },

  musictribe: {
    type: 'project',
    header: 'PROJECT NODE',
    avatar: 'MT',
    fields: [
      { label: 'TITLE', value: 'Music Tribe' },
      { label: 'YEAR',  value: '2026' },
      { label: 'STACK', value: 'Next.js · OpenSearch · Strapi · Medusa.js · GCP' },
      { label: 'TYPE',  value: 'Enterprise Monorepo', highlight: true },
    ],
    bio: 'Monorepo powering 12+ brand websites with SSR/ISR/CSR, headless CMS + commerce stack, and a 35TB cloud migration with 60% deduplication across 5.6M+ files.',
    links: [{ label: 'GitHub', url: 'https://github.com/meetvaghani12', icon: 'GH' }],
  },

  schoolerp: {
    type: 'project',
    header: 'PROJECT NODE',
    avatar: 'SE',
    fields: [
      { label: 'TITLE', value: 'School ERP' },
      { label: 'YEAR',  value: '2025' },
      { label: 'STACK', value: 'Next.js · TypeScript · PostgreSQL · RBAC' },
      { label: 'TYPE',  value: 'Multi-tenant SaaS', highlight: true },
    ],
    bio: 'Multi-tenant School ERP SaaS with modules for attendance, fees, transport, and communication. Role-based auth and custom subdomain routing per tenant.',
    links: [{ label: 'GitHub', url: 'https://github.com/meetvaghani12', icon: 'GH' }],
  },

  // ── Experience nodes ───────────────────────────────────────────────────────
  'exp-woosong': {
    type: 'experience',
    header: 'EXPERIENCE NODE',
    avatar: 'WU',
    fields: [
      { label: 'ROLE',    value: 'Research Intern' },
      { label: 'ORG',     value: 'Woosong University' },
      { label: 'YEAR',    value: '2024' },
      { label: 'LOC',     value: 'South Korea', highlight: true },
    ],
    bio: 'Research on "Application of AI and ML in Smart Buildings" — intelligent automation, energy optimization, and sensor-driven systems.',
    links: [],
  },

  'exp-superior': {
    type: 'experience',
    header: 'EXPERIENCE NODE',
    avatar: 'SE',
    fields: [
      { label: 'ROLE',    value: 'Full Stack Dev Intern' },
      { label: 'ORG',     value: 'Superior Exports Ltd' },
      { label: 'YEAR',    value: '2024' },
      { label: 'LOC',     value: 'Hong Kong', highlight: true },
    ],
    bio: 'Built a full-stack web application for an international company using React and Node.js, handling end-to-end feature delivery.',
    links: [],
  },

  'exp-apparrow': {
    type: 'experience',
    header: 'EXPERIENCE NODE',
    avatar: 'AP',
    fields: [
      { label: 'ROLE',    value: 'Software Engineer' },
      { label: 'ORG',     value: 'Apparrow Infotech' },
      { label: 'YEAR',    value: '2025' },
      { label: 'STACK',   value: 'Next.js · TypeScript · PostgreSQL', highlight: true },
    ],
    bio: 'Building a scalable multi-tenant School ERP with fine-grained RBAC, domain isolation, and performance-focused system design.',
    links: [],
  },

  'exp-devx': {
    type: 'experience',
    header: 'EXPERIENCE NODE',
    avatar: 'DX',
    fields: [
      { label: 'ROLE',    value: 'SDE' },
      { label: 'ORG',     value: 'DevX AI Labs' },
      { label: 'YEAR',    value: '2026' },
      { label: 'FOCUS',   value: 'AI-enabled Systems', highlight: true },
    ],
    bio: 'Designing and developing scalable AI-enabled software systems with strong emphasis on performance, reliability, and architectural excellence.',
    links: [],
  },
}
