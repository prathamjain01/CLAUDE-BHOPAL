// =============================================================================
// QUIZ VERIFICATION SYSTEM
// =============================================================================
// Verifies that learners have actually understood the skill before completion.
// Each skill has a set of quiz questions that must be passed.
// =============================================================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  skillId: string;
  skillName: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage (e.g., 70 means 70%)
}

export interface QuizAttempt {
  odp: string;
  lesarnerId: string;
  skillId: string;
  answers: number[];
  score: number;
  passed: boolean;
  attemptedAt: string;
}

// =============================================================================
// QUIZ DATABASE
// =============================================================================

const QUIZZES: Record<string, Quiz> = {
  "html-basics": {
    skillId: "html-basics",
    skillName: "HTML Basics",
    passingScore: 60,
    questions: [
      {
        id: "html-1",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language",
        ],
        correctIndex: 0,
        explanation: "HTML stands for Hyper Text Markup Language, used for structuring web content.",
      },
      {
        id: "html-2",
        question: "Which tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctIndex: 1,
        explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML.",
      },
      {
        id: "html-3",
        question: "What is the correct HTML element for the largest heading?",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        correctIndex: 2,
        explanation: "<h1> is the largest heading, while <h6> is the smallest.",
      },
      {
        id: "html-4",
        question: "Which attribute specifies an alternate text for an image?",
        options: ["title", "src", "alt", "name"],
        correctIndex: 2,
        explanation: "The 'alt' attribute provides alternative text when the image cannot be displayed.",
      },
      {
        id: "html-5",
        question: "What is the correct HTML for creating an unordered list?",
        options: ["<list>", "<ul>", "<ol>", "<dl>"],
        correctIndex: 1,
        explanation: "<ul> creates an unordered (bulleted) list, while <ol> creates an ordered (numbered) list.",
      },
    ],
  },

  "css-fundamentals": {
    skillId: "css-fundamentals",
    skillName: "CSS Fundamentals",
    passingScore: 60,
    questions: [
      {
        id: "css-1",
        question: "What does CSS stand for?",
        options: [
          "Creative Style Sheets",
          "Cascading Style Sheets",
          "Computer Style Sheets",
          "Colorful Style Sheets",
        ],
        correctIndex: 1,
        explanation: "CSS stands for Cascading Style Sheets, used for styling HTML elements.",
      },
      {
        id: "css-2",
        question: "Which property is used to change the background color?",
        options: ["color", "bgcolor", "background-color", "background"],
        correctIndex: 2,
        explanation: "The 'background-color' property sets the background color of an element.",
      },
      {
        id: "css-3",
        question: "How do you select an element with id 'demo'?",
        options: [".demo", "#demo", "demo", "*demo"],
        correctIndex: 1,
        explanation: "The # symbol is used to select elements by their id attribute.",
      },
      {
        id: "css-4",
        question: "Which property is used to change the font of an element?",
        options: ["font-style", "text-style", "font-family", "text-font"],
        correctIndex: 2,
        explanation: "The 'font-family' property specifies the font for an element.",
      },
      {
        id: "css-5",
        question: "What is the default value of the position property?",
        options: ["relative", "fixed", "absolute", "static"],
        correctIndex: 3,
        explanation: "The default position value is 'static', meaning elements follow the normal document flow.",
      },
    ],
  },

  "javascript-basics": {
    skillId: "javascript-basics",
    skillName: "JavaScript Basics",
    passingScore: 60,
    questions: [
      {
        id: "js-1",
        question: "Which keyword is used to declare a variable in modern JavaScript?",
        options: ["var", "let", "variable", "v"],
        correctIndex: 1,
        explanation: "'let' and 'const' are the modern ways to declare variables in JavaScript.",
      },
      {
        id: "js-2",
        question: "What will console.log(typeof []) output?",
        options: ["array", "object", "list", "undefined"],
        correctIndex: 1,
        explanation: "In JavaScript, arrays are actually objects, so typeof [] returns 'object'.",
      },
      {
        id: "js-3",
        question: "How do you write a comment in JavaScript?",
        options: ["<!-- comment -->", "// comment", "# comment", "** comment **"],
        correctIndex: 1,
        explanation: "Single-line comments use //, multi-line comments use /* */.",
      },
      {
        id: "js-4",
        question: "Which method adds an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "append()"],
        correctIndex: 0,
        explanation: "push() adds elements to the end, pop() removes from the end.",
      },
      {
        id: "js-5",
        question: "What is the result of '2' + 2 in JavaScript?",
        options: ["4", "22", "NaN", "Error"],
        correctIndex: 1,
        explanation: "The + operator concatenates when one operand is a string, resulting in '22'.",
      },
    ],
  },

  "react-basics": {
    skillId: "react-basics",
    skillName: "React Basics",
    passingScore: 60,
    questions: [
      {
        id: "react-1",
        question: "What is React?",
        options: [
          "A database",
          "A JavaScript library for building UIs",
          "A programming language",
          "A CSS framework",
        ],
        correctIndex: 1,
        explanation: "React is a JavaScript library for building user interfaces, maintained by Meta.",
      },
      {
        id: "react-2",
        question: "What is JSX?",
        options: [
          "A JavaScript extension for writing HTML-like syntax",
          "A new programming language",
          "A CSS preprocessor",
          "A database query language",
        ],
        correctIndex: 0,
        explanation: "JSX allows you to write HTML-like syntax in JavaScript files.",
      },
      {
        id: "react-3",
        question: "What hook is used to manage state in functional components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correctIndex: 1,
        explanation: "useState is the primary hook for managing local state in functional components.",
      },
      {
        id: "react-4",
        question: "What is a React component?",
        options: [
          "A CSS class",
          "A reusable piece of UI",
          "A database table",
          "A server endpoint",
        ],
        correctIndex: 1,
        explanation: "Components are reusable, independent pieces of UI that can accept props and manage state.",
      },
      {
        id: "react-5",
        question: "What does the useEffect hook do?",
        options: [
          "Manages state",
          "Handles side effects like data fetching",
          "Creates components",
          "Styles elements",
        ],
        correctIndex: 1,
        explanation: "useEffect handles side effects like API calls, subscriptions, and DOM manipulation.",
      },
    ],
  },

  "nodejs-basics": {
    skillId: "nodejs-basics",
    skillName: "Node.js Basics",
    passingScore: 60,
    questions: [
      {
        id: "node-1",
        question: "What is Node.js?",
        options: [
          "A web browser",
          "A JavaScript runtime built on Chrome's V8 engine",
          "A database",
          "A CSS framework",
        ],
        correctIndex: 1,
        explanation: "Node.js is a JavaScript runtime that allows you to run JavaScript on the server.",
      },
      {
        id: "node-2",
        question: "Which command initializes a new Node.js project?",
        options: ["node start", "npm init", "node create", "npm new"],
        correctIndex: 1,
        explanation: "'npm init' creates a new package.json file for your project.",
      },
      {
        id: "node-3",
        question: "What is npm?",
        options: [
          "Node Package Manager",
          "New Programming Method",
          "Node Process Manager",
          "Network Protocol Module",
        ],
        correctIndex: 0,
        explanation: "npm (Node Package Manager) is used to install and manage JavaScript packages.",
      },
      {
        id: "node-4",
        question: "How do you import a module in Node.js?",
        options: [
          "import module",
          "require('module')",
          "#include module",
          "load module",
        ],
        correctIndex: 1,
        explanation: "CommonJS uses require(), while ES modules use import statements.",
      },
      {
        id: "node-5",
        question: "What is Express.js?",
        options: [
          "A database",
          "A web framework for Node.js",
          "A testing library",
          "A CSS framework",
        ],
        correctIndex: 1,
        explanation: "Express is a minimal web framework for building APIs and web applications in Node.js.",
      },
    ],
  },

  "git-basics": {
    skillId: "git-basics",
    skillName: "Git Basics",
    passingScore: 60,
    questions: [
      {
        id: "git-1",
        question: "What is Git?",
        options: [
          "A programming language",
          "A version control system",
          "A web server",
          "A database",
        ],
        correctIndex: 1,
        explanation: "Git is a distributed version control system for tracking changes in code.",
      },
      {
        id: "git-2",
        question: "Which command creates a new Git repository?",
        options: ["git start", "git new", "git init", "git create"],
        correctIndex: 2,
        explanation: "'git init' initializes a new Git repository in the current directory.",
      },
      {
        id: "git-3",
        question: "What does 'git clone' do?",
        options: [
          "Creates a new branch",
          "Copies a repository",
          "Deletes a repository",
          "Merges branches",
        ],
        correctIndex: 1,
        explanation: "'git clone' creates a copy of a remote repository on your local machine.",
      },
      {
        id: "git-4",
        question: "Which command stages changes for commit?",
        options: ["git commit", "git push", "git add", "git stage"],
        correctIndex: 2,
        explanation: "'git add' stages changes to be included in the next commit.",
      },
      {
        id: "git-5",
        question: "What is a Git branch?",
        options: [
          "A copy of the repository",
          "An independent line of development",
          "A backup file",
          "A commit message",
        ],
        correctIndex: 1,
        explanation: "Branches allow you to work on different features independently.",
      },
    ],
  },

  "python-basics": {
    skillId: "python-basics",
    skillName: "Python Basics",
    passingScore: 60,
    questions: [
      {
        id: "py-1",
        question: "What is Python?",
        options: [
          "A snake",
          "A high-level programming language",
          "A database",
          "A web browser",
        ],
        correctIndex: 1,
        explanation: "Python is a high-level, interpreted programming language known for its readability.",
      },
      {
        id: "py-2",
        question: "How do you create a list in Python?",
        options: ["list = (1, 2, 3)", "list = [1, 2, 3]", "list = {1, 2, 3}", "list = <1, 2, 3>"],
        correctIndex: 1,
        explanation: "Lists in Python are created using square brackets [].",
      },
      {
        id: "py-3",
        question: "What keyword is used to define a function in Python?",
        options: ["function", "func", "def", "define"],
        correctIndex: 2,
        explanation: "The 'def' keyword is used to define functions in Python.",
      },
      {
        id: "py-4",
        question: "How do you start a comment in Python?",
        options: ["//", "#", "/*", "--"],
        correctIndex: 1,
        explanation: "Single-line comments in Python start with the # symbol.",
      },
      {
        id: "py-5",
        question: "What does 'print()' do in Python?",
        options: [
          "Reads input",
          "Outputs text to the console",
          "Creates a file",
          "Imports a module",
        ],
        correctIndex: 1,
        explanation: "print() outputs text or variables to the console.",
      },
    ],
  },

  "sql-basics": {
    skillId: "sql-basics",
    skillName: "SQL Basics",
    passingScore: 60,
    questions: [
      {
        id: "sql-1",
        question: "What does SQL stand for?",
        options: [
          "Structured Query Language",
          "Simple Question Language",
          "Standard Query Logic",
          "System Query Language",
        ],
        correctIndex: 0,
        explanation: "SQL stands for Structured Query Language, used to manage databases.",
      },
      {
        id: "sql-2",
        question: "Which statement is used to retrieve data from a database?",
        options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
        correctIndex: 1,
        explanation: "SELECT is used to query and retrieve data from database tables.",
      },
      {
        id: "sql-3",
        question: "Which clause is used to filter results in SQL?",
        options: ["FILTER", "WHERE", "HAVING", "IF"],
        correctIndex: 1,
        explanation: "WHERE clause filters rows based on specified conditions.",
      },
      {
        id: "sql-4",
        question: "What does INSERT INTO do?",
        options: [
          "Deletes data",
          "Updates data",
          "Adds new data",
          "Selects data",
        ],
        correctIndex: 2,
        explanation: "INSERT INTO adds new rows of data into a table.",
      },
      {
        id: "sql-5",
        question: "Which keyword removes duplicate values?",
        options: ["UNIQUE", "DISTINCT", "DIFFERENT", "SINGLE"],
        correctIndex: 1,
        explanation: "DISTINCT returns only unique values, removing duplicates from results.",
      },
    ],
  },
};

