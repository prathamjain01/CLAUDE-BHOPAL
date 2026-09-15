// =============================================================================
// MENTOR REVIEW SYSTEM
// =============================================================================
// Real industry professionals review and approve learning roadmaps.
// Mentors are matched based on the learner's target industry/role.
// =============================================================================

import { v4 as uuidv4 } from "uuid";

export interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  expertise: string[];
  location: string; // "Bhopal", "Indore", "Remote", etc.
  linkedinUrl?: string;
  isAvailable: boolean;
  reviewsCompleted: number;
}

export interface MentorReview {
  id: string;
  learnerId: string;
  mentorId: string;
  roadmapSnapshot: {
    goal: string;
    skills: string[];
    currentSkills: string[];
    estimatedWeeks: number;
  };
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "NEEDS_CHANGES" | "REJECTED";
  submittedAt: string;
  reviewedAt?: string;
  feedback?: {
    overallRating: 1 | 2 | 3 | 4 | 5;
    isPathAppropriate: boolean;
    suggestedChanges?: string[];
    additionalSkills?: string[];
    skipSkills?: string[];
    mentorNotes: string;
    encouragement: string;
  };
}

export interface WorkOpportunity {
  id: string;
  title: string;
  category: string;
  requiredSkills: string[];
  location: "Bhopal" | "Indore" | "Remote" | "Hybrid";
  type: "Full-time" | "Part-time" | "Freelance" | "Internship";
  salaryRange?: string;
  description: string;
}

// =============================================================================
// SAMPLE MENTORS (In production, this would be from a database)
// =============================================================================

const MENTORS: Mentor[] = [
  {
    id: "mentor-1",
    name: "Rahul Sharma",
    title: "Senior Frontend Developer",
    company: "Tech Startup (Remote)",
    industry: "frontend-developer",
    expertise: ["React", "JavaScript", "CSS", "Web Performance"],
    location: "Bhopal",
    isAvailable: true,
    reviewsCompleted: 45,
  },
  {
    id: "mentor-2",
    name: "Priya Patel",
    title: "Full Stack Engineer",
    company: "IT Services Company",
    industry: "fullstack-developer",
    expertise: ["Node.js", "React", "MongoDB", "AWS"],
    location: "Indore",
    isAvailable: true,
    reviewsCompleted: 32,
  },
  {
    id: "mentor-3",
    name: "Amit Kumar",
    title: "Backend Developer",
    company: "Fintech Startup",
    industry: "backend-developer",
    expertise: ["Node.js", "Python", "PostgreSQL", "Docker"],
    location: "Remote",
    isAvailable: true,
    reviewsCompleted: 28,
  },
  {
    id: "mentor-4",
    name: "Sneha Verma",
    title: "Data Analyst",
    company: "E-commerce Company",
    industry: "data-analyst",
    expertise: ["Python", "SQL", "Tableau", "Excel"],
    location: "Bhopal",
    isAvailable: true,
    reviewsCompleted: 19,
  },
  {
    id: "mentor-5",
    name: "Vikram Singh",
    title: "DevOps Engineer",
    company: "Cloud Services Provider",
    industry: "devops-engineer",
    expertise: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    location: "Remote",
    isAvailable: true,
    reviewsCompleted: 23,
  },
  {
    id: "mentor-6",
    name: "Ananya Gupta",
    title: "Mobile Developer",
    company: "App Development Agency",
    industry: "mobile-developer",
    expertise: ["React Native", "Flutter", "iOS", "Android"],
    location: "Indore",
    isAvailable: true,
    reviewsCompleted: 15,
  },
  {
    id: "mentor-7",
    name: "Rajesh Mishra",
    title: "ML Engineer",
    company: "AI Startup",
    industry: "ai-ml-engineer",
    expertise: ["Python", "TensorFlow", "NLP", "Computer Vision"],
    location: "Remote",
    isAvailable: true,
    reviewsCompleted: 21,
  },
];

// =============================================================================
// WORK OPPORTUNITIES (Local & Remote)
// =============================================================================

