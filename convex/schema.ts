import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cards: defineTable({
    question: v.string(),
    answer: v.string(),
    done: v.optional(v.boolean()),
    later: v.optional(v.boolean()),
    flashId: v.id("flash"),
  }).index("by_flashid", ["flashId"]),
  flash: defineTable({
    pinned: v.optional(v.boolean()),
    name: v.string(),
    createdAt: v.number(),
    generating: v.optional(v.boolean()),
    color: v.optional(v.string()),
    count:v.optional(v.number())
  }),
});
