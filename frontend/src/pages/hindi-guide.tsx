import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Keyboard, CheckCircle, XCircle, RefreshCw, Play } from "lucide-react";

const vowels = [
  { eng: "a", hin: "अ" }, { eng: "aa", hin: "आ" }, { eng: "i", hin: "इ" },
  { eng: "ii / ee", hin: "ई" }, { eng: "u", hin: "उ" }, { eng: "uu / oo", hin: "ऊ" },
  { eng: "e", hin: "ए" }, { eng: "ai", hin: "ऐ" }, { eng: "o", hin: "ओ" },
  { eng: "au", hin: "औ" }, { eng: "am", hin: "अं" }, { eng: "ah", hin: "अः" },
];

const consonants = [
  { eng: "k", hin: "क" }, { eng: "kh", hin: "ख" }, { eng: "g", hin: "ग" }, { eng: "gh", hin: "घ" }, { eng: "ng", hin: "ङ" },
  { eng: "c / ch", hin: "च" }, { eng: "chh", hin: "छ" }, { eng: "j", hin: "ज" }, { eng: "jh", hin: "झ" }, { eng: "ny", hin: "ञ" },
  { eng: "T", hin: "ट" }, { eng: "Th", hin: "ठ" }, { eng: "D", hin: "ड" }, { eng: "Dh", hin: "ढ" }, { eng: "N", hin: "ण" },
  { eng: "t", hin: "त" }, { eng: "th", hin: "थ" }, { eng: "d", hin: "द" }, { eng: "dh", hin: "ध" }, { eng: "n", hin: "न" },
  { eng: "p", hin: "प" }, { eng: "ph / f", hin: "फ" }, { eng: "b", hin: "ब" }, { eng: "bh", hin: "भ" }, { eng: "m", hin: "म" },
  { eng: "y", hin: "य" }, { eng: "r", hin: "र" }, { eng: "l", hin: "ल" }, { eng: "v / w", hin: "व" },
  { eng: "sh", hin: "श" }, { eng: "shh", hin: "ष" }, { eng: "s", hin: "स" }, { eng: "h", hin: "ह" },
];

const QUIZ_ITEMS = [
  ...vowels.slice(0, 6),
  ...consonants.slice(0, 10),
];

const PRACTICE_WORDS = [
  { word: "नमस्ते", keys: "namaste", meaning: "Hello" },
  { word: "भारत", keys: "bharat", meaning: "India" },
  { word: "कंप्यूटर", keys: "kampyutar", meaning: "Computer" },
  { word: "प्रोग्रामिंग", keys: "programing", meaning: "Programming" },
  { word: "स्वागत", keys: "swagat", meaning: "Welcome" },
  { word: "ज्ञान", keys: "gyaan", meaning: "Knowledge" },
  { word: "विद्यालय", keys: "vidyalay", meaning: "School" },
  { word: "परीक्षा", keys: "pariksha", meaning: "Exam" },
  { word: "सरकार", keys: "sarkar", meaning: "Government" },
  { word: "शिक्षक", keys: "shikshak", meaning: "Teacher" },
  { word: "पुस्तक", keys: "pustak", meaning: "Book" },
  { word: "मित्र", keys: "mitra", meaning: "Friend" },
];

const BEGINNER_LESSONS = [
  {
    title: "Lesson 1: Basic Vowels",
    desc: "Master the 5 short vowels",
    items: [
      { eng: "a", hin: "अ" }, { eng: "aa", hin: "आ" }, { eng: "i", hin: "इ" },
      { eng: "u", hin: "उ" }, { eng: "e", hin: "ए" },
    ],
  },
  {
    title: "Lesson 2: K-Row Consonants",
    desc: "The first row of the Devanagari consonant chart",
    items: [
      { eng: "k", hin: "क" }, { eng: "kh", hin: "ख" }, { eng: "g", hin: "ग" }, { eng: "gh", hin: "घ" },
    ],
  },
  {
    title: "Lesson 3: T and D Sounds",
    desc: "Soft and hard dental consonants",
    items: [
      { eng: "t", hin: "त" }, { eng: "th", hin: "थ" }, { eng: "d", hin: "द" }, { eng: "dh", hin: "ध" },
    ],
  },
  {
    title: "Lesson 4: Common Words",
    desc: "Practice with frequently used words",
    items: PRACTICE_WORDS.slice(0, 4).map(w => ({ eng: w.keys, hin: w.word })),
  },
];

