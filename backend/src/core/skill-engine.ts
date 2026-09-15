// =============================================================================
// SKILL ENGINE - Deterministic Source of Truth
// =============================================================================
// The Skill Engine is the SINGLE SOURCE OF TRUTH for:
// - Skills and their prerequisites
// - Free learning resources
// - Mini projects with acceptance criteria
//
// AI (Gemini) does NOT invent skills, prerequisites, or resources.
// AI only explains and personalizes what the Skill Engine provides.
// =============================================================================

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  prerequisites: string[]; // skill IDs
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Resource {
  id: string;
  skillId: string;
  title: string;
  provider: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'documentation';
  durationMinutes: number;
  language: string;
  isFree: boolean;
  isMobileFriendly: boolean;
}

export interface Project {
  id: string;
  skillId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  acceptanceCriteria: string[];
  starterHint: string;
}

// =============================================================================
// SKILL GRAPH - Frontend Development Path
// =============================================================================

const SKILLS: Skill[] = [
  {
    id: 'html-basics',
    name: 'HTML Basics',
    slug: 'html-basics',
    description: 'Learn the structure of web pages using HTML tags and elements',
    category: 'Frontend',
    prerequisites: [],
    estimatedHours: 8,
    difficulty: 'beginner',
  },
  {
    id: 'css-basics',
    name: 'CSS Basics',
    slug: 'css-basics',
    description: 'Style web pages with colors, layouts, and responsive design',
    category: 'Frontend',
    prerequisites: ['html-basics'],
    estimatedHours: 12,
    difficulty: 'beginner',
  },
  {
    id: 'javascript-fundamentals',
    name: 'JavaScript Fundamentals',
    slug: 'javascript-fundamentals',
    description: 'Add interactivity with variables, functions, loops, and DOM manipulation',
    category: 'Frontend',
    prerequisites: ['html-basics', 'css-basics'],
    estimatedHours: 25,
    difficulty: 'beginner',
  },
  {
    id: 'git-github',
    name: 'Git & GitHub',
    slug: 'git-github',
    description: 'Version control and collaboration using Git and GitHub',
    category: 'Tools',
    prerequisites: [],
    estimatedHours: 6,
    difficulty: 'beginner',
  },
  {
    id: 'responsive-design',
    name: 'Responsive Web Design',
    slug: 'responsive-design',
    description: 'Build websites that work on all screen sizes using flexbox and grid',
    category: 'Frontend',
    prerequisites: ['css-basics'],
    estimatedHours: 10,
    difficulty: 'intermediate',
  },
  {
    id: 'react-basics',
    name: 'React Basics',
    slug: 'react-basics',
    description: 'Build interactive UIs with components, props, and state',
    category: 'Frontend',
    prerequisites: ['javascript-fundamentals'],
    estimatedHours: 30,
    difficulty: 'intermediate',
  },
  {
    id: 'nodejs-basics',
    name: 'Node.js Basics',
    slug: 'nodejs-basics',
    description: 'Run JavaScript on the server, handle files and HTTP requests',
    category: 'Backend',
    prerequisites: ['javascript-fundamentals'],
    estimatedHours: 15,
    difficulty: 'intermediate',
  },
  {
    id: 'express-api',
    name: 'Express & REST APIs',
    slug: 'express-api',
    description: 'Build backend APIs with Express.js, routing, and middleware',
    category: 'Backend',
    prerequisites: ['nodejs-basics'],
    estimatedHours: 20,
    difficulty: 'intermediate',
  },
  {
    id: 'mongodb-basics',
    name: 'MongoDB Basics',
    slug: 'mongodb-basics',
    description: 'Store and query data with MongoDB, a NoSQL database',
    category: 'Backend',
    prerequisites: ['express-api'],
    estimatedHours: 15,
    difficulty: 'intermediate',
  },
  // Python & Data Skills
  {
    id: 'python-basics',
    name: 'Python Basics',
    slug: 'python-basics',
    description: 'Learn Python programming fundamentals - variables, functions, loops, and data structures',
    category: 'Programming',
    prerequisites: [],
    estimatedHours: 20,
    difficulty: 'beginner',
  },
  {
    id: 'sql-fundamentals',
    name: 'SQL Fundamentals',
    slug: 'sql-fundamentals',
    description: 'Query databases with SQL - SELECT, JOIN, GROUP BY, and data manipulation',
    category: 'Data',
    prerequisites: [],
    estimatedHours: 15,
    difficulty: 'beginner',
  },
  {
    id: 'data-analysis-pandas',
    name: 'Data Analysis with Pandas',
    slug: 'data-analysis-pandas',
    description: 'Analyze and manipulate data using Python Pandas library',
    category: 'Data',
    prerequisites: ['python-basics'],
    estimatedHours: 20,
    difficulty: 'intermediate',
  },
  {
    id: 'data-visualization',
    name: 'Data Visualization',
    slug: 'data-visualization',
    description: 'Create charts and dashboards with Matplotlib, Seaborn, and Plotly',
    category: 'Data',
    prerequisites: ['data-analysis-pandas'],
    estimatedHours: 15,
    difficulty: 'intermediate',
  },
  // DevOps Skills
  {
    id: 'linux-basics',
    name: 'Linux Command Line',
    slug: 'linux-basics',
    description: 'Navigate and manage Linux systems using the terminal',
    category: 'DevOps',
    prerequisites: [],
    estimatedHours: 10,
    difficulty: 'beginner',
  },
  {
    id: 'docker-basics',
    name: 'Docker Basics',
    slug: 'docker-basics',
    description: 'Containerize applications with Docker for consistent deployments',
    category: 'DevOps',
    prerequisites: ['linux-basics'],
    estimatedHours: 12,
    difficulty: 'intermediate',
  },
  {
    id: 'ci-cd-basics',
    name: 'CI/CD with GitHub Actions',
    slug: 'ci-cd-basics',
    description: 'Automate testing and deployment with continuous integration pipelines',
    category: 'DevOps',
    prerequisites: ['git-github', 'docker-basics'],
    estimatedHours: 10,
    difficulty: 'intermediate',
  },
  {
    id: 'cloud-basics',
    name: 'Cloud Fundamentals (AWS)',
    slug: 'cloud-basics',
    description: 'Deploy applications on AWS - EC2, S3, and basic cloud services',
    category: 'DevOps',
    prerequisites: ['docker-basics'],
    estimatedHours: 20,
    difficulty: 'intermediate',
  },
  // Mobile Development
  {
    id: 'react-native-basics',
    name: 'React Native Basics',
    slug: 'react-native-basics',
    description: 'Build cross-platform mobile apps with React Native',
    category: 'Mobile',
    prerequisites: ['react-basics'],
    estimatedHours: 25,
    difficulty: 'intermediate',
  },
  {
    id: 'mobile-ui-ux',
    name: 'Mobile UI/UX Design',
    slug: 'mobile-ui-ux',
    description: 'Design intuitive mobile interfaces and user experiences',
    category: 'Mobile',
    prerequisites: [],
    estimatedHours: 12,
    difficulty: 'beginner',
  },
  // AI/ML Skills
  {
    id: 'ml-fundamentals',
    name: 'Machine Learning Fundamentals',
    slug: 'ml-fundamentals',
    description: 'Understand ML concepts - regression, classification, and model evaluation',
    category: 'AI/ML',
    prerequisites: ['python-basics', 'data-analysis-pandas'],
    estimatedHours: 30,
    difficulty: 'intermediate',
  },
  {
    id: 'ai-apis',
    name: 'AI APIs (OpenAI, Claude)',
    slug: 'ai-apis',
    description: 'Integrate AI capabilities using OpenAI and Anthropic APIs',
    category: 'AI/ML',
    prerequisites: ['python-basics'],
    estimatedHours: 10,
    difficulty: 'intermediate',
  },
];

