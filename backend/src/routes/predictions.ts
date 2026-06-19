import { Router } from "express";
import { db, typingTestsTable } from "../db";
import { eq, desc } from "drizzle-orm";
import { optionalAuth } from "../middlewares/auth";
import {
  predictWPM,
  predictAccuracy,
  estimateTargetDate,
  getLanguagePredictions,
} from "../services/linearRegression";
import { z } from "zod";

const router = Router();

function getUsername(req: any): string | null {
  if (req.user?.username) return req.user.username;
  if (req.query.username && typeof req.query.username === "string") return req.query.username;
  return null;
}

async function getUserTests(username: string) {
  return db.select()
    .from(typingTestsTable)
    .where(eq(typingTestsTable.username, username))
    .orderBy(desc(typingTestsTable.createdAt))
    .limit(200);
}

router.get("/predictions/wpm", optionalAuth, async (req, res) => {
  const username = getUsername(req);
  if (!username) {
    res.status(400).json({ error: "Username required (query param or auth token)" });
    return;
  }
  try {
    const tests = await getUserTests(username);
    const wpmHistory = tests.map((t) => t.wpm).reverse();
    res.json(predictWPM(wpmHistory));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to generate WPM predictions" });
  }
});

router.get("/predictions/accuracy", optionalAuth, async (req, res) => {
  const username = getUsername(req);
  if (!username) {
    res.status(400).json({ error: "Username required" });
    return;
  }
  try {
    const tests = await getUserTests(username);
    const accHistory = tests.map((t) => t.accuracy).reverse();
    res.json(predictAccuracy(accHistory));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to generate accuracy predictions" });
  }
});

const GoalBody = z.object({
  targetWpm: z.number().min(1).max(300),
  username: z.string().optional(),
});

router.post("/predictions/goal", optionalAuth, async (req, res) => {
  const parsed = GoalBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input. Provide targetWpm (number)" });
    return;
  }
  const username = req.user?.username || parsed.data.username;
  if (!username) {
    res.status(400).json({ error: "Username required" });
    return;
  }
  try {
    const tests = await getUserTests(username);
    const wpmHistory = tests.map((t) => t.wpm).reverse();
    res.json(estimateTargetDate(wpmHistory, parsed.data.targetWpm));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to compute goal estimate" });
  }
});

router.get("/predictions/language", optionalAuth, async (req, res) => {
  const username = getUsername(req);
  if (!username) {
    res.status(400).json({ error: "Username required" });
    return;
  }
  try {
    const tests = await getUserTests(username);
    const result = getLanguagePredictions(tests.map((t) => ({ language: t.language, wpm: t.wpm })));
    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to generate language predictions" });
  }
});

export default router;
