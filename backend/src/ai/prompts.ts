export const SYSTEM_PROMPT = `
You are the PathPilot Learning Assistant, designed to guide self-directed technology learners in Tier-2 Indian cities (such as Bhopal and Indore).

CORE BEHAVIORAL DIRECTIVES:
1. Speak in warm, beginner-friendly, accessible language. Avoid elitist jargon.
2. DO NOT invent fake URLs, mock external websites, or fabricate learning resources. The resources and skills have already been curated and provided to you in the prompt.
3. DO NOT guarantee jobs, employment, or specific salary outcomes.
4. Keep explanations practical, focused on building real skills step-by-step.
5. You MUST output ONLY valid JSON adhering strictly to the schema provided. Do not enclose in markdown blocks unless returning pure raw JSON text.
`.trim();

export function buildPathwayExplanationPrompt(learner: {
  goal: string;
  priorExposure?: string;
  currentSkills: string[];
  availableHoursPerDay: number;
  device: string;
  preferredLanguage?: string;
  city?: string;
}, steps: Array<{
  skillSlug: string;
  skillName: string;
  prerequisites: string[];
  resourceTitle?: string;
  projectTitle?: string;
}>): string {
  return `
Analyze this learner profile and the sequenced learning steps:

LEARNER PROFILE:
- Target Goal: ${learner.goal}
- Prior Exposure / Background: ${learner.priorExposure || 'Complete beginner'}
- Already Mastered Skills: ${learner.currentSkills.length ? learner.currentSkills.join(', ') : 'None'}
- Available Time: ${learner.availableHoursPerDay} hours/day
- Available Device: ${learner.device}
- Preferred Language: ${learner.preferredLanguage || 'English'}
- Location: ${learner.city || 'Bhopal'}

SEQUENCED LEARNING STEPS:
${steps.map((s, i) => `${i + 1}. [${s.skillSlug}] ${s.skillName} (Prereqs: ${s.prerequisites.join(', ') || 'None'}) - Resource: ${s.resourceTitle || 'Curated guide'} - Project: ${s.projectTitle || 'Mini checkpoint'}`).join('\n')}

Generate a JSON object matching this schema:
{
  "overview": "Short encouraging paragraph explaining the learning roadmap tailored to this learner's available time and device.",
  "stepExplanations": [
    {
      "skillSlug": "<exact slug from the input>",
      "whyNeeded": "Why this specific skill comes next in their progression toward their goal",
      "beginnerTip": "One actionable beginner tip for staying motivated or practicing this skill",
      "estimatedPace": "e.g. 5-7 days at ${learner.availableHoursPerDay} hr/day"
    }
  ],
  "encouragementMessage": "A short, grounded motivational sign-off."
}
`.trim();
}

export function buildReplanPrompt(learner: {
  goal: string;
  availableHoursPerDay: number;
}, context: {
  completedSteps: string[];
  currentBlockedStep?: string;
  learnerFeedback: string;
  remainingSteps: string[];
}): string {
  return `
A learner on PathPilot needs their learning pathway adjusted.

LEARNER DETAILS:
- Goal: ${learner.goal}
- Current Time: ${learner.availableHoursPerDay} hours/day
- Completed Steps: ${context.completedSteps.join(', ') || 'None yet'}
- Currently Blocked / Struggling On: ${context.currentBlockedStep || 'N/A'}
- Learner Feedback / Blocker Reason: "${context.learnerFeedback}"
- Remaining Steps: ${context.remainingSteps.join(', ')}

Generate a JSON object matching this schema:
{
  "summaryOfChanges": "Clear summary of how the pathway is being adjusted or paced to accommodate their current situation.",
  "reasonForAdjustment": "Compassionate explanation addressing their specific feedback.",
  "updatedPaceAdvice": "Practical pacing advice for their remaining steps.",
  "encouragement": "Supportive words reminding them that learning has natural plateaus and steady progress is what matters."
}
`.trim();
}

export function buildToolingExplanationPrompt(topic: string, learnerLevel: string): string {
  return `
Explain the tooling concept "${topic}" for a ${learnerLevel} learner in simple, clear language without assuming prior tech knowledge.

Generate a JSON object matching this schema:
{
  "title": "${topic}",
  "plainLanguageExplanation": "An intuitive real-world analogy or plain-language explanation of what this tool is and why developers use it.",
  "commonBeginnerMistakes": ["Mistake 1 beginners make", "Mistake 2 beginners make"],
  "quickPracticalStep": "A safe, concrete 2-minute action they can try right now on their machine."
}
`.trim();
}
