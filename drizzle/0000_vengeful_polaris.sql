CREATE TABLE "authSession" (
	"key" text PRIMARY KEY NOT NULL,
	"session" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authState" (
	"key" text PRIMARY KEY NOT NULL,
	"state" text NOT NULL
);
