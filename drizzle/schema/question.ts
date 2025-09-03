// Import Drizzle helpers for Postgres tables
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core"

// Reuse common columns (id, createdAt, updatedAt)
import { createdAt, id, updatedAt } from "./schemaHelpers"

// For setting up relationships between tables
import { relations } from "drizzle-orm"

// Import the JobInfo table so we can connect questions to jobs
import { JobInfoTable } from "./jobInfo"

// Define possible difficulty levels for a question
// Like a dropdown with only 3 allowed options
export const questionDifficulties = ["easy", "medium", "hard"] as const
export type QuestionDifficulty = (typeof questionDifficulties)[number]

// Create a Postgres enum type for the difficulty field
export const questionDifficultyEnum = pgEnum(
  "questions_question_difficulty", // internal database name
  questionDifficulties
)

// Define the "questions" table
export const QuestionTable = pgTable("questions", {
  id, // unique identifier for each question

  // Link each question to a specific jobInfo entry
  jobInfoId: uuid()
    .references(() => JobInfoTable.id, { onDelete: "cascade" }) // if a JobInfo is deleted, its questions are deleted too
    .notNull(),

  text: varchar().notNull(), // the actual question text
  difficulty: questionDifficultyEnum().notNull(), // must be "easy", "medium", or "hard"

  createdAt, // timestamp when created
  updatedAt, // timestamp when updated
})

// Define relationships between tables
export const questionsRelations = relations(QuestionTable, ({ one }) => ({
  // Each question belongs to ONE jobInfo
  jobInfo: one(JobInfoTable, {
    fields: [QuestionTable.jobInfoId],   // column in QuestionTable
    references: [JobInfoTable.id],       // points to the JobInfo table
  }),
}))
