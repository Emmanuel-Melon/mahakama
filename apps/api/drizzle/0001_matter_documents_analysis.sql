ALTER TYPE "public"."matter_activity_type" ADD VALUE 'document_analyzed';--> statement-breakpoint
ALTER TABLE "matter_documents" ADD COLUMN "analysis" jsonb;--> statement-breakpoint
ALTER TABLE "matter_documents" ADD COLUMN "analyzed_at" timestamp;
