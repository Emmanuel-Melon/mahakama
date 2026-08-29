CREATE TYPE "public"."sender_type" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TYPE "public"."consultation_status" AS ENUM('pending', 'accepted', 'declined', 'engaged', 'closed');--> statement-breakpoint
CREATE TYPE "public"."lawyer_document_type" AS ENUM('bar_certificate', 'national_id', 'other');--> statement-breakpoint
CREATE TYPE "public"."lawyer_invite_status" AS ENUM('pending', 'accepted', 'expired', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."lawyer_profile_status" AS ENUM('draft', 'submitted', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('in_app', 'email', 'push');--> statement-breakpoint
CREATE TYPE "public"."notification_failure_reason" AS ENUM('provider_error', 'invalid_target', 'rejected', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."notification_status" AS ENUM('notification_pending', 'notification_sent', 'notification_delivered', 'notification_opened', 'notification_failed');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('admin', 'auth', 'consultations', 'payments', 'plans', 'system', 'users');--> statement-breakpoint
CREATE TYPE "public"."recipient_type" AS ENUM('sender', 'fulfillment_partner', 'admin');--> statement-breakpoint
CREATE TYPE "public"."secure_token_event_type" AS ENUM('VIEWED', 'VALIDATED', 'CONSUMED', 'REVOKED', 'EXPIRED_ATTEMPT', 'INVALID_ATTEMPT');--> statement-breakpoint
CREATE TYPE "public"."secure_token_type" AS ENUM('CODE', 'LINK');--> statement-breakpoint
CREATE TABLE "allowed_emails" (
	"email" text PRIMARY KEY NOT NULL,
	"added_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"is_revoked" boolean DEFAULT false NOT NULL,
	"refresh_token_hash" varchar(255),
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text DEFAULT 'Untitled Chat',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consultations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"lawyer_id" uuid NOT NULL,
	"status" "consultation_status" DEFAULT 'pending' NOT NULL,
	"request_message" text,
	"responded_at" timestamp,
	"decline_reason" text,
	"engaged_at" timestamp,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_bookmarks" (
	"user_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "document_bookmarks_user_id_document_id_pk" PRIMARY KEY("user_id","document_id")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"type" text NOT NULL,
	"sections" integer NOT NULL,
	"last_updated" date NOT NULL,
	"storage_url" text NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"act_name" text,
	"jurisdiction" text,
	"source_url" text,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_downloads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "law_source_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client" text NOT NULL,
	"document_id" uuid,
	"title" text NOT NULL,
	"source_url" text,
	"detected_last_updated" date,
	"previous_last_updated" date,
	"action" text NOT NULL,
	"detail" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inference_models" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"provider_id" varchar(32) NOT NULL,
	"display_name" varchar(64) NOT NULL,
	"is_premium" boolean DEFAULT false,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "inference_providers" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"is_external" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_inference_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"strategy_key" varchar(64) NOT NULL,
	"provider_id" varchar(32) NOT NULL,
	"model_id" varchar(64) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_strategy" UNIQUE("user_id","strategy_key")
);
--> statement-breakpoint
CREATE TABLE "lawyer_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"invited_by" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"status" "lawyer_invite_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"accepted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lawyer_invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "lawyer_profile_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lawyer_profile_id" uuid NOT NULL,
	"type" "lawyer_document_type" NOT NULL,
	"file_url" varchar(1024) NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lawyers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "lawyer_profile_status" DEFAULT 'draft' NOT NULL,
	"specialization" varchar(100),
	"experience_years" integer,
	"cases_handled" integer DEFAULT 0 NOT NULL,
	"is_available" boolean DEFAULT false NOT NULL,
	"location" varchar(100),
	"languages" text[],
	"bio" text,
	"bar_number" varchar(100),
	"issuing_authority" varchar(255),
	"jurisdiction" varchar(100),
	"education" jsonb,
	"submitted_at" timestamp,
	"reviewed_by" uuid,
	"reviewed_at" timestamp,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lawyers_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "matter_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matter_id" uuid NOT NULL,
	"uploaded_by_user_id" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_url" varchar(1024) NOT NULL,
	"file_type" varchar(100),
	"file_size" integer,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matter_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matter_id" uuid NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"type" "matter_event_type" NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"event_at" timestamp with time zone NOT NULL,
	"reminder_at" timestamp with time zone,
	"is_completed" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matter_lawyers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matter_id" uuid NOT NULL,
	"lawyer_id" uuid NOT NULL,
	"role" "matter_lawyer_role" DEFAULT 'primary' NOT NULL,
	"status" varchar(50) DEFAULT 'invited',
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "matter_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matter_id" uuid NOT NULL,
	"author_user_id" uuid NOT NULL,
	"content" text NOT NULL,
	"is_internal" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matter_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matter_id" uuid NOT NULL,
	"from_status" "matter_status",
	"to_status" "matter_status" NOT NULL,
	"changed_by_user_id" uuid,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_user_id" uuid NOT NULL,
	"source_chat_id" uuid,
	"title" text NOT NULL,
	"summary" text,
	"status" "matter_status" DEFAULT 'draft' NOT NULL,
	"jurisdiction" varchar(100),
	"practice_area" varchar(100),
	"urgency" varchar(50),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"is_shared_with_lawyer" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"closed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" uuid NOT NULL,
	"content" text NOT NULL,
	"sender_type" "sender_type" DEFAULT 'user' NOT NULL,
	"user_id" uuid,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"recipient_email" varchar(255),
	"type" varchar(100) NOT NULL,
	"channel" "notification_channel" DEFAULT 'in_app' NOT NULL,
	"recipient_type" "recipient_type" DEFAULT 'sender' NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"action_url" text,
	"scheduled_at" timestamp NOT NULL,
	"sent_at" timestamp,
	"delivered_at" timestamp,
	"status" "notification_status" DEFAULT 'notification_pending' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"template_key" varchar(100),
	"entity_id" varchar(255),
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"is_actioned" boolean DEFAULT false NOT NULL,
	"actioned_at" timestamp,
	CONSTRAINT "notifications_recipient_present_check" CHECK ("notifications"."user_id" IS NOT NULL OR "notifications"."recipient_email" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"endpoint" text NOT NULL,
	"keys" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "user_notification_preferences" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"category" varchar,
	"email_enabled" boolean DEFAULT true,
	"push_enabled" boolean DEFAULT true,
	"in_app_enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"location" text NOT NULL,
	"contact" text,
	"website" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institutions_to_services" (
	"institution_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	CONSTRAINT "institutions_to_services_institution_id_service_id_pk" PRIMARY KEY("institution_id","service_id")
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"icon" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category_id" text,
	"slug" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password" varchar(255),
	"role" text DEFAULT 'user' NOT NULL,
	"email_verified_at" timestamp,
	"fingerprint" varchar(255),
	"user_agent" text,
	"last_ip" varchar(45),
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"age" integer,
	"gender" text,
	"country" varchar(100),
	"city" varchar(100),
	"phone_number" varchar(20),
	"occupation" varchar(100),
	"bio" text,
	"profile_picture" text,
	"is_first_login" boolean DEFAULT true NOT NULL,
	"is_onboarded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_fingerprint_unique" UNIQUE("fingerprint")
);
--> statement-breakpoint
CREATE TABLE "document_chunks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vector_id" text,
	"document_id" uuid NOT NULL,
	"content" text NOT NULL,
	"chunk_index" integer NOT NULL,
	"section" text,
	"subsection" text,
	"article_number" integer,
	"act_name" text,
	"full_citation" text,
	"url" text,
	"jurisdiction" text,
	"last_updated" date,
	"version" integer,
	"embedding" vector(768),
	"embedding_provider" text,
	"embedding_model" text,
	"token_count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "embedding_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"status" text NOT NULL,
	"total_chunks" integer,
	"processed_chunks" integer DEFAULT 0,
	"error" text,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shadow_write_failures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"collection_name" text NOT NULL,
	"record_ids" text[] NOT NULL,
	"shadow_store" text NOT NULL,
	"primary_store" text NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "secure_token_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_id" uuid,
	"event_type" "secure_token_event_type" NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "secure_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"token_type" "secure_token_type" NOT NULL,
	"user_id" uuid,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"max_uses" integer,
	"uses_count" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_events" ADD CONSTRAINT "auth_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_lawyer_id_lawyers_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."lawyers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_bookmarks" ADD CONSTRAINT "document_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_bookmarks" ADD CONSTRAINT "document_bookmarks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_downloads" ADD CONSTRAINT "document_downloads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_downloads" ADD CONSTRAINT "document_downloads_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "law_source_checks" ADD CONSTRAINT "law_source_checks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inference_models" ADD CONSTRAINT "inference_models_provider_id_inference_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."inference_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_inference_preferences" ADD CONSTRAINT "user_inference_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_inference_preferences" ADD CONSTRAINT "user_inference_preferences_provider_id_inference_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."inference_providers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_inference_preferences" ADD CONSTRAINT "user_inference_preferences_model_id_inference_models_id_fk" FOREIGN KEY ("model_id") REFERENCES "public"."inference_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_invites" ADD CONSTRAINT "lawyer_invites_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyer_profile_documents" ADD CONSTRAINT "lawyer_profile_documents_lawyer_profile_id_lawyers_id_fk" FOREIGN KEY ("lawyer_profile_id") REFERENCES "public"."lawyers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyers" ADD CONSTRAINT "lawyers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lawyers" ADD CONSTRAINT "lawyers_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_documents" ADD CONSTRAINT "matter_documents_matter_id_matters_id_fk" FOREIGN KEY ("matter_id") REFERENCES "public"."matters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_documents" ADD CONSTRAINT "matter_documents_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_events" ADD CONSTRAINT "matter_events_matter_id_matters_id_fk" FOREIGN KEY ("matter_id") REFERENCES "public"."matters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_events" ADD CONSTRAINT "matter_events_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_lawyers" ADD CONSTRAINT "matter_lawyers_matter_id_matters_id_fk" FOREIGN KEY ("matter_id") REFERENCES "public"."matters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_lawyers" ADD CONSTRAINT "matter_lawyers_lawyer_id_lawyers_id_fk" FOREIGN KEY ("lawyer_id") REFERENCES "public"."lawyers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_notes" ADD CONSTRAINT "matter_notes_matter_id_matters_id_fk" FOREIGN KEY ("matter_id") REFERENCES "public"."matters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_notes" ADD CONSTRAINT "matter_notes_author_user_id_users_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_status_history" ADD CONSTRAINT "matter_status_history_matter_id_matters_id_fk" FOREIGN KEY ("matter_id") REFERENCES "public"."matters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matter_status_history" ADD CONSTRAINT "matter_status_history_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matters" ADD CONSTRAINT "matters_client_user_id_users_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matters" ADD CONSTRAINT "matters_source_chat_id_chat_sessions_id_fk" FOREIGN KEY ("source_chat_id") REFERENCES "public"."chat_sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_id_chat_sessions_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chat_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "push_subscriptions" ADD CONSTRAINT "push_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions_to_services" ADD CONSTRAINT "institutions_to_services_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "institutions_to_services" ADD CONSTRAINT "institutions_to_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "embedding_jobs" ADD CONSTRAINT "embedding_jobs_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secure_token_events" ADD CONSTRAINT "secure_token_events_token_id_secure_tokens_id_fk" FOREIGN KEY ("token_id") REFERENCES "public"."secure_tokens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "secure_tokens" ADD CONSTRAINT "secure_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_events_user_event_time_idx" ON "auth_events" USING btree ("user_id","event_type","created_at");--> statement-breakpoint
CREATE INDEX "document_idx" ON "document_chunks" USING btree ("document_id");--> statement-breakpoint
CREATE INDEX "vector_id_idx" ON "document_chunks" USING btree ("vector_id");--> statement-breakpoint
CREATE INDEX "embedding_idx" ON "document_chunks" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "secure_token_events_token_idx" ON "secure_token_events" USING btree ("token_id","created_at");--> statement-breakpoint
CREATE INDEX "secure_token_events_ip_time_idx" ON "secure_token_events" USING btree ("ip_address","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "secure_token_hash_idx" ON "secure_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "secure_token_user_type_idx" ON "secure_tokens" USING btree ("user_id","token_type");--> statement-breakpoint
CREATE INDEX "secure_token_entity_type_idx" ON "secure_tokens" USING btree ("entity_type","entity_id","token_type");