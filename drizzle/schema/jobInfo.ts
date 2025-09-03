// Import Drizzle helpers for Postgres tables
import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core"

// These are common fields like "id", "createdAt", "updatedAt" 
// that we reuse across different tables
import { createdAt, id, updatedAt } from "./schemaHelpers"

// Import other tables we want to connect to
import { UserTable } from "./user"
import { relations } from "drizzle-orm"
import { QuestionTable } from "./question"
import { InterviewTable } from "./interview"

// Define the allowed experience levels (like a dropdown menu)
// Only these 3 values will be valid: "junior", "mid-level", "senior"
export const experienceLevels = ["junior", "mid-level", "senior"] as const
export type ExperienceLevel = (typeof experienceLevels)[number]

// Create a database enum type for experience levels
export const experienceLevelEnum = pgEnum(
  "job_infos_experience_level", // internal name in database
  experienceLevels
)

// Define the "job_info" table (like a spreadsheet with columns)
export const JobInfoTable = pgTable("job_info", {
  id, // unique identifier for each row
  title: varchar(), // optional job title (text)
  name: varchar().notNull(), // required name field
  experienceLevel: experienceLevelEnum().notNull(), // must be "junior", "mid-level", or "senior"
  description: varchar().notNull(), // required job description
  userId: varchar() // the ID of the user who created this job info
    .references(() => UserTable.id, { onDelete: "cascade" }) // link to UserTable
    .notNull(), // required
  createdAt, // timestamp when created
  updatedAt, // timestamp when updated
})

// Define relationships (connections) between this table and others
export const jobInfoRelations = relations(JobInfoTable, ({ one, many }) => ({
  // Each job_info belongs to ONE user
  user: one(UserTable, {
    fields: [JobInfoTable.userId], // foreign key in this table
    references: [UserTable.id],    // points to id in UserTable
  }),
  // Each job_info can have MANY related questions
  questions: many(QuestionTable),
  // Each job_info can have MANY related interviews
  interviews: many(InterviewTable),
}))
