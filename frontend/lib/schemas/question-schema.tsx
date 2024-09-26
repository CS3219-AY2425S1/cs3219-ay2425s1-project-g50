import { z } from "zod";

export const QuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  complexity: z.string(),
});

const ComplexityEnum = z.enum(["easy", "medium", "hard"]);

const CreateQuestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  complexity: ComplexityEnum,
});

export const CreateQuestionArraySchema = z.array(CreateQuestionSchema);

export type CreateQuestion = z.infer<typeof CreateQuestionSchema>;

export const QuestionArraySchema = z.array(QuestionSchema);

export type Question = z.infer<typeof QuestionSchema>;
