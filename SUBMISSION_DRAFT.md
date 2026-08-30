# Recovery Ledger · NextStep Hacks 2026

## Short description

Recovery Ledger helps people recover from a missed commitment by making the state transition visible and recomputing the smallest feasible next action when available time changes.

## What we built

The prototype keeps a small commitment timeline with due time, effort, dependency, and state. A user can mark a commitment recoverable, move the available-time constraint, and see how the proposed next slice changes while the original assumptions remain visible.

## Why it fits Earth Forward

Environmental work is full of plans that fail when time, data, or coordination changes. Recovery Ledger tests the narrower systems idea behind that problem: a plan should expose its assumptions and return to a feasible state instead of treating failure as the end of the process. The demo uses a synthetic recycling-audit task and does not collect personal or environmental data.

## Technical approach

The current MVP uses a transparent rule: the next action is bounded by available minutes and remaining effort. It does not call an LLM, infer emotion, assign a personality, or upload data.

## AI-use disclosure

AI coding assistance was used for brainstorming, implementation drafting, and debugging. The project owner reviewed the implementation and remains responsible for understanding and explaining the code.

## Submission status

Local MVP created during the active event window. Devpost registration, public repository, screenshots, demo video, and final submission are still pending.
