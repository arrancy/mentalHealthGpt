import { relations } from "drizzle-orm";
import { boolean } from "drizzle-orm/pg-core";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  isOauth: boolean().notNull().default(true),
});

export const chatsTable = pgTable("chats", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
});
export const userRelations = relations(usersTable, ({ many }) => ({
  chats: many(chatsTable),
}));

export const chatsRelation = relations(chatsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [chatsTable.userId],
    references: [usersTable.id],
  }),
}));

export const messagesTable = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: varchar().notNull(),
  role: varchar().notNull(),
  chatId: integer().references(() => chatsTable.id),
});

export const chatRelations = relations(chatsTable, ({ many }) => ({
  messages: many(messagesTable),
}));

export const messsagesRelation = relations(messagesTable, ({ one }) => ({
  chat: one(chatsTable, {
    fields: [messagesTable.chatId],
    references: [chatsTable.id],
  }),
}));
