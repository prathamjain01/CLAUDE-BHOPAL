import { aiService } from "../../ai/service.js";
import {
  LearnerContext,
  SkillGapContext,
  ResourceContext,
  ProjectContext,
} from "../../ai/prompts.js";
import { LearningPathModel, ILearningPath, IPathwayStep } from "./model.js";
import { GeneratePathwayInput, ReplanPathwayInput } from "./schema.js";

// Curated initial catalog for standalone / development / seed fallback
const CURATED_SKILLS_FOR_GOALS: Record<string, { required: string[]; prerequisites: Record<string, string[]> }> = {
  "frontend development": {
    required: ["HTML & Semantic Web", "CSS & Responsive Design", "JavaScript Fundamentals", "Git & GitHub", "React Basics"],
    prerequisites: {
      "CSS & Responsive Design": ["HTML & Semantic Web"],
      "JavaScript Fundamentals": ["HTML & Semantic Web"],
      "Git & GitHub": [],
      "React Basics": ["JavaScript Fundamentals", "CSS & Responsive Design"],
    },
  },
  "backend development": {
    required: ["JavaScript Fundamentals", "Node.js Basics", "Express & REST APIs", "Database & MongoDB", "Git & GitHub"],
    prerequisites: {
      "Node.js Basics": ["JavaScript Fundamentals"],
      "Express & REST APIs": ["Node.js Basics"],
      "Database & MongoDB": ["Express & REST APIs"],
      "Git & GitHub": [],
    },
  },
  "fullstack development": {
    required: ["HTML & Semantic Web", "CSS & Responsive Design", "JavaScript Fundamentals", "React Basics", "Node.js Basics", "Express & REST APIs", "Database & MongoDB"],
    prerequisites: {
      "CSS & Responsive Design": ["HTML & Semantic Web"],
      "JavaScript Fundamentals": ["HTML & Semantic Web"],
      "React Basics": ["JavaScript Fundamentals"],
      "Node.js Basics": ["JavaScript Fundamentals"],
      "Express & REST APIs": ["Node.js Basics"],
      "Database & MongoDB": ["Express & REST APIs"],
    },
  },
};

const CURATED_RESOURCES: ResourceContext[] = [
  {
    id: "res_html_01",
    title: "MDN Web Docs: HTML Basics",
    provider: "MDN",
    skillId: "HTML & Semantic Web",
    level: "beginner",
    durationHours: 6,
    language: "English",
    isMobileFriendly: true,
    url: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
  },
  {
    id: "res_css_01",
    title: "Responsive Web Design Certification",
    provider: "freeCodeCamp",
    skillId: "CSS & Responsive Design",
    level: "beginner",
    durationHours: 12,
    language: "English",
    isMobileFriendly: true,
    url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
  },
  {
    id: "res_js_01",
    title: "JavaScript Algorithms & Data Structures",
    provider: "freeCodeCamp",
    skillId: "JavaScript Fundamentals",
    level: "beginner",
    durationHours: 20,
    language: "English",
    isMobileFriendly: true,
    url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
  },
  {
    id: "res_git_01",
    title: "Git and GitHub for Beginners",
    provider: "freeCodeCamp (YouTube)",
    skillId: "Git & GitHub",
    level: "beginner",
    durationHours: 3,
    language: "English",
    isMobileFriendly: true,
    url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
  },
  {
    id: "res_react_01",
    title: "Quick Start & Interactive Tutorial",
    provider: "React.dev",
    skillId: "React Basics",
    level: "beginner",
    durationHours: 15,
    language: "English",
    isMobileFriendly: false,
    url: "https://react.dev/learn",
  },
  {
    id: "res_node_01",
    title: "Node.js Crash Course",
    provider: "Traversy Media",
    skillId: "Node.js Basics",
    level: "beginner",
    durationHours: 5,
    language: "English",
    isMobileFriendly: true,
    url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
  },
  {
    id: "res_mongo_01",
    title: "MongoDB University - Intro to MongoDB",
    provider: "MongoDB",
    skillId: "Database & MongoDB",
    level: "beginner",
    durationHours: 8,
    language: "English",
    isMobileFriendly: true,
    url: "https://learn.mongodb.com/",
  },
];

