import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "SkillCompass - Find Your Direction. Build Your Future.",
  description:
    "Discover the right career path, understand exactly what skills you need, and follow a personalized roadmap built around your goals.",
  keywords: ["career guidance", "learning roadmap", "skill gap analysis", "AI coach", "portfolio projects"],
  openGraph: {
    title: "SkillCompass - AI-Powered Career Guidance",
    description: "Discover the right career path and follow a personalized roadmap.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface-deep text-text-primary min-h-screen flex flex-col font-body-md text-body-md antialiased selection:bg-primary-container selection:text-surface-deep">
        <Header />
        <main className="flex-1 flex flex-col relative w-full pt-16 pb-20 bg-surface-deep">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
