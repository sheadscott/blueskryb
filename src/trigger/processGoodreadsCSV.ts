// import { eq } from "drizzle-orm";
import { logger, task, wait } from '@trigger.dev/sdk/v3'
import { drizzle } from 'drizzle-orm/node-postgres'
// import { user, book } from "@/lib/db/schema";

// Initialize Drizzle client
const db = drizzle(process.env.DATABASE_URL!)

export const processGoodreadsCSV = task({
  id: 'process-goodreads-csv',
  run: async (payload: { content: string; userId: number }) => {
    logger.log('Processing Goodreads CSV', { payload })
    // Create new user
    // const [user] = await db.insert(users).values(payload).returning()

    // return {
    //   createdUser: user,
    //   message: 'User created and updated successfully',
    // }

    await wait.for({ seconds: 2 })

    return {
      message: 'Hello, from ProcessGoodreadsCSV',
    }
  },
})

// export const processGoodreadsCSV = task({
//     id: 'process-goodreads-csv',
//     // Set an optional maxDuration to prevent tasks from running indefinitely
//     maxDuration: 10, // Stop executing after 300 secs (5 mins) of compute
//     run: async (payload: any, { ctx }) => {

//       await wait.for({ seconds: 5 })

//       return {
//         message: 'Hello, world!',
//       }
//     },
//   })