function MappingGrid({ title, items }: { title: string; items: { eng: string; hin: string }[] }) {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-mono text-primary uppercase border-b border-primary/20 pb-2 tracking-widest">{title}</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            className={`bg-muted/30 border rounded-md p-3 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${highlighted === i ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(57,255,106,0.2)]" : "border-border/50 hover:border-primary/40 hover:bg-primary/5"}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setHighlighted(highlighted === i ? null : i)}
            data-testid={`key-card-${i}`}
          >
            <span className="text-2xl font-bold text-foreground mb-1">{item.hin}</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded ${highlighted === i ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
              {item.eng}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QuizSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [quizItems] = useState(() => [...QUIZ_ITEMS].sort(() => Math.random() - 0.5).slice(0, 10));

  const current = quizItems[currentIdx];

  const handleSubmit = () => {
    if (!userInput.trim()) return;
    const isCorrect = userInput.trim().toLowerCase() === current.eng.toLowerCase() ||
      current.eng.toLowerCase().split(" / ").includes(userInput.trim().toLowerCase());
    setResult(isCorrect ? "correct" : "wrong");
    setScore((s) => s + (isCorrect ? 1 : 0));
    setTotal((t) => t + 1);
  };

  const handleNext = () => {
    setUserInput("");
    setResult(null);
    setCurrentIdx((i) => i + 1);
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setUserInput("");
    setResult(null);
    setScore(0);
    setTotal(0);
  };

  if (currentIdx >= quizItems.length) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-8">
        <div className="text-5xl font-mono font-bold text-primary">{score}/{quizItems.length}</div>
        <div className="text-lg font-mono text-muted-foreground">
          {score >= 8 ? "Excellent! You are mastering Devanagari!" : score >= 5 ? "Good progress! Keep practicing." : "Keep going — practice makes perfect!"}
        </div>
        <div className="flex justify-center gap-2 mt-2">
          {Array.from({ length: quizItems.length }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full" style={{ background: i < score ? "#39FF6A" : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>
        <Button onClick={handleReset} className="font-mono mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {quizItems.map((_, i) => (
            <div key={i} className={`h-1 w-6 rounded-full transition-all ${i < currentIdx ? "bg-primary" : i === currentIdx ? "bg-primary/60 animate-pulse" : "bg-border"}`} />
          ))}
        </div>
        <Badge variant="outline" className="font-mono border-primary/30 text-primary">
          {score}/{total} correct
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="text-center space-y-4"
        >
          <div className="text-sm text-muted-foreground font-mono">What is the transliteration of:</div>
          <div className="text-7xl font-bold" style={{ lineHeight: 1.2 }}>{current.hin}</div>

          {result === null ? (
            <div className="flex gap-2 max-w-xs mx-auto">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                placeholder="Type the English equivalent..."
                className="flex-1 bg-muted/40 border border-border rounded-md px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                autoFocus
                data-testid="input-quiz"
              />
              <Button onClick={handleSubmit} className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-3"
            >
              <div className={`flex items-center justify-center gap-2 text-lg font-mono font-bold ${result === "correct" ? "text-primary" : "text-destructive"}`}>
                {result === "correct" ? (
                  <><CheckCircle className="w-5 h-5" /> Correct!</>
                ) : (
                  <><XCircle className="w-5 h-5" /> The answer is: <span className="text-primary">{current.eng}</span></>
                )}
              </div>
              <Button onClick={handleNext} variant="outline" className="font-mono border-primary/30 hover:bg-primary/10 hover:text-primary">
                Next Character
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function LessonCard({ lesson, idx }: { lesson: typeof BEGINNER_LESSONS[0]; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout className="border border-border/50 rounded-lg overflow-hidden bg-card/40 hover:border-primary/30 transition-colors">
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setOpen(!open)}
        data-testid={`lesson-toggle-${idx}`}
      >
        <div>
          <div className="font-mono text-sm text-primary font-bold">{lesson.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{lesson.desc}</div>
        </div>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <Play className="w-4 h-4 text-primary" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="border-t border-border/30 p-4 grid grid-cols-4 sm:grid-cols-6 gap-3">
              {lesson.items.map((item, i) => (
                <div key={i} className="bg-muted/30 border border-border/50 rounded-md p-3 text-center hover:border-primary/40 hover:bg-primary/5 transition-colors">
                  <div className="text-2xl font-bold text-foreground mb-1">{item.hin}</div>
                  <div className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">{item.eng}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function HindiGuide() {
  const [activeTab, setActiveTab] = useState<"guide" | "quiz" | "practice">("guide");

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Hero */}
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2 border border-primary/20">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold font-mono text-foreground">Devanagari Typing Guide</h1>
        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
          Master Hindi phonetic transliteration. Type the English equivalent and the system converts to Devanagari script.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-muted/30 rounded-lg border border-border/40 w-fit mx-auto">
        {([
          { key: "guide", label: "Key Reference", icon: BookOpen },
          { key: "quiz", label: "Practice Quiz", icon: Keyboard },
          { key: "practice", label: "Beginner Lessons", icon: Play },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition-all ${activeTab === key ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(57,255,106,0.3)]" : "text-muted-foreground hover:text-foreground"}`}
            data-testid={`tab-${key}`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "guide" && (
          <motion.div key="guide" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="font-mono text-primary text-base">How Transliteration Works</CardTitle>
                <CardDescription>
                  Type English phonetics and the system maps them to Devanagari characters. Single letters for most consonants, two-letter combos for aspirated sounds.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <MappingGrid title="Vowels — Swar" items={vowels} />
                <MappingGrid title="Consonants — Vyanjan" items={consonants} />

                <div className="space-y-4">
                  <h3 className="text-base font-mono text-primary uppercase border-b border-primary/20 pb-2 tracking-widest">Common Word Examples</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {PRACTICE_WORDS.map((ex, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center justify-between bg-muted/20 border border-border/40 p-3 rounded-md hover:border-primary/30 hover:bg-primary/5 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <div>
                          <div className="text-xl font-bold text-foreground">{ex.word}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{ex.meaning}</div>
                        </div>
                        <span className="font-mono text-primary text-sm bg-primary/10 px-2 py-1 rounded">{ex.keys}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="space-y-3">
                  <h3 className="text-base font-mono text-primary uppercase border-b border-primary/20 pb-2 tracking-widest">Quick Tips</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { tip: "Long vowels", desc: "Use double letter: 'aa' for आ, 'ee' for ई, 'oo' for ऊ" },
                      { tip: "Aspirated consonants", desc: "Add 'h': 'kh' for ख, 'gh' for घ, 'bh' for भ, 'ph' for फ" },
                      { tip: "Retroflex sounds", desc: "Uppercase for ट-row: 'T' for ट, 'D' for ड, 'N' for ण" },
                      { tip: "Nasal sounds", desc: "'m' at end for anusvara: 'am' gives अं" },
                    ].map((t, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-muted/20 rounded-md border border-border/30">
                        <div className="w-1.5 h-full min-h-[2rem] bg-primary/50 rounded-full flex-shrink-0" />
                        <div>
                          <div className="font-mono text-sm text-primary font-semibold">{t.tip}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="bg-card/50 backdrop-blur border-border/50 max-w-lg mx-auto">
              <CardHeader>
                <CardTitle className="font-mono text-primary text-base flex items-center gap-2">
                  <Keyboard className="w-4 h-4" /> Interactive Quiz
                </CardTitle>
                <CardDescription>
                  See the Devanagari character and type its English transliteration. Press Enter to submit.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuizSection />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "practice" && (
          <motion.div key="practice" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
            <p className="text-sm text-muted-foreground font-mono text-center">Click a lesson to expand it and study the characters.</p>
            {BEGINNER_LESSONS.map((lesson, i) => (
              <LessonCard key={i} lesson={lesson} idx={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
