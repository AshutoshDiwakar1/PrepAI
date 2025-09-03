import { pgTable, varchar } from "drizzle-orm/pg-core"
import { createdAt, updatedAt } from "./schemaHelpers"


export const UserTable = pgTable("users", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  email: varchar().notNull().unique(),
  imageUrl: varchar().notNull(),
  createdAt,
  updatedAt,
})