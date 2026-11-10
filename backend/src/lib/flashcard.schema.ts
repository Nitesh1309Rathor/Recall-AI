import { z } from "zod";

export const FlashcardResponseSchema = z.object({
  flashcards: z.array(
    z.object({
      front: z.string().min(1),
      back: z.string().min(1),
    }),
  ),
});

export type FlashcardResponse = z.infer<typeof FlashcardResponseSchema>;
