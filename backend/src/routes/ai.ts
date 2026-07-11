import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { GenerateContentBody, GenerateFeedbackBody } from "../validation";
import { getLocalContent } from "./content-library";
import { db, typingContentTable } from "../db";
import { eq, and, sql } from "drizzle-orm";

const router = Router();

const AI_TIMEOUT_MS = 3000;

function getAiClient() {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

function buildContentPrompt(mode: string, language: string, difficulty: string, linesCount: number, topic: string | null | undefined): string {
  const difficultyMap: Record<string, string> = {
    beginner: "simple, short sentences, basic concepts",
    intermediate: "moderate complexity, standard patterns",
    advanced: "complex, technical, expert-level",
  };
  const diffDesc = difficultyMap[difficulty] || "moderate complexity";

  if (mode === "coding") {
    return `Generate a ${difficulty} ${language} code snippet for typing practice.
Requirements:
- Exactly ${linesCount} lines of actual code
- Well-formatted, properly indented ${language} code
- Include comments where appropriate
- ${diffDesc}
- Real, useful code (not Lorem Ipsum or random chars)
- Topic: ${topic || "general programming"}
Return ONLY the raw code text, no markdown code fences, no explanations.`;
  }

  if (mode === "hindi") {
    return `Generate a Hindi typing practice passage.
Requirements:
- ${linesCount} lines of Hindi text in Devanagari script
- ${diffDesc}
- Natural, flowing Hindi prose
- Topic: ${topic || "general"}
Return ONLY the Hindi text, no explanations.`;
  }

  if (mode === "hindi_english") {
    return `Generate a mixed Hindi-English (Hinglish) typing practice passage.
Requirements:
- ${linesCount} lines mixing Hindi Devanagari and English naturally
- ${diffDesc}
Return ONLY the text, no explanations.`;
  }

  if (mode === "placement") {
    const placementTopic = topic || language || "OOPs concepts";
    return `Generate a technical interview preparation typing passage about ${placementTopic}.
Requirements:
- ${linesCount} lines of technical content
- Cover key concepts, definitions, examples
- ${diffDesc}
Return ONLY the text content, no markdown, no explanations.`;
  }

  if (mode === "resume") {
    const resumeTypes: Record<string, string> = {
      bullet: "professional resume bullet points",
      email: "a professional email",
      cover: "a cover letter paragraph",
      linkedin: "a LinkedIn summary",
    };
    const type = resumeTypes[language] || "professional resume bullet points";
    return `Generate ${type} for typing practice.
Requirements:
- ${linesCount} lines of professional content
- ${diffDesc}
Return ONLY the content text, no labels, no explanations.`;
  }

  if (mode === "government") {
    const examTopic = topic || language || "general knowledge";
    return `Generate a ${examTopic} exam-style passage for typing practice.
Requirements:
- ${linesCount} lines of formal passage text
- Suitable for SSC/Railway/Banking typing test format
- ${diffDesc}
Return ONLY the passage text, no explanations.`;
  }

  if (mode === "blind") {
    return `Generate an English paragraph for blind typing challenge practice.
Requirements:
- ${linesCount} lines
- ${diffDesc}
- Interesting, memorable content so users can recall it
Return ONLY the text, no explanations.`;
  }

  return `Generate an English typing practice passage.
Requirements:
- ${linesCount} lines
- ${diffDesc}
- Interesting, engaging content
- Topic: ${topic || "general"}
Return ONLY the text, no explanations.`;
}

const MODELS_BY_PRIORITY = ["gemini-2.0-flash-lite", "gemini-1.5-flash-8b", "gemini-2.0-flash", "gemini-2.5-flash"];

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`AI_TIMEOUT after ${ms}ms`)), ms)
    ),
  ]);
}

