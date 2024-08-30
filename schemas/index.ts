
import * as z from "zod";
import {ChannelType} from "@prisma/client"
export const serverSchema =z.object({
    name: z.string().min(1, {
      message: "Server name is required",
    }),
    imageUrl: z.string().min(1, {
      message: "Image is required",
    }),
  });

export type ServerValues = z.infer<typeof serverSchema>


export const channelSchema =z.object({
  name: z.string().min(1, {
    message: "Channel Name is required",
  }).refine((name) => name !== 'general' , {message : "Channel name cannot be general."}),
  type : z.nativeEnum(ChannelType)

});
export type ChannelValues = z.infer<typeof channelSchema>
