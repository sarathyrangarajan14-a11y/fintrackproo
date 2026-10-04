ALTER TABLE "clients" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "father_name" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "marital_status" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "aadhaar_number" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "bank_account_name" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "bank_name" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "bank_account_number" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "bank_ifsc" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "bank_account_type" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "occupation" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "annual_income" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "source_of_income" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "investment_experience" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "is_fatca" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "is_pep" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "nominee_name" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "nominee_relation" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "pan_document_url" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "aadhaar_document_url" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "bank_proof_url" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "photo_url" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "signature_url" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "kyc_rejection_reason" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "kyc_verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "kyc_verified_by" integer;