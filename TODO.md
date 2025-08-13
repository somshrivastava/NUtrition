# NUtrition — Next Steps Roadmap (Spring 2025)

This document lays out decisions, tradeoffs, and a concrete plan to get the app production-ready after the NU Dining site update broke our scraper.

## 1) Current status and immediate problems

- Scraper uses Selenium + geckodriver with brittle DOM selectors and hardcoded assumptions (e.g., month navigation, driver path). Website changed, so it now fails.
- Backend (`backend/api.py`/`backend/Main.py`) is only used to run a scrape and upsert into Supabase; the frontend reads directly from Supabase. Two near-duplicate Flask files exist; `models.py` is incomplete.
- Frontend relies on Supabase for data; no direct calls to our Flask server. Realtime is wired but basic.
- Operational gaps: no scheduled scraping, no monitoring/alerting, no environment-agnostic browser runtime, no infra-as-code.

## 2) Serverless web scraping: options and recommendation

We need headless, reliable, scheduled execution with modern browser automation. Selenium + drivers is fragile on serverless. Prefer Playwright.

Options:

1. AWS Lambda (container image) + Playwright

- Pros: reliable, mature, CloudWatch logs/alarms, EventBridge cron, VPC support; large ecosystem.
- Cons: cold starts with container images; some setup overhead; local dev with containers.

2. Google Cloud Run Jobs + Playwright (container)

- Pros: simplest UX for containerized jobs, fast cold starts, easy HTTP/cron via Cloud Scheduler, great logs; free tier friendly.
- Cons: GCP setup if team is less familiar.

3. Vercel Serverless + Cron + Playwright

- Pros: we already host frontend on Vercel; simple cron.
- Cons: headless Playwright support is possible but heavier, with size/time limits. Edge Functions don’t support Playwright; Serverless Functions require careful bundling. Less robust for longer scrapes.

4. Managed scraping APIs (ScrapingBee, Zyte, Bright Data)

- Pros: lowest ops, built-in anti-bot handling.
- Cons: recurring cost; still need logic to parse/normalize; vendor lock-in.

5. Cloudflare Workers + Browser Rendering

- Pros: cheap, global.
- Cons: still beta-like for complex Playwright flows; not ideal for heavier scraping.

Recommendation:

- Primary: Google Cloud Run Jobs with Playwright (Python or TypeScript) running in a container, scheduled via Cloud Scheduler. Simple, robust, scales, good DX, minimal ops.
- Alternative: AWS Lambda with a Playwright container if team prefers AWS.
- Stretch/upgrade: If NU Dining exposes a JSON API behind the page, pivot to API ingestion (no browser automation), scheduled on Cloud Run/Lambda. This is the most robust path if feasible.

## 3) Do we need a backend at all?

Short answer: not for the user-facing app. Keep the frontend reading from Supabase directly. The only server-side need is a scraping/ETL job that writes into Supabase.

Options:

- A) No dedicated backend service: Use a scheduled job (Cloud Run Job/Lambda) that upserts `menus` into Supabase. Provide an admin-only trigger (signed webhook or Supabase Edge Function) to force refresh. Recommended.
- B) Lightweight API (if needed later): FastAPI or Node/Express as a thin orchestration layer. Adds ongoing maintenance and latency; only build if we need custom business logic not suited for Supabase policies/functions.

Language/framework for scraper:

- If staying in Python: Playwright for Python in a container. Familiar migration from Selenium, strong reliability.
- If preferring TypeScript: Playwright TS is first-class and may align with frontend skillset. Either choice is fine once containerized.

## 4) UX improvements (prioritized)

Quick wins (1–2 days):

- Loading and empty states: clear feedback when menus haven’t loaded, when a date/hall/meal has no data, and when network errors occur.
- Dietary filters: client-side filters for vegetarian/vegan/gluten-free/halal, etc., from tags in `foods`.
- Sorting controls: by calories/protein/carbs/fats.
- Sticky action bar on mobile: selected meal summary + “Add to daily log”.
- Improve defaults: remember last selected hall/meal in `sessionStorage`.

Medium (1–2 weeks):

- Search within menu items.
- Compare meals across halls or across times.
- Visual diff: highlight new/changed items vs. yesterday.
- Accessibility pass: focus order, contrast, ARIA labels.
- Performance: paginate or virtualize long menus; fetch only relevant date/hall/meal.

Later:

- Personalized suggestions based on past logs.
- Shareable links and export to Apple Health/MyFitnessPal (CSV).

## 5) Problems with the current strategy

- Selenium/geckodriver brittle and environment-specific (`/opt/homebrew/bin/geckodriver`), won’t run in serverless without custom layers.
- Hardcoded month logic; selectors likely stale due to site changes.
- Duplicate Flask entrypoints and incomplete `models.py` indicate dead code/tech debt.
- Frontend fetches “all menus” from Supabase and filters client-side; can be slow/expensive at scale.
- No observability or alerts; silent failures.
- No schema/indexing strategy; `menus` likely needs constraints and indexes for date/hall/meal.

