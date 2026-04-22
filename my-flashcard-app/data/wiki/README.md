# Flashcard Wiki Editing

Edit the Markdown files in this folder to update the mini-wiki.

Each file represents one category:

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
- Use `label` for the short tab/dashboard name.
- Use one `#` heading for the category.
- Use each `##` heading as a flashcard question.
- Put the answer directly below the question.
- Run `npm run build:data` after editing to regenerate `data/flashcards.json`.
- Run `npm run validate:data` to check the Markdown can be parsed.

The app reads `data/flashcards.json`, so commit both the edited Markdown and regenerated JSON.
