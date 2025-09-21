/*
  Warnings:

  - You are about to drop the column `page` on the `MistakeInSession` table. All the data in the column will be lost.
  - You are about to drop the column `saving_session_id` on the `MistakeInSession` table. All the data in the column will be lost.
  - Added the required column `session_surah_id` to the `MistakeInSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MistakeInSession" DROP CONSTRAINT "MistakeInSession_saving_session_id_fkey";

-- DropIndex
DROP INDEX "MistakeInSession_saving_session_id_idx";

-- AlterTable
ALTER TABLE "MistakeInSession" DROP COLUMN "page",
DROP COLUMN "saving_session_id",
ADD COLUMN     "session_surah_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SessionSurahTemplate" (
    "id" SERIAL NOT NULL,
    "surahNumber" INTEGER NOT NULL,
    "pageNumber" INTEGER NOT NULL,
    "startLine" INTEGER,
    "endLine" INTEGER,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SessionSurahTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionSurah" (
    "id" SERIAL NOT NULL,
    "saving_session_id" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "isPassed" BOOLEAN,
    "score" INTEGER,
    "notes" TEXT,

    CONSTRAINT "SessionSurah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionSurahTemplate_surahNumber_idx" ON "SessionSurahTemplate"("surahNumber");

-- CreateIndex
CREATE INDEX "SessionSurahTemplate_pageNumber_idx" ON "SessionSurahTemplate"("pageNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SessionSurahTemplate_surahNumber_pageNumber_key" ON "SessionSurahTemplate"("surahNumber", "pageNumber");

-- CreateIndex
CREATE INDEX "SessionSurah_saving_session_id_idx" ON "SessionSurah"("saving_session_id");

-- CreateIndex
CREATE INDEX "SessionSurah_template_id_idx" ON "SessionSurah"("template_id");

-- CreateIndex
CREATE INDEX "MistakeInSession_session_surah_id_idx" ON "MistakeInSession"("session_surah_id");

-- AddForeignKey
ALTER TABLE "SessionSurah" ADD CONSTRAINT "SessionSurah_saving_session_id_fkey" FOREIGN KEY ("saving_session_id") REFERENCES "SavingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSurah" ADD CONSTRAINT "SessionSurah_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "SessionSurahTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeInSession" ADD CONSTRAINT "MistakeInSession_session_surah_id_fkey" FOREIGN KEY ("session_surah_id") REFERENCES "SessionSurah"("id") ON DELETE CASCADE ON UPDATE CASCADE;
