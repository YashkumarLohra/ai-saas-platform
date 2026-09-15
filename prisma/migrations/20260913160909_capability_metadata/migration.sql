-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "capabilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "limitations" TEXT[] DEFAULT ARRAY[]::TEXT[];