const WORK_OPPORTUNITIES: WorkOpportunity[] = [
  // Frontend
  {
    id: "opp-1",
    title: "Junior Frontend Developer",
    category: "frontend-developer",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
    location: "Bhopal",
    type: "Full-time",
    salaryRange: "₹3-5 LPA",
    description: "Build user interfaces for web applications at local IT services companies.",
  },
  {
    id: "opp-2",
    title: "React Developer (Remote)",
    category: "frontend-developer",
    requiredSkills: ["React", "TypeScript", "CSS", "Git"],
    location: "Remote",
    type: "Full-time",
    salaryRange: "₹6-12 LPA",
    description: "Work with startups across India building modern web applications.",
  },
  {
    id: "opp-3",
    title: "Freelance Web Developer",
    category: "frontend-developer",
    requiredSkills: ["HTML", "CSS", "JavaScript"],
    location: "Remote",
    type: "Freelance",
    salaryRange: "₹500-2000/hour",
    description: "Build websites for local businesses and clients on platforms like Upwork, Fiverr.",
  },
  // Backend
  {
    id: "opp-4",
    title: "Node.js Developer",
    category: "backend-developer",
    requiredSkills: ["Node.js", "Express", "MongoDB", "REST APIs"],
    location: "Indore",
    type: "Full-time",
    salaryRange: "₹4-8 LPA",
    description: "Build backend services for growing IT companies in Indore.",
  },
  {
    id: "opp-5",
    title: "API Developer (Remote)",
    category: "backend-developer",
    requiredSkills: ["Node.js", "PostgreSQL", "Docker"],
    location: "Remote",
    type: "Full-time",
    salaryRange: "₹8-15 LPA",
    description: "Design and build scalable APIs for SaaS products.",
  },
  // Fullstack
  {
    id: "opp-6",
    title: "Full Stack Developer",
    category: "fullstack-developer",
    requiredSkills: ["React", "Node.js", "MongoDB", "Git"],
    location: "Bhopal",
    type: "Full-time",
    salaryRange: "₹5-10 LPA",
    description: "End-to-end development at local software companies.",
  },
  {
    id: "opp-7",
    title: "Startup Developer (Remote)",
    category: "fullstack-developer",
    requiredSkills: ["React", "Node.js", "AWS", "TypeScript"],
    location: "Remote",
    type: "Full-time",
    salaryRange: "₹10-20 LPA",
    description: "Join early-stage startups building products from scratch.",
  },
  // Data Analyst
  {
    id: "opp-8",
    title: "Data Analyst",
    category: "data-analyst",
    requiredSkills: ["Python", "SQL", "Excel", "Data Visualization"],
    location: "Bhopal",
    type: "Full-time",
    salaryRange: "₹4-7 LPA",
    description: "Analyze business data for local companies and government organizations.",
  },
  {
    id: "opp-9",
    title: "Business Intelligence Analyst (Remote)",
    category: "data-analyst",
    requiredSkills: ["SQL", "Tableau", "Python"],
    location: "Remote",
    type: "Full-time",
    salaryRange: "₹8-14 LPA",
    description: "Create dashboards and insights for product teams.",
  },
  // DevOps
  {
    id: "opp-10",
    title: "Junior DevOps Engineer",
    category: "devops-engineer",
    requiredSkills: ["Linux", "Docker", "CI/CD", "AWS"],
    location: "Remote",
    type: "Full-time",
    salaryRange: "₹6-12 LPA",
    description: "Manage infrastructure and deployments for tech companies.",
  },
  // Mobile
  {
    id: "opp-11",
    title: "React Native Developer",
    category: "mobile-developer",
    requiredSkills: ["React Native", "JavaScript", "Mobile UI"],
    location: "Indore",
    type: "Full-time",
    salaryRange: "₹5-10 LPA",
    description: "Build cross-platform mobile apps for clients.",
  },
  {
    id: "opp-12",
    title: "App Developer (Freelance)",
    category: "mobile-developer",
    requiredSkills: ["React Native", "Firebase"],
    location: "Remote",
    type: "Freelance",
    salaryRange: "₹50K-2L/project",
    description: "Build mobile apps for startups and local businesses.",
  },
  // AI/ML
  {
    id: "opp-13",
    title: "ML Engineer (Remote)",
    category: "ai-ml-engineer",
    requiredSkills: ["Python", "Machine Learning", "TensorFlow"],
    location: "Remote",
    type: "Full-time",
    salaryRange: "₹12-25 LPA",
    description: "Build ML models for AI-powered products.",
  },
  {
    id: "opp-14",
    title: "AI Integration Developer",
    category: "ai-ml-engineer",
    requiredSkills: ["Python", "OpenAI API", "LangChain"],
    location: "Remote",
    type: "Full-time",
    salaryRange: "₹10-18 LPA",
    description: "Integrate AI capabilities into existing products.",
  },
];

// =============================================================================
// IN-MEMORY STORAGE
// =============================================================================

const reviewRequests: Map<string, MentorReview> = new Map();

// =============================================================================
// MENTOR REVIEW SERVICE
// =============================================================================

