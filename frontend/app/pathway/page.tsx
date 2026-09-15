"use client";

import { useState } from "react";
import Link from "next/link";

interface CheckpointItem {
  id: string;
  label: string;
  done: boolean;
}

export default function PathwayPage() {
  const [activeStage, setActiveStage] = useState(2);
  const [replanState, setReplanState] = useState<string | null>(null);

  // Mini-project acceptance criteria checkboxes
  const [criteria, setCriteria] = useState<CheckpointItem[]>([
    { id: "c1", label: "Implement token bucket rate limiter with sliding window logs", done: true },
    { id: "c2", label: "Configure Redis connection pool with fallbacks", done: true },
    { id: "c3", label: "Expose Express middleware returning 429 Too Many Requests", done: false },
    { id: "c4", label: "Write automated integration tests with supertest", done: false },
    { id: "c5", label: "Containerize service with Docker Compose", done: false },
  ]);

  const toggleCriteria = (id: string) => {
    setCriteria((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = criteria.filter((c) => c.done).length;
  const projectProgress = Math.round((completedCount / criteria.length) * 100);

  const stages = [
    {
      stageNumber: 1,
      title: "Foundations & Tooling",
      status: "Completed",
      duration: "3 Weeks",
      projects: "4 Projects",
      skills: ["Advanced JavaScript", "TypeScript Generics", "Git Branching", "RESTful Design"],
    },
    {
      stageNumber: 2,
      title: "Full-Stack Architecture & APIs",
      status: "In Progress",
      duration: "4 Weeks",
      projects: "6 Projects",
      skills: ["Node.js Microservices", "PostgreSQL Indexes & Transactions", "JWT / OAuth2", "Docker Basics"],
    },
    {
      stageNumber: 3,
      title: "System Design & Scaling",
      status: "Up Next",
      duration: "5 Weeks",
      projects: "3 Projects",
      skills: ["Redis Caching", "Message Queues (RabbitMQ/Kafka)", "Horizontal Scaling & Load Balancing", "Database Sharding"],
    },
    {
      stageNumber: 4,
      title: "AI Integration & LLM Systems",
      status: "Upcoming",
      duration: "4 Weeks",
      projects: "5 Projects",
      skills: ["Vector DBs (Pinecone/Milvus)", "RAG Pipelines", "Prompt Engineering", "OpenAI & Anthropic APIs"],
    },
    {
      stageNumber: 5,
      title: "DevOps & Cloud Deployment",
      status: "Upcoming",
      duration: "3 Weeks",
      projects: "3 Projects",
      skills: ["AWS ECS / EKS", "CI/CD with GitHub Actions", "Terraform IaC", "Grafana & Prometheus"],
    },
    {
      stageNumber: 6,
      title: "Career Ready Capstone & Interviews",
      status: "Upcoming",
      duration: "2 Weeks",
      projects: "Capstone",
      skills: ["System Design Mock Interviews", "Portfolio Review", "Live Coding Drills", "Resume Tailoring"],
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 md:px-8 py-8 text-text-primary">
      {/* Top Pathway Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-subtle">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-subtle-bg border border-primary-container/30 text-primary font-label-code text-xs mb-3">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
            <span>Target Role: AI / Full-Stack Engineer</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary">
            Curated Learning Pathway
          </h1>
          <p className="font-body-sm text-text-secondary mt-1">
            Stage 02 of 06 • Estimated time remaining: 3.5 months
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setReplanState(replanState ? null : "open")}
            className="px-4 py-2.5 rounded-lg bg-surface-container border border-border-subtle hover:border-primary text-text-primary font-title-sm text-xs flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Adjust Pace / Re-plan</span>
          </button>
          <Link
            href="/progress"
            className="px-4 py-2.5 rounded-lg bg-primary-container text-surface-deep font-title-sm text-xs flex items-center gap-2 hover:bg-primary transition-all shadow-[0_0_16px_rgba(255,107,53,0.3)]"
          >
            <span>View Skill Progress</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Re-plan Accordion Card */}
      {replanState && (
        <div className="mb-8 p-6 rounded-2xl bg-surface-raised border border-primary-container/40 shadow-xl animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-title-sm text-text-primary">How is this step going?</h3>
            <button
              onClick={() => setReplanState(null)}
              className="text-text-muted hover:text-text-primary text-xs font-label-code"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Completed early", desc: "Advance to Stage 3 now" },
              { label: "Need more practice", desc: "Add 1 targeted mini-project" },
              { label: "I am stuck", desc: "Connect with AI Coach for tips" },
              { label: "Time changed", desc: "Recalibrate weekly duration" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  alert(`Plan adjusted: ${opt.desc}`);
                  setReplanState(null);
                }}
                className="p-3 text-left rounded-xl bg-surface-container border border-border-subtle hover:border-primary-container transition-all"
              >
                <div className="font-title-sm text-xs text-text-primary mb-1">{opt.label}</div>
                <div className="font-body-sm text-[11px] text-text-muted">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Active Stage Spotlight & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Stage Details & Project Checkpoint */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Milestone Card */}
          <div className="p-6 md:p-8 rounded-2xl bg-surface-raised border border-primary-container/30 shadow-[0_8px_32px_rgba(255,107,53,0.1)] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-orange-subtle-bg text-primary font-label-code text-xs border border-primary-container/30">
                CURRENT MILESTONE
              </span>
              <span className="font-label-code text-text-muted text-xs">Stage 02 • 4 Weeks</span>
            </div>

            <h2 className="font-headline-md text-text-primary mb-2">
              Full-Stack Architecture &amp; Scalable APIs
            </h2>
            <p className="font-body-sm text-text-secondary mb-6">
              Why this now: Modern software engineering requires bridging decoupled frontends with performant, secured microservices before scaling horizontally.
            </p>

            {/* Sub-skills chips */}
            <div className="mb-6">
              <span className="font-label-caps text-text-muted block mb-2">Competencies Tested</span>
              <div className="flex flex-wrap gap-2">
                {stages[1].skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-lg bg-surface-container border border-border-subtle font-label-code text-xs text-text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Free Recommended Resources */}
            <div className="p-4 rounded-xl bg-surface-container border border-border-subtle mb-6">
              <span className="font-label-caps text-text-muted block mb-2">Primary Free Resource</span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-title-sm text-text-primary text-sm">Node.js Performance Patterns &amp; PostgreSQL</h4>
                  <p className="font-body-sm text-text-muted text-xs">Full text guide with interactive architecture diagrams • 3.5 hrs</p>
                </div>
                <span className="material-symbols-outlined text-primary text-[20px]">open_in_new</span>
              </div>
            </div>

            {/* Project Checkpoint Spec */}
            <div className="p-5 rounded-xl bg-surface-container border border-primary-container/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">task_alt</span>
                  <h4 className="font-title-sm text-text-primary">Project Checkpoint: Rate Limiter Service</h4>
                </div>
                <span className="font-label-code text-xs text-primary">{projectProgress}% Completed</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-primary-container h-full rounded-full transition-all duration-300"
                  style={{ width: `${projectProgress}%` }}
                />
              </div>

              <div className="space-y-2.5 font-body-sm">
                {criteria.map((item) => (
                  <label
                    key={item.id}
                    onClick={() => toggleCriteria(item.id)}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      readOnly
                      className="mt-1 h-4 w-4 rounded border-border-subtle bg-surface-container-highest text-primary-container accent-primary-container"
                    />
                    <span className={`text-xs ${item.done ? "line-through text-text-muted" : "text-text-primary"}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: All 6 Stages Timeline Tracker */}
        <div className="space-y-4">
          <h3 className="font-title-sm text-text-primary mb-2">Roadmap Milestones</h3>
          {stages.map((stg) => {
            const isSelected = activeStage === stg.stageNumber;
            const isCurrent = stg.stageNumber === 2;
            const isDone = stg.stageNumber < 2;

            return (
              <div
                key={stg.stageNumber}
                onClick={() => setActiveStage(stg.stageNumber)}
                className={`p-4 rounded-xl bg-surface-raised border cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary-container ring-1 ring-primary-container/40"
                    : "border-border-subtle hover:border-border-bold"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-code text-xs text-text-muted">
                    Stage 0{stg.stageNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-label-code ${
                      isDone
                        ? "bg-primary-container/20 text-primary"
                        : isCurrent
                        ? "bg-orange-subtle-bg text-primary border border-primary-container/30 animate-pulse"
                        : "bg-surface-container-high text-text-muted"
                    }`}
                  >
                    {stg.status}
                  </span>
                </div>
                <h4 className="font-title-sm text-sm text-text-primary mb-1">{stg.title}</h4>
                <div className="flex items-center gap-3 text-[11px] font-label-code text-text-muted">
                  <span>{stg.duration}</span>
                  <span>•</span>
                  <span>{stg.projects}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
