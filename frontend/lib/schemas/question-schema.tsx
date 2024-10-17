import { z } from "zod";

export const CategoryEnumArray = [
  "Algorithms",
  "Arrays",
  "Bit Manipulation",
  "Brainteaser",
  "Databases",
  "Data Structures",
  "Recursion",
  "Strings",
] as const;
export const CategoryEnumSchema = z.enum(CategoryEnumArray);
export type CategoryEnum = z.infer<typeof CategoryEnumSchema>;

export const ComplexityEnumArray = ["Easy", "Medium", "Hard"] as const;
export const ComplexityEnumSchema = z.enum(ComplexityEnumArray);
export type ComplexityEnum = z.infer<typeof ComplexityEnumSchema>;

export const QuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  categories: z.array(CategoryEnumSchema),
  complexity: ComplexityEnumSchema,
});

export const QuestionArraySchema = z.array(QuestionSchema);

export type Question = z.infer<typeof QuestionSchema>;

export const CreateQuestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  categories: z.array(CategoryEnumSchema),
  complexity: ComplexityEnumSchema,
});

export const CreateQuestionArraySchema = z.array(CreateQuestionSchema);

export type CreateQuestion = z.infer<typeof CreateQuestionSchema>;

export const UpdateQuestionSchema = z.object({
  title: z.string(),
  description: z.string(),
  categories: z.array(CategoryEnumSchema),
  complexity: ComplexityEnumSchema,
});

export type UpdateQuestion = z.infer<typeof UpdateQuestionSchema>;
