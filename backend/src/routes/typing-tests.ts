import { Router } from "express";
import { db, typingTestsTable } from "../db";
import {
  CreateTypingTestBody,
  ListTypingTestsQueryParams,
  GetTypingTestParams,
} from "../validation";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/typing-tests", async (req, res) => {
  const parseResult = ListTypingTestsQueryParams.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { limit = 20, mode } = parseResult.data;
  try {
    let query = db
      .select()
      .from(typingTestsTable)
      .orderBy(desc(typingTestsTable.createdAt))
      .limit(limit ?? 20);

    const results = await query;
    const filtered = mode ? results.filter((r) => r.mode === mode) : results;
    res.json(filtered);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list typing tests" });
  }
});

router.post("/typing-tests", async (req, res) => {
  const parseResult = CreateTypingTestBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  try {
    const [created] = await db
      .insert(typingTestsTable)
      .values(parseResult.data)
      .returning();
    res.status(201).json(created);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to save typing test" });
  }
});

router.get("/typing-tests/:id", async (req, res) => {
  const parseResult = GetTypingTestParams.safeParse(req.params);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [test] = await db
      .select()
      .from(typingTestsTable)
      .where(eq(typingTestsTable.id, parseResult.data.id));
    if (!test) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(test);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get typing test" });
  }
});

export default router;
