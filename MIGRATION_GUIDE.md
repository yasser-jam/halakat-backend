# Migration Guide: Session-Based to Dynamic Portion Splitting

## Overview

This migration transforms the recitation session system from surah/page templates with pre-calculated scores to a **dynamic portion splitting** model where the server processes pages sequentially and automatically splits them into PASSED/FAILED portions based on mistake deductions vs an evaluation threshold.

## What Changed

### Before (Old System)
- **SavingSession** with `start/end` pages and `maxPossibleScore`
- **SessionSurah** linked to **SessionSurahTemplate** with weight-based scoring
- **MistakeInSession** linking SessionSurah to Mistake
- Session surahs were submitted with pre-calculated scores from the client
- No session-level status

### After (New System)
- **RecitationSession** with `total_score`, `status` (PASSED/FAILED/PARTIALLY_PASSED), and `notes`
- **SessionPortion** representing each recited page with independent pass/fail status
- **SessionError** linking portion to mistake with `page_number` tracking
- Server-side dynamic splitting: pages processed in order, stops on first fail
- Pass threshold driven by `Evaluation.minimum_marks`

## Database Schema Changes

### Deleted Tables
- `SessionSurah` — replaced by `SessionPortion`
- `MistakeInSession` — replaced by `SessionError`

### Renamed Table
- `SavingSession` → `RecitationSession`

### New Tables
- `SessionPortion` (replaces SessionSurah)
- `SessionError` (replaces MistakeInSession)

### Modified Tables
- `Evaluation` — added `is_passed` boolean field
- `Mistake` — relation renamed from `mistakes` to `errors`
- `Student` — relation renamed from `saving_sessions` to `recitation_sessions`
- `Teacher` — relation renamed from `saving_sessions` to `recitation_sessions`
- `Campaign` — relation renamed from `saving_sessions` to `recitation_sessions`

### New Enums
- `SessionStatus` — `PASSED`, `FAILED`, `PARTIALLY_PASSED`
- `PortionType` — `FULL_PAGE`, `HALF_PAGE`, `SURAH`
- `PortionStatus` — `PASSED`, `FAILED`

## Migration Steps

### 1. Apply Schema
```bash
npx prisma db push
```

## New Scoring Logic

### Per-Page Score
```
page_score = max(0, 100 - SUM(mistake.reduced_marks on this page))
```

### Pass/Fail
```
page_score >= evaluation.minimum_marks  →  PASSED  (continue)
page_score <  evaluation.minimum_marks  →  FAILED  (stop session)
```

### Session Status
| Condition | Status |
|-----------|--------|
| All portions PASSED | `PASSED` |
| Some PASSED + one FAILED | `PARTIALLY_PASSED` |
| First page FAILED | `FAILED` |
