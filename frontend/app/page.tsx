"use client";

import { useState } from "react";
import Link from "next/link";

interface CareerPath {
  id: string;
  title: string;
  match: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: string;
  description: string;
  readiness: number;
  criticalGap: { name: string; pct: number };
  moderateGap: { name: string; pct: number };
  closeSkill: { name: string; pct: number };
  recommendedFocus: string;
}

const CAREER_PATHS: CareerPath[] = [
  {
    id: "ai-fullstack",
    title: "AI / Full-Stack Engineer",
    match: 92,
    difficulty: "Intermediate",
    icon: "terminal",
    description: "Master modern frontend frameworks, scalable backend APIs, cloud deployment, and system architecture.",
    readiness: 68,
    criticalGap: { name: "System Design & Scaling", pct: 32 },
    moderateGap: { name: "AI Engineering & LLM APIs", pct: 45 },
    closeSkill: { name: "Advanced Backend Performance", pct: 75 },
    recommendedFocus: "Recommended focus: System Design module",
  },
  {
    id: "ai-ml",
    title: "AI / ML Engineer",
    match: 96,
    difficulty: "Advanced",
    icon: "psychology",
    description: "Build and deploy LLM pipelines, fine-tune models, and integrate generative AI capabilities into apps.",
    readiness: 61,
    criticalGap: { name: "PyTorch & Tensor Operations", pct: 28 },
    moderateGap: { name: "Vector Databases & RAG", pct: 52 },
    closeSkill: { name: "Python API Integration", pct: 84 },
    recommendedFocus: "Recommended focus: RAG & Vector Embeddings module",
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    match: 78,
    difficulty: "Beginner",
    icon: "analytics",
    description: "Transform raw datasets into actionable intelligence using Python, SQL, and advanced visualization tools.",
    readiness: 79,
    criticalGap: { name: "Statistical Modeling", pct: 42 },
    moderateGap: { name: "Advanced SQL & CTEs", pct: 68 },
    closeSkill: { name: "Tableau & Dashboarding", pct: 90 },
    recommendedFocus: "Recommended focus: SQL Window Functions",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Engineer",
    match: 64,
    difficulty: "Advanced",
    icon: "shield",
    description: "Secure cloud infrastructure, perform penetration testing, and implement zero-trust security standards.",
    readiness: 55,
    criticalGap: { name: "Network Packet Analysis", pct: 25 },
    moderateGap: { name: "Zero Trust Architecture", pct: 48 },
    closeSkill: { name: "Linux Administration", pct: 80 },
    recommendedFocus: "Recommended focus: Network Forensics & Wireshark",
  },
  {
    id: "cloud-engineer",
    title: "Cloud Engineer",
    match: 81,
    difficulty: "Intermediate",
    icon: "cloud",
    description: "Architect containerized infrastructure on AWS/GCP, orchestrate via Kubernetes, and automate CI/CD.",
    readiness: 71,
    criticalGap: { name: "Kubernetes Cluster Ops", pct: 36 },
    moderateGap: { name: "Terraform Infrastructure as Code", pct: 58 },
    closeSkill: { name: "Docker Containerization", pct: 88 },
    recommendedFocus: "Recommended focus: Terraform AWS Multi-tier setup",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    match: 70,
    difficulty: "Beginner",
    icon: "palette",
    description: "Design intuitive user flows, comprehensive design systems, and high-fidelity interactive prototypes.",
    readiness: 82,
    criticalGap: { name: "Design System Architecture", pct: 40 },
    moderateGap: { name: "User Research & Usability Testing", pct: 64 },
    closeSkill: { name: "Figma UI Prototyping", pct: 92 },
    recommendedFocus: "Recommended focus: Design Tokens & Token Studio",
  },
];

