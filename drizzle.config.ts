import { defineConfig } from 'drizzle-kit'
console.log('process.env.POSTGRES_URL', process.env.POSTGRES_URL)
export default defineConfig({
  out: './drizzle',
  schema: './src/lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
})

// npx drizzle-kit push
