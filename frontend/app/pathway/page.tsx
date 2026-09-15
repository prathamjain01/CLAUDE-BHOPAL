"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getStoredLearnerId,
  getLearnerState,
  getProgress,
  updateCheckpoint,
  getNextMove,
  clearLearnerId,
  type LearnerState,
  type ProgressResponse,
  type NextMoveResponse,
} from "@/lib/api/apiClient";
import ThemeToggle from "@/components/ThemeToggle";

type CheckpointStatus = "NOT_STARTED" | "LEARNING" | "BUILDING" | "STUCK" | "COMPLETED";

export default function PathwayPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [learnerState, setLearnerState] = useState<LearnerState | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [nextMove, setNextMove] = useState<NextMoveResponse | null>(null);
  const [stuckReason, setStuckReason] = useState("");
  const [showStuckModal, setShowStuckModal] = useState(false);
  const [stuckHelp, setStuckHelp] = useState<{
    explanation: string;
    simplifiedSteps: string[];
    encouragement: string;
  } | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const learnerId = getStoredLearnerId();
    if (!learnerId) {
      router.push("/");
      return;
    }

    async function loadData() {
      try {
        const [state, prog] = await Promise.all([
          getLearnerState(learnerId!),
          getProgress(learnerId!),
        ]);
        setLearnerState(state);
        setProgress(prog);

        const move = await getNextMove({
          goal: state.goal,
          currentSkills: state.currentSkills,
          dailyMinutes: state.dailyMinutes,
          device: state.device,
          name: state.name,
        });
        setNextMove(move);
      } catch {
        setError("Failed to load learning data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleStatusUpdate = async (status: CheckpointStatus) => {
    const learnerId = getStoredLearnerId();
    if (!learnerId) return;

    setUpdating(true);
    try {
      const response = await updateCheckpoint(
        learnerId,
        status as "LEARNING" | "BUILDING" | "STUCK" | "COMPLETED",
        status === "STUCK" ? stuckReason : undefined
      );

      if (response.success) {
        setLearnerState(response.learnerState);
        if (response.stuckHelp) {
          setStuckHelp(response.stuckHelp);
        }
        if (response.nextMove) {
          setNextMove(response.nextMove);
        }
        const prog = await getProgress(learnerId);
        setProgress(prog);
      }
    } catch {
      setError("Failed to update status");
    } finally {
      setUpdating(false);
      setShowStuckModal(false);
      setStuckReason("");
    }
  };

  const handleReset = () => {
    clearLearnerId();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading your path...</p>
        </div>
      </div>
    );
  }

  if (error || !learnerState || !nextMove) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center transition-colors">
        <div className="text-center max-w-md">
          <p className="text-[var(--error)] mb-4">{error || "No learning session found"}</p>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-[var(--accent)] text-white rounded-xl font-semibold"
          >
            Start Fresh
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = learnerState.currentCheckpoint?.status || "NOT_STARTED";
  const skill = nextMove.nextMove?.skill;
  const resources = nextMove.resources || [];
  const claudePrompt = nextMove.claudePrompt;
  const project = nextMove.project;
  const [showClaudePrompt, setShowClaudePrompt] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      {/* Header */}
      <header className="p-4 border-b border-[var(--border-primary)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="font-bold text-sm text-white">P</span>
            </div>
            <div>
              <span className="font-semibold">PathPilot</span>
              {learnerState.name && (
                <span className="text-[var(--text-secondary)] text-sm ml-2">Hi, {learnerState.name}!</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleReset}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition"
            >
              Start Over
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        {progress && (
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--text-secondary)]">Progress to {learnerState.goal}</span>
              <span className="text-[var(--accent)] font-semibold">
                {progress.completedSkills}/{progress.totalSkills} skills ({progress.progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-hover)] rounded-full transition-all duration-500"
                style={{ width: `${progress.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Completion State */}
        {nextMove.isComplete ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Congratulations!</h1>
            <p className="text-[var(--text-secondary)] mb-8">
              You've completed all skills for {learnerState.goal}!
            </p>
            <button
              onClick={handleReset}
              className="px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-semibold transition"
            >
              Start a New Journey
            </button>
          </div>
        ) : skill ? (
          <>
            {/* Current Skill Card */}
            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] overflow-hidden mb-6">
              <div className="p-6 border-b border-[var(--border-primary)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[var(--accent-muted)] text-[var(--accent)] rounded-full text-sm font-medium">
                    Next Skill
                  </span>
                  <span className="text-[var(--text-muted)] text-sm">
                    ~{skill.estimatedDays || skill.estimatedHours} {skill.estimatedDays ? 'days' : 'hours'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{skill.name}</h2>
                {skill.description && (
                  <p className="text-[var(--text-secondary)]">{skill.description}</p>
                )}
                {nextMove.nextMove?.whyThisSkill && (
                  <div className="mt-4 p-4 bg-[var(--bg-tertiary)] rounded-xl">
                    <p className="text-sm text-[var(--text-secondary)]">
                      <span className="text-[var(--accent)] font-medium">Why this skill? </span>
                      {nextMove.nextMove.whyThisSkill}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Flow */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  {["LEARNING", "BUILDING", "COMPLETED"].map((status, i) => (
                    <div key={status} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          currentStatus === status
                            ? "bg-[var(--accent)] text-white"
                            : currentStatus === "COMPLETED" ||
                              (currentStatus === "BUILDING" && status === "LEARNING")
                            ? "bg-[var(--success)] text-white"
                            : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                        }`}
                      >
                        {i + 1}
                      </div>
                      {i < 2 && (
                        <div
                          className={`w-12 h-1 ${
                            (currentStatus === "BUILDING" && status === "LEARNING") ||
                            currentStatus === "COMPLETED"
                              ? "bg-[var(--success)]"
                              : "bg-[var(--bg-tertiary)]"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div className={currentStatus === "LEARNING" ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>
                    Learn
                  </div>
                  <div className={currentStatus === "BUILDING" ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}>
                    Build
                  </div>
                  <div className={currentStatus === "COMPLETED" ? "text-[var(--success)]" : "text-[var(--text-muted)]"}>
                    Prove
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Card - Multiple Resources */}
            {resources.length > 0 && (currentStatus === "NOT_STARTED" || currentStatus === "LEARNING") && (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[var(--info)] text-sm font-medium">Free Learning Resources</span>
                  <span className="text-[var(--text-muted)] text-sm">{resources.length} options</span>
                </div>

                <div className="space-y-3 mb-6">
                  {resources.map((resource, index) => (
                    <a
                      key={resource.id || index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-[var(--bg-tertiary)] rounded-xl hover:bg-[var(--bg-hover)] transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          resource.type === 'video' ? 'bg-red-500/10 text-red-500' :
                          resource.type === 'course' ? 'bg-green-500/10 text-green-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {resource.type === 'video' ? '▶' : resource.type === 'course' ? '📚' : '📄'}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{resource.title}</h4>
                          <p className="text-xs text-[var(--text-muted)]">
                            {resource.provider} • {resource.type} • {resource.durationMinutes < 60 ? `${resource.durationMinutes}m` : `${Math.round(resource.durationMinutes / 60)}h`}
                          </p>
                        </div>
                      </div>
                      <span className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition">→</span>
                    </a>
                  ))}
                </div>

                {/* Claude Prompt Section */}
                {claudePrompt && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowClaudePrompt(!showClaudePrompt)}
                      className="w-full flex items-center justify-between p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <span className="text-purple-500">🤖</span>
                        </div>
                        <div className="text-left">
                          <h4 className="font-medium text-sm text-purple-400">Learn with Claude AI</h4>
                          <p className="text-xs text-[var(--text-muted)]">Get a personalized tutor prompt</p>
                        </div>
                      </div>
                      <span className="text-purple-400">{showClaudePrompt ? '▲' : '▼'}</span>
                    </button>

                    {showClaudePrompt && (
                      <div className="mt-3 p-4 bg-[var(--bg-tertiary)] rounded-xl">
                        <p className="text-xs text-[var(--text-muted)] mb-2">Copy this prompt and paste it to Claude:</p>
                        <pre className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap bg-[var(--bg-secondary)] p-4 rounded-lg overflow-x-auto max-h-48 overflow-y-auto">
                          {claudePrompt}
                        </pre>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(claudePrompt);
                            alert("Prompt copied to clipboard!");
                          }}
                          className="mt-3 w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition"
                        >
                          Copy Prompt
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {currentStatus === "NOT_STARTED" && (
                  <button
                    onClick={() => handleStatusUpdate("LEARNING")}
                    disabled={updating}
                    className="w-full py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white rounded-xl font-semibold transition"
                  >
                    {updating ? "Starting..." : "Start Learning"}
                  </button>
                )}

                {currentStatus === "LEARNING" && (
                  <button
                    onClick={() => handleStatusUpdate("BUILDING")}
                    disabled={updating}
                    className="w-full py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white rounded-xl font-semibold transition"
                  >
                    {updating ? "Updating..." : "Done Learning → Start Building"}
                  </button>
                )}
              </div>
            )}

            {/* Project Card */}
            {project && (currentStatus === "BUILDING" || currentStatus === "STUCK") && (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-purple-500 dark:text-purple-400 text-sm font-medium">Mini Project</span>
                    <h3 className="text-xl font-semibold mt-1">{project.title}</h3>
                  </div>
                  <span className="text-[var(--text-muted)] text-sm">~{project.estimatedHours}h</span>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">{project.description}</p>

                <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mb-4">
                  <h4 className="font-medium mb-3 text-sm text-[var(--text-secondary)]">Acceptance Criteria:</h4>
                  <ul className="space-y-2">
                    {project.acceptanceCriteria.map((criteria, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[var(--accent)] mt-0.5">•</span>
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>

                {project.starterHint && (
                  <div className="bg-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-xl p-4 mb-4">
                    <p className="text-sm text-[var(--warning)]">
                      <span className="font-medium">Hint: </span>
                      {project.starterHint}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowStuckModal(true)}
                    className="flex-1 py-3 border border-[var(--border-primary)] hover:border-[var(--accent)] rounded-xl font-medium transition"
                  >
                    I'm Stuck
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("COMPLETED")}
                    disabled={updating}
                    className="flex-1 py-3 bg-[var(--success)] hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-semibold transition"
                  >
                    {updating ? "Verifying..." : "I've Completed This!"}
                  </button>
                </div>
              </div>
            )}

            {/* Stuck Help Card */}
            {stuckHelp && (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--accent)]/30 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">💡</span>
                  <h3 className="text-lg font-semibold">Let me help you</h3>
                </div>
                <p className="text-[var(--text-secondary)] mb-4">{stuckHelp.explanation}</p>
                <div className="bg-[var(--bg-tertiary)] rounded-xl p-4 mb-4">
                  <h4 className="font-medium mb-2 text-sm">Try these steps:</h4>
                  <ol className="space-y-2">
                    {stuckHelp.simplifiedSteps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[var(--accent)] font-medium">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="text-[var(--accent)] text-sm italic">{stuckHelp.encouragement}</p>
                <button
                  onClick={() => {
                    setStuckHelp(null);
                    handleStatusUpdate("BUILDING");
                  }}
                  className="w-full mt-4 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl font-semibold transition"
                >
                  Got it, let me try again
                </button>
              </div>
            )}

            {/* Completed Skills */}
            {progress && progress.completedList.length > 0 && (
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)] p-6">
                <h3 className="font-semibold mb-4">Skills Completed</h3>
                <div className="flex flex-wrap gap-2">
                  {progress.completedList.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[var(--success-muted)] text-[var(--success)] rounded-full text-sm"
                    >
                      ✓ {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* Stuck Modal */}
      {showStuckModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 max-w-md w-full border border-[var(--border-primary)]">
            <h3 className="text-xl font-bold mb-4">What are you stuck on?</h3>
            <textarea
              value={stuckReason}
              onChange={(e) => setStuckReason(e.target.value)}
              placeholder="Describe what's confusing you..."
              className="w-full h-32 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:border-[var(--accent)] focus:outline-none resize-none mb-4 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStuckModal(false);
                  setStuckReason("");
                }}
                className="flex-1 py-3 border border-[var(--border-primary)] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate("STUCK")}
                disabled={!stuckReason.trim() || updating}
                className="flex-1 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white rounded-xl font-semibold"
              >
                {updating ? "Getting help..." : "Get Help"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
