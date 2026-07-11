import { useState, useEffect, useRef, useCallback } from "react";
import { useRoute } from "wouter";
import { useGenerateContent, useCreateTypingTest, useGenerateFeedback } from "@/lib/api";
import { useUsername } from "@/hooks/use-username";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw, Trophy, Target, AlertTriangle, Clock, Terminal, ChevronRight, FolderOpen, File } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type TestState = "idle" | "running" | "completed" | "blind_countdown";

type VsTheme = "vscode-dark" | "github-dark" | "intellij" | "monokai";

const VS_THEMES: Record<VsTheme, { label: string; bg: string; lineNumBg: string; lineNumColor: string; border: string; titleBg: string; tabBg: string; dotColors: string[] }> = {
  "vscode-dark": {
    label: "VS Code Dark",
    bg: "#1e1e1e",
    lineNumBg: "#1e1e1e",
    lineNumColor: "#858585",
    border: "#3c3c3c",
    titleBg: "#323233",
    tabBg: "#2d2d2d",
    dotColors: ["#ff5f57", "#febc2e", "#28c840"],
  },
  "github-dark": {
    label: "GitHub Dark",
    bg: "#0d1117",
    lineNumBg: "#0d1117",
    lineNumColor: "#6e7681",
    border: "#30363d",
    titleBg: "#161b22",
    tabBg: "#21262d",
    dotColors: ["#ff6369", "#ffd05a", "#4caf50"],
  },
  "intellij": {
    label: "IntelliJ IDEA",
    bg: "#2b2b2b",
    lineNumBg: "#313335",
    lineNumColor: "#606366",
    border: "#464646",
    titleBg: "#3c3f41",
    tabBg: "#4e5254",
    dotColors: ["#ff5f57", "#febc2e", "#28c840"],
  },
  "monokai": {
    label: "Monokai",
    bg: "#272822",
    lineNumBg: "#272822",
    lineNumColor: "#90908a",
    border: "#49483e",
    titleBg: "#1e1f1c",
    tabBg: "#35342d",
    dotColors: ["#ff6057", "#ffbd2e", "#27c93f"],
  },
};

const MODE_LANGUAGES: Record<string, { value: string; label: string }[]> = {
  english: [{ value: "english", label: "English" }],
  blind: [{ value: "english", label: "English" }],
  hindi: [{ value: "hindi", label: "Hindi (Devanagari)" }],
  hindi_english: [{ value: "hindi_english", label: "Hindi + English Mixed" }],
  coding: [
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "javascript", label: "JavaScript" },
    { value: "mysql", label: "MySQL" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
  ],
  placement: [
    { value: "oops", label: "OOPs Concepts" },
    { value: "dbms", label: "DBMS" },
    { value: "operating_systems", label: "Operating Systems" },
    { value: "computer_networks", label: "Computer Networks" },
    { value: "java", label: "Java" },
    { value: "python", label: "Python" },
    { value: "sql", label: "SQL Queries" },
  ],
  government: [
    { value: "ssc", label: "SSC" },
    { value: "railway", label: "Railway" },
    { value: "banking", label: "Banking" },
    { value: "clerk", label: "Clerk" },
    { value: "stenographer", label: "Stenographer" },
  ],
  resume: [
    { value: "bullet", label: "Resume Bullet Points" },
    { value: "email", label: "Professional Email" },
    { value: "cover", label: "Cover Letter" },
    { value: "linkedin", label: "LinkedIn Summary" },
  ],
};

const MODE_DEFAULT_LANGUAGE: Record<string, string> = {
  english: "english",
  blind: "english",
  hindi: "hindi",
  hindi_english: "hindi_english",
  coding: "python",
  placement: "oops",
  government: "ssc",
  resume: "bullet",
};

const CODE_EXTENSIONS: Record<string, string> = {
  java: "Main.java",
  python: "solution.py",
  c: "program.c",
  cpp: "solution.cpp",
  javascript: "script.js",
  mysql: "queries.sql",
  html: "index.html",
  css: "styles.css",
};

const MODE_LABELS: Record<string, string> = {
  english: "English Typing",
  coding: "Code Typing",
  hindi: "Hindi Typing",
  hindi_english: "Hindi + English",
  blind: "Blind Challenge",
  placement: "Placement Prep",
  resume: "Resume Writing",
  government: "Government Exam",
};