interface ChatMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<CareerPath>(CAREER_PATHS[0]);
  const [copiedSpec, setCopiedSpec] = useState<string | null>(null);

  // AI Career Coach Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "user",
      text: "How should I prepare for system design rounds given my current 68% readiness score?",
      timestamp: "10:42 AM",
    },
    {
      id: "2",
      sender: "coach",
      text: "Based on your gap analysis, focus heavily on horizontal scaling and database sharding over the next 10 days. I've added 2 targeted architecture projects to your roadmap. Want to review the first one?",
      timestamp: "10:42 AM",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = `Great question! For ${selectedRole.title}, focusing on closing your "${selectedRole.criticalGap.name}" gap is the fastest lever to boost your match score from ${selectedRole.readiness}% to over 85%.`;
      if (userText.toLowerCase().includes("project") || userText.toLowerCase().includes("build")) {
        replyText = "I recommend kicking off the 'Distributed Rate Limiter API' spec right now. It covers Redis sliding logs, Docker containers, and handles 100k requests/sec.";
      } else if (userText.toLowerCase().includes("interview") || userText.toLowerCase().includes("job")) {
        replyText = `For ${selectedRole.title} interviews in your region, technical hiring managers look closely for production Git workflows and clean API designs. Check our Stage 02 and 03 milestones!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "coach",
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const handleSpecAction = (projectName: string) => {
    setCopiedSpec(projectName);
    setTimeout(() => setCopiedSpec(null), 3000);
  };

  return (
    <div className="flex flex-col w-full text-text-primary bg-surface-deep">
      {/* Cinematic Hero Section */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 overflow-hidden flex flex-col items-center text-center">
        {/* Ambient glow behind hero */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary-container/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/80 border border-border-subtle backdrop-blur-md mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
          <span className="font-label-caps text-label-caps text-primary">AI-Powered Career Guidance</span>
        </div>

        <h1 className="font-display-xl md:text-display-xl text-headline-lg-mobile tracking-tight max-w-4xl mb-6 text-text-primary">
          Find Your Direction.<br />Build Your Future.
        </h1>

        <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl mb-10">
          Discover the right career path, understand exactly what skills you need, and follow a personalized roadmap built around your goals.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-12">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-4 rounded-[10px] bg-primary-container text-surface-deep font-title-sm hover:bg-primary transition-all shadow-[0_0_24px_-4px_rgba(255,107,53,0.4)] flex items-center justify-center gap-2 group"
          >
            <span>Build My Roadmap</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>

          <a
            href="#discovery"
            className="w-full sm:w-auto px-8 py-4 rounded-[10px] bg-surface-container border border-border-subtle text-text-primary font-title-sm hover:bg-surface-highlight transition-all flex items-center justify-center hover:border-border-bold"
          >
            Explore Career Paths
          </a>
        </div>

        <div className="flex items-center gap-3 text-text-muted font-body-sm">
          <span>Built for students, developers &amp; ambitious professionals.</span>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-border-subtle flex items-center justify-center text-[10px] font-bold text-primary">JD</div>
            <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-border-subtle flex items-center justify-center text-[10px] font-bold text-primary">AS</div>
            <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-border-subtle flex items-center justify-center text-[10px] font-bold text-primary">MK</div>
          </div>
        </div>
      </section>

      {/* Hero Product Preview Mockup */}
      <section className="w-full max-w-6xl mx-auto px-4 md:px-8 mb-24">
        <div className="relative rounded-2xl bg-surface-raised border border-border-subtle shadow-[0_24px_48px_-12px_rgba(0,0,0,0.7)] p-4 md:p-8 backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar of App Mockup */}
          <div className="flex items-center justify-between pb-6 border-b border-border-subtle mb-8">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-error/40" />
              <div className="w-3 h-3 rounded-full bg-primary-container/40" />
              <div className="w-3 h-3 rounded-full bg-primary/40" />
              <span className="font-label-code text-text-muted ml-2 text-xs">skillcompass.app/workspace/roadmap-v2</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-subtle-bg border border-primary-container/30 text-primary text-label-code">
                Career Match: {selectedRole.match}%
              </span>
            </div>
          </div>

          {/* App Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Role & Stats */}
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-surface-container border border-border-subtle">
                <span className="font-label-caps text-text-muted block mb-1">Recommended Path</span>
                <h3 className="font-headline-md text-text-primary mb-3">{selectedRole.title}</h3>
                <p className="font-body-sm text-text-secondary mb-4">{selectedRole.description}</p>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary-container h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${selectedRole.match}%` }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-surface-container border border-border-subtle">
                <h4 className="font-title-sm text-text-primary mb-4">Skill Progress Meters</h4>
                <div className="space-y-3 font-body-sm">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">JavaScript &amp; TS</span>
                      <span className="text-text-primary font-label-code">86%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[86%] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">React &amp; UI Architecture</span>
                      <span className="text-text-primary font-label-code">72%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[72%] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">Node.js &amp; APIs</span>
                      <span className="text-text-primary font-label-code">61%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[61%] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">System Design</span>
                      <span className="text-text-primary font-label-code">38%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary-container h-full w-[38%] rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary">AI Engineering</span>
                      <span className="text-text-primary font-label-code">24%</span>
                    </div>
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary-container h-full w-[24%] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right/Center Column: Visual Roadmap Timeline Preview */}
            <div className="lg:col-span-2 p-6 rounded-xl bg-surface-container border border-border-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-title-sm text-text-primary">Active Learning Timeline</h4>
                  <span className="font-label-code text-text-muted">Phase 2 of 6</span>
                </div>

                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-border-subtle">
                  <div className="flex items-start gap-4 relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary-container ring-4 ring-surface-container" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title-sm text-text-primary">01. Foundations &amp; Modern Tooling</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-primary-container/20 text-primary font-label-code">
                          Completed
                        </span>
                      </div>
                      <p className="font-body-sm text-text-secondary mt-1">
                        Git, Advanced JS, TypeScript basics, and RESTful architectures.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 relative pl-8">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container animate-pulse" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title-sm text-text-primary">02. Full-Stack Systems &amp; APIs</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-orange-subtle-bg text-primary font-label-code border border-primary-container/30">
                          In Progress
                        </span>
                      </div>
                      <p className="font-body-sm text-text-secondary mt-1">
                        Node.js microservices, PostgreSQL indexing, and GraphQL integration.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 relative pl-8 opacity-60">
                    <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-surface-container-highest border border-border-subtle ring-4 ring-surface-container" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-title-sm text-text-primary">03. System Design &amp; Scalability</span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-surface-container-high text-text-secondary font-label-code">
                          Up Next
                        </span>
                      </div>
                      <p className="font-body-sm text-text-secondary mt-1">
                        Caching strategies, load balancing, and distributed DBs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-body-sm text-text-muted">Estimated time to completion: 4.5 months</span>
                <Link
                  href="/pathway"
                  className="px-4 py-2 rounded-lg bg-surface-container-high text-text-primary font-title-sm hover:bg-surface-highlight transition-all text-xs flex items-center gap-1.5"
                >
                  <span>View Full Roadmap</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Discovery Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-24" id="discovery">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-label-caps text-label-caps text-primary block mb-2">EXPLORE OPPORTUNITIES</span>
          <h2 className="font-headline-lg md:text-headline-lg text-headline-lg-mobile text-text-primary mb-4">
            Not sure where you&apos;re headed? Let&apos;s find the path
          </h2>
          <p className="font-body-lg text-text-secondary">
            Compare roles, analyze required competencies, and pick your target destination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAREER_PATHS.map((path) => {
            const isSelected = selectedRole.id === path.id;
            return (
              <div
                key={path.id}
                onClick={() => setSelectedRole(path)}
                className={`p-6 rounded-xl bg-surface-raised border cursor-pointer transition-all group flex flex-col justify-between ${
                  isSelected
                    ? "border-primary-container shadow-[0_0_20px_rgba(255,107,53,0.15)] ring-1 ring-primary-container/40"
                    : "border-border-subtle hover:border-border-bold"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center transition-colors ${
                        isSelected ? "text-primary-container" : "text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[24px]">{path.icon}</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full font-label-code text-xs border ${
                        isSelected
                          ? "bg-primary-container text-surface-deep font-bold border-primary-container"
                          : "bg-orange-subtle-bg text-primary border-primary-container/20"
                      }`}
                    >
                      {path.match}% Match
                    </span>
                  </div>
                  <h3
                    className={`font-title-sm mb-2 transition-colors ${
                      isSelected ? "text-primary" : "text-text-primary group-hover:text-primary"
                    }`}
                  >
                    {path.title}
                  </h3>
                  <p className="font-body-sm text-text-secondary mb-4">{path.description}</p>
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-xs font-label-code text-text-muted">
                  <span>Diff: {path.difficulty}</span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {isSelected ? "Selected ✓" : "Select Path →"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Skill Gap Analysis Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <div className="p-8 md:p-12 rounded-2xl bg-surface-raised border border-border-subtle grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-label-caps text-label-caps text-primary block mb-2">PRECISION DIAGNOSTICS</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary mb-4">
              Know exactly what you&apos;re missing
            </h2>
            <p className="font-body-lg text-text-secondary mb-6">
              Stop wasting time on tutorials you already know. SkillCompass scans your GitHub, resume, or quick assessment to map your exact delta.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                <div>
                  <span className="font-title-sm text-text-primary block">Automated Skill Extraction</span>
                  <span className="font-body-sm text-text-secondary">
                    Pulls repositories and code samples to gauge proficiency instantly.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                <div>
                  <span className="font-title-sm text-text-primary block">Targeted Gap Closure</span>
                  <span className="font-body-sm text-text-secondary">
                    Focuses 100% of your energy on missing foundational blocks.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Diagnostic Panel */}
          <div className="p-6 rounded-xl bg-surface-container border border-border-subtle">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
              <div>
                <span className="font-label-code text-text-muted block text-xs">TARGET ROLE</span>
                <span className="font-title-sm text-text-primary">{selectedRole.title}</span>
              </div>
              <div className="text-right">
                <span className="font-label-code text-text-muted block text-xs">READINESS</span>
                <span className="font-headline-md text-primary">{selectedRole.readiness}%</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between font-body-sm mb-1">
                  <span className="text-text-primary">{selectedRole.criticalGap.name}</span>
                  <span className="text-error font-label-code">Critical Gap ({selectedRole.criticalGap.pct}%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-error h-full rounded-full transition-all duration-700"
                    style={{ width: `${selectedRole.criticalGap.pct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-body-sm mb-1">
                  <span className="text-text-primary">{selectedRole.moderateGap.name}</span>
                  <span className="text-primary font-label-code">Moderate Gap ({selectedRole.moderateGap.pct}%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700"
                    style={{ width: `${selectedRole.moderateGap.pct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-body-sm mb-1">
                  <span className="text-text-primary">{selectedRole.closeSkill.name}</span>
                  <span className="text-primary font-label-code">Close ({selectedRole.closeSkill.pct}%)</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700"
                    style={{ width: `${selectedRole.closeSkill.pct}%` }}
                  />
                </div>
              </div>
            </div>

            <Link
              href="/pathway"
              className="p-4 rounded-lg bg-orange-subtle-bg border border-primary-container/20 flex items-center justify-between hover:bg-orange-subtle-bg/80 transition-colors group"
            >
              <span className="font-body-sm text-primary font-medium">{selectedRole.recommendedFocus}</span>
              <span className="material-symbols-outlined text-primary text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Personalized Roadmap Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-24" id="roadmap">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-label-caps text-label-caps text-primary block mb-2">DYNAMIC TIMELINE</span>
          <h2 className="font-headline-lg md:text-headline-lg text-headline-lg-mobile text-text-primary mb-4">
            Your career path, mapped out
          </h2>
          <p className="font-body-lg text-text-secondary">
            6 sequential milestones engineered to transform you from beginner to hireable professional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stage 1 */}
          <div className="p-6 rounded-xl bg-surface-raised border border-border-subtle relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-surface-container-high text-text-muted font-label-code text-xs rounded-bl-lg">
              Stage 01
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[20px]">flag</span>
            </div>
            <h3 className="font-title-sm text-text-primary mb-2">Foundations &amp; Tooling</h3>
            <p className="font-body-sm text-text-secondary mb-4">
              Git workflows, advanced JavaScript/TypeScript patterns, and modern CLI environments.
            </p>
            <div className="flex items-center gap-2 text-xs font-label-code text-text-muted pt-4 border-t border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              <span>3 Weeks • 4 Projects</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-6 rounded-xl bg-surface-raised border border-primary-container/40 shadow-[0_8px_24px_-4px_rgba(255,107,53,0.12)] relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-orange-subtle-bg text-primary font-label-code text-xs rounded-bl-lg border-l border-b border-primary-container/30">
              Stage 02
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-subtle-bg flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined text-[20px]">layers</span>
            </div>
            <h3 className="font-title-sm text-text-primary mb-2">Full-Stack Architecture</h3>
            <p className="font-body-sm text-text-secondary mb-4">
              Node.js microservices, PostgreSQL schema optimization, and secure JWT authentication.
            </p>
            <div className="flex items-center gap-2 text-xs font-label-code text-primary pt-4 border-t border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span>4 Weeks • 6 Projects</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-6 rounded-xl bg-surface-raised border border-border-subtle relative overflow-hidden opacity-90">
            <div className="absolute top-0 right-0 px-3 py-1 bg-surface-container-high text-text-muted font-label-code text-xs rounded-bl-lg">
              Stage 03
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-text-secondary mb-4">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <h3 className="font-title-sm text-text-primary mb-2">System Design &amp; Scaling</h3>
            <p className="font-body-sm text-text-secondary mb-4">
              Caching layers with Redis, horizontal scaling, load balancing, and rate limiting.
            </p>
            <div className="flex items-center gap-2 text-xs font-label-code text-text-muted pt-4 border-t border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-surface-container-highest border border-border-subtle" />
              <span>5 Weeks • 3 Projects</span>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-6 rounded-xl bg-surface-raised border border-border-subtle relative overflow-hidden opacity-80">
            <div className="absolute top-0 right-0 px-3 py-1 bg-surface-container-high text-text-muted font-label-code text-xs rounded-bl-lg">
              Stage 04
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-text-secondary mb-4">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <h3 className="font-title-sm text-text-primary mb-2">AI Integration &amp; LLMs</h3>
            <p className="font-body-sm text-text-secondary mb-4">
              Embedding databases, vector search, RAG pipelines, and OpenAI/Anthropic API integration.
            </p>
            <div className="flex items-center gap-2 text-xs font-label-code text-text-muted pt-4 border-t border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-surface-container-highest border border-border-subtle" />
              <span>4 Weeks • 5 Projects</span>
            </div>
          </div>

          {/* Stage 5 */}
          <div className="p-6 rounded-xl bg-surface-raised border border-border-subtle relative overflow-hidden opacity-70">
            <div className="absolute top-0 right-0 px-3 py-1 bg-surface-container-high text-text-muted font-label-code text-xs rounded-bl-lg">
              Stage 05
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-text-secondary mb-4">
              <span className="material-symbols-outlined text-[20px]">cloud_upload</span>
            </div>
            <h3 className="font-title-sm text-text-primary mb-2">DevOps &amp; Cloud Deployment</h3>
            <p className="font-body-sm text-text-secondary mb-4">
              Docker containerization, Kubernetes pods, CI/CD pipelines on GitHub Actions, and AWS hosting.
            </p>
            <div className="flex items-center gap-2 text-xs font-label-code text-text-muted pt-4 border-t border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-surface-container-highest border border-border-subtle" />
              <span>3 Weeks • 3 Projects</span>
            </div>
          </div>

          {/* Stage 6 */}
          <div className="p-6 rounded-xl bg-surface-raised border border-border-subtle relative overflow-hidden opacity-60">
            <div className="absolute top-0 right-0 px-3 py-1 bg-surface-container-high text-text-muted font-label-code text-xs rounded-bl-lg">
              Stage 06
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-text-secondary mb-4">
              <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            </div>
            <h3 className="font-title-sm text-text-primary mb-2">Career Ready Portfolio</h3>
            <p className="font-body-sm text-text-secondary mb-4">
              Mock technical interviews, GitHub portfolio polish, resume tailoring, and job board matching.
            </p>
            <div className="flex items-center gap-2 text-xs font-label-code text-text-muted pt-4 border-t border-border-subtle">
              <span className="w-2 h-2 rounded-full bg-surface-container-highest border border-border-subtle" />
              <span>2 Weeks • Capstone Project</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Career Coach Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-label-caps text-label-caps text-primary block mb-2">24/7 MENTORSHIP</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-text-primary mb-4">
              Your AI career coach, always available
            </h2>
            <p className="font-body-lg text-text-secondary mb-6">
              Ask complex questions about system architecture, debug roadmap blockers, or run mock behavioral interviews anytime.
            </p>
            <ul className="space-y-3 font-body-md text-text-secondary">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Instant answers tailored to your current skill level
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Real-time code review &amp; refactoring suggestions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Salary negotiation &amp; interview preparation tips
              </li>
            </ul>
          </div>

          {/* Chat Workspace Preview */}
          <div className="p-6 rounded-2xl bg-surface-raised border border-border-subtle shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-surface-deep font-bold text-xs shadow-[0_0_12px_rgba(255,107,53,0.4)]">
                  AI
                </div>
                <div>
                  <span className="font-title-sm text-text-primary block text-sm">Compass Coach</span>
                  <span className="font-label-code text-text-muted text-[10px]">Online • Ready to assist</span>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-orange-subtle-bg text-primary font-label-code text-[10px] border border-primary-container/20">
                GPT-4o Turbo
              </span>
            </div>

            <div className="space-y-4 mb-6 font-body-sm max-h-72 overflow-y-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row" : "flex-row"}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-surface-container-high text-text-muted"
                        : "bg-primary-container text-surface-deep"
                    }`}
                  >
                    {msg.sender === "user" ? "You" : "AI"}
                  </div>
                  <div
                    className={`p-3 rounded-xl ${
                      msg.sender === "user"
                        ? "bg-surface-container text-text-primary"
                        : "bg-surface-container-high text-text-primary border border-border-subtle"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary-container flex-shrink-0 flex items-center justify-center text-xs text-surface-deep font-bold animate-pulse">
                    AI
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-high text-text-muted border border-border-subtle flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="relative">
              <input
                className="w-full h-11 bg-surface-container border border-border-subtle rounded-lg px-4 pr-12 font-body-sm text-text-primary focus:outline-none focus:border-primary placeholder:text-text-muted"
                placeholder="Ask your AI coach anything about your career..."
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Send Message"
                className="absolute right-2 top-1.5 w-8 h-8 rounded bg-primary-container text-surface-deep flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-50"
                disabled={!inputMessage.trim() || isTyping}
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Project Recommendations Section */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-label-caps text-label-caps text-primary block mb-2">LEARN BY BUILDING</span>
          <h2 className="font-headline-lg md:text-headline-lg text-headline-lg-mobile text-text-primary mb-4">
            Stop watching tutorials. Start building
          </h2>
          <p className="font-body-lg text-text-secondary">
            Production-grade portfolio projects specifically tailored to close your verified skill gaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Project 1 */}
          <div className="p-6 rounded-xl bg-surface-raised border border-border-subtle flex flex-col justify-between hover:border-border-bold transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-orange-subtle-bg text-primary font-label-code text-xs border border-primary-container/20">
                  System Design
                </span>
                <span className="font-label-code text-text-muted text-xs">Est. 12 hrs</span>
              </div>
              <h3 className="font-title-sm text-text-primary mb-2">Distributed Rate Limiter API</h3>
              <p className="font-body-sm text-text-secondary mb-6">
                Build a high-throughput token bucket rate limiter using Redis and Node.js to handle 100k req/sec.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-xs font-label-code">Node.js</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-xs font-label-code">Redis</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-xs font-label-code">Docker</span>
              </div>
            </div>
            <button
              onClick={() => handleSpecAction("Distributed Rate Limiter API")}
              className="w-full py-2.5 rounded-lg bg-surface-container border border-border-subtle text-text-primary font-title-sm hover:bg-surface-highlight transition-all text-xs flex items-center justify-center gap-2"
            >
              <span>{copiedSpec === "Distributed Rate Limiter API" ? "Spec Copied! ✓" : "Start Project Spec"}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Project 2 */}
          <div className="p-6 rounded-xl bg-surface-raised border border-border-subtle flex flex-col justify-between hover:border-border-bold transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-orange-subtle-bg text-primary font-label-code text-xs border border-primary-container/20">
                  AI Engineering
                </span>
                <span className="font-label-code text-text-muted text-xs">Est. 15 hrs</span>
              </div>
              <h3 className="font-title-sm text-text-primary mb-2">AI Resume &amp; Skill Analyzer</h3>
              <p className="font-body-sm text-text-secondary mb-6">
                Build a RAG pipeline using vector embeddings to parse resumes and output dynamic career roadmaps.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-xs font-label-code">Python</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-xs font-label-code">OpenAI API</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-xs font-label-code">Pinecone</span>
              </div>
            </div>
            <button
              onClick={() => handleSpecAction("AI Resume & Skill Analyzer")}
              className="w-full py-2.5 rounded-lg bg-surface-container border border-border-subtle text-text-primary font-title-sm hover:bg-surface-highlight transition-all text-xs flex items-center justify-center gap-2"
            >
              <span>{copiedSpec === "AI Resume & Skill Analyzer" ? "Spec Copied! ✓" : "Start Project Spec"}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Project 3 */}
          <div className="p-6 rounded-xl bg-surface-raised border border-border-subtle flex flex-col justify-between hover:border-border-bold transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-text-secondary font-label-code text-xs border border-border-subtle">
                  Full-Stack
                </span>
                <span className="font-label-code text-text-muted text-xs">Est. 10 hrs</span>
              </div>
              <h3 className="font-title-sm text-text-primary mb-2">Real-time Collaboration Canvas</h3>
              <p className="font-body-sm text-text-secondary mb-6">
                Implement WebSockets and operational transformation for real-time multi-user document editing.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-xs font-label-code">TypeScript</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-xs font-label-code">WebSockets</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-text-muted text-xs font-label-code">React</span>
              </div>
            </div>
            <button
              onClick={() => handleSpecAction("Real-time Collaboration Canvas")}
              className="w-full py-2.5 rounded-lg bg-surface-container border border-border-subtle text-text-primary font-title-sm hover:bg-surface-highlight transition-all text-xs flex items-center justify-center gap-2"
            >
              <span>{copiedSpec === "Real-time Collaboration Canvas" ? "Spec Copied! ✓" : "Start Project Spec"}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof & Career Readiness */}
      <section className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <div className="p-8 md:p-12 rounded-2xl bg-surface-raised border border-border-subtle text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 via-transparent to-transparent pointer-events-none" />
          <span className="font-label-caps text-label-caps text-primary block mb-2">PROVEN RESULTS</span>
          <h2 className="font-headline-lg md:text-headline-lg text-headline-lg-mobile text-text-primary mb-12">
            Engineered for career acceleration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-surface-container border border-border-subtle">
              <span className="font-display-xl text-primary block mb-2">94%</span>
              <span className="font-title-sm text-text-primary block mb-1">Land Target Role</span>
              <span className="font-body-sm text-text-secondary">
                Users who complete their SkillCompass roadmap secure a relevant position within 6 months.
              </span>
            </div>

            <div className="p-6 rounded-xl bg-surface-container border border-border-subtle">
              <span className="font-display-xl text-primary block mb-2">3.2x</span>
              <span className="font-title-sm text-text-primary block mb-1">Faster Skill Acquisition</span>
              <span className="font-body-sm text-text-secondary">
                Targeted gap analysis eliminates redundant learning and focuses entirely on high-yield topics.
              </span>
            </div>

            <div className="p-6 rounded-xl bg-surface-container border border-border-subtle">
              <span className="font-display-xl text-primary block mb-2">45k+</span>
              <span className="font-title-sm text-text-primary block mb-1">Active Engineers</span>
              <span className="font-body-sm text-text-secondary">
                Ambitious professionals building their future using our AI roadmapping engine.
              </span>
            </div>
          </div>

          <blockquote className="max-w-2xl mx-auto font-body-lg text-text-secondary italic mb-4">
            “SkillCompass diagnosed my system design gaps instantly and gave me a precise 6-week roadmap. I landed an AI Engineer role at a Series B startup shortly after completing it.”
          </blockquote>
          <div className="font-title-sm text-text-primary">Alex Rivera</div>
          <div className="font-body-sm text-text-muted">AI Engineer @ TechCorp</div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full max-w-5xl mx-auto px-4 md:px-8 mb-24 text-center">
        <div className="p-12 rounded-2xl bg-gradient-to-b from-surface-raised to-surface-container border border-border-subtle relative overflow-hidden shadow-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-primary-container/15 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="font-headline-lg md:text-headline-lg text-headline-lg-mobile text-text-primary mb-4">
            Ready to find your direction?
          </h2>
          <p className="font-body-lg text-text-secondary max-w-xl mx-auto mb-8">
            Join thousands of developers and professionals accelerating their careers with AI-powered roadmaps.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-4 rounded-[10px] bg-primary-container text-surface-deep font-title-sm hover:bg-primary transition-all shadow-[0_0_24px_-4px_rgba(255,107,53,0.4)] flex items-center justify-center gap-2 group"
            >
              <span>Get Started For Free</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border-subtle bg-surface-deep py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-surface-deep">
                <span className="material-symbols-outlined text-[16px]">explore</span>
              </div>
              <span className="font-title-sm text-text-primary">SkillCompass</span>
            </div>
            <p className="font-body-sm text-text-secondary">
              AI-powered career discovery and skill-roadmap platform for modern software engineers and professionals.
            </p>
          </div>

          <div>
            <h4 className="font-title-sm text-text-primary mb-4 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 font-body-sm text-text-secondary">
              <li><Link className="hover:text-primary transition-colors" href="/pathway">Roadmaps</Link></li>
              <li><a className="hover:text-primary transition-colors" href="#discovery">Career Discovery</a></li>
              <li><Link className="hover:text-primary transition-colors" href="/progress">Skill Gap Analyzer</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/onboarding">AI Coach</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-title-sm text-text-primary mb-4 text-xs uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 font-body-sm text-text-secondary">
              <li><Link className="hover:text-primary transition-colors" href="/work-map">Work Categories</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/pathway">API Reference</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/progress">Community Insights</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/onboarding">Guides</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-title-sm text-text-primary mb-4 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 font-body-sm text-text-secondary">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between text-xs font-label-code text-text-muted">
          <span>&copy; 2025 SkillCompass Inc. All rights reserved.</span>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a className="hover:text-text-primary transition-colors" href="#">Twitter</a>
            <a className="hover:text-text-primary transition-colors" href="#">GitHub</a>
            <a className="hover:text-text-primary transition-colors" href="#">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
