CREATE TABLE "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"canonical_url" text NOT NULL,
	CONSTRAINT "category_canonical_url_unique" UNIQUE("canonical_url")
);
--> statement-breakpoint
CREATE TABLE "slug" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"sub_title" text,
	"short_story" text,
	"full_story" text,
	"meta_description" text,
	"meta_keywords" text,
	"meta_title" text,
	"og_image" text,
	"canonical_url" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"author" text NOT NULL,
	"category_id" serial NOT NULL,
	"reading_time" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "slug_canonical_url_unique" UNIQUE("canonical_url")
);
--> statement-breakpoint
ALTER TABLE "slug" ADD CONSTRAINT "slug_author_user_id_fk" FOREIGN KEY ("author") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slug" ADD CONSTRAINT "slug_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE no action ON UPDATE no action;