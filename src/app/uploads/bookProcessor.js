import { Worker } from 'bullmq'
import { redisConnectionOptions } from '../config/redis.js'
import { createClient } from '@supabase/supabase-js'
import { generateSynopsisAndTags } from '../lib/generate-synopsis.js'
import {
  generateEmbedding,
  constructEmbeddingInput,
} from '../lib/generate-embeddings.js'
import dotenv from 'dotenv'
// Load environment variables for the worker
dotenv.config()
const QUEUE_NAME = 'book-processing'
// --- Worker Definition ---
console.log(`Starting BullMQ worker for queue: "${QUEUE_NAME}"`)
const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { userId, books } = job.data
    console.log(
      `Worker processing job ${job.id} for user ${userId}. Books: ${books.length}`
    )
    // Initialize Supabase client using Service Role Key
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        'Supabase URL or Service Key missing in worker environment.'
      )
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    let successCount = 0
    let errorCount = 0
    // Re-implement the core processing logic here (from the old processGoodreadsData)
    for (const book of books) {
      try {
        console.log(`  Worker processing: ${book.title} by ${book.author}`)
        job.updateProgress(((successCount + errorCount) / books.length) * 100) // Update progress
        // --- Step 1: Find or Create Book ---
        let existingBook = null
        let bookIdInDb = null
        // Implement find logic (same as before)
        if (!existingBook && book.isbn13) {
          const { data, error } = await supabase
            .from('Books')
            .select('id')
            .eq('isbn13', book.isbn13)
            .maybeSingle()
          if (error) throw new Error(`DB Error (isbn13): ${error.message}`)
          existingBook = data
        }
        // ... (add other find fallbacks: isbn, gr_book_id)
        if (!existingBook && book.isbn) {
          const { data, error } = await supabase
            .from('Books')
            .select('id')
            .eq('isbn', book.isbn)
            .maybeSingle()
          if (error) throw new Error(`DB Error (isbn): ${error.message}`)
          existingBook = data
        }
        if (!existingBook && book.bookId) {
          const { data, error } = await supabase
            .from('Books')
            .select('id')
            .eq('gr_book_id', book.bookId)
            .maybeSingle()
          if (error) throw new Error(`DB Error (gr_id): ${error.message}`)
          existingBook = data
        }
        if (existingBook) {
          bookIdInDb = existingBook?.id ?? null
          if (bookIdInDb) console.log(`    Found existing book: ${bookIdInDb}`)
          else existingBook = null // Treat as not found if ID missing
        }
        if (!bookIdInDb) {
          console.log(
            `    Book not found. Generating data for ${book.title}...`
          )
          // Generate Synopsis/Tags
          let generatedSynopsis = null
          let generatedTags = []
          const synopsisResult = await generateSynopsisAndTags(
            book.title,
            book.author,
            book.additionalAuthors
          )
          if (synopsisResult) {
            generatedSynopsis = synopsisResult.synopsis
            generatedTags = synopsisResult.tags
          }
          // Generate Embedding
          let generatedEmbeddingVector = null
          const embeddingInputText = constructEmbeddingInput(
            book.title,
            book.author,
            book.additionalAuthors,
            generatedSynopsis,
            generatedTags
          )
          if (embeddingInputText) {
            generatedEmbeddingVector = await generateEmbedding(
              embeddingInputText
            )
          }
          // Create Book Record
          const { data: newBook, error: insertError } = await supabase
            .from('Books')
            .insert({
              gr_book_id: book.bookId,
              title: book.title,
              author: book.author,
              author_lf: book.authorLf,
              add_authors: book.additionalAuthors,
              isbn: book.isbn,
              isbn13: book.isbn13,
              publisher: book.publisher,
              binding: book.binding,
              num_of_pages: book.numberOfPages,
              year_published: book.yearPublished,
              original_publication_year: book.originalPublicationYear,
              synopsis: generatedSynopsis,
              tags: generatedTags,
              embedding: generatedEmbeddingVector,
            })
            .select('id')
            .single()
          if (insertError)
            throw new Error(`DB Insert Error: ${insertError.message}`)
          if (!newBook) throw new Error('DB Insert Error: No ID returned.')
          bookIdInDb = newBook.id
          console.log(`    Created book: ${bookIdInDb}`)
        }
        if (!bookIdInDb) {
          throw new Error('Failed to find or create book ID.') // Should not happen if logic above is correct
        }
        // --- Step 2: Upsert User-Book Relationship ---
        console.log(
          `    Upserting user-book link for user ${userId} / book ${bookIdInDb}`
        )
        const { error: upsertError } = await supabase.from('UserBooks').upsert({
          user_id: userId,
          book_id: bookIdInDb,
          rating: book.userRating,
          date_read: book.dateRead || null,
          date_added: book.dateAdded,
          bookshelves: book.bookshelves,
          bookshelves_with_positions: book.bookshelvesWithPositions,
          exclusive_shelf: book.exclusiveShelf,
          review: book.myReview,
          spoiler: book.spoiler,
          private_notes: book.privateNotes,
          read_count: book.readCount,
          owned_copies: book.ownedCopies,
        })
        if (upsertError)
          throw new Error(`DB Upsert Error: ${upsertError.message}`)
        successCount++
        await job.log(`Successfully processed book: ${book.title}`) // Log progress within the job
      } catch (error) {
        console.error(
          `  Error processing book "${book.title}" in job ${job.id}:`,
          error.message
        )
        errorCount++
        await job.log(`Error processing book "${book.title}": ${error.message}`)
        // Decide if one error fails the whole job or just skip the book
        // For now, we continue processing other books in the job
        // throw error; // Uncomment this to make the job fail on the first book error
      }
    }
    console.log(
      `Worker finished job ${job.id} for user ${userId}. Success: ${successCount}, Errors: ${errorCount}`
    )
    // Return value (optional) can be stored if needed
    return { successCount, errorCount }
  },
  { connection: redisConnectionOptions }
)
// --- Worker Event Listeners (Optional but Recommended) ---
worker.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed successfully. Result:`, result)
})
worker.on('failed', (job, err) => {
  if (job) {
    console.error(
      `Job ${job.id} failed after ${job.attemptsMade} attempts:`,
      err
    )
  } else {
    console.error(`Worker encountered an error:`, err)
  }
})
worker.on('error', (err) => {
  // Log unexpected errors in the worker itself
  console.error('Worker error:', err)
})
console.log('Worker started and listening for jobs...')
//# sourceMappingURL=bookProcessor.js.map
