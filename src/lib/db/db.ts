import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
// import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres'

const connectionString = process.env.POSTGRES_URL
if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is required')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
// const client = postgres(connectionString, { prepare: false })
// export const db = drizzle(client)

const pool = new Pool({ connectionString })
export const db = drizzle({ client: pool })