// =============================================================================
// CURATED FREE RESOURCES
// =============================================================================

const RESOURCES: Resource[] = [
  // HTML - Multiple resources
  {
    id: 'res-html-mdn',
    skillId: 'html-basics',
    title: 'HTML Basics - MDN Web Docs',
    provider: 'MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics',
    type: 'documentation',
    durationMinutes: 60,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-html-fcc',
    skillId: 'html-basics',
    title: 'Learn HTML - freeCodeCamp',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/#learn-html-by-building-a-cat-photo-app',
    type: 'course',
    durationMinutes: 180,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-html-yt-traversy',
    skillId: 'html-basics',
    title: 'HTML Crash Course For Absolute Beginners',
    provider: 'Traversy Media',
    url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
    type: 'video',
    durationMinutes: 60,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-html-yt-brocode',
    skillId: 'html-basics',
    title: 'HTML Full Course for Beginners',
    provider: 'Bro Code',
    url: 'https://www.youtube.com/watch?v=HD13eq_Pmp8',
    type: 'video',
    durationMinutes: 120,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // CSS - Multiple resources
  {
    id: 'res-css-mdn',
    skillId: 'css-basics',
    title: 'CSS First Steps - MDN Web Docs',
    provider: 'MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps',
    type: 'documentation',
    durationMinutes: 120,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-css-fcc',
    skillId: 'css-basics',
    title: 'Learn CSS - freeCodeCamp',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/#learn-basic-css-by-building-a-cafe-menu',
    type: 'course',
    durationMinutes: 240,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-css-yt-traversy',
    skillId: 'css-basics',
    title: 'CSS Crash Course For Absolute Beginners',
    provider: 'Traversy Media',
    url: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
    type: 'video',
    durationMinutes: 85,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-css-yt-kevin',
    skillId: 'css-basics',
    title: 'Learn CSS in 20 Minutes',
    provider: 'Web Dev Simplified',
    url: 'https://www.youtube.com/watch?v=1PnVor36_40',
    type: 'video',
    durationMinutes: 23,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // JavaScript - Multiple resources
  {
    id: 'res-js-fcc',
    skillId: 'javascript-fundamentals',
    title: 'JavaScript Algorithms and Data Structures',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
    type: 'course',
    durationMinutes: 600,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-js-javascript-info',
    skillId: 'javascript-fundamentals',
    title: 'The Modern JavaScript Tutorial',
    provider: 'javascript.info',
    url: 'https://javascript.info/',
    type: 'documentation',
    durationMinutes: 480,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-js-yt-traversy',
    skillId: 'javascript-fundamentals',
    title: 'JavaScript Crash Course For Beginners',
    provider: 'Traversy Media',
    url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c',
    type: 'video',
    durationMinutes: 100,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-js-yt-fireship',
    skillId: 'javascript-fundamentals',
    title: 'JavaScript in 100 Seconds',
    provider: 'Fireship',
    url: 'https://www.youtube.com/watch?v=DHjqpvDnNGE',
    type: 'video',
    durationMinutes: 3,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // Git - Multiple resources
  {
    id: 'res-git-fcc-yt',
    skillId: 'git-github',
    title: 'Git and GitHub for Beginners - Crash Course',
    provider: 'freeCodeCamp YouTube',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    type: 'video',
    durationMinutes: 69,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-git-docs',
    skillId: 'git-github',
    title: 'Git Documentation',
    provider: 'Git',
    url: 'https://git-scm.com/doc',
    type: 'documentation',
    durationMinutes: 120,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  {
    id: 'res-git-yt-fireship',
    skillId: 'git-github',
    title: 'Git Explained in 100 Seconds',
    provider: 'Fireship',
    url: 'https://www.youtube.com/watch?v=hwP7WQkmECE',
    type: 'video',
    durationMinutes: 2,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // Responsive Design
  {
    id: 'res-responsive-fcc',
    skillId: 'responsive-design',
    title: 'Learn Responsive Web Design',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
    type: 'course',
    durationMinutes: 300,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // React
  {
    id: 'res-react-official',
    skillId: 'react-basics',
    title: 'React Quick Start',
    provider: 'React.dev',
    url: 'https://react.dev/learn',
    type: 'documentation',
    durationMinutes: 300,
    language: 'English',
    isFree: true,
    isMobileFriendly: false,
  },
  // Node.js
  {
    id: 'res-node-traversy',
    skillId: 'nodejs-basics',
    title: 'Node.js Crash Course',
    provider: 'Traversy Media',
    url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
    type: 'video',
    durationMinutes: 90,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // Express
  {
    id: 'res-express-mdn',
    skillId: 'express-api',
    title: 'Express Web Framework',
    provider: 'MDN',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs',
    type: 'documentation',
    durationMinutes: 360,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // MongoDB
  {
    id: 'res-mongodb-uni',
    skillId: 'mongodb-basics',
    title: 'MongoDB University - Free Courses',
    provider: 'MongoDB',
    url: 'https://learn.mongodb.com/',
    type: 'course',
    durationMinutes: 300,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // Python
  {
    id: 'res-python-fcc',
    skillId: 'python-basics',
    title: 'Python for Everybody',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
    type: 'course',
    durationMinutes: 600,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // SQL
  {
    id: 'res-sql-khan',
    skillId: 'sql-fundamentals',
    title: 'Intro to SQL',
    provider: 'Khan Academy',
    url: 'https://www.khanacademy.org/computing/computer-programming/sql',
    type: 'course',
    durationMinutes: 240,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // Pandas
  {
    id: 'res-pandas-kaggle',
    skillId: 'data-analysis-pandas',
    title: 'Pandas Course',
    provider: 'Kaggle',
    url: 'https://www.kaggle.com/learn/pandas',
    type: 'course',
    durationMinutes: 240,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // Data Visualization
  {
    id: 'res-dataviz-kaggle',
    skillId: 'data-visualization',
    title: 'Data Visualization Course',
    provider: 'Kaggle',
    url: 'https://www.kaggle.com/learn/data-visualization',
    type: 'course',
    durationMinutes: 240,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // Linux
  {
    id: 'res-linux-fcc',
    skillId: 'linux-basics',
    title: 'Linux Command Line Tutorial',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/news/the-linux-commands-handbook/',
    type: 'article',
    durationMinutes: 120,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // Docker
  {
    id: 'res-docker-fcc',
    skillId: 'docker-basics',
    title: 'Docker Tutorial for Beginners',
    provider: 'freeCodeCamp YouTube',
    url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
    type: 'video',
    durationMinutes: 160,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // CI/CD
  {
    id: 'res-cicd-gh',
    skillId: 'ci-cd-basics',
    title: 'GitHub Actions Documentation',
    provider: 'GitHub',
    url: 'https://docs.github.com/en/actions/learn-github-actions',
    type: 'documentation',
    durationMinutes: 180,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // Cloud
  {
    id: 'res-aws-fcc',
    skillId: 'cloud-basics',
    title: 'AWS Certified Cloud Practitioner',
    provider: 'freeCodeCamp YouTube',
    url: 'https://www.youtube.com/watch?v=SOTamWNgDKc',
    type: 'video',
    durationMinutes: 780,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // React Native
  {
    id: 'res-rn-official',
    skillId: 'react-native-basics',
    title: 'React Native Documentation',
    provider: 'React Native',
    url: 'https://reactnative.dev/docs/getting-started',
    type: 'documentation',
    durationMinutes: 300,
    language: 'English',
    isFree: true,
    isMobileFriendly: false,
  },
  // Mobile UI/UX
  {
    id: 'res-mobile-ux',
    skillId: 'mobile-ui-ux',
    title: 'Mobile App Design Course',
    provider: 'Google',
    url: 'https://www.coursera.org/learn/ui-ux-design',
    type: 'course',
    durationMinutes: 360,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // ML Fundamentals
  {
    id: 'res-ml-kaggle',
    skillId: 'ml-fundamentals',
    title: 'Intro to Machine Learning',
    provider: 'Kaggle',
    url: 'https://www.kaggle.com/learn/intro-to-machine-learning',
    type: 'course',
    durationMinutes: 240,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
  // AI APIs
  {
    id: 'res-ai-apis',
    skillId: 'ai-apis',
    title: 'OpenAI API Documentation',
    provider: 'OpenAI',
    url: 'https://platform.openai.com/docs/quickstart',
    type: 'documentation',
    durationMinutes: 120,
    language: 'English',
    isFree: true,
    isMobileFriendly: true,
  },
];

// =============================================================================
// CLAUDE PROMPTS - AI Learning Assistant Prompts
// =============================================================================

const CLAUDE_PROMPTS: Record<string, string> = {
  'html-basics': `I'm learning HTML basics. Please teach me like a patient tutor:

1. Start with what HTML is and why it matters
2. Explain the basic structure of an HTML document
3. Teach me the most important tags (headings, paragraphs, links, images, lists)
4. Give me a simple exercise to practice
5. After I try it, review my code and give feedback

Let's start with step 1. Keep explanations simple and use examples.`,

  'css-basics': `I'm learning CSS basics. Please be my CSS tutor:

1. Explain what CSS is and how it connects to HTML
2. Teach me selectors (element, class, id)
3. Show me the box model (margin, padding, border)
4. Teach basic properties (colors, fonts, backgrounds)
5. Give me a hands-on exercise to style a simple page

Start with step 1 and let's go step by step. Use visual examples when possible.`,

  'javascript-fundamentals': `I'm learning JavaScript fundamentals. Please teach me:

1. What JavaScript is and what it can do
2. Variables (let, const) and data types
3. Functions and how to use them
4. Conditionals (if/else) and loops
5. DOM manipulation basics
6. Give me a mini project to build

Start from the beginning and check my understanding with small exercises along the way.`,

  'git-github': `I'm learning Git and GitHub. Please help me understand:

1. What is version control and why use it?
2. Basic Git commands (init, add, commit, status, log)
3. Branching and merging
4. How to use GitHub (push, pull, clone)
5. Walk me through creating my first repository

Be practical - give me commands to try and explain what each does.`,

  'responsive-design': `I'm learning responsive web design. Teach me:

1. What makes a website "responsive"?
2. CSS Flexbox basics
3. CSS Grid basics
4. Media queries and breakpoints
5. Mobile-first design approach
6. Give me a challenge: make a layout that works on all screen sizes

Use code examples I can try in my browser.`,

  'react-basics': `I'm learning React. Please teach me step by step:

1. What is React and why use it?
2. Components and JSX
3. Props - passing data to components
4. State - making components interactive with useState
5. Handling events
6. Give me a small React project to build

Start simple and build up. Let me code along with you.`,

  'nodejs-basics': `I'm learning Node.js. Help me understand:

1. What is Node.js and how is it different from browser JS?
2. How to run JavaScript files with Node
3. Working with modules (require/import)
4. The file system module (reading/writing files)
5. Creating a simple HTTP server
6. Give me a practical exercise

Show me actual code I can run on my computer.`,

  'express-api': `I'm learning to build APIs with Express.js. Teach me:

1. What is Express and REST APIs?
2. Setting up an Express server
3. Routes and HTTP methods (GET, POST, PUT, DELETE)
4. Middleware basics
5. Handling request data (params, query, body)
6. Build a simple CRUD API with me

Let's build something real together step by step.`,

  'mongodb-basics': `I'm learning MongoDB. Please teach me:

1. What is MongoDB and NoSQL databases?
2. Basic concepts (documents, collections, databases)
3. CRUD operations (Create, Read, Update, Delete)
4. Using Mongoose with Node.js
5. Creating schemas and models
6. Help me build a simple database for a project

Walk me through real examples I can practice.`,

  'python-basics': `I'm learning Python. Please be my Python tutor:

1. Why Python and what's it used for?
2. Variables and data types
3. Lists, dictionaries, and loops
4. Functions and modules
5. File handling basics
6. Give me fun exercises to practice

Make it interactive - give me challenges and check my solutions.`,

  'sql-fundamentals': `I'm learning SQL. Help me master database queries:

1. What are databases and SQL?
2. SELECT statements and filtering with WHERE
3. Sorting and limiting results
4. JOINs - combining tables
5. GROUP BY and aggregate functions
6. Give me a dataset and query challenges

Provide sample data so I can practice queries.`,

  'docker-basics': `I'm learning Docker. Teach me containerization:

1. What is Docker and why containers?
2. Images vs Containers
3. Writing a Dockerfile
4. Docker commands (build, run, ps, stop)
5. Docker Compose basics
6. Help me containerize a simple application

Give me commands to try on my machine.`,
};

// =============================================================================
// MINI PROJECTS WITH ACCEPTANCE CRITERIA
// =============================================================================

const PROJECTS: Project[] = [
  {
    id: 'proj-html-profile',
    skillId: 'html-basics',
    title: 'Personal Profile Page',
    description: 'Create a simple HTML page about yourself with headings, paragraphs, images, and links',
    difficulty: 'beginner',
    estimatedHours: 2,
    acceptanceCriteria: [
      'Page has a proper HTML5 structure (doctype, html, head, body)',
      'Contains at least 3 different heading levels (h1, h2, h3)',
      'Includes at least one image with alt text',
      'Has at least 3 external links that open in new tabs',
      'Contains an unordered or ordered list',
    ],
    starterHint: 'Start with the basic HTML5 boilerplate and add sections for About Me, My Hobbies, and Contact.',
  },
  {
    id: 'proj-css-card',
    skillId: 'css-basics',
    title: 'Styled Product Card',
    description: 'Style a product card with CSS including colors, spacing, borders, and hover effects',
    difficulty: 'beginner',
    estimatedHours: 3,
    acceptanceCriteria: [
      'Card has rounded corners and a subtle shadow',
      'Image fits properly within the card',
      'Text has proper spacing and typography',
      'Card has a hover effect (scale, shadow, or color change)',
      'Uses at least 3 different CSS properties for layout',
    ],
    starterHint: 'Use a div container for the card and style it with padding, margin, border-radius, and box-shadow.',
  },
  {
    id: 'proj-js-calculator',
    skillId: 'javascript-fundamentals',
    title: 'Simple Calculator',
    description: 'Build a calculator that performs basic math operations',
    difficulty: 'beginner',
    estimatedHours: 4,
    acceptanceCriteria: [
      'Calculator can add, subtract, multiply, and divide',
      'Has a clear/reset button',
      'Displays the current input and result',
      'Handles decimal numbers',
      'Shows error message for division by zero',
    ],
    starterHint: 'Create functions for each operation. Use event listeners for button clicks and update a display element.',
  },
  {
    id: 'proj-git-repo',
    skillId: 'git-github',
    title: 'GitHub Portfolio Repository',
    description: 'Create a GitHub repository with proper README, commits, and branches',
    difficulty: 'beginner',
    estimatedHours: 2,
    acceptanceCriteria: [
      'Repository has a descriptive README.md',
      'At least 5 meaningful commits with clear messages',
      'Created and merged at least one branch',
      'Repository is public and accessible',
      '.gitignore file is configured properly',
    ],
    starterHint: 'Initialize a new repo, add your profile page project, write a good README, and practice branching.',
  },
  {
    id: 'proj-responsive-landing',
    skillId: 'responsive-design',
    title: 'Responsive Landing Page',
    description: 'Build a landing page that looks great on mobile, tablet, and desktop',
    difficulty: 'intermediate',
    estimatedHours: 5,
    acceptanceCriteria: [
      'Layout changes appropriately for mobile (<768px), tablet, and desktop',
      'Navigation collapses to hamburger menu on mobile',
      'Images are responsive and dont overflow',
      'Uses CSS Flexbox or Grid for layout',
      'Text is readable on all screen sizes',
    ],
    starterHint: 'Start mobile-first, use media queries for larger screens, and test with browser dev tools.',
  },
  {
    id: 'proj-react-todo',
    skillId: 'react-basics',
    title: 'React Todo App',
    description: 'Build a todo list app with React components and state management',
    difficulty: 'intermediate',
    estimatedHours: 6,
    acceptanceCriteria: [
      'Can add new todos',
      'Can mark todos as complete/incomplete',
      'Can delete todos',
      'Uses at least 3 separate components',
      'State is managed with useState hook',
      'Todos persist in localStorage',
    ],
    starterHint: 'Create components for TodoList, TodoItem, and AddTodo. Lift state up to the parent component.',
  },
  {
    id: 'proj-node-cli',
    skillId: 'nodejs-basics',
    title: 'Node.js CLI Tool',
    description: 'Create a command-line tool that reads/writes files',
    difficulty: 'intermediate',
    estimatedHours: 4,
    acceptanceCriteria: [
      'Accepts command-line arguments',
      'Can read from a file',
      'Can write to a file',
      'Handles errors gracefully',
      'Provides helpful usage instructions',
    ],
    starterHint: 'Use process.argv for arguments and the fs module for file operations.',
  },
  {
    id: 'proj-express-api',
    skillId: 'express-api',
    title: 'REST API for Notes',
    description: 'Build a simple REST API with CRUD operations for notes',
    difficulty: 'intermediate',
    estimatedHours: 5,
    acceptanceCriteria: [
      'GET /notes returns all notes',
      'POST /notes creates a new note',
      'PUT /notes/:id updates a note',
      'DELETE /notes/:id deletes a note',
      'Proper HTTP status codes are returned',
      'Request validation is implemented',
    ],
    starterHint: 'Start with Express, create routes for each CRUD operation, and use an array as temporary storage.',
  },
  {
    id: 'proj-mongodb-crud',
    skillId: 'mongodb-basics',
    title: 'MongoDB User Management',
    description: 'Create a user management system with MongoDB',
    difficulty: 'intermediate',
    estimatedHours: 5,
    acceptanceCriteria: [
      'Can create users with name and email',
      'Can read/list all users',
      'Can update user information',
      'Can delete users',
      'Email must be unique',
      'Proper error handling for database operations',
    ],
    starterHint: 'Connect to MongoDB with Mongoose, create a User schema, and implement CRUD operations.',
  },
  // Python Project
  {
    id: 'proj-python-automation',
    skillId: 'python-basics',
    title: 'File Organizer Script',
    description: 'Create a Python script that organizes files in a folder by type',
    difficulty: 'beginner',
    estimatedHours: 3,
    acceptanceCriteria: [
      'Script scans a target directory',
      'Creates folders for different file types (images, documents, etc)',
      'Moves files to appropriate folders',
      'Handles duplicate file names',
      'Provides a summary of organized files',
    ],
    starterHint: 'Use os and shutil modules. Create a dictionary mapping extensions to folder names.',
  },
  // SQL Project
  {
    id: 'proj-sql-analysis',
    skillId: 'sql-fundamentals',
    title: 'Sales Data Analysis',
    description: 'Write SQL queries to analyze a sample sales database',
    difficulty: 'beginner',
    estimatedHours: 3,
    acceptanceCriteria: [
      'Query total sales by product category',
      'Find top 10 customers by purchase amount',
      'Calculate monthly sales trends',
      'Join multiple tables to get customer details',
      'Use GROUP BY and aggregate functions',
    ],
    starterHint: 'Use a sample database like SQLite. Start with simple SELECT then add JOINs and GROUP BY.',
  },
  // Pandas Project
  {
    id: 'proj-pandas-analysis',
    skillId: 'data-analysis-pandas',
    title: 'COVID Data Analysis',
    description: 'Analyze real COVID-19 data using Pandas',
    difficulty: 'intermediate',
    estimatedHours: 4,
    acceptanceCriteria: [
      'Load and clean a CSV dataset',
      'Handle missing values appropriately',
      'Calculate summary statistics by country',
      'Create time series analysis',
      'Export results to a new CSV',
    ],
    starterHint: 'Download data from Our World in Data. Use read_csv, groupby, and fillna methods.',
  },
  // Data Visualization Project
  {
    id: 'proj-dataviz-dashboard',
    skillId: 'data-visualization',
    title: 'Interactive Sales Dashboard',
    description: 'Create visualizations from sales data',
    difficulty: 'intermediate',
    estimatedHours: 4,
    acceptanceCriteria: [
      'Create at least 3 different chart types',
      'Include a time series line chart',
      'Add a bar chart for category comparison',
      'Create a pie chart for proportions',
      'Charts have proper titles and labels',
    ],
    starterHint: 'Use Matplotlib for static charts. Try Plotly for interactive visualizations.',
  },
  // Linux Project
  {
    id: 'proj-linux-script',
    skillId: 'linux-basics',
    title: 'Backup Automation Script',
    description: 'Write a bash script to automate file backups',
    difficulty: 'beginner',
    estimatedHours: 2,
    acceptanceCriteria: [
      'Script accepts source and destination directories',
      'Creates timestamped backup folders',
      'Compresses backup files',
      'Logs backup operations',
      'Can be scheduled with cron',
    ],
    starterHint: 'Use tar for compression, date for timestamps, and echo for logging.',
  },
  // Docker Project
  {
    id: 'proj-docker-app',
    skillId: 'docker-basics',
    title: 'Dockerize a Web App',
    description: 'Containerize a simple web application with Docker',
    difficulty: 'intermediate',
    estimatedHours: 3,
    acceptanceCriteria: [
      'Create a working Dockerfile',
      'App runs correctly in container',
      'Use multi-stage build for optimization',
      'Create docker-compose.yml for easy startup',
      'Document how to build and run',
    ],
    starterHint: 'Start with a Node.js or Python app. Use official base images.',
  },
  // CI/CD Project
  {
    id: 'proj-cicd-pipeline',
    skillId: 'ci-cd-basics',
    title: 'GitHub Actions Pipeline',
    description: 'Set up automated testing and deployment',
    difficulty: 'intermediate',
    estimatedHours: 3,
    acceptanceCriteria: [
      'Pipeline runs on push to main',
      'Runs automated tests',
      'Builds Docker image',
      'Deploys to a staging environment',
      'Sends notification on failure',
    ],
    starterHint: 'Create .github/workflows/main.yml. Use actions/checkout and actions/setup-node.',
  },
  // Cloud Project
  {
    id: 'proj-cloud-deploy',
    skillId: 'cloud-basics',
    title: 'Deploy App to AWS',
    description: 'Deploy a web application to AWS EC2',
    difficulty: 'intermediate',
    estimatedHours: 4,
    acceptanceCriteria: [
      'Launch an EC2 instance',
      'Configure security groups',
      'Deploy application code',
      'Set up a domain or use public IP',
      'App is accessible from the internet',
    ],
    starterHint: 'Use AWS Free Tier. Start with t2.micro instance and Amazon Linux.',
  },
  // React Native Project
  {
    id: 'proj-rn-app',
    skillId: 'react-native-basics',
    title: 'Weather App',
    description: 'Build a cross-platform weather app with React Native',
    difficulty: 'intermediate',
    estimatedHours: 6,
    acceptanceCriteria: [
      'Shows current weather for user location',
      'Search for weather in other cities',
      'Displays temperature, humidity, and conditions',
      'Works on both iOS and Android',
      'Has clean, mobile-friendly UI',
    ],
    starterHint: 'Use Expo for quick setup. Fetch data from OpenWeatherMap API.',
  },
  // Mobile UI/UX Project
  {
    id: 'proj-mobile-ux',
    skillId: 'mobile-ui-ux',
    title: 'App Wireframes',
    description: 'Design wireframes for a mobile app',
    difficulty: 'beginner',
    estimatedHours: 3,
    acceptanceCriteria: [
      'Create wireframes for at least 5 screens',
      'Include user flow diagram',
      'Follow mobile design guidelines',
      'Consider thumb-friendly navigation',
      'Document design decisions',
    ],
    starterHint: 'Use Figma (free). Study Apple HIG or Material Design guidelines.',
  },
  // ML Project
  {
    id: 'proj-ml-model',
    skillId: 'ml-fundamentals',
    title: 'House Price Predictor',
    description: 'Build a machine learning model to predict house prices',
    difficulty: 'intermediate',
    estimatedHours: 5,
    acceptanceCriteria: [
      'Load and explore the dataset',
      'Preprocess and clean data',
      'Train a regression model',
      'Evaluate model accuracy',
      'Make predictions on new data',
    ],
    starterHint: 'Use scikit-learn and the Boston Housing dataset. Try Linear Regression first.',
  },
  // AI APIs Project
  {
    id: 'proj-ai-chatbot',
    skillId: 'ai-apis',
    title: 'AI Chatbot',
    description: 'Build a chatbot using OpenAI or Claude API',
    difficulty: 'intermediate',
    estimatedHours: 4,
    acceptanceCriteria: [
      'Accepts user input',
      'Sends requests to AI API',
      'Displays AI responses',
      'Maintains conversation context',
      'Handles API errors gracefully',
    ],
    starterHint: 'Use the OpenAI Python library. Start with simple completions, then add chat history.',
  },
];

// =============================================================================
// GOAL MAPPINGS - What skills are needed for each goal
// =============================================================================

const GOAL_SKILLS: Record<string, string[]> = {
  'frontend-developer': [
    'html-basics',
    'css-basics',
    'javascript-fundamentals',
    'git-github',
    'responsive-design',
    'react-basics',
  ],
  'backend-developer': [
    'javascript-fundamentals',
    'git-github',
    'nodejs-basics',
    'express-api',
    'mongodb-basics',
  ],
  'fullstack-developer': [
    'html-basics',
    'css-basics',
    'javascript-fundamentals',
    'git-github',
    'responsive-design',
    'react-basics',
    'nodejs-basics',
    'express-api',
    'mongodb-basics',
  ],
  'data-analyst': [
    'python-basics',
    'sql-fundamentals',
    'git-github',
    'data-analysis-pandas',
    'data-visualization',
  ],
  'devops-engineer': [
    'git-github',
    'linux-basics',
    'docker-basics',
    'ci-cd-basics',
    'cloud-basics',
  ],
  'mobile-developer': [
    'javascript-fundamentals',
    'git-github',
    'react-basics',
    'mobile-ui-ux',
    'react-native-basics',
  ],
  'ai-ml-engineer': [
    'python-basics',
    'git-github',
    'data-analysis-pandas',
    'ml-fundamentals',
    'ai-apis',
  ],
};

// =============================================================================
// SKILL ENGINE CLASS
// =============================================================================

export class SkillEngine {
  /**
   * Get all skills
   */
  getAllSkills(): Skill[] {
    return SKILLS;
  }

  /**
   * Get skill by ID
   */
  getSkill(skillId: string): Skill | undefined {
    return SKILLS.find((s) => s.id === skillId || s.slug === skillId);
  }

  /**
   * Get skills required for a goal
   */
  getSkillsForGoal(goal: string): Skill[] {
    const normalizedGoal = goal.toLowerCase().replace(/\s+/g, '-');

    // Find matching goal
    let goalKey = Object.keys(GOAL_SKILLS).find((key) =>
      normalizedGoal.includes(key) || key.includes(normalizedGoal)
    );

    // Default to frontend if no match
    if (!goalKey) {
      goalKey = 'frontend-developer';
    }

    const skillIds = GOAL_SKILLS[goalKey];
    return skillIds.map((id) => this.getSkill(id)).filter((s): s is Skill => !!s);
  }

  /**
   * Calculate skill gap - what skills the learner is missing
   */
  calculateSkillGap(goal: string, currentSkills: string[]): {
    known: Skill[];
    missing: Skill[];
    nextSkill: Skill | null;
  } {
    const requiredSkills = this.getSkillsForGoal(goal);
    const normalizedCurrent = currentSkills.map((s) => s.toLowerCase().replace(/\s+/g, '-'));

    const known: Skill[] = [];
    const missing: Skill[] = [];

    for (const skill of requiredSkills) {
      const isKnown = normalizedCurrent.some(
        (cs) => cs.includes(skill.slug) || skill.slug.includes(cs) ||
                cs.includes(skill.id) || skill.id.includes(cs)
      );
      if (isKnown) {
        known.push(skill);
      } else {
        missing.push(skill);
      }
    }

    // Find next skill (first missing skill whose prerequisites are satisfied)
    const nextSkill = this.findNextSkill(missing, known);

    return { known, missing, nextSkill };
  }

  /**
   * Find the next skill to learn (topological order respecting prerequisites)
   */
  private findNextSkill(missing: Skill[], known: Skill[]): Skill | null {
    const knownIds = new Set(known.map((s) => s.id));

    for (const skill of missing) {
      const prereqsSatisfied = skill.prerequisites.every((prereqId) => knownIds.has(prereqId));
      if (prereqsSatisfied) {
        return skill;
      }
    }

    // If no skill has all prereqs satisfied, return the first missing skill
    return missing[0] || null;
  }

  /**
   * Get resources for a skill
   */
  getResourcesForSkill(skillId: string): Resource[] {
    return RESOURCES.filter((r) => r.skillId === skillId);
  }

  /**
   * Get best resource for a skill (considering device constraints)
   */
  getBestResource(skillId: string, isMobile: boolean = false): Resource | null {
    const resources = this.getResourcesForSkill(skillId);

    if (isMobile) {
      const mobileResource = resources.find((r) => r.isMobileFriendly);
      if (mobileResource) return mobileResource;
    }

    return resources[0] || null;
  }

  /**
   * Get project for a skill
   */
  getProjectForSkill(skillId: string): Project | null {
    return PROJECTS.find((p) => p.skillId === skillId) || null;
  }

  /**
   * Get Claude prompt for a skill
   */
  getClaudePrompt(skillId: string): string | null {
    return CLAUDE_PROMPTS[skillId] || null;
  }

  /**
   * Get all available goals
   */
  getAvailableGoals(): string[] {
    return Object.keys(GOAL_SKILLS).map((key) =>
      key.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
  }
}

export const skillEngine = new SkillEngine();
