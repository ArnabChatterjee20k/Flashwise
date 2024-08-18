import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "cards",
      columns: [
        { name: "question", type: "string" },
        { name: "answer", type: "string", isOptional: true },
        { name: "is_done", type: "boolean" },
        { name: "is_later", type: "boolean" },
      ],
    }),
    tableSchema({
      name: "flash",
      columns: [
        { name: "card_id", type: "string" },
        { name: "is_pinned", type: "boolean" },
      ],
    }),
  ],
});
