
import * as z from "zod";
export const createServerSchema =z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    imageUrl: z.string().min(1, {
      message: "Image is required",
    }),
  });

export type CreateServerValues = z.infer<typeof createServerSchema>