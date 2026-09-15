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
];

// =============================================================================
// CURATED FREE RESOURCES
// =============================================================================

const RESOURCES: Resource[] = [
  // HTML
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
  // CSS
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
  // JavaScript
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
  // Git
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
];

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
   * Get all available goals
   */
  getAvailableGoals(): string[] {
    return Object.keys(GOAL_SKILLS).map((key) =>
      key.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
  }
}

export const skillEngine = new SkillEngine();
