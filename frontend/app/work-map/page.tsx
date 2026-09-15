"use client";

import { useState } from "react";
import Link from "next/link";

interface WorkCategory {
  id: string;
  title: string;
  demand: "Very High" | "High" | "Moderate";
  matchScore: number;
  description: string;
  requiredSkills: string[];
  locations: string[];
  typicalRoles: string[];
}

export default function WorkMapPage() {
  const [filter, setFilter] = useState<string>("All");

  const categories: WorkCategory[] = [
    {
      id: "wc-1",
      title: "Full-Stack Web & API Engineering",
      demand: "Very High",
      matchScore: 92,
      description: "Building production software, microservices, database schemas, and modern responsive frontends.",
      requiredSkills: ["JavaScript", "TypeScript", "Node.js", "React", "PostgreSQL", "REST APIs"],
      locations: ["Bhopal", "Indore", "Bangalore", "Remote"],
      typicalRoles: ["Full-Stack Engineer", "Backend Developer", "API Engineer"],
    },
    {
      id: "wc-2",
      title: "Generative AI & LLM Applications",
      demand: "Very High",
      matchScore: 84,
      description: "Developing intelligent workflow tools, Retrieval-Augmented Generation (RAG) pipelines, and LLM integrations.",
      requiredSkills: ["Python", "OpenAI / Anthropic APIs", "Vector DBs (Pinecone)", "TypeScript", "RAG Patterns"],
      locations: ["Remote", "Bangalore", "Gurgaon", "Indore"],
      typicalRoles: ["AI Application Developer", "LLM Integration Engineer", "AI Solutions Engineer"],
    },
    {
      id: "wc-3",
      title: "Frontend & Design Systems Engineering",
      demand: "High",
      matchScore: 88,
      description: "Crafting accessible, state-of-the-art user interfaces, token systems, performance optimization, and animations.",
      requiredSkills: ["React / Next.js", "Tailwind CSS", "TypeScript", "State Management", "Performance Auditing"],
      locations: ["Bhopal", "Indore", "Pune", "Remote"],
      typicalRoles: ["Frontend Engineer", "UI Engineer", "Web Application Developer"],
    },
    {
      id: "wc-4",
      title: "Cloud Infrastructure & DevOps",
      demand: "High",
      matchScore: 71,
      description: "Orchestrating containerized deployments, setting up CI/CD pipelines, and monitoring cloud reliability.",
      requiredSkills: ["Docker", "Kubernetes", "AWS ECS / S3", "GitHub Actions", "Linux Administration"],
      locations: ["Remote", "Indore", "Hyderabad", "Bhopal"],
      typicalRoles: ["DevOps Engineer", "Cloud Associate", "Platform Support Engineer"],
    },
  ];

  const filteredCategories = filter === "All" ? categories : categories.filter((c) => c.demand === filter);

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 md:px-8 py-8 text-text-primary">
      {/* Informational Guidance Alert */}
      <div className="mb-8 p-4 rounded-xl bg-surface-raised border border-border-subtle flex items-start gap-3">
        <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">info</span>
        <div className="text-xs">
          <span className="font-title-sm text-text-primary block text-xs mb-0.5">
            Work Category Guidance &amp; Mapping
          </span>
          <span className="text-text-secondary">
            Work mapping is informational to help you understand market demand and skill applications—it does not imply or guarantee job placement.
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-subtle">
        <div>
          <span className="font-label-caps text-label-caps text-primary block mb-2">CAREER REALITY CHECK</span>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary">
            Work Categories You&apos;re Preparing For
          </h1>
          <p className="font-body-sm text-text-secondary mt-1">
            Explore industry segments and verify which skill sets are sought after across central India and remote markets.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2">
          {["All", "Very High", "High"].map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-label-code border transition-all ${
                filter === d
                  ? "bg-primary-container text-surface-deep border-primary-container font-bold"
                  : "bg-surface-container border-border-subtle text-text-secondary hover:text-text-primary"
              }`}
            >
              {d === "All" ? "All Demand" : `${d} Demand`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Work Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-2xl bg-surface-raised border border-border-subtle flex flex-col justify-between hover:border-border-bold transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-orange-subtle-bg text-primary font-label-code text-xs border border-primary-container/20">
                  {cat.demand} Demand
                </span>
                <span className="font-label-code text-xs text-text-muted">
                  Match: <strong className="text-primary">{cat.matchScore}%</strong>
                </span>
              </div>

              <h2 className="font-title-sm text-text-primary text-base mb-2">{cat.title}</h2>
              <p className="font-body-sm text-text-secondary mb-6">{cat.description}</p>

              {/* Required Skills */}
              <div className="mb-6">
                <span className="font-label-caps text-text-muted block mb-2">Skills in Demand</span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-surface-container border border-border-subtle font-label-code text-[11px] text-text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Locations where category is found */}
              <div className="mb-6">
                <span className="font-label-caps text-text-muted block mb-2">Common Hubs</span>
                <div className="flex items-center gap-2 text-xs font-label-code text-text-secondary">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  <span>{cat.locations.join(" • ")}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
              <span className="font-body-sm text-xs text-text-muted">
                {cat.typicalRoles[0]} &amp; more
              </span>
              <Link
                href="/pathway"
                className="text-xs font-label-code text-primary hover:underline flex items-center gap-1"
              >
                <span>View Roadmap Alignment →</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
