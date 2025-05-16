import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'

const Pool =
  (pg as typeof pg & { native?: { Pool: typeof pg.Pool } }).native?.Pool ??
  pg.Pool

console.log('Using Pool:', Pool === pg.Pool ? 'pg (JS)' : 'pg-native')

const connectionString = process.env.POSTGRES_URL
if (!connectionString) {
  throw new Error('POSTGRES_URL environment variable is required')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
// const client = postgres(connectionString, { prepare: false })
// export const db = drizzle(client)

const pool = new Pool({ connectionString })
export const db = drizzle({ client: pool })
