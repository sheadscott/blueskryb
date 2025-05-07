import { pgTable, text } from 'drizzle-orm/pg-core'

export const authState = pgTable('authState', {
  key: text('key').primaryKey(),
  state: text('state').notNull(),
})

export const authSession = pgTable('authSession', {
  key: text('key').primaryKey(),
  session: text('session').notNull(),
})
