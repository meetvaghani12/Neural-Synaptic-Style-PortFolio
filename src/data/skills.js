// ─────────────────────────────────────────────
//  SKILLS DATA
//  level: 1–5  (1 = beginner, 5 = expert)
// ─────────────────────────────────────────────

export const skills = {
  // Hidden Layer 1 — Frontend  (color: #34d399 green)
  frontend: [
    { id: 'react',      name: 'React.js',     level: 5 },
    { id: 'nextjs',     name: 'Next.js',      level: 5 },
    { id: 'typescript', name: 'TypeScript',   level: 5 },
    { id: 'tailwind',   name: 'Tailwind CSS', level: 4 },
    { id: 'redux',      name: 'Redux',        level: 3 },
    { id: 'threejs',    name: 'Three.js',     level: 3 },
  ],

  // Hidden Layer 2 — Backend + Cloud  (color: #f59e0b amber)
  backend: [
    { id: 'nodejs',    name: 'Node.js',      level: 5 },
    { id: 'python',    name: 'Python',       level: 5 },
    { id: 'express',   name: 'Express.js',   level: 4 },
    { id: 'medusa',    name: 'Medusa.js',    level: 4 },
    { id: 'postgres',  name: 'PostgreSQL',   level: 4 },
    { id: 'aws',       name: 'AWS',          level: 4 },
    { id: 'gcp',       name: 'GCP',          level: 4 },
    { id: 'docker',    name: 'Docker',       level: 4 },
    { id: 'kubernetes',name: 'Kubernetes',   level: 3 },
    { id: 'mongodb',   name: 'MongoDB',      level: 3 },
    { id: 'redis',     name: 'Redis',        level: 3 },
    { id: 'opensearch',name: 'OpenSearch',   level: 4 },
  ],

  // Hidden Layer 3 — AI / ML  (color: #a78bfa purple)
  ai: [
    { id: 'llm',        name: 'LLMs / OpenAI',      level: 4 },
    { id: 'ml',         name: 'Machine Learning',    level: 4 },
    { id: 'tensorflow', name: 'TensorFlow',          level: 3 },
    { id: 'langchain',  name: 'LangChain',           level: 3 },
    { id: 'vectordb',   name: 'Vector DBs',          level: 3 },
    { id: 'nlp',        name: 'NLP',                 level: 3 },
  ],
}
