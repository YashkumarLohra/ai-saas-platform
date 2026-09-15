-- CreateEnum
CREATE TYPE "PricingTier" AS ENUM ('FREE', 'FREEMIUM', 'PAID', 'ENTERPRISE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ApiAccessLevel" AS ENUM ('NO_API', 'PUBLIC_API', 'PAID_API', 'ENTERPRISE_API', 'RESTRICTED_API', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('EXTERNAL', 'API', 'NATIVE', 'EMBED', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "apiAccess" "ApiAccessLevel" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "integration" "IntegrationType" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "pricingTier" "PricingTier" NOT NULL DEFAULT 'UNKNOWN';