// Generate a generic quiz for skills without predefined quizzes
function generateGenericQuiz(skillId: string, skillName: string): Quiz {
  return {
    skillId,
    skillName,
    passingScore: 60,
    questions: [
      {
        id: `${skillId}-1`,
        question: `What is the main purpose of ${skillName}?`,
        options: [
          "To solve a specific technical problem",
          "To make websites look pretty",
          "To store data in databases",
          "To send emails automatically",
        ],
        correctIndex: 0,
        explanation: `${skillName} is designed to solve specific technical challenges in its domain.`,
      },
      {
        id: `${skillId}-2`,
        question: `Which is a best practice when learning ${skillName}?`,
        options: [
          "Memorize everything without practice",
          "Build projects and practice regularly",
          "Only read documentation",
          "Skip the fundamentals",
        ],
        correctIndex: 1,
        explanation: "Hands-on practice through building projects is the most effective way to learn.",
      },
      {
        id: `${skillId}-3`,
        question: `What should you do when stuck while learning ${skillName}?`,
        options: [
          "Give up immediately",
          "Search documentation, ask communities, break down the problem",
          "Ignore the problem",
          "Start a completely different skill",
        ],
        correctIndex: 1,
        explanation: "Breaking down problems and using available resources is key to overcoming obstacles.",
      },
    ],
  };
}

