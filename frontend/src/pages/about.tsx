import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Terminal,
  BarChart2,
  Code2,
  Sparkles,
  Shield,
  Users,
  Activity,
  Trophy,
  LineChart,
  Globe,
  Cloud,
  Database,
  Server,
  Rocket,
  GitBranch,
  Linkedin,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const featureIcons = [
  { icon: Terminal, title: "Real-Time Typing Tests", desc: "Fast practice loops with live feedback." },
  { icon: Sparkles, title: "AI Generated Practice Content", desc: "Adaptive prompts designed to challenge your weak spots." },
  { icon: Code2, title: "Coding Typing Mode", desc: "Multi-language code exercises with accurate whitespace." },
  { icon: BarChart2, title: "WPM Tracking", desc: "Measure speed improvements over time." },
  { icon: Shield, title: "Accuracy Analysis", desc: "Spot errors precisely and track consistency." },
  { icon: LineChart, title: "Performance Trends", desc: "Visualize your momentum with analytics & charts." },
  { icon: Trophy, title: "Leaderboards", desc: "Rank against other typers and keep pushing." },
  { icon: Users, title: "User Profiles", desc: "Your stats, your history, your growth." },
  { icon: Activity, title: "Personalized Feedback", desc: "AI-powered coaching to improve efficiently." },
  { icon: Server, title: "Progress Analytics", desc: "Detailed summaries and predictive insights." },
  { icon: Globe, title: "Multi-language Support", desc: "Practice English, Hindi, and coding languages." },
  { icon: Cloud, title: "Cloud-Based Data Storage", desc: "Secure data storage and synced learning." },
];

function AboutCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <motion.div variants={item}>
      <Card className="bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-colors h-full">
        <CardContent className="p-6 space-y-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-mono text-primary text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="text-center pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold font-mono min-h-[4rem] flex items-center justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">KEYFORGE_AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-mono">
            AI-Powered Typing Practice & Performance Analytics Platform
          </p>

          <p className="text-base md:text-lg text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            KEYFORGE_AI is an intelligent typing practice platform designed to help users improve typing speed, accuracy, coding proficiency, and overall keyboard efficiency through analytics, AI-generated content, performance tracking, and personalized feedback.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/type/coding">
              <Button className="font-mono font-bold uppercase tracking-widest px-8">
                Start Typing
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                variant="outline"
                className="font-mono font-bold uppercase tracking-widest px-8 border-primary/30 hover:bg-primary/10 hover:text-primary"
              >
                View Leaderboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Project Overview */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-mono border-b border-border/50 pb-2 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" /> Project Overview
        </h2>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground uppercase font-mono tracking-wider">What we do</p>
              <p className="text-lg font-mono">KEYFORGE_AI combines typing practice with modern analytics and AI-powered learning.</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Users can practice normal typing, coding challenges, and performance-based exercises while tracking their growth through detailed statistics and leaderboards.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground uppercase font-mono tracking-wider">Why it matters</p>
              <div className="grid grid-cols-1 gap-3">
                {[ 
                  { t: "Speed + Accuracy", d: "Measure both and improve consistently." },
                  { t: "Coding Proficiency", d: "Whitespace-aware code typing for real-world practice." },
                  { t: "Personalized Feedback", d: "AI coaching that adapts to your patterns." },
                ].map((x) => (
                  <div key={x.t} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-mono text-primary">{x.t}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{x.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-mono border-b border-border/50 pb-2 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" /> Features
        </h2>

        <motion.div variants={container} initial="hidden" animate="show" className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureIcons.map((f) => (
            <AboutCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </motion.div>
      </section>

      {/* Technology Stack */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-mono border-b border-border/50 pb-2 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" /> Technology Stack
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Frontend</p>
              <p className="font-mono text-primary">React • TypeScript • Vite</p>
              <p className="text-sm text-muted-foreground">Tailwind CSS • TanStack Query • Wouter • shadcn/ui</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Backend</p>
              <p className="font-mono text-primary">Node.js • Express • TypeScript</p>
              <p className="text-sm text-muted-foreground">JWT Authentication • Zod Validation</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Database</p>
              <p className="font-mono text-primary">PostgreSQL • Drizzle ORM • Neon</p>
              <p className="text-sm text-muted-foreground">Cloud-first storage and secure persistence.</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">AI</p>
              <p className="font-mono text-primary">Google Gemini API</p>
              <p className="text-sm text-muted-foreground">Adaptive feedback & coaching insights.</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50 md:col-span-2">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Deployment</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <p className="font-mono text-primary flex items-center gap-2"><Server className="w-4 h-4" /> DigitalOcean • Nginx</p>
                <p className="font-mono text-primary flex items-center gap-2"><Database className="w-4 h-4" /> PM2 • Production Hosting</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-mono border-b border-border/50 pb-2 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> How It Works
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          {[ 
            { n: 1, t: "Create an account", d: "Sign up and set up your profile." },
            { n: 2, t: "Take typing tests", d: "Choose your mode and practice." },
            { n: 3, t: "Track analytics", d: "See progress with detailed stats." },
            { n: 4, t: "Receive AI feedback", d: "Improve faster with coaching." },
            { n: 5, t: "Improve typing performance", d: "Train consistently and level up." },
          ].map((s) => (
            <motion.div key={s.n} variants={item}>
              <Card className="bg-card/50 backdrop-blur border-border/50 h-full">
                <CardContent className="p-6 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-mono text-primary font-bold">
                    {s.n}
                  </div>
                  <p className="font-mono text-primary">{s.t}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Developer */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-mono border-b border-border/50 pb-2 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Meet the Developer
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur border-border/50 md:col-span-2">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GitBranch className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold font-mono text-primary">Prakhar Kumar</p>
                  <p className="text-sm text-muted-foreground font-mono uppercase">Computer Science & Engineering Student</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                Prakhar Kumar is a Computer Science & Engineering student passionate about software development, artificial intelligence, full-stack web development, and building impactful technology solutions. KEYFORGE_AI was developed as a modern typing and analytics platform that combines performance tracking with AI-driven insights to create a smarter learning experience.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-background/40 border border-border/30">
                  <p className="text-xs text-muted-foreground uppercase font-mono">University</p>
                  <p className="font-mono text-foreground">Sathyabama Institute of Science and Technology, Chennai</p>
                </div>
                <div className="p-3 rounded-lg bg-background/40 border border-border/30">
                  <p className="text-xs text-muted-foreground uppercase font-mono">Focus</p>
                  <p className="font-mono text-foreground">AI • Full-stack • Performance analytics</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-colors text-sm font-mono"
                >
                  <GitBranch className="w-4 h-4 text-primary" /> GitHub
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-colors text-sm font-mono"
                >
                  <Linkedin className="w-4 h-4 text-primary" /> LinkedIn
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono">What I built</p>
              <p className="font-mono text-primary text-lg">A typing platform that feels like an IDE.</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                KEYFORGE_AI emphasizes fast feedback loops, reliable code rendering, and analytics you can actually use.
              </p>
              <div className="pt-2">
                <Link href="/type/coding">
                  <Button className="w-full font-mono font-bold uppercase tracking-widest">Try It Now</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Roadmap */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-mono border-b border-border/50 pb-2 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-primary" /> Future Roadmap
        </h2>

        <motion.div variants={container} initial="hidden" animate="show" className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "AI Performance Coach",
            "Multiplayer Typing Battles",
            "Competitive Coding Typing Arena",
            "Advanced Skill Predictions",
            "Custom Typing Challenges",
            "Mobile Application",
            "Gamification System",
            "Achievement Badges",
          ].map((t) => (
            <AboutCard key={t} icon={Trophy} title={t} desc="Designed to make practice more engaging and measurable." />
          ))}
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto">
        <Card className="bg-primary/5 border-primary/20 overflow-hidden">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-mono text-primary">Ready to Improve Your Typing Skills?</h3>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  Start practicing with KEYFORGE_AI and track your growth using powerful analytics and AI-driven insights.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/type/coding">
                  <Button className="font-mono font-bold uppercase tracking-widest px-8">Start Now</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

