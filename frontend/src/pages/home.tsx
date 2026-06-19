import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useGetPlatformStats } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Globe, FileText, Briefcase, Building2, Keyboard, EyeOff, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetPlatformStats();

  const [text, setText] = useState("");
  const fullText = "AI-Powered Multilingual Coding TypeRacer";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const modes = [
    { id: "coding", name: "Coding", icon: Code2, desc: "Master syntax across 15+ languages" },
    { id: "english", name: "English", icon: Keyboard, desc: "Classic prose and vocabulary" },
    { id: "hindi", name: "Hindi", icon: Globe, desc: "Devanagari script practice" },
    { id: "hindi_english", name: "Hinglish", icon: Globe, desc: "Mixed language challenges" },
    { id: "blind", name: "Blind Mode", icon: EyeOff, desc: "Type from memory after 5s" },
    { id: "placement", name: "Placements", icon: Briefcase, desc: "Interview coding questions" },
    { id: "resume", name: "Resume", icon: FileText, desc: "Professional terminology" },
    { id: "government", name: "Government", icon: Building2, desc: "Official document typing" },
  ];

  const languages = ["Python", "Java", "JavaScript", "C++", "C", "MySQL", "HTML", "CSS"];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="text-center pt-16 pb-8 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold font-mono min-h-[4rem] flex items-center justify-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
            {text}
          </span>
          <span className="w-4 h-12 bg-primary animate-pulse ml-2 inline-block"></span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Elevate your typing speed with AI-generated challenges. Train in code, English, Hindi, and professional formats.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link href="/type/coding">
            <button className="px-8 py-3 bg-primary text-primary-foreground font-mono font-bold uppercase tracking-widest rounded-md hover:bg-primary/90 transition-all hover:shadow-[0_0_20px_rgba(57,255,106,0.4)]">
              Start Training
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats?.totalUsers, suffix: "+" },
          { label: "Tests Completed", value: stats?.totalTests, suffix: "+" },
          { label: "Highest WPM", value: stats?.highestWpm, suffix: "" },
          { label: "Languages", value: stats?.languagesSupported, suffix: "" }
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur border-primary/20">
            <CardContent className="p-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground font-mono uppercase">{stat.label}</p>
              {statsLoading ? (
                <Skeleton className="h-10 w-24 mx-auto bg-primary/10" />
              ) : (
                <p className="text-3xl md:text-4xl font-bold text-primary font-mono">
                  {stat.value?.toLocaleString()}{stat.suffix}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Modes Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-mono border-b border-border/50 pb-2 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          Select Protocol
        </h2>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {modes.map((mode) => (
            <motion.div key={mode.id} variants={item}>
              <Link href={`/type/${mode.id}`}>
                <Card className="h-full bg-card/40 backdrop-blur border-border/50 hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(57,255,106,0.1)] cursor-pointer group">
                  <CardContent className="p-6 space-y-4">
                    <mode.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div>
                      <h3 className="font-bold text-lg font-mono group-hover:text-primary transition-colors">{mode.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{mode.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Languages Snippet */}
      <section className="space-y-6">
        <h2 className="text-2xl font-mono border-b border-border/50 pb-2">Supported Environments</h2>
        <div className="flex flex-wrap gap-3">
          {languages.map(lang => (
            <div key={lang} className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm font-mono text-primary hover:bg-primary/10 transition-colors">
              {lang}
            </div>
          ))}
          <div className="px-4 py-2 rounded-full border border-border bg-secondary/50 text-sm font-mono text-muted-foreground">
            + many more
          </div>
        </div>
      </section>
    </div>
  );
}
