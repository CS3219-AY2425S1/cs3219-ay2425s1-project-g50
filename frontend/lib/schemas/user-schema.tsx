import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  skillLevel: z.string().nullable(),
  isAdmin: z.boolean(),
  createdAt: z.string(),
});

export const UserArraySchema = z.array(UserSchema);

export type User = z.infer<typeof UserSchema>;
