import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const wikiDir = path.join(process.cwd(), "data", "wiki");
const outputPath = path.join(process.cwd(), "data", "flashcards.json");
const allowedKeys = new Set(["global", "china", "cloud", "architecture"]);

const files = fs
  .readdirSync(wikiDir)
  .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (files.length === 0) {
  throw new Error(`No Markdown files found in ${wikiDir}`);
}

let nextId = 1;
const seenKeys = new Set();

function parseFrontmatter(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);

  if (!match) {
    throw new Error(`${file}: missing metadata block. Add key and label frontmatter.`);
  }

  const metadata = {};

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");

    if (separator === -1) {
      throw new Error(`${file}: invalid metadata line "${line}". Use "name: value".`);
    }

    const name = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();

    metadata[name] = value;
  }

  const body = source.slice(match[0].length).trim();

  if (!metadata.key || !metadata.label) {
    throw new Error(`${file}: metadata must include both "key" and "label".`);
  }

  if (!allowedKeys.has(metadata.key)) {
    throw new Error(
      `${file}: unsupported key "${metadata.key}". Use one of: ${Array.from(allowedKeys).join(", ")}.`
    );
  }

  if (seenKeys.has(metadata.key)) {
    throw new Error(`${file}: duplicate key "${metadata.key}".`);
  }

  seenKeys.add(metadata.key);

  return {
    body,
    key: metadata.key,
    label: metadata.label,
  };
}

const categories = files.map((file) => {
  const source = fs.readFileSync(path.join(wikiDir, file), "utf8").trim();
  const { body, key, label } = parseFrontmatter(source, file);
  const lines = body.split(/\r?\n/);
  const titleLine = lines.find((line) => line.startsWith("# "));

  if (!titleLine) {
    throw new Error(`${file}: missing category title. Add a "# Category Name" line.`);
  }

  const category = titleLine.replace(/^#\s+/, "").trim();
  const cardBlocks = body.split(/\n(?=##\s+)/).slice(1);

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
    key,
    label,
    category,
    cards,
  };
});

for (const key of allowedKeys) {
  if (!seenKeys.has(key)) {
    throw new Error(`Missing category metadata for key "${key}".`);
  }
}

fs.writeFileSync(outputPath, `${JSON.stringify(categories, null, 2)}\n`);

console.log(`Built ${nextId - 1} flashcards across ${categories.length} categories.`);
