
import * as z from "zod";
export const serverSchema =z.object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    imageUrl: z.string().min(1, {
      message: "Image is required",
    }),
  });

export type ServerValues = z.infer<typeof serverSchema>