// =============================================================================
// QUIZ SERVICE
// =============================================================================

class QuizService {
  private attempts: Map<string, QuizAttempt[]> = new Map();

  /**
   * Get quiz for a skill
   */
  getQuiz(skillId: string, skillName?: string): Quiz {
    const quiz = QUIZZES[skillId];
    if (quiz) return quiz;

    // Generate generic quiz for unknown skills
    return generateGenericQuiz(skillId, skillName || skillId);
  }

  /**
   * Submit quiz answers and calculate score
   */
  submitQuiz(
    learnerId: string,
    skillId: string,
    answers: number[]
  ): { score: number; passed: boolean; results: Array<{ correct: boolean; explanation: string }> } {
    const quiz = this.getQuiz(skillId);
    let correctCount = 0;
    const results: Array<{ correct: boolean; explanation: string }> = [];

    quiz.questions.forEach((q, index) => {
      const isCorrect = answers[index] === q.correctIndex;
      if (isCorrect) correctCount++;
      results.push({
        correct: isCorrect,
        explanation: q.explanation,
      });
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Store attempt
    const attempt: QuizAttempt = {
      odp: `${learnerId}-${skillId}-${Date.now()}`,
      lesarnerId: learnerId,
      skillId,
      answers,
      score,
      passed,
      attemptedAt: new Date().toISOString(),
    };

    const learnerAttempts = this.attempts.get(learnerId) || [];
    learnerAttempts.push(attempt);
    this.attempts.set(learnerId, learnerAttempts);

    return { score, passed, results };
  }

  /**
   * Check if learner has passed quiz for a skill
   */
  hasPassedQuiz(learnerId: string, skillId: string): boolean {
    const attempts = this.attempts.get(learnerId) || [];
    return attempts.some((a) => a.skillId === skillId && a.passed);
  }

  /**
   * Get learner's quiz attempts
   */
  getAttempts(learnerId: string): QuizAttempt[] {
    return this.attempts.get(learnerId) || [];
  }
}

export const quizService = new QuizService();
