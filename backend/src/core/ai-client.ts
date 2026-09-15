// =============================================================================
// AI CLIENT - Gemini Integration for PathPilot
// =============================================================================
// Uses Gemini for:
// - Explaining WHY a skill comes next
// - Personalizing guidance based on learner context
// - Re-planning when learner is stuck
//
// AI does NOT:
// - Invent skills or prerequisites (Skill Engine is source of truth)
// - Generate resource URLs (curated resources only)
// - Make employment promises
// =============================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-1.5-flash";
const MAX_RETRIES = 2;

let geminiClient: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
}

export interface AIRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export interface AIResponse {
  text: string;
  success: boolean;
}

/**
 * Call Gemini API with retry logic
 */
export async function callAI(request: AIRequest): Promise<AIResponse> {
  const genAI = getClient();

  if (!genAI) {
    console.warn("[AI] No GEMINI_API_KEY configured - using fallback responses");
    return { text: "", success: false };
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: request.systemPrompt,
      });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: request.userPrompt }] }],
        generationConfig: {
          maxOutputTokens: request.maxTokens || 1024,
          temperature: 0.7,
        },
      });

      const text = result.response.text();
      return { text, success: true };
    } catch (err) {
      console.error(`[AI] Attempt ${attempt} failed:`, err);
      if (attempt === MAX_RETRIES) {
        return { text: "", success: false };
      }
    }
  }

  return { text: "", success: false };
}

/**
 * Check if AI is available
 */
export function isAIAvailable(): boolean {
  return !!getClient();
}

// =============================================================================
// AI PROMPTS FOR PATHPILOT FEATURES
// =============================================================================

/**
 * Generate explanation for WHY this skill comes next
 */
export async function explainNextSkill(
  skillName: string,
  skillDescription: string,
  learnerGoal: string,
  knownSkills: string[],
  learnerName?: string
): Promise<string> {
  const response = await callAI({
    systemPrompt: `You are PathPilot, a friendly learning mentor for self-directed learners in India.
Your job is to explain WHY learning a specific skill is the right next step.
Keep explanations:
- Short (2-3 sentences max)
- Encouraging and motivational
- Focused on the practical benefit
- In simple English that a beginner can understand
Never mention jobs, salaries, or employment. Focus on skill building.`,

    userPrompt: `The learner${learnerName ? ` (${learnerName})` : ""} wants to become a ${learnerGoal}.
They already know: ${knownSkills.length > 0 ? knownSkills.join(", ") : "nothing yet"}.
Their next skill to learn is: ${skillName}
Skill description: ${skillDescription}

Write a short, encouraging explanation of why ${skillName} is the perfect next step for them.`,
  });

  if (!response.success) {
    return `${skillName} is your next step because it builds directly on what you already know and moves you closer to your goal of becoming a ${learnerGoal}. Let's do this!`;
  }

  return response.text.trim();
}

/**
 * Generate personalized tip for learning the skill
 */
export async function generateLearningTip(
  skillName: string,
  dailyMinutes: number,
  device: string
): Promise<string> {
  const response = await callAI({
    systemPrompt: `You are PathPilot, a learning mentor. Give ONE practical tip for learning a skill.
Keep it short (1-2 sentences), actionable, and encouraging.`,

    userPrompt: `Give a practical tip for someone learning ${skillName}.
They have ${dailyMinutes} minutes per day and use a ${device}.
One short tip:`,
  });

  if (!response.success) {
    return `Set a daily reminder and practice ${skillName} for ${dailyMinutes} minutes. Consistency beats intensity!`;
  }

  return response.text.trim();
}

/**
 * Generate help when learner is stuck
 */
export async function generateStuckHelp(
  skillName: string,
  projectTitle: string,
  stuckReason: string
): Promise<{ explanation: string; simplifiedSteps: string[]; encouragement: string }> {
  const response = await callAI({
    systemPrompt: `You are PathPilot, a patient learning mentor.
A learner is stuck on a project. Help them by:
1. Acknowledging their struggle (1 sentence)
2. Breaking down the problem into 3 simpler steps
3. Giving encouragement (1 sentence)

Output as JSON: {"explanation": "...", "simplifiedSteps": ["step1", "step2", "step3"], "encouragement": "..."}`,

    userPrompt: `Skill: ${skillName}
Project: ${projectTitle}
Why they're stuck: ${stuckReason}

Help them get unstuck. Output JSON only.`,
  });

  if (!response.success) {
    return {
      explanation: `Getting stuck is part of learning ${skillName}. Let's break this down together.`,
      simplifiedSteps: [
        "Take a 5-minute break and come back fresh",
        "Re-read the resource section on this topic",
        "Try building just the first small part, then add more",
      ],
      encouragement: "Every developer gets stuck. The ones who succeed are the ones who keep trying!",
    };
  }

  try {
    // Extract JSON from response
    const jsonMatch = response.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fall through to default
  }

  return {
    explanation: `Let's work through this ${skillName} challenge together.`,
    simplifiedSteps: [
      "Review the basics one more time",
      "Start with the simplest version possible",
      "Add features one at a time",
    ],
    encouragement: "You're closer than you think. Keep going!",
  };
}

/**
 * Generate completion celebration message
 */
export async function generateCompletionMessage(
  skillName: string,
  projectTitle: string,
  nextSkillName?: string
): Promise<string> {
  const response = await callAI({
    systemPrompt: `You are PathPilot. A learner just completed a skill checkpoint.
Write a SHORT (2 sentences max) celebration message. Be genuine, not over the top.
If there's a next skill, mention it briefly.`,

    userPrompt: `Learner completed: ${skillName} by building "${projectTitle}"
${nextSkillName ? `Next skill: ${nextSkillName}` : "This was their final skill!"}

Write a celebration message:`,
  });

  if (!response.success) {
    if (nextSkillName) {
      return `Great work completing ${skillName}! You've proven you can build real things. Ready for ${nextSkillName}?`;
    }
    return `Congratulations! You've completed ${skillName} and built ${projectTitle}. You should be proud of how far you've come!`;
  }

  return response.text.trim();
}
