CREATE TABLE "test1" (
	"id" text PRIMARY KEY NOT NULL,
	"test1" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "test1" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "feedback" CASCADE;--> statement-breakpoint
DROP TABLE "category" CASCADE;--> statement-breakpoint
DROP TABLE "slug" CASCADE;--> statement-breakpoint
DROP TABLE "account" CASCADE;--> statement-breakpoint
DROP TABLE "session" CASCADE;--> statement-breakpoint
DROP TABLE "user" CASCADE;--> statement-breakpoint
DROP TABLE "verification" CASCADE;