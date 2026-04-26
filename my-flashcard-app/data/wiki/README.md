# Flashcard Wiki Editing

Edit the Markdown files in this folder to update the mini-wiki.

Each English file represents one category. Add a Simplified Chinese translation
by using the same filename with `-zh` before `.md`.

```md
---
key: global
label: Global CSV
---

# Category Name

## Question text?

Answer text.
```

Rules:

- Keep `key` stable. Supported keys are `global`, `china`, `cloud`, and `architecture`.
- Keep the same `key` in translated files. For example, both
  `01-global-sap-csv.md` and `01-global-sap-csv-zh.md` should use `key: global`.
- Use `label` for the short tab/dashboard name.
- Use one `#` heading for the category.
- Use each `##` heading as a flashcard question.
- Put the answer directly below the question.
- Keep translated files aligned with the English source. Each locale should have
  the same category keys and the same number of cards per category.
- Run `npm run build:data` after editing to regenerate `data/flashcards.json`.
- Run `npm run validate:data` to check the Markdown can be parsed.

The app reads `data/flashcards.json`, so commit both the edited Markdown and
regenerated JSON.
