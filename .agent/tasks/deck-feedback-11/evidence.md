# Evidence

## Acceptance criteria

- **AC1 — PASS:** The content diff contains exactly 56 removed and 56 added
  prompt lines. The 56 rejected texts are absent and all 11 approved texts
  remain verbatim.
- **AC2 — PASS:** Replacements use direct subjects, choices, scenes, and
  actions; the exact rejected set is protected by regression tests.
- **AC3 — PASS:** Replacements avoid unusual memory, experience, acting, and
  equipment requirements.
- **AC4 — PASS:** Existing room/video compatibility gates pass.
- **AC5 — PASS:** Gender-neutrality and editorial gates pass.
- **AC6 — PASS:** The deck remains 360 unique cards with all stage/category
  balance tests passing.
- **AC7 — PASS:** Local and browser verification, GitHub Pages deployment, and
  live production asset readback all pass.

## Verification

- `npm run check` — 39/39 tests, TypeScript, and production build passed.
- `npm run test:e2e` — 45 passed; 1 intentionally skipped.
- Content diff scope — 56 removed prompt lines and 56 added prompt lines.
- `npm audit --audit-level=high` — 0 vulnerabilities.
- `git diff --check` — passed.
- Adversarial editorial review — passed after five first-draft fixes.
- GitHub Pages run
  [`30241829072`](https://github.com/kiku-jw/teply-krug/actions/runs/30241829072)
  — build and deploy passed for commit `14e7a19`.
- Live asset readback — 3/3 sampled replacements present and 3/3 sampled
  rejected prompts absent.
