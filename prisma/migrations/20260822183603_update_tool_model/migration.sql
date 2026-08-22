-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "bestFor" TEXT,
ADD COLUMN     "cons" TEXT[],
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "isIntegrated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPreferenceMatch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pros" TEXT[],
ADD COLUMN     "reasons" TEXT[];
