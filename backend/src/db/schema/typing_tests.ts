import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";

export const typingTestsTable = pgTable("typing_tests", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().default("Guest"),
  mode: text("mode").notNull(),
  language: text("language").notNull(),
  wpm: real("wpm").notNull(),
  accuracy: real("accuracy").notNull(),
  errors: integer("errors").notNull().default(0),
  duration: integer("duration").notNull(),
  linesCount: integer("lines_count"),
  codeTheme: text("code_theme"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertTypingTest = typeof typingTestsTable.$inferInsert;
export type TypingTest = typeof typingTestsTable.$inferSelect;
