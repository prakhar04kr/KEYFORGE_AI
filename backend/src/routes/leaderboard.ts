import { Router } from "express";
import { db, typingTestsTable } from "../db";
import { GetLeaderboardQueryParams } from "../validation";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/leaderboard", async (req, res) => {
  const parseResult = GetLeaderboardQueryParams.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { category = "overall", period = "all_time", limit = 50 } = parseResult.data;

  try {
    let rows = await db.select().from(typingTestsTable).orderBy(desc(typingTestsTable.wpm));

    const now = new Date();
    if (period === "daily") {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 1);
      rows = rows.filter((r) => new Date(r.createdAt) >= cutoff);
    } else if (period === "weekly") {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      rows = rows.filter((r) => new Date(r.createdAt) >= cutoff);
    } else if (period === "monthly") {
      const cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - 1);
      rows = rows.filter((r) => new Date(r.createdAt) >= cutoff);
    }

    if (category !== "overall") {
      rows = rows.filter((r) => r.mode === category || r.language === category);
    }

    const limitNum = limit ?? 50;
    const entries = rows.slice(0, limitNum).map((r, idx) => ({
      rank: idx + 1,
      username: r.username,
      wpm: r.wpm,
      accuracy: r.accuracy,
      mode: r.mode,
      language: r.language,
      createdAt: r.createdAt.toISOString(),
    }));

    res.json(entries);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get leaderboard" });
  }
});

export default router;