## 6) Proposed target architecture

Core principles: reduce moving parts, keep browser automation isolated in a job, keep the app static + Supabase-driven, add observability.

```mermaid
flowchart TD
  Cron[Cloud Scheduler] -->|HTTP trigger| Job[Cloud Run Job: Scraper (Playwright)]
  Admin[Admin Trigger (signed URL/Supabase Edge Function)] --> Job
  Job -->|Upsert| Supabase[(Supabase Postgres)]
  Job -->|Store raw snapshots| Storage[S3/GCS bucket or Supabase Storage]
  Frontend[Vercel Frontend] -->|select * from menus| Supabase
  Monitor[Cloud Logging/Alerts + Sentry] --> Team[On-call]
```

Data model (recommended minimal):

- `menus`: one row per date × dining hall × mealTime with `foods` JSONB, `date` (date), `diningHall` (text), `mealTime` (text), `docId` (uuid), `dateAdded` (timestamp).
- Index: `(date, diningHall, mealTime)` unique; partial index if needed.
- Optional normalization later: `foods` into `menu_items` if we need analytics/FTS at scale.

## 7) Implementation plan

Phase 0 — Repo cleanup (0.5–1 day):

- Remove `backend/old_files/**` and consolidate to a single entry (`backend/` becomes `scraper/` if we switch languages).
- Delete duplicate `backend/Main.py` or redirect everything to one entrypoint.
- Add a `.tool-versions`/`.nvmrc` and pin Python/Node versions.

Phase 1 — Scraper migration to Playwright and container (2–3 days):

- Rebuild scraper with Playwright (Python or TS). Avoid DOM-clicking where possible; first attempt to discover JSON APIs via network tab. Fall back to DOM only for navigation.
- Output a normalized `foods` structure consistent with existing frontend.
- Add retries, timeouts, and structured logs.

Phase 2 — Cloud infra (1–2 days):

- Containerize scraper.
- Deploy to Cloud Run Jobs. Set Cloud Scheduler cron to run daily at 05:00 local time and again at 10:00/16:00 to catch updates.
- Secrets: store Supabase URL/key in Secret Manager; mount into job env.
- Logging and alerting: error logs route to alert channel (email/Slack) via Cloud Monitoring.

Phase 3 — Frontend improvements (3–5 days):

- Add loading/empty/error states; dietary filters; sorting; sticky action bar.
- Fetch only the needed menu: switch `getMenus` to query by `date`, `diningHall`, `mealTime` with Supabase filters and indexes.
- Add a minimal “Admin refresh” button hidden behind a flag that hits the signed trigger to recompute current day’s menus.

Phase 4 — Observability and QA (1–2 days):

- Sentry on frontend; structured logs in scraper; dashboards for job success rates.
- Synthetic check: scheduled lightweight function that verifies today’s menu exists for each hall/meal and alerts on gaps.

## 8) Concrete tasks (checklist)

- [ ] Decide language for scraper: Python + Playwright or TS + Playwright.
- [ ] Investigate NU Dining network calls; prefer ingesting official JSON if available.
- [ ] Implement scraper with retries, timeouts, and schema-compatible output.
- [ ] Containerize scraper; add CI to build/push image on main.
- [ ] Provision Cloud Run Job + Cloud Scheduler + Secret Manager.
- [ ] Add signed admin trigger endpoint.
- [ ] Add DB constraints and indexes on `menus(date, diningHall, mealTime)`.
- [ ] Update frontend `getMenus` to filtered queries; add loading/empty/error states.
- [ ] Implement dietary filters and sorting.
- [ ] Add Sentry and monitoring/alerts.
- [ ] Remove dead code in `backend/` and document architecture in `README.md`.

## 9) Tech choices summary

- Scraping runtime: Playwright in container (Cloud Run Jobs). Alternative: AWS Lambda (container image).
- Data store: Supabase Postgres (keep JSONB for `foods`); consider normalization later if analytics/debugging demand it.
- Frontend hosting: keep Vercel.
- Secrets/Config: Cloud Secret Manager + GitHub Actions OIDC to deploy without long-lived keys.
- Monitoring: Cloud Logging + alerting; Sentry for frontend.

## 10) Open questions

- Which halls/meals are in scope for MVP? Any seasonal venues to include/exclude?
- Expected SLA for freshness (once daily vs. multiple times/day)?
- Do we need authenticated admin refresh in the UI, or is CLI/manual trigger enough?
- Any compliance constraints if we store raw snapshots?

## 11) Time/Cost estimates (ballpark)

- Migration + infra: 5–8 dev-days.
- Frontend UX pass: 3–5 dev-days.
- Monitoring + QA: 1–2 dev-days.
- Cloud costs: likely <$10/month at low traffic on Cloud Run; Supabase as-is.