const CURATED_PROJECTS: ProjectContext[] = [
  {
    id: "proj_html_css_01",
    title: "Local Business Showcase Landing Page",
    skillIds: ["HTML & Semantic Web", "CSS & Responsive Design"],
    difficulty: "beginner",
    acceptanceCriteria: [
      "Semantic HTML5 tags (header, nav, main, section, footer)",
      "Fully responsive grid and flexbox layout across mobile and desktop",
      "Accessible images with alt attributes and high color contrast",
    ],
  },
  {
    id: "proj_js_01",
    title: "Student Daily Expense Tracker",
    skillIds: ["JavaScript Fundamentals"],
    difficulty: "beginner",
    acceptanceCriteria: [
      "Add expense item with category, amount, and date",
      "Delete and filter expenses by category",
      "Calculate total daily and monthly spend dynamically",
      "Persist entries in browser localStorage",
    ],
  },
  {
    id: "proj_git_01",
    title: "Open-Source Profile & Project Repository",
    skillIds: ["Git & GitHub"],
    difficulty: "beginner",
    acceptanceCriteria: [
      "Initialized git repo with clear commit messages",
      "Comprehensive README.md with setup instructions and screenshot",
      "GitHub Pages deployment link configured",
    ],
  },
  {
    id: "proj_react_01",
    title: "Task & Habit Tracker with Filter & LocalStorage",
    skillIds: ["React Basics"],
    difficulty: "intermediate",
    acceptanceCriteria: [
      "Modular components for TaskInput, TaskList, TaskItem, and Stats",
      "State management using useState and useEffect hooks",
      "Filtering by All / Active / Completed states",
    ],
  },
];

