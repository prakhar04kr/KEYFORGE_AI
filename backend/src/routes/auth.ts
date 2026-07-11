import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "../db";
import { eq } from "drizzle-orm";
import { signToken, requireAuth } from "../middlewares/auth";
import { z } from "zod";

const router = Router();

const RegisterBody = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscores"),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/auth/register", async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const { username, email, password } = parsed.data;
  try {
    const existing = await db.select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    const existingUsername = await db.select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1);
    if (existingUsername.length > 0) {
      res.status(409).json({ error: "Username already taken" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable)
      .values({ username, email, passwordHash })
      .returning({ id: usersTable.id, username: usersTable.username, email: usersTable.email, role: usersTable.role });
    const token = signToken({ userId: user.id, username: user.username, email: user.email, role: user.role });
    res.status(201).json({ token, user });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  const { email, password } = parsed.data;
  try {
    const [user] = await db.select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    const token = signToken({ userId: user.id, username: user.username, email: user.email, role: user.role });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role, createdAt: user.createdAt } });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const [user] = await db.select({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      role: usersTable.role,
      createdAt: usersTable.createdAt,
    })
      .from(usersTable)
      .where(eq(usersTable.id, req.user!.userId))
      .limit(1);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.post("/logout", (_req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
