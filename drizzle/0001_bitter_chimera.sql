ALTER TABLE "appointments" ADD COLUMN "medical_condition" text;--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "family_history" text;--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "vaccine" text;--> statement-breakpoint
ALTER TABLE "patient" ADD COLUMN "life_style" text;--> statement-breakpoint
ALTER TABLE "patient" DROP COLUMN IF EXISTS "medical_condition";