export class MentorReviewService {
  /**
   * Get mentors for a specific industry/goal
   */
  getMentorsForGoal(goal: string): Mentor[] {
    const normalizedGoal = goal.toLowerCase().replace(/\s+/g, "-");
    return MENTORS.filter(
      (m) => m.isAvailable && (m.industry.includes(normalizedGoal) || normalizedGoal.includes(m.industry))
    );
  }

  /**
   * Get all available mentors
   */
  getAllMentors(): Mentor[] {
    return MENTORS.filter((m) => m.isAvailable);
  }

  /**
   * Submit roadmap for mentor review
   */
  submitForReview(
    learnerId: string,
    roadmapSnapshot: MentorReview["roadmapSnapshot"],
    preferredMentorId?: string
  ): MentorReview {
    const normalizedGoal = roadmapSnapshot.goal.toLowerCase().replace(/\s+/g, "-");

    // Find matching mentor
    let mentor: Mentor | undefined;
    if (preferredMentorId) {
      mentor = MENTORS.find((m) => m.id === preferredMentorId && m.isAvailable);
    }
    if (!mentor) {
      const matchingMentors = this.getMentorsForGoal(roadmapSnapshot.goal);
      mentor = matchingMentors[0] || MENTORS.find((m) => m.isAvailable);
    }

    if (!mentor) {
      throw new Error("No mentors available at this time");
    }

    const review: MentorReview = {
      id: uuidv4(),
      learnerId,
      mentorId: mentor.id,
      roadmapSnapshot,
      status: "PENDING",
      submittedAt: new Date().toISOString(),
    };

    reviewRequests.set(review.id, review);
    return review;
  }

  /**
   * Get review status
   */
  getReviewStatus(reviewId: string): MentorReview | null {
    return reviewRequests.get(reviewId) || null;
  }

  /**
   * Get reviews for a learner
   */
  getReviewsForLearner(learnerId: string): MentorReview[] {
    return Array.from(reviewRequests.values()).filter((r) => r.learnerId === learnerId);
  }

  /**
   * Mentor submits review (would be called from mentor dashboard)
   */
  submitReview(
    reviewId: string,
    mentorId: string,
    feedback: MentorReview["feedback"]
  ): MentorReview | null {
    const review = reviewRequests.get(reviewId);
    if (!review || review.mentorId !== mentorId) {
      return null;
    }

    review.status = feedback?.isPathAppropriate ? "APPROVED" : "NEEDS_CHANGES";
    review.reviewedAt = new Date().toISOString();
    review.feedback = feedback;

    reviewRequests.set(reviewId, review);
    return review;
  }

  /**
   * Get work opportunities for a goal
   */
  getWorkOpportunities(goal: string): WorkOpportunity[] {
    const normalizedGoal = goal.toLowerCase().replace(/\s+/g, "-");
    return WORK_OPPORTUNITIES.filter((opp) =>
      opp.category.includes(normalizedGoal) || normalizedGoal.includes(opp.category)
    );
  }

  /**
   * Get all work opportunities
   */
  getAllWorkOpportunities(): WorkOpportunity[] {
    return WORK_OPPORTUNITIES;
  }

  /**
   * Get work opportunities by location
   */
  getWorkOpportunitiesByLocation(location: "Bhopal" | "Indore" | "Remote"): WorkOpportunity[] {
    return WORK_OPPORTUNITIES.filter((opp) => opp.location === location || opp.location === "Hybrid");
  }

  /**
   * Get mentor by ID
   */
  getMentor(mentorId: string): Mentor | null {
    return MENTORS.find((m) => m.id === mentorId) || null;
  }

  /**
   * Simulate mentor review (for demo purposes)
   */
  async simulateMentorReview(reviewId: string): Promise<MentorReview | null> {
    const review = reviewRequests.get(reviewId);
    if (!review) return null;

    // Simulate review delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mentor = this.getMentor(review.mentorId);
    const feedback: MentorReview["feedback"] = {
      overallRating: 4,
      isPathAppropriate: true,
      mentorNotes: `Great choice of path! The ${review.roadmapSnapshot.goal} roadmap looks well-structured. Focus on building projects to showcase your skills.`,
      encouragement: `You're on the right track! I've seen many learners from ${mentor?.location || 'our region'} succeed with this path. Keep going!`,
      suggestedChanges: review.roadmapSnapshot.skills.length < 5
        ? ["Consider adding more practical projects between skills"]
        : undefined,
    };

    return this.submitReview(reviewId, review.mentorId, feedback);
  }
}

export const mentorReviewService = new MentorReviewService();
