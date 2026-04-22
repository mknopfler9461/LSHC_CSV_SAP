import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const wikiDir = path.join(process.cwd(), "data", "wiki");
const outputPath = path.join(process.cwd(), "data", "flashcards.json");

const files = fs
  .readdirSync(wikiDir)
  .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (files.length === 0) {
  throw new Error(`No Markdown files found in ${wikiDir}`);
}

let nextId = 1;

const categories = files.map((file) => {
  const source = fs.readFileSync(path.join(wikiDir, file), "utf8").trim();
  const lines = source.split(/\r?\n/);
  const titleLine = lines.find((line) => line.startsWith("# "));

  if (!titleLine) {
    throw new Error(`${file}: missing category title. Add a "# Category Name" line.`);
  }

  const category = titleLine.replace(/^#\s+/, "").trim();
  const cardBlocks = source.split(/\n(?=##\s+)/).slice(1);

  if (cardBlocks.length === 0) {
    throw new Error(`${file}: missing cards. Add cards using "## Question" headings.`);
  }

  const cards = cardBlocks.map((block) => {
    const [questionLine, ...answerLines] = block.trim().split(/\r?\n/);
    const question = questionLine.replace(/^##\s+/, "").trim();
    const answer = answerLines.join("\n").trim();

    if (!question || questionLine === question) {
      throw new Error(`${file}: card question must start with "## ".`);
    }

    if (!answer) {
      throw new Error(`${file}: "${question}" is missing an answer.`);
    }

    return {
      id: nextId++,
      question,
      answer,
    };
  });

  return {
    category,
    cards,
  };
});

fs.writeFileSync(outputPath, `${JSON.stringify(categories, null, 2)}\n`);

console.log(`Built ${nextId - 1} flashcards across ${categories.length} categories.`);
