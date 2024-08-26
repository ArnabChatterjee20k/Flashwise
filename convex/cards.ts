import { v } from "convex/values";
import {
  query,
  mutation,
  internalAction,
  internalMutation,
  action,
} from "./_generated/server";
import { api, fullApi, internal } from "./_generated/api";
import { generateCards } from "./utils/ai";
import { CardAISchema } from "./validators";
import { z } from "zod";

export const getCards = query({
  args: { flashCardId: v.id("flash") },
  handler: async (ctx, { flashCardId }) => {
    const cards = await ctx.db
      .query("cards")
      .withIndex("by_flashid")
      .filter((q) => q.eq(q.field("flashId"), flashCardId))
      .collect();
    return cards;
  },
});

export const deleteCard = mutation({
  args: { id: v.union(v.id("flash"), v.id("cards")) },
  handler(ctx, { id }) {
    ctx.db.delete(id);
  },
});

export const getFlashCard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const card = ctx.db.query("flash");
    if (limit) return card.take(limit);
    return card.collect();
  },
});

export const getPinnedFlash = query({
  handler: async (ctx) => {
    return ctx.db
      .query("flash")
      .filter((q) => q.eq(q.field("pinned"), true))
      .collect();
  },
});

export const getFlashCardById = query({
  args: { id: v.id("flash") },
  handler: (ctx, { id }) => {
    return ctx.db
      .query("flash")
      .withIndex("by_id")
      .filter((q) => q.eq(q.field("_id"), id))
      .take(1);
  },
});

export const getProjectDetails = query({
  args: { id: v.id("flash") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const createFlashCard = mutation({
  args: { title: v.optional(v.string()) },
  handler: async (ctx, { title }) => {
    const flashCardTitle = title ? title : "Untitled";
    const id = await ctx.db.insert("flash", {
      name: flashCardTitle,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const updateCardData = mutation({
  args: {
    id: v.id("cards"),
    question: v.optional(v.string()),
    answer: v.optional(v.string()),
  },
  handler(ctx, { id, answer, question }) {
    ctx.db.patch(id, {
      ...(question && { question: question }),
      ...(answer && { answer: answer }),
    });
  },
});

export const updateFlashCardStatus = internalMutation({
  args: {
    id: v.id("flash"),
    status: v.boolean(),
    count: v.optional(v.number()),
  },
  handler: async (ctx, { id, status, count }) => {
    const card = await ctx.db.get(id);
    const prevCount = card?.count || 0;
    await ctx.db.patch(id, {
      generating: status,
      ...(count && { count: prevCount + count }),
    });
  },
});

export const updateFlashCard = mutation({
  args: {
    title: v.optional(v.string()),
    id: v.id("flash"),
    pin: v.optional(v.boolean()),
  },
  handler: async (ctx, { title, id, pin }) => {
    const flashCardTitle = title;
    await ctx.db.patch(id, {
      ...(title && { name: title }),
      ...(pin !== undefined && { pinned: pin }),
    });
  },
});

export const createCard = mutation({
  args: {
    question: v.string(),
    answer: v.string(),
    flashCardId: v.id("flash"),
  },
  handler: async (ctx, { question, answer, flashCardId }) => {
    const cardId = await ctx.db.insert("cards", {
      question,
      answer,
      flashId: flashCardId,
    });
    return cardId;
  },
});

export const createQuestionAI = action({
  args: { prompt: v.string(), count: v.number(), flashCardId: v.id("flash") },
  handler: async (ctx, { count, prompt, flashCardId }) => {
    try {
      await ctx.runMutation(internal.cards.updateFlashCardStatus, {
        id: flashCardId,
        status: true,
      });
      const result = await generateCards(prompt, count);
      const data = CardAISchema.parse(result);
      const cards = data.cards;
      const qnaCardsSequence = cards.map(({ question, answer }) =>
        ctx.runMutation(api.cards.createCard, { question, answer, flashCardId })
      );
      const qnaCardsSequenceResult = await Promise.allSettled(qnaCardsSequence);
      qnaCardsSequenceResult.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Failed to create card ${index}:`, result.reason);
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError)
        console.error("AI schema generation error", error);
      else console.error(error);
    } finally {
      await ctx.runMutation(internal.cards.updateFlashCardStatus, {
        id: flashCardId,
        status: false,
        count: count,
      });
    }
  },
});