export class PathwayService {
  /**
   * Generate an ordered learning pathway based on learner intake.
   */
  async generatePathway(input: GeneratePathwayInput): Promise<ILearningPath> {
    const goalNormalized = (input.goal || "frontend development").toLowerCase().trim();
    const matchedGoal = Object.keys(CURATED_SKILLS_FOR_GOALS).find(
      (g) => goalNormalized.includes(g) || g.includes(goalNormalized)
    ) || "frontend development";

    const goalSpec = CURATED_SKILLS_FOR_GOALS[matchedGoal];

    // Compute missing skills based on learner's current knowledge
    const knownNormalized = (input.currentSkills || []).map((s) => s.toLowerCase().trim());
    const missingSkills = goalSpec.required.filter((req) => {
      const reqNorm = req.toLowerCase();
      return !knownNormalized.some((k) => reqNorm.includes(k) || k.includes(reqNorm));
    });

    const learnerContext: LearnerContext = {
      goal: input.goal || matchedGoal,
      currentSkills: input.currentSkills || [],
      device: input.device || "laptop",
      dailyTimeMinutes: input.dailyTimeMinutes || 60,
      internetQuality: input.internetQuality || "broadband",
      preferredLanguage: input.preferredLanguage || "English",
      city: input.city || "Bhopal",
      priorExposure: input.priorExposure,
    };

    const skillGapContext: SkillGapContext = {
      knownSkills: input.currentSkills || [],
      requiredSkills: goalSpec.required,
      missingSkills,
      prerequisites: goalSpec.prerequisites,
    };

    // Generate through AI service with deterministic fallback
    const aiResult = await aiService.generatePathway(
      learnerContext,
      skillGapContext,
      CURATED_RESOURCES,
      CURATED_PROJECTS
    );

    const steps: IPathwayStep[] = aiResult.steps.map((step, idx) => ({
      id: step.id || `step_${String(idx + 1).padStart(2, "0")}`,
      skillName: step.skillName,
      reason: step.reason,
      estimatedDays: step.estimatedDays || 7,
      resourceIds: step.resourceIds || [],
      projectId: step.projectId || null,
      acceptanceCriteria: step.acceptanceCriteria || [],
      beginnerTip: step.beginnerTip,
      status: (step.status as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED") || (idx === 0 ? "IN_PROGRESS" : "NOT_STARTED"),
      order: idx + 1,
    }));

    const pathwayData = {
      learnerId: input.learnerId || `learner_demo_${Date.now()}`,
      goal: aiResult.goal || input.goal || matchedGoal,
      version: 1,
      isActive: true,
      totalEstimatedDays: aiResult.totalEstimatedDays || 30,
      steps,
      replanHistory: [],
    };

    try {
      const doc = new LearningPathModel(pathwayData);
      return await doc.save();
    } catch {
      // In-memory fallback if MongoDB is not connected in local testing
      return {
        ...pathwayData,
        _id: `pathway_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as ILearningPath;
    }
  }

  /**
   * Get a pathway by ID.
   */
  async getPathwayById(id: string): Promise<ILearningPath | null> {
    try {
      const pathway = await LearningPathModel.findById(id);
      if (pathway) return pathway;
    } catch {
      // Ignore id format error
    }

    // Try finding by custom id or return demo fallback
    try {
      const pathway = await LearningPathModel.findOne({
        $or: [{ _id: id }, { learnerId: id }],
      });
      if (pathway) return pathway;
    } catch {
      // Ignore
    }

    return null;
  }

  /**
   * Re-plan an active pathway.
   */
  async replanPathway(id: string, input: ReplanPathwayInput): Promise<ILearningPath> {
    let pathway = await this.getPathwayById(id);

    if (!pathway) {
      // Create a default pathway to replan if not found
      pathway = await this.generatePathway({
        learnerId: "demo_learner",
        goal: "frontend development",
        currentSkills: [],
        device: "laptop",
        dailyTimeMinutes: 60,
        internetQuality: "broadband",
        preferredLanguage: "English",
        city: "Bhopal",
      });
    }

    const currentStepId = input.stepId || pathway.steps[0]?.id || "step_01";

    const replanResult = await aiService.replanPathway(
      {
        goal: pathway.goal,
        steps: pathway.steps.map((s) => ({
          id: s.id,
          skillName: s.skillName,
          status: s.status,
          reason: s.reason,
          estimatedDays: s.estimatedDays,
        })),
      },
      {
        reason: input.reason,
        details: input.details,
        currentStepId,
        updatedConstraints: input.updatedConstraints,
      },
      {
        goal: pathway.goal,
        currentSkills: [],
        device: "laptop",
        dailyTimeMinutes: 60,
        internetQuality: "broadband",
        preferredLanguage: "English",
        city: "Bhopal",
      },
      CURATED_RESOURCES,
      CURATED_PROJECTS
    );

    const updatedSteps: IPathwayStep[] = replanResult.steps.map((s, idx) => ({
      id: s.id,
      skillName: s.skillName,
      reason: s.reason,
      estimatedDays: s.estimatedDays,
      resourceIds: s.resourceIds || [],
      projectId: s.projectId || null,
      acceptanceCriteria: s.acceptanceCriteria || [],
      beginnerTip: s.beginnerTip,
      status: (s.status as "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED") || "NOT_STARTED",
      order: idx + 1,
    }));

    const nextVersion = (pathway.version || 1) + 1;
    const historyEntry = {
      version: nextVersion,
      reason: input.reason,
      rationale: replanResult.rationale,
      timestamp: new Date(),
    };

    pathway.steps = updatedSteps;
    pathway.version = nextVersion;
    pathway.totalEstimatedDays = replanResult.totalEstimatedDays;
    pathway.replanHistory = [...(pathway.replanHistory || []), historyEntry];

    try {
      if (typeof pathway.save === "function") {
        return await pathway.save();
      }
    } catch {
      // Ignore DB save errors in offline tests
    }

    return pathway;
  }

  /**
   * Get a shareable one-page summary of the pathway for mentor review.
   */
  async getShareablePathway(id: string) {
    const pathway = await this.getPathwayById(id);
    if (!pathway) {
      throw new Error(`Pathway not found for id: ${id}`);
    }

    const currentStep = pathway.steps.find((s) => s.status === "IN_PROGRESS") || pathway.steps[0];
    const completedSteps = pathway.steps.filter((s) => s.status === "COMPLETED");
    const nextSteps = pathway.steps.filter((s) => s.status === "NOT_STARTED");

    return {
      pathwayId: pathway._id || id,
      goal: pathway.goal,
      version: pathway.version,
      totalEstimatedDays: pathway.totalEstimatedDays,
      summary: {
        totalSteps: pathway.steps.length,
        completedCount: completedSteps.length,
        inProgressStep: currentStep ? currentStep.skillName : null,
      },
      currentStep,
      completedSteps: completedSteps.map((s) => s.skillName),
      upcomingSteps: nextSteps.map((s) => ({
        skillName: s.skillName,
        estimatedDays: s.estimatedDays,
        reason: s.reason,
      })),
      workCategoriesNote: "This pathway develops capabilities for Frontend and Web Interface engineering (Bhopal / Indore / Remote).",
      shareUrl: `/share/${pathway._id || id}`,
    };
  }
}

export const pathwayService = new PathwayService();
