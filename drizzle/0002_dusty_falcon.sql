ALTER TABLE "bookshopISBN" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "bookshopISBNBook" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "bookshopISBN" CASCADE;--> statement-breakpoint
DROP TABLE "bookshopISBNBook" CASCADE;--> statement-breakpoint
ALTER TABLE "book" DROP CONSTRAINT "book_bookshop_isbn_id_bookshopISBN_id_fk";
--> statement-breakpoint
ALTER TABLE "book" ADD COLUMN "booshop_isbn13" text;--> statement-breakpoint
ALTER TABLE "book" DROP COLUMN "bookshop_isbn_id";