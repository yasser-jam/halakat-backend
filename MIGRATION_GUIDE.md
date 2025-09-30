# Migration Guide: Session-Based to Surah-Based Evaluation System

## Overview

This migration transforms the Quran memorization tracking system from a session-based approach to a more granular surah and page-based evaluation system. This allows for better tracking of individual surah performance, support for partial pages, and more realistic mosque workflows.

## What Changed

### Before (Old System)
- **SavingSession** represented the entire recitation session
- **MistakeInSession** was tied to the session with only a page field
- Mistakes were tracked at the session level
- Difficult to handle multiple short surahs in one session
- No support for partial pages (¾ page, half page)
- No independent pass/fail evaluation for each surah/page

### After (New System)
- **SessionSurahTemplate** provides reference data for surah → page → weight mapping
- **SessionSurah** represents each recited page/surah in a session
- **MistakeInSession** now references SessionSurah instead of SavingSession
- Fine-grained tracking per surah/page
- Support for short surahs and partial pages
- Independent evaluation for each surah/page

## New Database Schema

### SessionSurahTemplate
```prisma
model SessionSurahTemplate {
  id          Int    @id @default(autoincrement())
  surahNumber Int
  pageNumber  Int
  startLine   Int?
  endLine     Int?
  weight      Float  // 1.0 full page, <1.0 partial

  session_surahs SessionSurah[]

  @@unique([surahNumber, pageNumber])
  @@index([surahNumber])
  @@index([pageNumber])
}
```

### SessionSurah
```prisma
model SessionSurah {
  id                Int    @id @default(autoincrement())
  saving_session_id Int
  template_id       Int
  isPassed          Boolean?
  score             Int?
  notes             String?

  saving_session SavingSession       @relation(fields: [saving_session_id], references: [id], onDelete: Cascade)
  template       SessionSurahTemplate @relation(fields: [template_id], references: [id], onDelete: Restrict)
  mistakes       MistakeInSession[]

  @@index([saving_session_id])
  @@index([template_id])
}
```

### Updated MistakeInSession
```prisma
model MistakeInSession {
  id               Int @id @default(autoincrement())
  session_surah_id Int
  mistake_id       Int

  session_surah SessionSurah @relation(fields: [session_surah_id], references: [id], onDelete: Cascade)
  mistake       Mistake      @relation(fields: [mistake_id], references: [id], onDelete: Restrict)

  @@index([session_surah_id])
  @@index([mistake_id])
}
```

## Migration Steps

### 1. Database Migration
```bash
# Generate and apply the migration
npx prisma migrate dev --name "migrate-to-surah-based-system"
```

### 2. Populate SessionSurahTemplate
The seed script now automatically populates all 114 surahs with their page mappings:
```bash
npx prisma db seed
```

### 3. Migrate Existing Data (Optional)
If you have existing data, run the migration script:
```bash
npx ts-node prisma/migrate-existing-data.ts
```

## New API Endpoints

### SessionSurah Management
- `GET /session-surahs/templates` - Get all surah templates
- `GET /session-surahs/templates/surah/:surahNumber` - Get templates for specific surah
- `GET /session-surahs/templates/pages?startPage=X&endPage=Y` - Get templates by page range
- `GET /session-surahs/session/:sessionId` - Get surahs for a session
- `PUT /session-surahs/:id` - Update session surah (isPassed, score, notes)
- `POST /session-surahs/:id/mistakes` - Add mistake to session surah
- `DELETE /session-surahs/:id/mistakes/:mistakeId` - Remove mistake from session surah
- `GET /session-surahs/stats/:sessionId` - Get session statistics

### Updated SavingSession API
The existing endpoints now return data in the new format with `sessionSurahs` instead of `mistakes_in_session`.

## New Features

### 1. Fine-Grained Tracking
- Each surah/page can be evaluated independently
- Mistakes are tracked per surah, not per session
- Support for partial pages with weight-based evaluation

### 2. Flexible Evaluation
- Each SessionSurah has its own `isPassed`, `score`, and `notes`
- A SavingSession passes only if all SessionSurah entries pass
- Mistake tolerance depends on weight (¾ page has lower tolerance than full page)

### 3. Better Reporting
- Per-surah performance tracking
- Per-page detailed analysis
- Session-level aggregated statistics
- Weight-based progress calculation

### 4. Realistic Mosque Workflow
- Students can repeat only the surah/page with mistakes
- Support for multiple short surahs in one session
- Partial page recitation tracking

## Usage Examples

### Creating a New Session
```typescript
const createSessionDto = {
  teacherId: 1,
  studentId: 2,
  campaign_id: 1,
  start: 1,
  end: 5,
  rating: 4,
  duration: 1800,
  sessionSurahs: [
    {
      templateId: 1, // Al-Fatiha, Page 1
      isPassed: true,
      score: 85,
      notes: "Good recitation",
      mistakes: []
    },
    {
      templateId: 2, // Al-Baqarah, Page 2
      isPassed: false,
      score: 65,
      notes: "Needs improvement in tajweed",
      mistakes: [
        { mistakeId: 1 } // Tajweed error
      ]
    }
  ]
};
```

### Getting Session Statistics
```typescript
const stats = await sessionSurahService.getSessionSurahStats(sessionId);
// Returns: { totalSurahs, passedSurahs, failedSurahs, totalMistakes, averageScore, passRate }
```

## Benefits

1. **More Accurate Tracking**: Individual surah performance instead of session-level evaluation
2. **Flexible Workflow**: Support for partial pages and multiple short surahs
3. **Better Analytics**: Detailed reporting at surah and page levels
4. **Realistic Assessment**: Weight-based evaluation for partial pages
5. **Improved User Experience**: Students can focus on specific surahs that need work

## Backward Compatibility

The migration maintains backward compatibility by:
- Keeping the same SavingSession structure for reporting
- Providing migration scripts for existing data
- Maintaining the same API endpoints (with updated response format)

## Testing

After migration, verify:
1. All existing sessions are properly migrated
2. New sessions can be created with surah-level details
3. Mistake tracking works at the surah level
4. Statistics and reporting functions correctly
5. API responses match the new schema

## Support

For questions or issues with the migration, refer to:
- The updated API documentation
- The seed script for data structure examples
- The migration script for data transformation logic



