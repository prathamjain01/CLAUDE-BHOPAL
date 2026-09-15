"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { startSession, saveLearnerId, getGoals } from "@/lib/api/apiClient";
import ThemeToggle from "@/components/ThemeToggle";

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedGoal = searchParams.get("goal") || "";

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState<string[]>([]);

  // Form state
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(preselectedGoal);
  const [customGoal, setCustomGoal] = useState("");
  const [isCustomGoal, setIsCustomGoal] = useState(false);
  const [device, setDevice] = useState("laptop");
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [background, setBackground] = useState("");

  const skillOptions = [
    "HTML/CSS",
    "JavaScript",
    "Git",
    "React",
    "Node.js",
    "Python",
    "SQL",
    "TypeScript",
  ];

  const timeOptions = [
    { value: 30, label: "30 min/day", desc: "Casual pace" },
    { value: 60, label: "1 hour/day", desc: "Steady progress" },
    { value: 120, label: "2+ hours/day", desc: "Fast track" },
  ];

  useEffect(() => {
    getGoals()
      .then(setGoals)
      .catch(() => setGoals(["Frontend Developer", "Backend Developer", "Fullstack Developer"]));
  }, []);

  useEffect(() => {
    if (preselectedGoal) {
      setGoal(preselectedGoal);
    }
  }, [preselectedGoal]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    const skill = customSkillInput.trim();
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills((prev) => [...prev, skill]);
      setCustomSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleStart = async () => {
    const finalGoal = isCustomGoal ? customGoal : goal;

    if (!finalGoal) {
      setError("Please select or enter a goal");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await startSession({
        goal: finalGoal,
        currentSkills: selectedSkills,
        dailyMinutes,
        device,
        name: name || undefined,
        isCustomGoal,
        background: background || undefined,
      });

      saveLearnerId(response.learnerId);
      router.push("/pathway");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start session");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      {/* Header */}
      <header className="p-4 border-b border-[var(--border-primary)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
          >
            <span className="text-xl">←</span>
            <span>Back</span>
          </button>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-1 rounded-full transition-all ${
                    i <= step ? "bg-[var(--accent)]" : "bg-[var(--border-secondary)]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Step 1: Name & Goal */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">Let's get started</h1>
              <p className="text-[var(--text-secondary)]">Tell us about yourself and your goals</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:border-[var(--accent)] focus:outline-none transition text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm text-[var(--text-secondary)]">
                    What do you want to become?
                  </label>
                  <button
                    onClick={() => {
                      setIsCustomGoal(!isCustomGoal);
                      if (!isCustomGoal) {
                        setGoal("");
                      } else {
                        setCustomGoal("");
                      }
                    }}
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    {isCustomGoal ? "Choose from list" : "Enter custom goal"}
                  </button>
                </div>

                {isCustomGoal ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      placeholder="e.g., AI Product Manager, Blockchain Developer, Game Designer..."
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:border-[var(--accent)] focus:outline-none transition text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                    />
                    <div className="p-3 bg-[var(--accent-muted)] rounded-lg">
                      <p className="text-sm text-[var(--accent)]">
                        AI will create a personalized learning path based on your custom goal
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 max-h-64 overflow-y-auto">
                    {goals.map((g) => (
                      <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          goal === g
                            ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                            : "border-[var(--border-primary)] hover:border-[var(--border-secondary)]"
                        }`}
                      >
                        <span className="font-medium">{g}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Tell us about yourself (optional but helps AI personalize)
                </label>
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  placeholder="e.g., I'm a marketing professional looking to transition into tech, I have some Excel experience..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:border-[var(--accent)] focus:outline-none transition text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!goal && !customGoal}
              className="w-full py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">What do you already know?</h1>
              <p className="text-[var(--text-secondary)]">Select from common skills or add your own</p>
            </div>

            {/* Quick select common skills */}
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-3">
                Common skills (tap to select)
              </label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                      selectedSkills.includes(skill)
                        ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
                        : "border-[var(--border-primary)] hover:border-[var(--border-secondary)]"
                    }`}
                  >
                    {selectedSkills.includes(skill) && <span className="mr-1">✓</span>}
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Add custom skill */}
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                Add other skills you know
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomSkill()}
                  placeholder="e.g., Figma, Excel, Photoshop, Java..."
                  className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl focus:border-[var(--accent)] focus:outline-none transition text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
                <button
                  onClick={addCustomSkill}
                  disabled={!customSkillInput.trim()}
                  className="px-6 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium text-white transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Selected skills display */}
            {selectedSkills.length > 0 && (
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Your skills ({selectedSkills.length})
                </label>
                <div className="flex flex-wrap gap-2 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[var(--accent-muted)] text-[var(--accent)] rounded-lg text-sm"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-[var(--error)] transition"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedSkills.length === 0 && (
              <p className="text-center text-sm text-[var(--text-muted)] py-4">
                No skills selected yet. Select from above or add your own, or skip if you're starting fresh.
              </p>
            )}

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 border border-[var(--border-primary)] hover:border-[var(--border-secondary)] rounded-xl font-medium transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-xl font-semibold text-white transition"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Time & Device */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">How will you learn?</h1>
              <p className="text-[var(--text-secondary)]">Set your pace and environment</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-3">
                  Daily time commitment
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {timeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDailyMinutes(opt.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        dailyMinutes === opt.value
                          ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                          : "border-[var(--border-primary)] hover:border-[var(--border-secondary)]"
                      }`}
                    >
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{opt.desc}</div>
                    </button>
                  ))}

                  {/* Custom hours option */}
                  <button
                    onClick={() => {
                      const hours = prompt("Enter hours per day (e.g., 1.5, 3, 4):");
                      if (hours) {
                        const parsed = parseFloat(hours);
                        if (!isNaN(parsed) && parsed > 0 && parsed <= 8) {
                          setDailyMinutes(Math.round(parsed * 60));
                        }
                      }
                    }}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      ![30, 60, 120].includes(dailyMinutes)
                        ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                        : "border-[var(--border-primary)] hover:border-[var(--border-secondary)]"
                    }`}
                  >
                    <div className="font-semibold">
                      {![30, 60, 120].includes(dailyMinutes)
                        ? `${Math.round(dailyMinutes / 60 * 10) / 10}h/day`
                        : "+ Custom"}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {![30, 60, 120].includes(dailyMinutes)
                        ? "Your pace"
                        : "Set hours"}
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-3">
                  Primary device
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "laptop", label: "Laptop/Desktop", icon: "💻" },
                    { value: "mobile", label: "Mobile", icon: "📱" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDevice(opt.value)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        device === opt.value
                          ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                          : "border-[var(--border-primary)] hover:border-[var(--border-secondary)]"
                      }`}
                    >
                      <div className="text-2xl mb-1">{opt.icon}</div>
                      <div className="font-medium">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-[var(--error-muted)] border border-[var(--error)] rounded-xl text-[var(--error)] text-center">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-4 border border-[var(--border-primary)] hover:border-[var(--border-secondary)] rounded-xl font-medium transition"
              >
                Back
              </button>
              <button
                onClick={handleStart}
                disabled={isLoading}
                className="flex-1 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating your path...
                  </>
                ) : (
                  "Start Learning →"
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
