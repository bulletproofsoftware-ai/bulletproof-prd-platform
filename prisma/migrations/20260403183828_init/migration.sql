-- CreateEnum
CREATE TYPE "PrdStatus" AS ENUM ('draft', 'research', 'editing', 'review', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "PrdSource" AS ENUM ('idea', 'research', 'upload', 'manual', 'brainstorm');

-- CreateEnum
CREATE TYPE "IdeaStatus" AS ENUM ('open', 'promoted', 'archived');

-- CreateEnum
CREATE TYPE "ResearchStatus" AS ENUM ('running', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "BrainstormStatus" AS ENUM ('active', 'promoted', 'archived');

-- CreateEnum
CREATE TYPE "BrainstormRole" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('pending', 'in_progress', 'approved', 'rejected', 'changes_requested');

-- CreateTable
CREATE TABLE "prds" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" "PrdStatus" NOT NULL DEFAULT 'draft',
    "content_md" TEXT NOT NULL,
    "source" "PrdSource" NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'local',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ideas" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tags" TEXT[],
    "status" "IdeaStatus" NOT NULL DEFAULT 'open',
    "prd_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_sessions" (
    "id" UUID NOT NULL,
    "prd_id" UUID,
    "prompt" TEXT NOT NULL,
    "status" "ResearchStatus" NOT NULL DEFAULT 'running',
    "queries" JSONB NOT NULL DEFAULT '[]',
    "results" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "research_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brainstorm_sessions" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" "BrainstormStatus" NOT NULL DEFAULT 'active',
    "promoted_to" TEXT,
    "promoted_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brainstorm_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brainstorm_messages" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "role" "BrainstormRole" NOT NULL,
    "content" TEXT NOT NULL,
    "extracted_themes" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brainstorm_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL,
    "prd_id" UUID NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'pending',
    "ai_summary" TEXT,
    "security_scan" JSONB,
    "duplication_scan" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_comments" (
    "id" UUID NOT NULL,
    "review_id" UUID NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'local',
    "body" TEXT NOT NULL,
    "section_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prd_versions" (
    "id" UUID NOT NULL,
    "prd_id" UUID NOT NULL,
    "content_md" TEXT NOT NULL,
    "version_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prd_versions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_prd_id_fkey" FOREIGN KEY ("prd_id") REFERENCES "prds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_sessions" ADD CONSTRAINT "research_sessions_prd_id_fkey" FOREIGN KEY ("prd_id") REFERENCES "prds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brainstorm_messages" ADD CONSTRAINT "brainstorm_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "brainstorm_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_prd_id_fkey" FOREIGN KEY ("prd_id") REFERENCES "prds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_comments" ADD CONSTRAINT "review_comments_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prd_versions" ADD CONSTRAINT "prd_versions_prd_id_fkey" FOREIGN KEY ("prd_id") REFERENCES "prds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
