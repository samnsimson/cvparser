import * as z from "zod"
import { CompleteUser, RelatedUserSchema } from "./index"

export const PostSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string(),
})

export interface CompletePost extends z.infer<typeof PostSchema> {
  createdBy: CompleteUser
}

/**
 * RelatedPostSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPostSchema: z.ZodSchema<CompletePost> = z.lazy(() => PostSchema.extend({
  createdBy: RelatedUserSchema,
}))
