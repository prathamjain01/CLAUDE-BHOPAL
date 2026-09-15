"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  category: string;
  options: { label: string; score: number }[];
}

export default function AssessmentPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: "How do you typically handle caching in high-traffic Node.js APIs?",
      category: "System Design",
      options: [
        { label: "I store values in in-memory JavaScript global objects", score: 30 },
        { label: "I use Redis with key TTLs and cache-aside pattern", score: 95 },
        { label: "I rely purely on HTTP headers (Cache-Control)", score: 60 },
        { label: "I haven't had to implement caching yet", score: 10 },
      ],
    },
    {
      id: 2,
      question: "Which approach best handles database query performance bottlenecks in PostgreSQL?",
      category: "Backend Databases",
      options: [
        { label: "Run EXPLAIN ANALYZE, inspect query plan, add B-Tree or GIN indexes", score: 95 },
        { label: "Increase the server RAM and restart the DB server", score: 35 },
        { label: "Fetch all rows into Node.js and filter in JavaScript", score: 15 },
        { label: "Switch to a NoSQL database immediately", score: 40 },
      ],
    },
    {
      id: 3,
      question: "When integrating LLMs into web apps, how do you prevent context window exhaustion?",
      category: "AI Engineering",
      options: [
        { label: "Use vector embeddings and semantic search (RAG) to inject only relevant chunks", score: 95 },
        { label: "Truncate the system prompt and discard old chat history blindly", score: 50 },
        { label: "Send the entire knowledge base in every single prompt", score: 20 },
        { label: "I haven't worked with vector databases or LLM APIs yet", score: 10 },
      ],
    },
  ];

  const handleSelectOption = (score: number) => {
    const updated = [...scores, score];
    setScores(updated);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setCompleted(true);
    }
  };

  const finalScore = completed && scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto px-4 md:px-8 py-8 text-text-primary">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border-subtle">
        <Link href="/" className="text-text-muted hover:text-text-primary text-xs font-label-code flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Exit Assessment</span>
        </Link>
        <span className="font-label-code text-xs text-primary">
          {completed ? "Completed" : `Question ${currentQ + 1} of ${questions.length}`}
        </span>
      </div>

      {!completed ? (
        <div className="p-8 rounded-2xl bg-surface-raised border border-border-subtle shadow-xl">
          <span className="px-2.5 py-1 rounded-full bg-orange-subtle-bg text-primary font-label-code text-xs border border-primary-container/20 inline-block mb-4">
            {questions[currentQ].category}
          </span>
          <h2 className="font-headline-md text-text-primary mb-6">
            {questions[currentQ].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQ].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(opt.score)}
                className="w-full p-4 text-left rounded-xl bg-surface-container border border-border-subtle hover:border-primary-container hover:bg-surface-container-high transition-all flex items-center justify-between group"
              >
                <span className="font-body-md text-sm text-text-primary group-hover:text-primary">
                  {opt.label}
                </span>
                <span className="material-symbols-outlined text-text-muted group-hover:text-primary text-[18px]">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-surface-raised border border-primary-container/40 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-orange-subtle-bg border border-primary-container/30 flex items-center justify-center text-primary mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">verified</span>
          </div>

          <span className="font-label-caps text-primary block mb-1">DIAGNOSTIC COMPLETE</span>
          <h2 className="font-headline-lg text-text-primary mb-2">Verified Proficiency: {finalScore}%</h2>
          <p className="font-body-md text-text-secondary max-w-md mx-auto mb-8">
            Your gap profile has been updated. Based on your responses, we have calibrated your roadmap to prioritize distributed caching and RAG embeddings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pathway"
              className="px-6 py-3 rounded-lg bg-primary-container text-surface-deep font-title-sm text-sm hover:bg-primary transition-all shadow-[0_0_20px_rgba(255,107,53,0.3)] flex items-center gap-2"
            >
              <span>View Updated Pathway</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <Link
              href="/progress"
              className="px-6 py-3 rounded-lg bg-surface-container border border-border-subtle text-text-primary font-title-sm text-sm hover:bg-surface-highlight transition-all"
            >
              View Skill Meters
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
