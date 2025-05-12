CREATE TABLE "book" (
	"id" serial PRIMARY KEY NOT NULL,
	"gr_book_id" text,
	"isbn" text,
	"isbn13" text,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"author_lf" text,
	"add_authors" text,
	"avg_rating" numeric(3, 2),
	"publisher" text,
	"binding" text,
	"num_of_pages" integer,
	"year_published" integer,
	"original_publication_year" integer,
	"synopsis" text,
	"tags" text[],
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"bookshop_isbn_id" integer,
	CONSTRAINT "book_gr_book_id_unique" UNIQUE("gr_book_id"),
	CONSTRAINT "book_isbn_unique" UNIQUE("isbn"),
	CONSTRAINT "book_isbn13_unique" UNIQUE("isbn13")
);
--> statement-breakpoint
CREATE TABLE "bookshopISBN" (
	"id" serial PRIMARY KEY NOT NULL,
	"isbn13" text NOT NULL,
	CONSTRAINT "bookshopISBN_isbn13_unique" UNIQUE("isbn13")
);
--> statement-breakpoint
CREATE TABLE "bookshopISBNBook" (
	"bookshop_isbn_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	CONSTRAINT "bookshopISBNBook_bookshop_isbn_id_book_id_pk" PRIMARY KEY("bookshop_isbn_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"did" text NOT NULL,
	"email" text,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userBook" (
	"user_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"rating" integer,
	"date_read" text,
	"date_added" date,
	"bookshelves" text[],
	"bookshelves_with_positions" text,
	"exclusive_shelf" text,
	"review" text,
	"spoiler" text,
	"private_notes" text,
	"read_count" integer DEFAULT 0 NOT NULL,
	"owned_copies" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "userBook_user_id_book_id_pk" PRIMARY KEY("user_id","book_id")
);
--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_bookshop_isbn_id_bookshopISBN_id_fk" FOREIGN KEY ("bookshop_isbn_id") REFERENCES "public"."bookshopISBN"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookshopISBNBook" ADD CONSTRAINT "bookshopISBNBook_bookshop_isbn_id_bookshopISBN_id_fk" FOREIGN KEY ("bookshop_isbn_id") REFERENCES "public"."bookshopISBN"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookshopISBNBook" ADD CONSTRAINT "bookshopISBNBook_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userBook" ADD CONSTRAINT "userBook_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userBook" ADD CONSTRAINT "userBook_book_id_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."book"("id") ON DELETE cascade ON UPDATE no action;