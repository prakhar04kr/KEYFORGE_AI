import { pgTable, serial, text, timestamp, index } from "drizzle-orm/pg-core";

export const typingContentTable = pgTable(
  "typing_content",
  {
    id: serial("id").primaryKey(),
    mode: text("mode").notNull(),
    language: text("language").notNull(),
    difficulty: text("difficulty").notNull().default("intermediate"),
    title: text("title").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("typing_content_mode_lang_diff_idx").on(table.mode, table.language, table.difficulty),
  ]
);

export type TypingContent = typeof typingContentTable.$inferSelect;
