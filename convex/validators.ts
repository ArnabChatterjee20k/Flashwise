import { z } from "zod";

const CardSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const CardAISchema = z.object({ cards: z.array(CardSchema) });
