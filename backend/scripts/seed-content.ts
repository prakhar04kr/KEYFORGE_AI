import { db, typingContentTable } from "../src/db";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

interface ContentEntry {
  mode: string;
  language: string;
  difficulty: string;
  title: string;
  content: string;
}

const dataPath = join(__dirname, "../data/typing-content.json");
const entries: ContentEntry[] = JSON.parse(readFileSync(dataPath, "utf-8"));

async function seedContent() {
  console.log(`\nLoading content from: ${dataPath}`);
  console.log(`Total entries to seed: ${entries.length}\n`);

  // Clear existing content
  await db.delete(typingContentTable);
  console.log("Cleared existing content.");

  // Insert in batches of 25
  const batchSize = 25;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    await db.insert(typingContentTable).values(batch);
    console.log(`  Inserted ${i + 1}–${Math.min(i + batchSize, entries.length)} of ${entries.length}`);
  }

  console.log("\n✓ Seeding complete!\n");

  // Print summary
  const counts: Record<string, number> = {};
  for (const e of entries) {
    const key = `${e.mode}/${e.language}`;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const modes = [...new Set(entries.map(e => e.mode))];
  console.log("Entries by mode/language:");
  for (const mode of modes) {
    const modeEntries = Object.entries(counts).filter(([k]) => k.startsWith(mode + "/"));
    const modeTotal = modeEntries.reduce((s, [, v]) => s + v, 0);
    console.log(`\n  [${mode.toUpperCase()}] — ${modeTotal} total`);
    for (const [key, count] of modeEntries) {
      console.log(`    ${key.split("/")[1].padEnd(25)} ${count} entries`);
    }
  }

  const diffCounts: Record<string, number> = {};
  for (const e of entries) {
    diffCounts[e.difficulty] = (diffCounts[e.difficulty] ?? 0) + 1;
  }
  console.log("\nBy difficulty:");
  for (const [diff, count] of Object.entries(diffCounts)) {
    console.log(`  ${diff.padEnd(15)} ${count}`);
  }

  process.exit(0);
}

seedContent().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
