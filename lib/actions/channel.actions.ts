'use server'

import { channelSchema, ChannelValues } from "@/schemas"
import { Server , MemberRole } from "@prisma/client";
import { currentProfile } from "./profile.actions";
import { db } from "../db";


export const createChannel = async ({ values, serverId }: { values: ChannelValues; serverId: string }): Promise<Server> => {
    try {
      const profile = await currentProfile();
  
      if (!profile) throw new Error("Unauthenticated");
      if (!serverId) throw new Error("serverId is missing");
  
      const validatedFields = channelSchema.safeParse(values);
  
      if (!validatedFields.success) throw new Error("Missing Required Fields");
  
      const { name, type } = validatedFields.data;

      const newChannel = await db.server.update({
        where : {
            id : serverId ,
            members : {
                some : {
                    profileId : profile.id,
                    role : {
                        in : [MemberRole.ADMIN, MemberRole.MODERATOR]
                    }
                }
            }
        },

        data  : {
            channels : {
                create : {
                    profileId : profile.id ,
                    type , 
                    name ,
                }
            }
        }
      });
  
      return newChannel;
    } catch (error) {
        console.error("[CREATE_CHANNEL_ACTION]", error);
    throw error;
      
    }
  };
  
  