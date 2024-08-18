import { Database } from "@nozbe/watermelondb";
import { schema } from "@/model/schema";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";
import Cards from "./model";
const adapter = new SQLiteAdapter({
  schema,
  dbName: "flashcard",
});

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [Cards],
});
