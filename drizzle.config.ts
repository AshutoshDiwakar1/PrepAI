// Import environment variables (DATABASE_URL, etc.)
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!, // read directly from env
  },
})