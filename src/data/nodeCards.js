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
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/meet-vaghani-422a78224/', icon: 'LI' },
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
}