async function generateWithFallback(prompt: string): Promise<string> {
  const ai = getAiClient();
  let lastErr: unknown;
  for (const model of MODELS_BY_PRIORITY) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { maxOutputTokens: 8192 },
        }),
        AI_TIMEOUT_MS
      );
      return response.text ?? "";
    } catch (err: unknown) {
      lastErr = err;
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("RESOURCE_EXHAUSTED") ||
        msg.includes("429") ||
        msg.includes("quota") ||
        msg.includes("NOT_FOUND") ||
        msg.includes("404") ||
        msg.includes("AI_TIMEOUT")
      ) {
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

async function getDbContent(mode: string, language: string, difficulty: string) {
  try {
    const rows = await db
      .select()
      .from(typingContentTable)
      .where(
        and(
          eq(typingContentTable.mode, mode),
          eq(typingContentTable.language, language),
          eq(typingContentTable.difficulty, difficulty)
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(1);

    if (rows.length > 0) return rows[0];

    // Fallback: same mode, any difficulty
    const anyDiff = await db
      .select()
      .from(typingContentTable)
      .where(eq(typingContentTable.mode, mode))
      .orderBy(sql`RANDOM()`)
      .limit(1);

    return anyDiff[0] ?? null;
  } catch {
    return null;
  }
}

router.post("/ai/generate-content", async (req, res) => {
  const parseResult = GenerateContentBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const { mode, language, difficulty = "intermediate", linesCount = 30, topic } = parseResult.data;

  // First: attempt AI with a hard 3-second timeout
  try {
    const prompt = buildContentPrompt(mode, language, difficulty, linesCount, topic);
    const text = await generateWithFallback(prompt);
    res.json({ text: text.trim(), language, mode, title: topic || language, source: "ai" });
    return;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isQuotaOrTimeout = msg.includes("quota") || msg.includes("429") || msg.includes("EXHAUSTED") || msg.includes("AI_TIMEOUT");
    req.log.warn({ msg: "AI unavailable, serving from DB", reason: isQuotaOrTimeout ? "quota/timeout" : msg });
  }

  // Second: serve instantly from DB
  const dbRow = await getDbContent(mode, language, difficulty);
  if (dbRow) {
    res.json({ text: dbRow.content, language: dbRow.language, mode: dbRow.mode, title: dbRow.title, source: "db" });
    return;
  }

  // Third: last-resort in-memory library
  const fallback = getLocalContent(mode, language);
  if (fallback) {
    res.json({ text: fallback.text, language, mode, title: fallback.title, source: "local" });
    return;
  }

  res.status(500).json({ error: "Failed to generate content" });
});

router.post("/ai/feedback", async (req, res) => {
  const parseResult = GenerateFeedbackBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const { wpm, accuracy, errors, duration, mode, language, targetWpm } = parseResult.data;

  try {
    const prompt = `You are an AI typing coach. Analyze this typing test result and provide structured feedback.

Test Results:
- WPM: ${wpm}
- Accuracy: ${accuracy}%
- Errors: ${errors}
- Duration: ${duration}s
- Mode: ${mode}
- Language: ${language}
${targetWpm ? `- Target WPM: ${targetWpm}` : ""}

Respond with a JSON object with EXACTLY this structure:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "targetWpm": <number, recommended next target>,
  "summary": "<one sentence overall assessment>"
}

Be specific, actionable, and encouraging. Return ONLY valid JSON.`;

    const raw = await withTimeout(generateWithFallback(prompt), AI_TIMEOUT_MS * 2);
    let parsed: Record<string, unknown>;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      parsed = {};
    }

    res.json({
      strengths: (parsed["strengths"] as string[]) ?? [],
      weaknesses: (parsed["weaknesses"] as string[]) ?? [],
      suggestions: (parsed["suggestions"] as string[]) ?? [],
      targetWpm: (parsed["targetWpm"] as number) ?? Math.round(wpm * 1.1),
      summary: (parsed["summary"] as string) ?? "Keep practicing to improve your speed and accuracy.",
    });
  } catch {
    // Instant local feedback when AI is unavailable
    const targetWpmCalc = Math.round(wpm * 1.1);
    const isGoodAccuracy = accuracy >= 95;
    const isGoodWpm = wpm >= 50;
    res.json({
      strengths: [
        isGoodAccuracy ? `Excellent accuracy at ${accuracy.toFixed(1)}%` : `You completed the ${mode} test`,
        isGoodWpm ? `Good typing speed of ${wpm.toFixed(0)} WPM` : `${duration}s of focused practice`,
      ],
      weaknesses: [
        !isGoodAccuracy ? `Accuracy of ${accuracy.toFixed(1)}% needs improvement — aim for 95%+` : "Focus on maintaining accuracy at higher speeds",
        errors > 5 ? `${errors} errors made — slow down slightly for better precision` : "Keep building speed consistency",
      ],
      suggestions: [
        "Practice weak keys with targeted drills",
        "Aim to increase WPM by 5-10% per week",
        accuracy < 95 ? "Prioritize accuracy over speed — correct fingers over fast fingers" : "Try increasing your target WPM by 10",
      ],
      targetWpm: targetWpmCalc,
      summary: `You typed at ${wpm.toFixed(0)} WPM with ${accuracy.toFixed(1)}% accuracy — ${isGoodWpm && isGoodAccuracy ? "great performance!" : "keep practicing daily to improve steadily."}`,
    });
  }
});

export default router;
