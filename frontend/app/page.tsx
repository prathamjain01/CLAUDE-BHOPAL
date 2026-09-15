"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGoals, checkHealth } from "@/lib/api/apiClient";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const router = useRouter();
  const [goals, setGoals] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<{ connected: boolean; aiAvailable: boolean }>({
    connected: false,
    aiAvailable: false,
  });
  const [customGoal, setCustomGoal] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [health, goalList] = await Promise.all([
          checkHealth().catch(() => null),
          getGoals().catch(() => []),
        ]);

        setApiStatus({
          connected: health?.status === "ok",
          aiAvailable: health?.aiAvailable || false,
        });
        setGoals(goalList || []);
        if (goalList && goalList.length > 0) {
          setSelectedGoal(goalList[0]);
        }
      } catch (error) {
        console.error("Failed to connect to API:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const handleStart = () => {
    const goal = customGoal.trim() || selectedGoal;
    const isCustom = customGoal.trim() ? "true" : "false";
    router.push(`/onboarding?goal=${encodeURIComponent(goal)}&custom=${isCustom}`);
  };

  const handleAddCustomGoal = () => {
    if (customGoal.trim()) {
      setSelectedGoal(customGoal.trim());
      setShowCustomInput(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col transition-colors">
      {/* Header */}
      <header className="p-4 border-b border-[var(--border-primary)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg">PathPilot</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  apiStatus.connected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-[var(--text-muted)]">
                {apiStatus.connected ? (apiStatus.aiAvailable ? "AI Ready" : "Connected") : "Offline"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Don't follow a roadmap.
              <br />
              <span className="text-[var(--accent)]">Follow your next move.</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-lg mx-auto">
              PathPilot tells you exactly what to learn next, gives you a free resource,
              and a project to prove your skill.
            </p>
          </div>

          {/* Goal Selection */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : goals.length > 0 ? (
            <div className="space-y-4">
              <p className="text-[var(--text-muted)] text-sm uppercase tracking-wider">I want to become a</p>
              <div className="flex flex-wrap justify-center gap-3">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => {
                      setSelectedGoal(goal);
                      setCustomGoal("");
                      setShowCustomInput(false);
                    }}
                    className={`px-6 py-3 rounded-xl border-2 transition-all ${
                      selectedGoal === goal && !customGoal
                        ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
                        : "border-[var(--border-primary)] hover:border-[var(--border-secondary)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {goal}
                  </button>
                ))}

                {/* Custom Goal Button */}
                {!showCustomInput ? (
                  <button
                    onClick={() => setShowCustomInput(true)}
                    className={`px-6 py-3 rounded-xl border-2 border-dashed transition-all ${
                      customGoal
                        ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
                        : "border-[var(--border-primary)] hover:border-[var(--accent)] text-[var(--text-muted)]"
                    }`}
                  >
                    {customGoal || "+ Custom"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCustomGoal()}
                      placeholder="e.g. Game Developer"
                      autoFocus
                      className="px-4 py-3 rounded-xl border-2 border-[var(--accent)] bg-[var(--bg-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none w-48"
                    />
                    <button
                      onClick={handleAddCustomGoal}
                      disabled={!customGoal.trim()}
                      className="w-12 h-12 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-bold text-xl transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomGoal("");
                      }}
                      className="w-12 h-12 rounded-xl border-2 border-[var(--border-primary)] hover:border-[var(--error)] text-[var(--text-muted)] hover:text-[var(--error)] transition"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[var(--error-muted)] border border-[var(--error)]">
              <p className="text-[var(--error)]">
                Cannot connect to backend. Make sure the server is running on port 5001.
              </p>
              <code className="block mt-2 text-sm text-[var(--text-muted)]">cd backend && PORT=5001 npm run dev</code>
            </div>
          )}

          {/* CTA Button */}
          {goals.length > 0 && (
            <button
              onClick={handleStart}
              disabled={!selectedGoal && !customGoal.trim()}
              className="px-8 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg text-white transition-all transform hover:scale-105"
            >
              {customGoal.trim() ? `Start as ${customGoal.trim()} →` : "Start My Journey →"}
            </button>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-[var(--border-primary)]">
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-left">
              <div className="w-10 h-10 rounded-lg bg-[var(--info-muted)] flex items-center justify-center mb-3">
                <span className="text-[var(--info)] text-xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-1">Skill GPS</h3>
              <p className="text-sm text-[var(--text-secondary)]">Know exactly what to learn next based on your goal</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-left">
              <div className="w-10 h-10 rounded-lg bg-[var(--success-muted)] flex items-center justify-center mb-3">
                <span className="text-[var(--success)] text-xl">📚</span>
              </div>
              <h3 className="font-semibold mb-1">Free Resources</h3>
              <p className="text-sm text-[var(--text-secondary)]">Curated free learning materials for each skill</p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] text-left">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center mb-3">
                <span className="text-[var(--accent)] text-xl">🏆</span>
              </div>
              <h3 className="font-semibold mb-1">Prove & Progress</h3>
              <p className="text-sm text-[var(--text-secondary)]">Build projects to prove skills before moving on</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-[var(--border-primary)] text-center text-sm text-[var(--text-muted)]">
        PathPilot - Built for self-directed learners
      </footer>
    </div>
  );
}
