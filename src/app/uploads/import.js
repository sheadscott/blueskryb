import express from 'express'
import multer from 'multer'
import csv from 'csv-parser'
import { Readable } from 'stream'
import { authenticateToken } from '../middleware/authenticate.js'
import dotenv from 'dotenv'
import { addBooksToQueue } from '../queues/bookProcessingQueue.js'
dotenv.config()
const router = express.Router()
// --- File Upload Configuration ---
// Store files in memory for processing. Adjust if files are very large.
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// --- Route Definition ---
/**
 * POST /api/import/goodreads
 * Accepts a Goodreads CSV export file.
 * Parses the file and triggers the processing logic.
 * Requires authentication (middleware assumed to be added later).
 */
router.post(
  '/goodreads',
  authenticateToken,
  upload.single('file'),
  async (req, res) => {
    // 3. Get userId from the middleware-populated req.user
    const userId = req.user?.id
    if (!userId) {
      // This should technically be caught by the middleware,
      // but it's good practice to double-check.
      return res
        .status(401)
        .send({ message: 'Authentication failed: User ID not found.' })
    }
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded.' })
    }
    console.log(`Received Goodreads export for user: ${userId}`)
    const results = []
    const bufferStream = new Readable()
    bufferStream.push(req.file.buffer)
    bufferStream.push(null)
    let parsingError = null
    bufferStream
      .pipe(csv())
      .on('data', (data) => {
        try {
          // --- Clean ISBN/ISBN13 and convert empty strings to null ---
          let cleanedIsbn = null
          if (data['ISBN']) {
            const tempIsbn = String(data['ISBN']).replace(/=|"| /g, '')
            cleanedIsbn = tempIsbn === '' ? null : tempIsbn
          }
          let cleanedIsbn13 = null
          if (data['ISBN13']) {
            const tempIsbn13 = String(data['ISBN13']).replace(/=|"| /g, '')
            cleanedIsbn13 = tempIsbn13 === '' ? null : tempIsbn13
          }
          // --- End ISBN cleaning ---
          const cleanedData = {
            bookId: data['Book Id'] || '',
            title: data['Title'] || '',
            author: data['Author'] || '',
            authorLf: data['Author l-f'] || '',
            additionalAuthors: data['Additional Authors'] || null,
            isbn: cleanedIsbn, // Use cleaned value
            isbn13: cleanedIsbn13, // Use cleaned value
            userRating: data['My Rating']
              ? parseInt(String(data['My Rating']), 10)
              : 0,
            publisher: data['Publisher'] || null,
            binding: data['Binding'] || null,
            numberOfPages: data['Number of Pages']
              ? parseInt(String(data['Number of Pages']), 10)
              : null,
            yearPublished: data['Year Published']
              ? parseInt(String(data['Year Published']), 10)
              : null,
            originalPublicationYear: data['Original Publication Year']
              ? parseInt(String(data['Original Publication Year']), 10)
              : null,
            dateRead: data['Date Read'] || null,
            dateAdded: data['Date Added'] || '',
            bookshelves: data['Bookshelves']
              ? String(data['Bookshelves'])
                  .split(', ')
                  .map((s) => s.trim())
              : [],
            bookshelvesWithPositions:
              data['Bookshelves with positions'] || null,
            exclusiveShelf: data['Exclusive Shelf'] || null,
            myReview: data['My Review'] || null,
            spoiler: data['Spoiler'] || null,
            privateNotes: data['Private Notes'] || null,
            readCount: data['Read Count']
              ? parseInt(String(data['Read Count']), 10)
              : 0,
            ownedCopies: data['Owned Copies']
              ? parseInt(String(data['Owned Copies']), 10)
              : 0,
          }
          // Validation checks (keep existing or refine)
          if (cleanedData.title && cleanedData.bookId) {
            // Refined check: ensure critical numeric fields are valid numbers if they exist
            if (
              (cleanedData.numberOfPages === null ||
                !isNaN(cleanedData.numberOfPages)) &&
              (cleanedData.yearPublished === null ||
                !isNaN(cleanedData.yearPublished)) &&
              (cleanedData.originalPublicationYear === null ||
                !isNaN(cleanedData.originalPublicationYear)) &&
              !isNaN(cleanedData.userRating) &&
              !isNaN(cleanedData.readCount) &&
              !isNaN(cleanedData.ownedCopies)
            ) {
              results.push(cleanedData)
            }
          }
        } catch (validationError) {
          console.warn(
            'Skipping row due to validation/parsing error within row:',
            validationError.message,
            data
          )
          // Optionally collect these errors to report later
        }
      })
      .on('end', async () => {
        if (parsingError) {
          // Error was already handled by the 'error' event handler
          return
        }
        console.log(
          `Parsed ${results.length} valid books from CSV for user ${userId}. Enqueuing job...`
        )
        if (results.length > 0) {
          try {
            // --- Enqueue the background job ---
            await addBooksToQueue(userId, results)
            // --- Job Enqueued ---
            // Respond immediately (202 Accepted)
            res.status(202).send({
              message: `Accepted Goodreads export for processing. ${results.length} valid books found. Processing will continue in the background.`,
            })
          } catch (queueError) {
            console.error(
              `Error adding job to queue for user ${userId}:`,
              queueError
            )
            // Send an error response if queuing failed
            res.status(500).send({ message: 'Failed to queue import job.' })
          }
        } else {
          console.log(
            `No valid books found in CSV for user ${userId}. Nothing to queue.`
          )
          res
            .status(400)
            .send({ message: 'No valid book data found in the uploaded file.' })
        }
      })
      .on('error', (error) => {
        parsingError = error // Store error to check in 'end' handler
        console.error('Error parsing CSV stream:', error)
        // Avoid sending response here if 'end' event might still fire
        // If this error means the stream is aborted, we might need to ensure response is sent.
        // Check if response has already been sent before sending another one.
        if (!res.headersSent) {
          res.status(500).send({ message: 'Error processing CSV file.' })
        }
      })
  }
)
export default router
//# sourceMappingURL=import.js.map
