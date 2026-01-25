---
description: Verify application runtime stability by checking for console errors on critical routes.
---

# Runtime Verification Workflow

This workflow performs a "smoke test" on the running application to ensuring no runtime crashes or console errors occur on key pages.

## Steps

### 1. Ensure Development Server is Ready
The script attempts to detect if port `5173` is active. If not, it will try to spawn `npm run dev`.
**Recommendation**: Have `npm run dev` running in a separate terminal for faster checks.

### 2. Run Verification Script
Execute the following command:

```bash
npx tsx scripts/verify-runtime.ts
```

### 3. Review Output
- **Success**: Output ends with `✨ All routes passed runtime checks.`
- **Failure**: Errors for specific routes will be logged (e.g., `[Console Error] ...` or `[Uncaught Exception] ...`).

## Protected Routes
The script currently verifies:
- `/` (Home / Design System)
- `/grid` (Headless Grid Playground)
- `/table` (Legacy Data Table)
- `/tokens` (Token Visualization)

## Troubleshooting
- If the script hangs, ensure localhost:5173 is accessible manually.
- If "Visual Error" occurs, it means the `#root` element was not found (white screen of death).
