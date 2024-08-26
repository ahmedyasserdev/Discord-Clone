"use server";

import { createServerSchema, CreateServerValues } from "@/schemas";
import { v4 as uuidv4 } from "uuid"
import { db } from "../db";
import { MemberRole, Server } from "@prisma/client";
import { currentProfile } from "./profile.actions";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const createServer = async(values: CreateServerValues) : Promise<Server> => {
  const validatedFields = createServerSchema.safeParse(values);
    const currentUser  = await currentProfile()
    if (!currentUser) throw new Error("Unauthorized")
  if (!validatedFields.success) throw new Error("Missing Required Fields");

  const { imageUrl, name } = validatedFields.data;

    const newServer = await db.server.create({
        data : {
            name,
            imageUrl,
            profileId : currentUser.id as string,
            inviteCode : uuidv4(),
            channels : {
              create : [
                {name : "General" ,  profileId : currentUser.id as string}
              ]
            },

            members : {
              create  : [{profileId : currentUser.id , role : MemberRole.ADMIN}]
            }
        }
    })

      revalidatePath(`/servers/${newServer.id}`)
    return newServer

};


export const getServerById = cache(async (id: string) => {
  const server = await db.server.findUnique({
    where: { id },
  });
  return server;
});


export const generateNewInviteCode = async (serverId : string ) => {
    try {
      const  profile = await currentProfile();

      if (!profile) throw new Error("Unauthanticated");

        if (!serverId) throw new Error("serverId is missing");

        const serverToUpdate = await db.server.update({
          where  : {
            id : serverId ,
            profileId : profile.id
          },
          data : {
            inviteCode : uuidv4(),
          }
        })


        return serverToUpdate;

    }catch (error) {
        console.log('[GENERATE_NEW_CODE_ACTION]' , error)
    }
}
