-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "organization_id" INTEGER,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectSession" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "campaign_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubjectSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subject_organization_id_idx" ON "Subject"("organization_id");

-- CreateIndex
CREATE INDEX "SubjectSession_subject_id_idx" ON "SubjectSession"("subject_id");

-- CreateIndex
CREATE INDEX "SubjectSession_group_id_idx" ON "SubjectSession"("group_id");

-- CreateIndex
CREATE INDEX "SubjectSession_campaign_id_idx" ON "SubjectSession"("campaign_id");

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectSession" ADD CONSTRAINT "SubjectSession_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectSession" ADD CONSTRAINT "SubjectSession_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectSession" ADD CONSTRAINT "SubjectSession_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
