import z from "zod";

export const MCQSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctAnswer: z.string(),
      explanation: z.string(),
    }),
  ),
});

export type MCQResponse = z.infer<typeof MCQSchema>;
