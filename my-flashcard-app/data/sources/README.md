# Authority Source Cache

This folder documents the local source strategy for the grounded helper.

Runtime data currently lives in `data/authority-sources.json`. Each entry should be short, curated, and reviewable before client demos.

Source types are intentionally explicit:

- `Regulator guidance`
- `Regulator GMP annex`
- `Regulator inspection guidance`
- `International regulator guidance`
- `International guideline`
- `Inspectorate guidance`
- `Industry guidance`

Rules for future updates:

- Prefer official issuer pages over secondary copies.
- Keep source notes paraphrased and compact.
- Do not paste long copyrighted passages from paid or restricted guidance.
- If a document is under revision or not legally binding, state that in `status` or notes.
- Use ISPE/GAMP as implementation guidance, not as a substitute for applicable law or regulator guidance.
