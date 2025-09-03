// Import helpers to define Postgres tables in Drizzle
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core"

// Reuse standard fields (id, createdAt, updatedAt)
import { createdAt, id, updatedAt } from "./schemaHelpers"

// Import JobInfo table so we can link interviews to jobs
import { JobInfoTable } from "./jobInfo"

// For defining relationships
import { relations } from "drizzle-orm/relations"

// Define the "interviews" table
export const InterviewTable = pgTable("interviews", {
  id, // unique identifier for each interview

  // Each interview is tied to a specific JobInfo entry
  jobInfoId: uuid()
    .references(() => JobInfoTable.id, { onDelete: "cascade" }) // if JobInfo is deleted, remove its interviews too
    .notNull(),

  duration: varchar().notNull(), // duration of the interview (e.g. "45min")
  humeChatId: varchar(),         // optional: external AI/chat session ID
  feedback: varchar(),           // optional: feedback text from interviewer or system

  createdAt, // timestamp when created
  updatedAt, // timestamp when updated
})

// Define relationships between Interview and JobInfo
export const interviewRelations = relations(InterviewTable, ({ one }) => ({
  // Each interview belongs to ONE JobInfo
  jobInfo: one(JobInfoTable, {
    fields: [InterviewTable.jobInfoId],  // foreign key column
    references: [JobInfoTable.id],       // points to JobInfo table
  }),
}))
