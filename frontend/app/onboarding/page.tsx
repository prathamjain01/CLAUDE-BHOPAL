"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Intake State
  const [targetGoal, setTargetGoal] = useState("AI / Full-Stack Engineer");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["JavaScript", "HTML/CSS"]);
  const [timeCommitment, setTimeCommitment] = useState("10-15 hrs / week");
  const [deviceType, setDeviceType] = useState("Laptop / PC");
  const [locationPreference, setLocationPreference] = useState("Hybrid / Remote");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/pathway");
    }, 1200);
  };

  const goals = [
    { title: "AI / Full-Stack Engineer", icon: "terminal", desc: "Build modern web apps with integrated LLM APIs." },
    { title: "AI / ML Specialist", icon: "psychology", desc: "Fine-tune models and build RAG pipelines." },
    { title: "Cloud & DevOps Engineer", icon: "cloud", desc: "Kubernetes, CI/CD pipelines, and cloud infra." },
    { title: "Data Analyst / BI", icon: "analytics", desc: "Data insights, SQL querying, and dashboards." },
  ];

  const skillOptions = [
    "HTML/CSS", "JavaScript", "TypeScript", "React", "Node.js", 
    "Python", "SQL", "Git", "Docker", "REST APIs"
  ];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 md:px-8 py-8 text-text-primary">
      {/* Top Breadcrumb & Progress */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 text-xs font-label-code">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Home</span>
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-primary font-label-code text-xs">Roadmap Intake</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-code text-xs text-text-muted">Step {step} of 3</span>
          <div className="w-24 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary-container h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step 1: Goal */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-label-caps text-label-caps text-primary block mb-2">CAREER DIRECTION</span>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary mb-3">
              What role are you targeting?
            </h1>
            <p className="font-body-md text-text-secondary">
              SkillCompass will reverse-engineer the required competencies and projects for your target position.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {goals.map((g) => {
              const active = targetGoal === g.title;
              return (
                <div
                  key={g.title}
                  onClick={() => setTargetGoal(g.title)}
                  className={`p-5 rounded-xl bg-surface-raised border cursor-pointer transition-all ${
                    active
                      ? "border-primary-container bg-surface-container shadow-[0_0_16px_rgba(255,107,53,0.15)] ring-1 ring-primary-container/40"
                      : "border-border-subtle hover:border-border-bold"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-primary-container text-surface-deep" : "bg-surface-container text-primary"}`}>
                      <span className="material-symbols-outlined text-[20px]">{g.icon}</span>
                    </div>
                    {active && <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>}
                  </div>
                  <h3 className="font-title-sm text-text-primary mb-1">{g.title}</h3>
                  <p className="font-body-sm text-text-secondary">{g.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3.5 rounded-lg bg-primary-container text-surface-deep font-title-sm hover:bg-primary transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,53,0.3)]"
            >
              <span>Next: Current Skills</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Current Skills */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-label-caps text-label-caps text-primary block mb-2">DIAGNOSTIC BASELINE</span>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary mb-3">
              What do you already know?
            </h1>
            <p className="font-body-md text-text-secondary">
              Select any technologies or concepts you have touched. We will skip the basics and pinpoint your delta.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto py-4">
            {skillOptions.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-label-code transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-primary-container text-surface-deep border-primary-container font-semibold shadow-[0_0_12px_rgba(255,107,53,0.3)]"
                      : "bg-surface-raised border-border-subtle text-text-secondary hover:border-border-bold hover:text-text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isSelected ? "check" : "add"}
                  </span>
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-lg bg-surface-container border border-border-subtle text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-8 py-3.5 rounded-lg bg-primary-container text-surface-deep font-title-sm hover:bg-primary transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,53,0.3)]"
            >
              <span>Next: Study Constraints</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Commitment & Environment */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="font-label-caps text-label-caps text-primary block mb-2">PRACTICAL CADENCE</span>
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary mb-3">
              How will you study?
            </h1>
            <p className="font-body-md text-text-secondary">
              Set realistic goals so your milestones adapt to your life schedule.
            </p>
          </div>

          <div className="space-y-4 max-w-xl mx-auto">
            <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle">
              <label className="font-title-sm text-text-primary block mb-2">Available Time</label>
              <div className="grid grid-cols-3 gap-2">
                {["5-10 hrs / week", "10-15 hrs / week", "20+ hrs / week"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeCommitment(t)}
                    className={`py-2 px-3 rounded-lg text-xs font-label-code border transition-all ${
                      timeCommitment === t
                        ? "bg-primary-container text-surface-deep border-primary-container font-bold"
                        : "bg-surface-container border-border-subtle text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle">
              <label className="font-title-sm text-text-primary block mb-2">Primary Workstation</label>
              <div className="grid grid-cols-2 gap-2">
                {["Laptop / PC", "Mobile + Shared PC"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDeviceType(d)}
                    className={`py-2 px-3 rounded-lg text-xs font-label-code border transition-all ${
                      deviceType === d
                        ? "bg-primary-container text-surface-deep border-primary-container font-bold"
                        : "bg-surface-container border-border-subtle text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle">
              <label className="font-title-sm text-text-primary block mb-2">Location Preference</label>
              <div className="grid grid-cols-2 gap-2">
                {["Hybrid / Remote", "Bhopal / Central India"].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocationPreference(loc)}
                    className={`py-2 px-3 rounded-lg text-xs font-label-code border transition-all ${
                      locationPreference === loc
                        ? "bg-primary-container text-surface-deep border-primary-container font-bold"
                        : "bg-surface-container border-border-subtle text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-lg bg-surface-container border border-border-subtle text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              Back
            </button>
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-lg bg-primary-container text-surface-deep font-title-sm hover:bg-primary transition-all flex items-center gap-2 shadow-[0_0_24px_rgba(255,107,53,0.4)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-surface-deep border-t-transparent animate-spin" />
                  <span>Synthesizing Custom Path...</span>
                </>
              ) : (
                <>
                  <span>Generate My Roadmap</span>
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
