import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const User = sqliteTable("User", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  createdAt: text("createdAt").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updatedAt").default(sql`(CURRENT_TIMESTAMP)`),
  name: text("name"),
  email: text("email").unique(),
});

export const Password = sqliteTable("Password", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  hash: text("hash").notNull(),
  userId: text("userId")
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
});

export const UserRelations = relations(User, ({ one }) => ({
  password: one(Password, {
    fields: [User.id],
    references: [Password.userId],
  }),
}));

export type User = typeof User.$inferSelect; // return type when queried
