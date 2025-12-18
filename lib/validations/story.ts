import { z } from "zod";

export const storyInputSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  storyText: z
    .string()
    .min(10, "Story text must be at least 10 characters")
    .max(5000, "Story text must be less than 5000 characters"),
  acceptanceCriteria: z
    .string()
    .max(2000, "Acceptance criteria must be less than 2000 characters")
    .optional(),
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed").optional(),
});

export type StoryInput = z.infer<typeof storyInputSchema>;
