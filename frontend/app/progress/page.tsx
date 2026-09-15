"use client";

import { useState } from "react";
import Link from "next/link";

interface SkillItem {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Systems" | "AI & Cloud";
  proficiency: number;
  verified: boolean;
}

export default function ProgressPage() {
  const [skills, setSkills] = useState<SkillItem[]>([
    { id: "s1", name: "JavaScript & ES6+", category: "Frontend", proficiency: 86, verified: true },
    { id: "s2", name: "TypeScript & Generics", category: "Frontend", proficiency: 78, verified: true },
    { id: "s3", name: "React 19 & Next.js", category: "Frontend", proficiency: 72, verified: true },
    { id: "s4", name: "Node.js & Express", category: "Backend", proficiency: 61, verified: true },
    { id: "s5", name: "PostgreSQL & Prisma", category: "Backend", proficiency: 54, verified: false },
    { id: "s6", name: "JWT & OAuth2 Security", category: "Backend", proficiency: 68, verified: true },
    { id: "s7", name: "System Design & Caching", category: "Systems", proficiency: 38, verified: false },
    { id: "s8", name: "Redis & Rate Limiting", category: "Systems", proficiency: 42, verified: false },
    { id: "s9", name: "Docker Containerization", category: "Systems", proficiency: 50, verified: false },
    { id: "s10", name: "Vector Databases & RAG", category: "AI & Cloud", proficiency: 24, verified: false },
    { id: "s11", name: "LLM API Integration", category: "AI & Cloud", proficiency: 45, verified: false },
    { id: "s12", name: "GitHub Actions CI/CD", category: "AI & Cloud", proficiency: 55, verified: true },
  ]);

  const toggleVerify = (id: string) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, verified: !s.verified, proficiency: s.verified ? Math.max(10, s.proficiency - 15) : Math.min(100, s.proficiency + 15) } : s))
    );
  };

  const avgProficiency = Math.round(
    skills.reduce((acc, s) => acc + s.proficiency, 0) / skills.length
  );

  const categories = ["Frontend", "Backend", "Systems", "AI & Cloud"] as const;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 md:px-8 py-8 text-text-primary">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-border-subtle">
        <div>
          <span className="font-label-caps text-label-caps text-primary block mb-2">VERIFIED COMPETENCY RADAR</span>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary">
            Skill Gap &amp; Readiness Analysis
          </h1>
          <p className="font-body-sm text-text-secondary mt-1">
            Tracking 12 target competencies for AI / Full-Stack Engineer.
          </p>
        </div>

        {/* Readiness Meter Card */}
        <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle flex items-center gap-6 min-w-[240px]">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-container-high"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary-container transition-all duration-700"
                strokeDasharray={`${avgProficiency}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-headline-md text-primary font-bold text-sm">
              {avgProficiency}%
            </span>
          </div>
          <div>
            <span className="font-label-code text-text-muted text-xs block">CURRENT READINESS</span>
            <span className="font-title-sm text-text-primary text-sm">Market Ready in ~9 Wks</span>
          </div>
        </div>
      </div>

      {/* Recommended Focus Card */}
      <div className="mb-8 p-5 rounded-xl bg-orange-subtle-bg border border-primary-container/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-surface-deep flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </div>
          <div>
            <h4 className="font-title-sm text-text-primary text-sm">Highest Leverage Skill: System Design &amp; Caching</h4>
            <p className="font-body-sm text-text-secondary text-xs">
              Closing this 38% gap will increase your overall readiness score to 74%.
            </p>
          </div>
        </div>
        <Link
          href="/pathway"
          className="px-4 py-2 rounded-lg bg-primary-container text-surface-deep font-title-sm text-xs flex items-center gap-2 hover:bg-primary transition-all flex-shrink-0"
        >
          <span>Open Module Spec</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>

      {/* Skill Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat);
          return (
            <div key={cat} className="p-6 rounded-xl bg-surface-raised border border-border-subtle">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-subtle">
                <h3 className="font-title-sm text-text-primary">{cat}</h3>
                <span className="font-label-code text-text-muted text-xs">{catSkills.length} Skills</span>
              </div>

              <div className="space-y-4">
                {catSkills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVerify(skill.id)}
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                            skill.verified
                              ? "bg-primary-container text-surface-deep"
                              : "border border-border-subtle hover:border-primary"
                          }`}
                          title={skill.verified ? "Verified skill" : "Click to mark practiced"}
                        >
                          {skill.verified && <span className="material-symbols-outlined text-[12px] font-bold">check</span>}
                        </button>
                        <span className="text-text-primary font-medium">{skill.name}</span>
                      </div>
                      <span className="font-label-code text-text-secondary">{skill.proficiency}%</span>
                    </div>

                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          skill.proficiency >= 70
                            ? "bg-primary"
                            : skill.proficiency >= 40
                            ? "bg-primary-container"
                            : "bg-error"
                        }`}
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
