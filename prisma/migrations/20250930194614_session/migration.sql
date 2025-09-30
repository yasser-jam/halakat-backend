/*
  Warnings:

  - Added the required column `evaluation_id` to the `SessionSurah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavingSession" ADD COLUMN     "maxPossibleScore" DOUBLE PRECISION,
ADD COLUMN     "overallPassed" BOOLEAN,
ADD COLUMN     "totalScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "SessionSurah" ADD COLUMN     "evaluation_id" INTEGER NOT NULL,
ADD COLUMN     "isCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rawScore" INTEGER,
ADD COLUMN     "weightedScore" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "SessionSurahTemplate" ALTER COLUMN "surahName" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "SessionSurah_evaluation_id_idx" ON "SessionSurah"("evaluation_id");

-- AddForeignKey
ALTER TABLE "SessionSurah" ADD CONSTRAINT "SessionSurah_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