function normalizeCodeForTyping(code: string): string {
  return code
    .split("\n")
    .map((line) => line.replace(/^[ \t]+/, ""))
    .join("\n");
}

export default function TypeTest() {
  const [, params] = useRoute("/type/:mode");
  const mode = params?.mode || "english";
  const { username } = useUsername();

  const defaultLang = MODE_DEFAULT_LANGUAGE[mode] ?? "english";

  const [language, setLanguage] = useState(defaultLang);
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [linesCount, setLinesCount] = useState<number>(mode === "coding" ? 30 : 10);
  const [vsTheme, setVsTheme] = useState<VsTheme>("vscode-dark");

  const [testState, setTestState] = useState<TestState>("idle");
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [blindTimeLeft, setBlindTimeLeft] = useState(5);
  const [liveTime, setLiveTime] = useState(0);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const liveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateContent = useGenerateContent();
  const createTest = useCreateTypingTest();
  const generateFeedback = useGenerateFeedback();

  // Reset language when mode changes
  useEffect(() => {
    setLanguage(MODE_DEFAULT_LANGUAGE[mode] ?? "english");
    setLinesCount(mode === "coding" ? 30 : 10);
  }, [mode]);

  const loadContent = useCallback(() => {
    setTestState("idle");
    setInput("");
    setErrors(0);
    setStartTime(null);
    setEndTime(null);
    setLiveTime(0);
    if (liveTimerRef.current) clearInterval(liveTimerRef.current);

    generateContent.mutate(
      { data: { mode, language, difficulty, linesCount } },
      {
        onSuccess: (data) => {
          setText(mode === "coding" ? normalizeCodeForTyping(data.text) : data.text);
          if (mode === "blind") {
            setTestState("blind_countdown");
            setBlindTimeLeft(5);
          }
        },
      }
    );
  }, [mode, language, difficulty, linesCount, generateContent]);

  // Initial load — only trigger when these change, not on every render
  const prevConfigRef = useRef({ mode, language, difficulty, linesCount });
  useEffect(() => {
    const prev = prevConfigRef.current;
    if (prev.mode !== mode || prev.language !== language || prev.difficulty !== difficulty || prev.linesCount !== linesCount) {
      prevConfigRef.current = { mode, language, difficulty, linesCount };
      loadContent();
    }
  }, [mode, language, difficulty, linesCount]);

  // First load
  const didLoad = useRef(false);
  useEffect(() => {
    if (!didLoad.current) {
      didLoad.current = true;
      loadContent();
    }
  }, []);

  // Blind countdown timer
  useEffect(() => {
    if (testState === "blind_countdown") {
      if (blindTimeLeft > 0) {
        const t = setTimeout(() => setBlindTimeLeft((p) => p - 1), 1000);
        return () => clearTimeout(t);
      } else {
        setTestState("idle");
        inputRef.current?.focus();
      }
    }
  }, [testState, blindTimeLeft]);

  // Live timer
  useEffect(() => {
    if (testState === "running") {
      liveTimerRef.current = setInterval(() => {
        setLiveTime(startTime ? Math.floor((Date.now() - startTime) / 1000) : 0);
      }, 500);
    } else {
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
    }
    return () => {
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
    };
  }, [testState, startTime]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    if (testState === "completed" || testState === "blind_countdown") return;

    if (testState === "idle") {
      setTestState("running");
      setStartTime(Date.now());
    }

    let val = e.target.value;

    // Normalize textarea/newline behavior: ensure Enter produces "\n" in the typed string.
    // (Some browsers/environments may report Enter as "\r".)
    val = val.replace(/\r/g, "\n");

    setInput(val);

    if (val.length > input.length) {
      const lastChar = val[val.length - 1];
      const expectedChar = text[val.length - 1];

      // If we've exceeded the expected content, don't count it as an error.
      if (typeof expectedChar !== "undefined" && lastChar !== expectedChar) {
        setErrors((p) => p + 1);
      }
    }

    if (val.length >= text.length && text.length > 0) {
      handleComplete(val);
    }
  };

  const handleComplete = (finalInput: string) => {
    setTestState("completed");
    const end = Date.now();
    setEndTime(end);
    if (liveTimerRef.current) clearInterval(liveTimerRef.current);

    const elapsed = end - (startTime || end);
    const timeInMinutes = elapsed / 60000;
    const correctChars = finalInput.split("").filter((c, i) => c === text[i]).length;
    const finalWpm = Math.max(0, Math.round((correctChars / 5) / Math.max(timeInMinutes, 0.01)));
    const finalAccuracy = Math.max(0, Math.round((correctChars / Math.max(text.length, 1)) * 100));
    const finalDuration = Math.round(elapsed / 1000);

    createTest.mutate({
      data: { username, mode, language, wpm: finalWpm, accuracy: finalAccuracy, errors, duration: finalDuration, linesCount: mode === "coding" ? linesCount : undefined },
    });

    generateFeedback.mutate({
      data: { wpm: finalWpm, accuracy: finalAccuracy, errors, duration: finalDuration, mode, language },
    });
  };

  const getLiveWpm = () => {
    if (!startTime || liveTime === 0) return 0;
    const mins = liveTime / 60;
    const correctChars = input.split("").filter((c, i) => c === text[i]).length;
    return Math.round((correctChars / 5) / Math.max(mins, 0.01));
  };

  const getLiveAcc = () => {
    if (input.length === 0) return 100;
    const correct = input.split("").filter((c, i) => c === text[i]).length;
    return Math.round((correct / input.length) * 100);
  };

  const theme = VS_THEMES[vsTheme];
  const isCoding = mode === "coding";
  const textLines = text.split("\n");

  const renderCodingEditor = () => {
    const fileName = CODE_EXTENSIONS[language] ?? "code.txt";
    let charIdx = 0;

    return (
      <div
        className="rounded-lg overflow-hidden font-mono text-sm border"
        style={{ background: theme.bg, borderColor: theme.border, minHeight: 360 }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2" style={{ background: theme.titleBg, borderBottom: `1px solid ${theme.border}` }}>
          <div className="flex gap-1.5">
            {theme.dotColors.map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="flex-1 text-center text-xs" style={{ color: theme.lineNumColor }}>
            KeyForge — Code Editor
          </span>
        </div>

        {/* Tabs bar */}
        <div className="flex items-center px-2" style={{ background: theme.tabBg, borderBottom: `1px solid ${theme.border}` }}>
          <div className="flex items-center gap-1 px-3 py-1.5 text-xs" style={{ background: theme.bg, borderTop: `2px solid #39FF6A`, color: "#cccccc" }}>
            <File className="w-3 h-3 opacity-60" />
            {fileName}
          </div>
        </div>

        {/* File explorer + editor layout */}
        <div className="flex" style={{ minHeight: 300 }}>
          {/* Mini file explorer */}
          <div className="hidden md:flex flex-col text-xs py-2 border-r select-none" style={{ width: 150, background: theme.lineNumBg, borderColor: theme.border, color: theme.lineNumColor }}>
            <div className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: theme.lineNumColor }}>
              <FolderOpen className="w-3 h-3" /> Explorer
            </div>
            <div className="flex items-center gap-1 px-3 py-0.5 opacity-60">
              <ChevronRight className="w-3 h-3" /> PROJECT
            </div>
            <div className="flex items-center gap-1 px-5 py-0.5" style={{ background: theme.bg, color: "#39FF6A" }}>
              <File className="w-3 h-3" /> {fileName}
            </div>
          </div>

          {/* Editor area */}
          <div
            className="flex-1 overflow-auto p-0 cursor-text"
            onClick={() => testState !== "completed" && testState !== "blind_countdown" && inputRef.current?.focus()}
          >
            <table className="w-full border-collapse">
              <tbody>
                {textLines.map((line, lineIdx) => {
                  const lineStartIdx = charIdx;
                  charIdx += line.length + (lineIdx < textLines.length - 1 ? 1 : 0);
                  const lineEndIdx = charIdx;

                  return (
                    <tr key={lineIdx} className="leading-6">
                      <td
                        className="text-right pr-4 pl-3 select-none w-10 text-xs pt-0.5 align-top"
                        style={{ color: theme.lineNumColor, background: theme.lineNumBg, userSelect: "none" }}
                      >
                        {lineIdx + 1}
                      </td>
                      <td className="pl-2 pr-4 whitespace-pre-wrap pt-0.5 align-top">
                        {(line + (lineIdx < textLines.length - 1 ? "\n" : "")).split("").map((char, charInLine) => {
                          const absoluteIdx = lineStartIdx + charInLine;
                          let color = "#858585";
                          let bg = "transparent";

                          if (absoluteIdx < input.length) {
                            if (input[absoluteIdx] === char) {
                              color = "#39FF6A";
                            } else {
                              color = "#ff5555";
                              bg = "rgba(255,85,85,0.15)";
                            }
                          } else if (absoluteIdx === input.length && testState !== "completed") {
                            color = "#cccccc";
                          } else {
                            color = char === "\n" ? "transparent" : "#abb2bf";
                          }

                          const isCursor = absoluteIdx === input.length && testState !== "completed";

                          return (
                            <span
                              key={charInLine}
                              style={{
                                color: char === "\n" ? "transparent" : color,
                                background: bg,
                                borderLeft: isCursor ? "2px solid #39FF6A" : undefined,
                              }}
                              className={isCursor ? "animate-pulse" : ""}
                            >
                              {char === "\n" ? " " : char}
                            </span>
                          );
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-1 text-xs" style={{ background: "#007acc", color: "#fff" }}>
          <div className="flex items-center gap-3">
            <span>KeyForge</span>
            <span>{fileName}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>{language.toUpperCase()}</span>
            <span>Ln {Math.min(input.split("\n").length, textLines.length)}, Col {(input.split("\n").pop()?.length ?? 0) + 1}</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    );
  };

  const renderNormalText = () => {
    if (mode === "blind" && testState === "blind_countdown") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-5xl font-mono font-bold text-primary animate-pulse">{blindTimeLeft}</div>
            <div className="text-muted-foreground font-mono text-lg">Memorize this text...</div>
          </div>
          <div className="font-mono text-lg leading-relaxed text-foreground/80 whitespace-pre-wrap border border-primary/20 rounded-md p-4 bg-primary/5">
            {text}
          </div>
        </div>
      );
    }

    if (mode === "blind" && testState !== "completed") {
      return (
        <div className="flex flex-col items-center justify-center h-40 space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Terminal className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div className="text-muted-foreground font-mono text-lg">Type from memory...</div>
          <div className="text-xs text-muted-foreground/50 font-mono">{input.length} / {text.length} chars typed</div>
        </div>
      );
    }

    return (
      <div
        className="font-mono text-xl leading-relaxed whitespace-pre-wrap break-words cursor-text"
        onClick={() => testState !== "completed" && inputRef.current?.focus()}
      >
        {text.split("").map((char, idx) => {
          let cls = "text-muted-foreground/60";
          if (idx < input.length) {
            cls = input[idx] === char ? "text-primary" : "text-destructive bg-destructive/20 rounded-sm";
          }
          const isCursor = idx === input.length && testState !== "completed";
          return (
            <span key={idx} className={`${cls} ${isCursor ? "border-l-2 border-primary animate-pulse" : ""}`}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-8rem)]">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-4">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="font-mono text-primary uppercase text-sm tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              {MODE_LABELS[mode] ?? "Typing Test"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Language / Topic selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {mode === "placement" ? "Topic" : mode === "government" ? "Category" : mode === "resume" ? "Content Type" : "Language"}
              </label>
              <Select value={language} onValueChange={setLanguage} disabled={testState === "running"}>
                <SelectTrigger className="font-mono text-sm" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(MODE_LANGUAGES[mode] ?? MODE_LANGUAGES["english"]).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="font-mono">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Difficulty</label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)} disabled={testState === "running"}>
                <SelectTrigger className="font-mono text-sm" data-testid="select-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner" className="font-mono">Beginner</SelectItem>
                  <SelectItem value="intermediate" className="font-mono">Intermediate</SelectItem>
                  <SelectItem value="advanced" className="font-mono">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lines count for coding */}
            {isCoding && (
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Lines of Code</label>
                <Select value={linesCount.toString()} onValueChange={(v) => setLinesCount(Number(v))} disabled={testState === "running"}>
                  <SelectTrigger className="font-mono text-sm" data-testid="select-lines">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30" className="font-mono">30 Lines</SelectItem>
                    <SelectItem value="50" className="font-mono">50 Lines</SelectItem>
                    <SelectItem value="75" className="font-mono">75 Lines</SelectItem>
                    <SelectItem value="100" className="font-mono">100 Lines</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* VS Code theme selector for coding */}
            {isCoding && (
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Editor Theme</label>
                <Select value={vsTheme} onValueChange={(v) => setVsTheme(v as VsTheme)} disabled={testState === "running"}>
                  <SelectTrigger className="font-mono text-sm" data-testid="select-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(VS_THEMES) as [VsTheme, typeof VS_THEMES[VsTheme]][]).map(([key, t]) => (
                      <SelectItem key={key} value={key} className="font-mono">
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={loadContent}
              variant="outline"
              className="w-full font-mono mt-2 border-primary/30 hover:bg-primary/10 hover:text-primary hover:border-primary/60 transition-all"
              disabled={generateContent.isPending}
              data-testid="button-restart"
            >
              {generateContent.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {generateContent.isPending ? "Generating..." : "New Test"}
            </Button>
          </CardContent>
        </Card>

        {/* Live Stats */}
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1" data-testid="stat-wpm">
              <span className="text-xs text-muted-foreground font-mono uppercase flex items-center gap-1">
                <Trophy className="w-3 h-3 text-primary" /> WPM
              </span>
              <div className="text-3xl font-bold font-mono text-primary">{getLiveWpm()}</div>
            </div>
            <div className="space-y-1" data-testid="stat-accuracy">
              <span className="text-xs text-muted-foreground font-mono uppercase flex items-center gap-1">
                <Target className="w-3 h-3 text-primary" /> ACC
              </span>
              <div className="text-3xl font-bold font-mono text-foreground">{getLiveAcc()}%</div>
            </div>
            <div className="space-y-1" data-testid="stat-errors">
              <span className="text-xs text-muted-foreground font-mono uppercase flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-destructive" /> ERR
              </span>
              <div className="text-3xl font-bold font-mono text-destructive">{errors}</div>
            </div>
            <div className="space-y-1" data-testid="stat-time">
              <span className="text-xs text-muted-foreground font-mono uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-primary" /> TIME
              </span>
              <div className="text-3xl font-bold font-mono text-foreground">{liveTime}s</div>
            </div>
          </CardContent>
        </Card>

        {/* Government exam accuracy badge */}
        {mode === "government" && (
          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="p-4 space-y-2">
              <div className="text-xs text-primary font-mono uppercase tracking-widest">Exam Standard</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary">Min. 95% Accuracy</Badge>
                <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary">Timed Test</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main typing area */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <div className="relative">
          {isCoding ? (
            <textarea
              ref={inputRef as any}
              className="absolute opacity-0 -z-10 w-0 h-0"
              value={input}
              onChange={handleInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // Allow Enter to be recorded as a real "\n".
                  // Prevent browser default handling and insert explicitly.
                  e.preventDefault();
                  const el = e.currentTarget as HTMLTextAreaElement;
                  const before = el.value.slice(0, el.selectionStart ?? el.value.length);
                  const after = el.value.slice(el.selectionEnd ?? el.value.length);
                  const next = before + "\n" + after;
                  setInput(next);
                }
              }}
              onBlur={() => {
                if (testState !== "completed" && testState !== "blind_countdown") {
                  setTimeout(() => (inputRef.current as any)?.focus?.(), 50);
                }
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-testid="input-typing"
            />
          ) : (
            <input
              ref={inputRef as any}
              type="text"

              className="absolute opacity-0 -z-10 w-0 h-0"
              value={input}
              onChange={handleInput}
              onBlur={() => {
                if (testState !== "completed" && testState !== "blind_countdown") {
                  setTimeout(() => inputRef.current?.focus(), 50);
                }
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-testid="input-typing"
            />
          )}


          {isCoding && text ? (
            <div className="relative">
              {testState !== "completed" && testState !== "blind_countdown" && document.activeElement !== inputRef.current && (
                <div
                  className="absolute inset-0 z-20 flex items-end justify-center pb-4 cursor-pointer rounded-lg"
                  onClick={() => inputRef.current?.focus()}
                >
                  <div className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-mono uppercase font-bold tracking-widest text-sm shadow-[0_0_30px_rgba(57,255,106,0.4)]">
                    ▶ Click to Start Typing
                  </div>
                </div>
              )}
              {generateContent.isPending ? (
                <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-card/50">
                  <Skeleton className="h-8 w-3/4 bg-primary/10" />
                  <Skeleton className="h-6 w-full bg-primary/10" />
                  <Skeleton className="h-6 w-5/6 bg-primary/10" />
                  <Skeleton className="h-6 w-4/5 bg-primary/10" />
                </div>
              ) : (
                renderCodingEditor()
              )}
            </div>
          ) : (
            <Card
              className={`min-h-[360px] border-primary/20 bg-card/80 backdrop-blur transition-all duration-300 relative overflow-hidden ${testState === "idle" && !generateContent.isPending ? "cursor-text hover:border-primary/40" : ""}`}
            >
              <CardContent className="p-8 min-h-[360px]">
                {generateContent.isPending ? (
                  <div className="space-y-4">
                    <Skeleton className="h-7 w-3/4 bg-primary/10" />
                    <Skeleton className="h-7 w-full bg-primary/10" />
                    <Skeleton className="h-7 w-5/6 bg-primary/10" />
                    <Skeleton className="h-7 w-4/5 bg-primary/10" />
                  </div>
                ) : (
                  <div className="relative">
                    {testState !== "completed" && testState !== "blind_countdown" && document.activeElement !== inputRef.current && (
                      <div
                        className="absolute inset-0 z-20 flex items-end justify-center pb-4 cursor-pointer rounded-md"
                        onClick={() => inputRef.current?.focus()}
                      >
                        <div className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-mono uppercase font-bold tracking-widest text-sm shadow-[0_0_30px_rgba(57,255,106,0.4)]">
                          ▶ Click to Start Typing
                        </div>
                      </div>
                    )}
                    {renderNormalText()}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Progress bar */}
        {testState === "running" && text.length > 0 && (
          <motion.div
            className="w-full h-1 bg-border rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(57,255,106,0.6)]"
              style={{ width: `${Math.round((input.length / text.length) * 100)}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </motion.div>
        )}

        {/* Coaching Feedback */}
        <AnimatePresence>
          {testState === "completed" && (
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <Card className="border-primary/30 bg-primary/5 shadow-[0_0_30px_rgba(57,255,106,0.08)]">
                <CardHeader className="pb-3">
                  <CardTitle className="font-mono text-primary flex items-center gap-2 text-base">
                    <Terminal className="w-4 h-4" />
                    Coaching Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generateFeedback.isPending ? (
                    <div className="flex items-center gap-3 text-muted-foreground font-mono py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      Analyzing your typing patterns...
                    </div>
                  ) : generateFeedback.data ? (
                    <div className="space-y-4">
                      {generateFeedback.data.summary && (
                        <p className="text-sm text-foreground/80 font-mono border-l-2 border-primary pl-3 py-1">
                          {generateFeedback.data.summary}
                        </p>
                      )}
                      <div className="grid md:grid-cols-3 gap-6 font-mono text-sm">
                        <div className="space-y-2">
                          <h4 className="text-primary uppercase text-xs tracking-widest border-b border-primary/20 pb-1">Strengths</h4>
                          <ul className="space-y-1 list-none text-muted-foreground">
                            {generateFeedback.data.strengths.map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">+</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-destructive uppercase text-xs tracking-widest border-b border-destructive/20 pb-1">Improve</h4>
                          <ul className="space-y-1 list-none text-muted-foreground">
                            {generateFeedback.data.weaknesses.map((w, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-destructive mt-0.5">!</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-foreground/70 uppercase text-xs tracking-widest border-b border-border pb-1">Next Steps</h4>
                          <ul className="space-y-1 list-none text-muted-foreground">
                            {generateFeedback.data.suggestions.map((s, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">›</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                        <span className="text-xs text-muted-foreground font-mono">Target WPM:</span>
                        <span className="text-primary font-mono font-bold">{generateFeedback.data.targetWpm}</span>
                        <Button onClick={loadContent} size="sm" variant="outline" className="ml-auto font-mono border-primary/30 hover:bg-primary/10 hover:text-primary">
                          <RefreshCw className="w-3 h-3 mr-1" /> Try Again
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
